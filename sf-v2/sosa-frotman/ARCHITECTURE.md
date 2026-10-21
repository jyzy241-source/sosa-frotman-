# Sosa-Frotman Inversiones — Arquitectura SaaS

Plataforma para gestión de solicitudes de crédito, clientes, cuotas y back-office, sobre el stack que ya manejás (React, Node/Express, PostgreSQL, Hostinger VPS).

## 1. Roles del sistema

Todo el diseño de auth/DB parte de estos 4 roles:

| Rol | Qué hace |
|---|---|
| **Cliente** | Solicita crédito, ve su estado, paga cuotas, descarga contratos |
| **Oficial de crédito** | Revisa solicitudes asignadas, visita al cliente, llena checklist de electrodomésticos, aprueba/rechaza |
| **Supervisor** | Aprueba montos altos, ve reportes por oficial, reasigna solicitudes |
| **Admin** | Gestión de usuarios, configuración de productos de préstamo, auditoría |

## 2. Frontend

**Stack:** React 18 + Vite, React Router, TanStack Query, React Hook Form + Zod, Zustand (estado de UI liviano), Tailwind con los tokens de `DESIGN.md`.

**Apps separadas, un solo repo (monorepo con pnpm workspaces o Turborepo):**
- `apps/web` — landing pública + solicitud de crédito (lo que ya vimos en el DESIGN.md)
- `apps/portal` — portal de cliente autenticado (estado de solicitud, cuotas, pagos)
- `apps/backoffice` — panel de oficiales/supervisores/admin
- `packages/ui` — componentes compartidos (Button, Card, FormField, DataTable, Badge) siguiendo el sistema de diseño
- `packages/api-client` — cliente tipado generado desde el OpenAPI del backend

Justifica la separación: el back-office maneja datos sensibles (cédulas, buró de crédito) y no debería compartir bundle con la landing pública.

## 3. Backend

**Stack:** Python + **FastAPI** — encaja además con tu dirección hacia backend cloud-native / data engineering, más que quedarte en Node. FastAPI da tipado real con Pydantic, OpenAPI generado automáticamente (sin librerías intermedias) y async nativo para I/O (email, buró de crédito, notificaciones).

- **ORM:** SQLAlchemy 2.0 (estilo async) + **SQLModel** si querés que el modelo de datos y el schema de validación compartan una sola definición (recomendado para no duplicar `Cliente` en dos lugares).
- **Migraciones:** Alembic.
- **Validación:** Pydantic v2 en cada boundary de request/response.
- **Servidor:** Uvicorn detrás de Nginx, con Gunicorn como process manager (`gunicorn -k uvicorn.workers.UvicornWorker`) en vez de PM2 para el backend — PM2 queda para lo que ya tengas en Node si algo se mantiene ahí.
- **Jobs/cron:** APScheduler si el volumen es bajo (mora, recordatorios de cuota); Celery + Redis solo si more adelante necesitás colas reales (envío masivo, generación de PDFs en background).

**Estructura por módulos, no por capas técnicas:**
```
app/
  modules/
    auth/           # login, refresh, MFA, password reset
    clientes/       # CRUD cliente, KYC
    solicitudes/    # motor de la solicitud multi-paso
    prestamos/      # producto de préstamo aprobado, tabla de amortización
    cuotas/         # cronograma, pagos, mora
    codeudores/
    fiadores/
    referencias/
    documentos/     # subida cédula, contratos generados
    buro_credito/   # integración BIC (ley 172-13)
    notificaciones/ # email, SMS, WhatsApp
    auditoria/      # log de cada acción sensible
    usuarios/       # gestión interna, roles
    __cada módulo__: router.py, schemas.py (Pydantic), models.py (SQLModel), service.py, deps.py
  core/
    security.py     # hashing, JWT, MFA
    config.py        # settings vía pydantic-settings
    middleware.py     # rbac, rate-limit, audit-log
  jobs/              # tareas programadas: mora, recordatorios
  main.py
```

**API:** REST, OpenAPI 3.1 autogenerado por FastAPI, versión en el path (`/api/v1`). GraphQL no aporta nada acá — es CRUD financiero con roles claros, REST es más simple de auditar.

## 4. Base de datos — PostgreSQL

