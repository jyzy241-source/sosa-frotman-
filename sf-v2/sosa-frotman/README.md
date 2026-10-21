# Sosa-Frotman Inversiones — Monorepo

Plataforma SaaS para Sosa-Frotman Inversiones (Moca, RD).

## Estructura

```
apps/
  web/          Landing pública + solicitud de crédito (React + Vite)
  portal/       Portal de cliente autenticado (pendiente)
  backoffice/   Panel de oficiales/supervisores/admin (pendiente)
packages/
  ui/           Componentes compartidos
  api-client/   Cliente tipado generado desde el OpenAPI del backend
services/
  api/          Backend FastAPI (Python)
docker/         docker-compose para dev y prod
```

Ver `docker/docker-compose.yml` para levantar todo en local:

```
cd docker
cp .env.example .env
docker compose up --build
```

Frontend: http://localhost:5173
API: http://localhost:8000/docs

Ver `DESIGN.md` para el sistema de diseño y `ARCHITECTURE.md` para la arquitectura completa.
