from datetime import date

from sqlmodel import Field, SQLModel


class Cliente(SQLModel, table=True):
    __tablename__ = "clientes"

    id: int | None = Field(default=None, primary_key=True)
    usuario_id: int | None = Field(default=None, foreign_key="usuarios.id")
    nombre: str
    apellido: str
    apodo: str | None = None
    cedula: str = Field(unique=True, index=True)
    fecha_nacimiento: date
    estado_civil: str
    tipo_vivienda: str  # propia | familiar | alquilada
    telefono: str
    direccion: str
    ocupacion: str


class DatosLaborales(SQLModel, table=True):
    __tablename__ = "datos_laborales"

    id: int | None = Field(default=None, primary_key=True)
    cliente_id: int = Field(foreign_key="clientes.id")
    empresa: str
    tipo_empresa: str
    telefono: str
    cargo: str
    sueldo: float
    tiempo_empresa: str
    jefe_inmediato: str | None = None
    otros_ingresos: float | None = None
    direccion: str
