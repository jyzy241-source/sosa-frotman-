import base64
import logging
import asyncio

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)


async def enviar_pdf_por_email(
    folio: int | str, nombre_archivo: str, pdf: bytes,
    adjuntos: list[dict] | None = None, servicio: str = "Solicitud de crédito",
) -> bool:
    settings = get_settings()
    if not all((settings.resend_api_key, settings.notificaciones_email_from,
                settings.notificaciones_email_to)):
        logger.warning("Solicitud %s archivada; falta configurar Resend.", folio)
        return False
    archivos = [{"filename": nombre_archivo, "content": base64.b64encode(pdf).decode()}]
    for index, adjunto in enumerate(adjuntos or []):
        if adjunto["content_type"] == "application/pdf" and adjunto["contenido"] == pdf:
            continue
        archivos.append({
            "filename": f"{index + 1}-{adjunto['tipo']}-{adjunto['nombre_archivo']}",
            "content": base64.b64encode(adjunto["contenido"]).decode(),
        })
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = None
            for intento in range(3):
                response = await client.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {settings.resend_api_key}",
                         "Idempotency-Key": f"solicitud-{folio}"},
                json={
                    "from": settings.notificaciones_email_from,
                    "to": [v.strip() for v in settings.notificaciones_email_to.split(",") if v.strip()],
                    "subject": f"{servicio} · {folio}",
                    "text": f"Se recibió una solicitud de {servicio}. Folio: {folio}.\n"
                            "El formulario PDF y sus documentos están adjuntos.",
                    "attachments": archivos,
                },
                )
                if response.is_success:
                    break
                if response.status_code >= 500 and intento < 2:
                    await asyncio.sleep(2 ** intento)
            response.raise_for_status()
            return bool(response.json().get("id"))
    except (httpx.HTTPError, ValueError) as exc:
        detalle = ""
        if isinstance(exc, httpx.HTTPStatusError):
            detalle = f" status={exc.response.status_code} body={exc.response.text[:500]}"
        logger.exception("No se pudo enviar la solicitud %s por Resend.%s", folio, detalle)
        return False
