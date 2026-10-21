from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.modules.solicitudes.pdf import generar_pdf_solicitud
from app.modules.solicitudes.notificaciones import enviar_pdf_por_email

from app.modules.clientes.models import Cliente, DatosLaborales
from app.modules.solicitudes.models import (
    AutorizacionBuro,
    AdjuntoSolicitud,
    EstadoSolicitud,
    PersonaVinculada,
    Referencia,
    Solicitud,
)
from app.modules.solicitudes.schemas import SolicitudCreate


async def crear_solicitud(
    session: AsyncSession, payload: SolicitudCreate, adjuntos: list[dict]
) -> tuple[Solicitud, bytes, bool]:
    # Reusa el cliente si ya existe por cédula; si no, lo crea.
    cliente = (
        await session.exec(select(Cliente).where(Cliente.cedula == payload.cliente.cedula))
    ).first()
    if cliente is None:
        cliente = Cliente(**payload.cliente.model_dump())
        session.add(cliente)
        await session.flush()  # asigna cliente.id sin cerrar la transacción

    session.add(DatosLaborales(cliente_id=cliente.id, **payload.datos_laborales.model_dump()))

    solicitud = Solicitud(
        cliente_id=cliente.id,
        servicio=payload.servicio, equipo=payload.equipo, tienda=payload.tienda,
        direccion_tienda=payload.direccion_tienda,
        estado=EstadoSolicitud.enviada,
        **payload.caracteristicas.model_dump(),
    )
    session.add(solicitud)
    await session.flush()
    assert solicitud.id is not None

    pdf = generar_pdf_solicitud(solicitud.id, payload)
    adjuntos.append({
        "tipo": "solicitud_pdf",
        "nombre_archivo": f"solicitud-SF-{solicitud.id:06d}.pdf",
        "content_type": "application/pdf",
        "contenido": pdf,
    })

    if payload.codeudor:
        session.add(
            PersonaVinculada(solicitud_id=solicitud.id, rol="codeudor", **payload.codeudor.model_dump())
        )
    if payload.fiador:
        session.add(
            PersonaVinculada(solicitud_id=solicitud.id, rol="fiador", **payload.fiador.model_dump())
        )
    for ref in payload.referencias:
        session.add(Referencia(solicitud_id=solicitud.id, **ref.model_dump()))

    session.add(
        AutorizacionBuro(solicitud_id=solicitud.id, **payload.autorizacion_buro.model_dump())
    )
    for adjunto in adjuntos:
        session.add(AdjuntoSolicitud(solicitud_id=solicitud.id, **adjunto))

    await session.commit()
    await session.refresh(solicitud)
    email_enviado = await enviar_pdf_por_email(
        f"SF-{solicitud.id:06d}",
        f"solicitud-SF-{solicitud.id:06d}.pdf",
        pdf,
        adjuntos,
    )
    return solicitud, pdf, email_enviado
