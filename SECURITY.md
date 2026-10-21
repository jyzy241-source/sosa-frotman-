# Seguridad y verificación

## Configuración obligatoria

- Mantener `ALLOW_PUBLIC_REGISTRATION=false` en producción. El cliente solo envía solicitudes públicas; las cuentas internas se crean por un proceso administrativo controlado.
- Definir `SECRET_KEY` único y aleatorio, `DATABASE_URL`, `CORS_ORIGINS` con dominios reales y las credenciales de Resend únicamente en el entorno de despliegue.
- Servir la API detrás de HTTPS. En producción la API envía HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` y `Permissions-Policy`.

## Verificación local

Backend (desde `services/api`, con la configuración de prueba):

```powershell
python -m pytest tests -q
ruff check app tests
mypy app
```

Frontend:

```powershell
npm run typecheck
npm run build
```

Las cargas de formularios tienen un límite global configurable con `MAX_UPLOAD_BYTES` (15 MiB por defecto), además de los límites individuales de cada archivo.