**Entidades núcleo** (a partir de tu formulario en papel):

```sql
usuarios (id, email, password_hash, rol, mfa_secret, activo, creado_en)

clientes (
  id, usuario_id, nombre, apellido, apodo, cedula, fecha_nacimiento,
  estado_civil, tipo_vivienda, telefono, direccion, ocupacion
)

datos_laborales (
  id, cliente_id, empresa, tipo_empresa, telefono, cargo,
  sueldo, tiempo_empresa, jefe_inmediato, otros_ingresos, direccion
)

solicitudes (
  id, cliente_id, oficial_id, estado, monto_solicitado, plazo_meses,
  modalidad, solo_interes, prestamo_adicional, capacidad_pago,
  tipo_garantia, cuotas_propuestas, creado_en, decidido_en
)
  -- estado: borrador | enviada | en_revision | aprobada | rechazada | desembolsada

codeudores (id, solicitud_id, ...mismos campos que cliente + laborales)
fiadores   (id, solicitud_id, ...mismos campos que cliente + laborales)

referencias (id, solicitud_id, tipo /* comercial|personal */, nombre, telefono)

visita_domicilio (
  id, solicitud_id, oficial_id, fecha,
  electrodomesticos jsonb  -- {abanico: true, nevera: true, vehiculos: 1, ...}
)

autorizacion_buro (id, solicitud_id, aceptado, ip, firma_digital_url, fecha)

prestamos (
  id, solicitud_id, monto_aprobado, tasa, plazo_meses,
  fecha_desembolso, estado  -- activo | pagado | mora | castigado
)

cuotas (
  id, prestamo_id, numero, monto, fecha_vencimiento,
  fecha_pago, estado  -- pendiente | pagada | vencida
)

pagos (id, cuota_id, monto, metodo, referencia, registrado_por, fecha)

documentos (id, entidad_tipo, entidad_id, tipo_doc, url, subido_por, fecha)

auditoria (id, usuario_id, accion, entidad_tipo, entidad_id, detalle jsonb, ip, fecha)
```

**Decisiones clave:**
- `electrodomesticos` como `jsonb`: la lista del formulario cambia poco pero no vale la pena una tabla aparte.
- `auditoria` graba **toda** acción sobre `solicitudes`, `cuotas` y `documentos` — es un requisito casi implícito al manejar buró de crédito.
- Migraciones con **Prisma** o **Drizzle** (Drizzle si querés SQL más explícito y menor overhead; Prisma si preferís DX y ya lo conocés). Nunca migraciones a mano en producción.
- Backups: `pg_dump` diario automatizado + retención 30 días, punto separado en DevOps.

## 5. Auth y seguridad

- **Auth:** JWT de acceso (15 min) + refresh token httpOnly cookie (7 días, rotación en cada uso). Nunca guardes el JWT en localStorage — para roles internos con datos de buró, cookie httpOnly + `SameSite=Strict` es no negociable.
- **RBAC:** middleware que verifica rol + ownership (`cliente` solo ve sus propias solicitudes; `oficial` solo las asignadas).
- **MFA:** obligatorio para `oficial`, `supervisor`, `admin` (TOTP con `pyotp`). Opcional para `cliente`.
- **Rate limiting:** `slowapi` (equivalente de express-rate-limit para FastAPI) + Redis en `/api/v1/auth/*` y en el endpoint de solicitud pública (evita spam de solicitudes falsas).
- **Cifrado en reposo:** cédula y datos bancarios cifrados a nivel de columna (`pgcrypto` o cifrado en aplicación con `cryptography`/Fernet) — no solo confiar en el disco cifrado del VPS.
- **Validación:** Pydantic en cada boundary, nunca confiar en el frontend.
- **Headers:** middleware de seguridad tipo `secure` o headers manuales (FastAPI no trae helmet, se replica a mano), CORS restringido a los 3 dominios (web/portal/backoffice), CSP explícito.
- **Passwords:** `passlib` con bcrypt/argon2.
- **Cumplimiento local:** la autorización de buró de crédito (ley 172-13) debe quedar con IP, timestamp y evidencia de aceptación — ya contemplado en `autorizacion_buro`.
- **Secretos:** nunca en el repo; `.env` por ambiente + gestor de secretos (mínimo viable: Doppler o Infisical; a este tamaño no hace falta Vault).

