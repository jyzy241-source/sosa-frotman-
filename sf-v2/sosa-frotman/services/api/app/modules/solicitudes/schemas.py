from datetime import date
from enum import Enum

from pydantic import BaseModel


class EstadoSolicitud(str, Enum):
    borrador = "borrador"
    enviada = "enviada"
    en_revision = "en_revision"
    aprobada = "aprobada"
    rechazada = "rechazada"
    desembolsada = "desembolsada"


class DatosClienteIn(BaseModel):
    nombre: str
    apellido: str
    apodo: str | None = None
    cedula: str
    fecha_nacimiento: date
    estado_civil: str
    tipo_vivienda: str  # propia | familiar | alquilada
    telefono: str
    direccion: str
    ocupacion: str


class DatosLaboralesIn(BaseModel):
    empresa: str
    tipo_empresa: str
    telefono: str
    cargo: str
    sueldo: float
    tiempo_empresa: str
    jefe_inmediato: str | None = None
    otros_ingresos: float | None = None
    direccion: str


class CaracteristicasPrestamoIn(BaseModel):
    monto_solicitado: float
    plazo_meses: int
    modalidad: str
    solo_interes: bool = False
    prestamo_adicional: bool = False
    capacidad_pago: float | None = None
    tipo_garantia: str | None = None


class PersonaReferenciaIn(BaseModel):
    # Reutilizado para Codeudor y Fiador
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


class ReferenciaIn(BaseModel):
    tipo: str  # comercial | personal
    nombre: str
    telefono: str


class AutorizacionBuroIn(BaseModel):
    aceptado: bool
    firma_digital_url: str | None = None


class SolicitudCreate(BaseModel):
    cliente: DatosClienteIn
    datos_laborales: DatosLaboralesIn
    caracteristicas: CaracteristicasPrestamoIn
    codeudor: PersonaReferenciaIn | None = None
    fiador: PersonaReferenciaIn | None = None
    referencias: list[ReferenciaIn] = []
    autorizacion_buro: AutorizacionBuroIn


class SolicitudOut(BaseModel):
    id: int
    estado: EstadoSolicitud
