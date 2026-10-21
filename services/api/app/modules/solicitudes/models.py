from datetime import date, datetime, timezone
from enum import Enum

from sqlmodel import Field, SQLModel
from sqlalchemy import JSON, Column, LargeBinary


class EstadoSolicitud(str, Enum):
    borrador = "borrador"
    enviada = "enviada"
    en_revision = "en_revision"
    aprobada = "aprobada"
    rechazada = "rechazada"
    desembolsada = "desembolsada"


class Solicitud(SQLModel, table=True):
    __tablename__ = "solicitudes"

    id: int | None = Field(default=None, primary_key=True)
    servicio: str = "personal"
    equipo: str | None = None
    tienda: str | None = None
    direccion_tienda: str | None = None
    cliente_id: int = Field(foreign_key="clientes.id")
    oficial_id: int | None = Field(default=None, foreign_key="usuarios.id")
    estado: EstadoSolicitud = EstadoSolicitud.borrador
    monto_solicitado: float
    plazo_meses: int
    modalidad: str
    solo_interes: bool = False
    prestamo_adicional: bool = False
    capacidad_pago: float | None = None
    tipo_garantia: str | None = None
    creado_en: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    decidido_en: datetime | None = None


class AdjuntoSolicitud(SQLModel, table=True):
    """Imagenes de identidad privadas, asociadas a una solicitud de credito."""

    __tablename__ = "adjuntos_solicitud"

    id: int | None = Field(default=None, primary_key=True)
    solicitud_id: int = Field(foreign_key="solicitudes.id", index=True)
    tipo: str
    nombre_archivo: str
    content_type: str
    contenido: bytes = Field(sa_column=Column(LargeBinary, nullable=False))
    creado_en: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PersonaVinculada(SQLModel, table=True):
    """Tabla compartida para Codeudor y Fiador — se distinguen por `rol`."""

    __tablename__ = "personas_vinculadas"

    id: int | None = Field(default=None, primary_key=True)
    solicitud_id: int = Field(foreign_key="solicitudes.id")
    rol: str  # "codeudor" | "fiador"
    nombre: str
    apellido: str
    cedula: str
    fecha_nacimiento: date
    estado_civil: str
    tipo_vivienda: str
    telefono: str
    direccion: str
    empresa: str | None = None
    cargo: str | None = None
    sueldo: float | None = None


class Referencia(SQLModel, table=True):
    __tablename__ = "referencias"

    id: int | None = Field(default=None, primary_key=True)
    solicitud_id: int = Field(foreign_key="solicitudes.id")
    tipo: str  # comercial | personal
    nombre: str
    telefono: str


class AutorizacionBuro(SQLModel, table=True):
    __tablename__ = "autorizacion_buro"

    id: int | None = Field(default=None, primary_key=True)
    solicitud_id: int = Field(foreign_key="solicitudes.id", unique=True)
    aceptado: bool
    ip: str | None = None
    firma_digital_url: str | None = None
    fecha: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class VisitaDomicilio(SQLModel, table=True):
    """Checklist de electrodomésticos — la llena el oficial, no el cliente."""

    __tablename__ = "visita_domicilio"

    id: int | None = Field(default=None, primary_key=True)
    solicitud_id: int = Field(foreign_key="solicitudes.id")
    oficial_id: int = Field(foreign_key="usuarios.id")
    fecha: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    electrodomesticos: dict = Field(default_factory=dict, sa_column=Column(JSON))
