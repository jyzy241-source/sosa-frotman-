from datetime import datetime, timezone
from enum import Enum

from sqlmodel import Field, SQLModel


class RolUsuario(str, Enum):
    cliente = "cliente"
    oficial = "oficial"
    supervisor = "supervisor"
    admin = "admin"


class Usuario(SQLModel, table=True):
    __tablename__ = "usuarios"

    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    rol: RolUsuario
    mfa_secret: str | None = None
    activo: bool = True
    creado_en: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
