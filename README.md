# Sosa-Frotman Inversiones — Monorepo

Plataforma SaaS para Sosa-Frotman Inversiones (Moca, RD).

## Estructura

```
apps/
  web/          Landing pública + solicitud de crédito (React + Vite)
  portal/       Reservado; no se usa en el alcance actual
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

## Formularios por servicio y envío de PDF

Los préstamos se identifican por `/solicitud?servicio=personal|hipotecario|vehiculo|celular`.
Celulares utiliza la solicitud de crédito y agrega equipo y tienda.
Seguro, Traspaso y GPS tienen formularios propios en sus rutas de servicios.

El backend guarda la solicitud antes de enviar por Resend el PDF y sus documentos.
Configurar únicamente en el backend: `RESEND_API_KEY`, `NOTIFICACIONES_EMAIL_FROM`
(remitente autorizado en Resend) y `NOTIFICACIONES_EMAIL_TO` (destinatarios separados por comas).
La respuesta `email_enviado` indica si Resend aceptó el correo; la interfaz informa si falló.

Antes de iniciar una API existente, ejecutar desde `services/api`: `alembic upgrade head`.
La migración `6b942b8d913c` agrega el servicio, equipo y tienda a los préstamos
y crea el almacenamiento privado de solicitudes de servicios. Docker aplica las migraciones al arrancar.

Verificación: `npm run build` en `apps/web` y `python -m pytest tests -q` en `services/api`.
Las pruebas usan datos ficticios, base de datos simulada y Resend simulado.
Documentación de la integración: https://resend.com/docs/api-reference/emails/send-email

Alcance actual: el cliente solo completa solicitudes públicas y adjunta documentos.
No necesita crear una cuenta ni usar un portal. La gestión posterior corresponde al
equipo interno.
