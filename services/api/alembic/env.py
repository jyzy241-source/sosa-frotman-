from app.modules.servicios.models import SolicitudServicio  # noqa: F401
import asyncio
from logging.config import fileConfig

from alembic import context
from sqlalchemy.ext.asyncio import async_engine_from_config
from sqlmodel import SQLModel

from app.core.config import get_settings

# Import de todos los modelos: necesario para que Alembic los vea al
# hacer autogenerate, aunque no se usen directamente en este archivo.
from app.modules.usuarios.models import Usuario  # noqa: F401
from app.modules.clientes.models import Cliente, DatosLaborales  # noqa: F401
from app.modules.solicitudes.models import (  # noqa: F401
    Solicitud,
    PersonaVinculada,
    Referencia,
    AutorizacionBuro,
    VisitaDomicilio,
)
from app.modules.prestamos.models import Prestamo, Cuota, Pago  # noqa: F401
from app.modules.auditoria.models import Auditoria  # noqa: F401

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

settings = get_settings()
config.set_main_option("sqlalchemy.url", settings.database_url)

target_metadata = SQLModel.metadata


def run_migrations_offline() -> None:
    context.configure(url=settings.database_url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
    )
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
