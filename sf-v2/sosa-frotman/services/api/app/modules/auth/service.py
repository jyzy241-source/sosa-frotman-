from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.security import TokenType, create_token, hash_password, verify_password
from app.modules.auth.schemas import LoginIn, RegisterIn
from app.modules.usuarios.models import Usuario


async def registrar(session: AsyncSession, payload: RegisterIn) -> Usuario:
    existente = (
        await session.exec(select(Usuario).where(Usuario.email == payload.email))
    ).first()
    if existente:
        raise HTTPException(status.HTTP_409_CONFLICT, "El email ya está registrado")

    usuario = Usuario(
        email=payload.email,
        password_hash=hash_password(payload.password),
        rol=payload.rol,
    )
    session.add(usuario)
    await session.commit()
    await session.refresh(usuario)
    return usuario


async def autenticar(session: AsyncSession, payload: LoginIn) -> Usuario:
    usuario = (
        await session.exec(select(Usuario).where(Usuario.email == payload.email))
    ).first()
    if usuario is None or not verify_password(payload.password, usuario.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Credenciales inválidas")
    if not usuario.activo:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Usuario inactivo")
    return usuario


def generar_tokens(usuario: Usuario) -> tuple[str, str]:
    access = create_token(usuario.email, usuario.rol.value, TokenType.access)
    refresh = create_token(usuario.email, usuario.rol.value, TokenType.refresh)
    return access, refresh