## 6. DevOps

Sobre tu infraestructura actual (Hostinger VPS + Nginx + PM2 + Certbot + Cloudflare):

- **Ambientes:** `dev` (local), `staging` (subdominio `staging.sosafrotman.com`), `prod`.
- **CI/CD:** GitHub Actions — lint + typecheck + test en cada PR; deploy a `staging` automático en merge a `main`; deploy a `prod` manual con aprobación (tag o workflow_dispatch).
- **Proceso de deploy backend:** entorno virtual (`uv` o `poetry` para dependencias reproducibles) → Alembic `upgrade head` → reload de Gunicorn sin downtime (`kill -HUP` al master, o `systemd` con `Restart=always` y `ExecReload`). Un `systemd` service unit versionado en el repo en vez del `ecosystem.config.js` de PM2.
- **Nginx:** un `server block` por app (web/portal/backoffice/api), rate limiting a nivel de Nginx como segunda capa, headers de seguridad ahí también.
- **Monitoreo:** PM2 + `pm2-logrotate` ya cubre logs básicos; sumar Sentry (free tier alcanza) para errores de frontend y backend, y un uptime check externo (UptimeRobot) para los 4 subdominios.
- **DB:** PostgreSQL en el mismo VPS si el volumen es bajo, o managed (Supabase/Neon) si preferís no operar la DB vos misma — dado que es dato financiero sensible, un managed con backups automáticos y PITR reduce mucho riesgo operativo por poco costo.

## 7. Testing

- **Backend:** `pytest` + `httpx.AsyncClient` (cliente de test nativo de FastAPI) para integración de cada módulo (mínimo: flujo completo de solicitud, cálculo de amortización, RBAC por rol). `testcontainers-python` con Postgres real para no mockear la DB en los tests críticos. `pytest-cov` para cobertura.
- **Frontend:** Vitest + React Testing Library para componentes de `packages/ui` y el formulario multi-paso; Playwright para 2-3 flujos E2E críticos (solicitar crédito completo, login + ver cuotas, oficial aprueba solicitud).
- **Contratos:** el OpenAPI que FastAPI genera automáticamente alimenta la generación del `api-client` tipado del frontend (`openapi-typescript`) en CI — evita que un cambio de shape rompa el portal sin avisar.
- **Cobertura:** no perseguir un número; priorizar los módulos `auth`, `solicitudes`, `prestamos` y `cuotas` porque ahí está el dinero y el dato sensible.

## 8. Tooling

- **Monorepo:** Turborepo para el frontend (`apps/`, `packages/`) + backend Python como paquete independiente dentro del mismo repo (`services/api/`), gestionado con `uv` o `poetry`
- **Lint/format frontend:** ESLint + Prettier
- **Lint/format backend:** `ruff` (lint + format en una sola herramienta, reemplaza flake8+black+isort) + `mypy` para chequeo de tipos estático sobre las anotaciones de Pydantic/SQLModel
- **Tipos:** TypeScript en el frontend; type hints + Pydantic como fuente única de verdad para validación + tipos en el backend
- **Docs internas:** este archivo + un `README` por módulo del backend; FastAPI ya sirve Swagger UI y Redoc automáticamente en `/docs` y `/redoc`, sin generación manual
- **Gestión de tareas:** Linear o GitHub Projects, lo que ya uses

## 9. Orden de construcción sugerido

1. DB schema + migraciones + seeds
2. Auth + RBAC (backend) — todo lo demás depende de esto
3. Módulo `solicitudes` completo (backend) con el flujo de 6 pasos
4. `apps/web`: landing + formulario público conectado al backend real
5. `apps/portal`: login cliente, ver estado, cuotas
6. `apps/backoffice`: cola de solicitudes, aprobación, visita de domicilio
7. Módulo `cuotas`/`pagos` + jobs de mora
8. CI/CD, monitoreo, hardening de seguridad, testing E2E
9. Documentos generados (contrato PDF) + notificaciones

Este orden prioriza tener el **formulario público funcionando contra backend real** lo antes posible, porque es la pieza que genera valor inmediato (reemplaza el papel), y deja auth/back-office para cuando ya hay datos reales entrando.
