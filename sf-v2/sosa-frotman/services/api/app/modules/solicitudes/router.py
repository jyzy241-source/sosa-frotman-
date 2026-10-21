from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.modules.solicitudes import service
from app.modules.solicitudes.schemas import SolicitudCreate, SolicitudOut

router = APIRouter()


@router.post("", response_model=SolicitudOut, status_code=status.HTTP_201_CREATED)
async def crear_solicitud(
    payload: SolicitudCreate,
    session: AsyncSession = Depends(get_session),
) -> SolicitudOut:
    """
    Recibe la solicitud de crédito completa (los 6 pasos del formulario
    público), crea/reutiliza el cliente por cédula, y la guarda en
    estado 'enviada'.

    TODO: notificar al oficial de crédito asignado; por ahora no hay
    lógica de asignación automática (oficial_id queda null).
    """
    solicitud = await service.crear_solicitud(session, payload)
    return SolicitudOut(id=solicitud.id, estado=solicitud.estado)
