from datetime import date, datetime
from enum import Enum

from sqlmodel import Field, SQLModel


class EstadoPrestamo(str, Enum):
    activo = "activo"
    pagado = "pagado"
    mora = "mora"
    castigado = "castigado"


class EstadoCuota(str, Enum):
    pendiente = "pendiente"
    pagada = "pagada"
    vencida = "vencida"


class Prestamo(SQLModel, table=True):
    __tablename__ = "prestamos"

    id: int | None = Field(default=None, primary_key=True)
    solicitud_id: int = Field(foreign_key="solicitudes.id", unique=True)
    monto_aprobado: float
    tasa: float
    plazo_meses: int
    fecha_desembolso: date | None = None
    estado: EstadoPrestamo = EstadoPrestamo.activo


class Cuota(SQLModel, table=True):
    __tablename__ = "cuotas"

    id: int | None = Field(default=None, primary_key=True)
    prestamo_id: int = Field(foreign_key="prestamos.id")
    numero: int
    monto: float
    fecha_vencimiento: date
    fecha_pago: date | None = None
    estado: EstadoCuota = EstadoCuota.pendiente


class Pago(SQLModel, table=True):
    __tablename__ = "pagos"

    id: int | None = Field(default=None, primary_key=True)
    cuota_id: int = Field(foreign_key="cuotas.id")
    monto: float
    metodo: str
    referencia: str | None = None
    registrado_por: int = Field(foreign_key="usuarios.id")
    fecha: datetime = Field(default_factory=datetime.utcnow)
