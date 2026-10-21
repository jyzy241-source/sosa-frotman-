from datetime import datetime, timezone
from sqlalchemy import Column, JSON, LargeBinary
from sqlmodel import SQLModel, Field

class SolicitudServicio(SQLModel, table=True):
    __tablename__ = "solicitudes_servicio"
    id: int | None = Field(default=None, primary_key=True)
    servicio: str
    datos: dict = Field(sa_column=Column(JSON, nullable=False))
    pdf: bytes = Field(sa_column=Column(LargeBinary, nullable=False))
    documentos: list = Field(sa_column=Column(JSON, nullable=False))
    email_enviado: bool = False
    creado_en: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
