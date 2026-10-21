# syntax=docker/dockerfile:1

# --- Etapa base: dependencias del sistema + uv ---
FROM python:3.12-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PROJECT_ENVIRONMENT=/opt/venv
RUN apt-get update && apt-get install -y --no-install-recommends \
        curl \
        libpq-dev \
        gcc \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# --- Etapa deps: instala dependencias en un venv cacheable ---
# Nota: usa uv.lock si existe (build reproducible); si no existe todavía,
# uv lo genera en este paso. Una vez que exista, commitealo al repo y
# cambiá a "uv sync --frozen" para builds 100% reproducibles.
FROM base AS deps
COPY pyproject.toml ./
RUN python -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir \
    "fastapi[standard]>=0.111" "uvicorn[standard]>=0.30" "gunicorn>=22.0" \
    "sqlmodel>=0.0.21" "sqlalchemy[asyncio]>=2.0" "asyncpg>=0.29" "alembic>=1.13" \
    "pydantic-settings>=2.3" "python-jose[cryptography]>=3.3" "passlib[bcrypt]>=1.7" \
    "pyotp>=2.9" "slowapi>=0.1.9" "redis>=5.0" "reportlab>=4.2" "httpx>=0.27"

# --- Etapa dev: hot-reload, incluye dependencias de desarrollo ---
FROM base AS dev
COPY pyproject.toml ./
RUN pip install --no-cache-dir \
    "fastapi[standard]>=0.111" "uvicorn[standard]>=0.30" "gunicorn>=22.0" \
    "sqlmodel>=0.0.21" "sqlalchemy[asyncio]>=2.0" "asyncpg>=0.29" "alembic>=1.13" \
    "pydantic-settings>=2.3" "python-jose[cryptography]>=3.3" "passlib[bcrypt]>=1.7" \
    "pyotp>=2.9" "slowapi>=0.1.9" "redis>=5.0" "reportlab>=4.2" "httpx>=0.27" \
    "pytest>=8.2" "pytest-asyncio>=0.23" "ruff>=0.5" "mypy>=1.10"
COPY . .
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONPATH="/app"
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# --- Etapa prod: imagen mínima, sin dev deps, usuario no-root ---
FROM base AS prod
COPY --from=deps /opt/venv /opt/venv
COPY . .
ENV PATH="/opt/venv/bin:$PATH"
RUN useradd --create-home --uid 1000 appuser \
    && chown -R appuser:appuser /app
USER appuser
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1
CMD ["gunicorn", "app.main:app", \
     "-k", "uvicorn.workers.UvicornWorker", \
     "--workers", "4", "--bind", "0.0.0.0:8000", \
     "--access-logfile", "-", "--error-logfile", "-"]
