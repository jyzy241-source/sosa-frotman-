from pydantic import BaseModel, EmailStr

from app.modules.usuarios.models import RolUsuario


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class RegisterIn(BaseModel):
    email: EmailStr
    password: str
    # El alta pública nunca puede crear usuarios internos.
    rol: RolUsuario = RolUsuario.cliente

    @property
    def public_role(self) -> RolUsuario:
        return RolUsuario.cliente


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UsuarioOut(BaseModel):
    id: int
    email: EmailStr
    rol: RolUsuario
