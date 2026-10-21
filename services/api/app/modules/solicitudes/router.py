import json

from fastapi import APIRouter, Depends, File, Form, HTTPException, Response, UploadFile, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.db import get_session
from app.modules.auth.deps import require_roles
from app.modules.solicitudes import service
from app.modules.solicitudes.models import AdjuntoSolicitud
from app.modules.solicitudes.schemas import SolicitudCreate, SolicitudOut
from app.modules.usuarios.models import RolUsuario

router = APIRouter()


@router.post("", response_model=SolicitudOut, status_code=status.HTTP_201_CREATED)
async def crear_solicitud(
    payload: str = Form(...),
    cedula_frente: UploadFile = File(...),
    cedula_reverso: UploadFile = File(...),
    session: AsyncSession = Depends(get_session),
) -> SolicitudOut:
    """
    Recibe la solicitud de crédito completa (los 6 pasos del formulario
    público), crea/reutiliza el cliente por cédula, y la guarda en
    estado 'enviada'.

    TODO: notificar al oficial de crédito asignado; por ahora no hay
    lógica de asignación automática (oficial_id queda null).
    """
    try:
        solicitud_data = SolicitudCreate.model_validate_json(payload)
    except (ValueError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=422, detail="Los datos de la solicitud no son válidos.") from exc

    adjuntos = []
    for tipo, archivo in (("cedula_frente", cedula_frente), ("cedula_reverso", cedula_reverso)):
        content_type = archivo.content_type or ""
        if content_type not in {"image/jpeg", "image/png", "image/webp"}:
            raise HTTPException(status_code=422, detail=f"{tipo}: formato de imagen no permitido.")
        contenido = await archivo.read(5 * 1024 * 1024 + 1)
        if not contenido or len(contenido) > 5 * 1024 * 1024:
            raise HTTPException(status_code=422, detail=f"{tipo}: imagen vacía o mayor a 5 MB.")
        firma_valida = (
            (content_type == "image/jpeg" and contenido.startswith(b"\xff\xd8\xff"))
            or (content_type == "image/png" and contenido.startswith(b"\x89PNG\r\n\x1a\n"))
            or (content_type == "image/webp" and contenido.startswith(b"RIFF") and contenido[8:12] == b"WEBP")
        )
        if not firma_valida:
            raise HTTPException(status_code=422, detail=f"{tipo}: el archivo no coincide con su formato.")
        adjuntos.append({
            "tipo": tipo,
            "nombre_archivo": (archivo.filename or tipo).replace("/", "_").replace("\\", "_"),
            "content_type": content_type,
            "contenido": contenido,
        })

    if solicitud_data.servicio == "celular" and not all(
        v and v.strip() for v in (solicitud_data.equipo, solicitud_data.tienda)
    ):
        raise HTTPException(status_code=422, detail="Indica el equipo y la tienda.")
    solicitud, _pdf, enviado = await service.crear_solicitud(session, solicitud_data, adjuntos)
    return SolicitudOut(id=solicitud.id, estado=solicitud.estado, email_enviado=enviado)


@router.get(
    "/{solicitud_id}/pdf",
    dependencies=[Depends(require_roles(RolUsuario.oficial, RolUsuario.supervisor, RolUsuario.admin))],
    response_class=Response,
)
async def descargar_pdf_solicitud(
    solicitud_id: int,
    session: AsyncSession = Depends(get_session),
) -> Response:
    documento = (
        await session.exec(
            select(AdjuntoSolicitud).where(
                AdjuntoSolicitud.solicitud_id == solicitud_id,
                AdjuntoSolicitud.tipo == "solicitud_pdf",
            )
        )
    ).first()
    if documento is None:
        raise HTTPException(status_code=404, detail="No se encontró el PDF de la solicitud.")
    return Response(
        content=documento.contenido,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{documento.nombre_archivo}"'},
    )
