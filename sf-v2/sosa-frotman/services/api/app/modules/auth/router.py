from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.db import get_session
from app.core.security import TokenType, create_token, decode_token
from app.modules.auth import service
from app.modules.auth.deps import get_current_user
from app.modules.auth.schemas import LoginIn, RegisterIn, TokenOut, UsuarioOut
from app.modules.usuarios.models import Usuario

router = APIRouter()
settings = get_settings()

REFRESH_COOKIE = "refresh_token"


def _set_refresh_cookie(response: Response, refresh_token: str) -> None:
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=refresh_token,
        httponly=True,
        samesite="strict",
        secure=(settings.env != "development"),
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
        path="/api/v1/auth",
    )


@router.post("/register", response_model=UsuarioOut, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterIn, session: AsyncSession = Depends(get_session)) -> Usuario:
    return await service.registrar(session, payload)


@router.post("/login", response_model=TokenOut)
async def login(
    payload: LoginIn,
    response: Response,
    session: AsyncSession = Depends(get_session),
) -> TokenOut:
    usuario = await service.autenticar(session, payload)
    access, refresh = service.generar_tokens(usuario)
    _set_refresh_cookie(response, refresh)
    return TokenOut(access_token=access)


@router.post("/refresh", response_model=TokenOut)
async def refresh(request: Request, response: Response) -> TokenOut:
    token = request.cookies.get(REFRESH_COOKIE)
    if not token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Sin refresh token")

    try:
        payload = decode_token(token)
    except ValueError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Refresh token inválido") from exc

    if payload.get("type") != TokenType.refresh.value:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Tipo de token incorrecto")

    # Rotación: se emite un refresh nuevo en cada uso.
    access = create_token(payload["sub"], payload["rol"], TokenType.access)
    nuevo_refresh = create_token(payload["sub"], payload["rol"], TokenType.refresh)
    _set_refresh_cookie(response, nuevo_refresh)
    return TokenOut(access_token=access)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response) -> None:
    response.delete_cookie(REFRESH_COOKIE, path="/api/v1/auth")


@router.get("/me", response_model=UsuarioOut)
async def me(usuario: Usuario = Depends(get_current_user)) -> Usuario:
    return usuario
