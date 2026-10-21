from datetime import datetime, timezone

from sqlalchemy import JSON, Column
from sqlmodel import Field, SQLModel


class Auditoria(SQLModel, table=True):
    __tablename__ = "auditoria"

    id: int | None = Field(default=None, primary_key=True)
    usuario_id: int | None = Field(default=None, foreign_key="usuarios.id")
    accion: str
    entidad_tipo: str
    entidad_id: int
    detalle: dict = Field(default_factory=dict, sa_column=Column(JSON))
    ip: str | None = None
    fecha: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
