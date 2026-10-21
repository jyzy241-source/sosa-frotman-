from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # En desarrollo puede ejecutarse desde services/api (usa .env local) o
    # desde el compose raíz (usa docker/.env). En producción las variables del
    # entorno tienen prioridad y no dependen de ningún archivo del proyecto.
    model_config = SettingsConfigDict(
        env_file=(".env", "../../docker/.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    env: str = "development"
    database_url: str
    redis_url: str = "redis://localhost:6379/0"
    secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7
    cors_origins: str = "https://sosafrotman.com,https://www.sosafrotman.com,http://localhost:5173,http://localhost:5174,http://localhost:5175,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:5175"
    resend_api_key: str | None = None
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_app_password: str | None = None
    notificaciones_email_from: str | None = None
    notificaciones_email_to: str | None = None
    allow_public_registration: bool = False
    max_upload_bytes: int = 15 * 1024 * 1024
    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    # Resolver la ruta desde este archivo permite arrancar uvicorn desde la
    # raíz del monorepo o desde services/api sin perder las credenciales de
    # desarrollo definidas en docker/.env.
    project_root = next(
        (parent for parent in Path(__file__).resolve().parents if (parent / "docker" / ".env").exists()),
        None,
    )
    env_files = (".env", str(project_root / "docker" / ".env")) if project_root else (".env",)
    return Settings(_env_file=env_files)  # type: ignore[call-arg]
