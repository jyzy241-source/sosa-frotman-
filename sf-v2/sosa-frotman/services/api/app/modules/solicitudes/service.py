from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.modules.clientes.models import Cliente, DatosLaborales
from app.modules.solicitudes.models import (
    AutorizacionBuro,
    EstadoSolicitud,
    PersonaVinculada,
    Referencia,
    Solicitud,
)
from app.modules.solicitudes.schemas import SolicitudCreate


async def crear_solicitud(session: AsyncSession, payload: SolicitudCreate) -> Solicitud:
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
        estado=EstadoSolicitud.enviada,
        **payload.caracteristicas.model_dump(),
    )
    session.add(solicitud)
    await session.flush()

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

    await session.commit()
    await session.refresh(solicitud)
    return solicitud
