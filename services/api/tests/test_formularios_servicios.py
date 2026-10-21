import base64
import json
from pathlib import Path
from types import SimpleNamespace

import httpx
import pymupdf
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.core.db import get_session
from app.modules.servicios import router as modulo
from app.modules.servicios.router import DatosServicio, validar_servicio
from app.modules.servicios.pdf import generar_pdf_servicio
from app.modules.solicitudes import notificaciones
from app.modules.solicitudes.pdf import generar_pdf_solicitud
from app.modules.solicitudes.schemas import SolicitudCreate

BASE = dict(nombre="Cliente de prueba", telefono="8095550100", direccion="Dirección de prueba 123",
            marca="Toyota", modelo="Corolla", ano="2024", placa="PRUEBA", chasis="CHASIS-PRUEBA")
TRASPASO = dict(BASE, comprador="Comprador de prueba", comprador_documento="DOC-PRUEBA",
                vendedor="Vendedor de prueba", vendedor_documento="DOC-PRUEBA-2")
PDF = b"%PDF-1.4\nArchivo de prueba"

class FakeSession:
    def __init__(self):
        self.registros = []
    def add(self, obj):
        self.registros.append(obj)
    async def commit(self):
        pass

@pytest.fixture
def cliente(monkeypatch):
    session = FakeSession()
    async def dependencia():
        yield session
    async def correo(*args):
        return True
    app = FastAPI()
    app.include_router(modulo.router, prefix="/servicios")
    app.dependency_overrides[get_session] = dependencia
    monkeypatch.setattr(modulo, "enviar_pdf_por_email", correo)
    with TestClient(app) as c:
        yield c, session

def post(c, servicio, datos, documentos=(), contenido=PDF, mime="application/pdf"):
    # Multipart payload remains multipart even without attachments.
    files = [("payload", (None, json.dumps(datos)))]
    files += [(k, (k+".pdf", contenido, mime)) for k in documentos]
    return c.post("/servicios/"+servicio, files=files)

def test_traspaso_documentos_y_empresa(cliente):
    c, session = cliente
    datos = DatosServicio(**TRASPASO)
    _, docs = validar_servicio("traspaso", datos)
    assert len(docs) == 6
    assert post(c, "traspaso", TRASPASO).status_code == 422
    res = post(c, "traspaso", TRASPASO, docs)
    assert res.status_code == 201, res.text
    assert res.json()["email_enviado"]
    assert session.registros[0].pdf.startswith(b"%PDF")
    con_empresa = dict(TRASPASO, empresa=True)
    assert post(c, "traspaso", con_empresa, docs).status_code == 422
    con_empresa.update(empresa_nombre="Empresa prueba", empresa_rnc="RNC-PRUEBA",
                       empresa_representante="Representante", empresa_direccion="Dirección empresa")
    assert post(c, "traspaso", con_empresa, docs).status_code == 201

def test_pasaporte_vigente_y_documentos_condicionales(cliente):
    c, _ = cliente
    datos = dict(TRASPASO, comprador_extranjero=True, comprador_vencimiento="2000-01-01")
    assert post(c, "traspaso", datos).status_code == 422
    datos["comprador_vencimiento"] = "2099-01-01"
    _, docs = validar_servicio("traspaso", DatosServicio(**datos))
    assert "comprador_pasaporte" in docs
    assert "comprador_cedula_frente" not in docs
    assert post(c, "traspaso", datos, docs).status_code == 201

def test_archivos_invalidos_y_seguro(cliente):
    c, _ = cliente
    datos = dict(BASE, cedula="DOC-PRUEBA", provincia="Espaillat", sector="Centro", color="Gris", valor="100000")
    docs = ["matricula_frente", "matricula_reverso"]
    assert post(c, "seguro", datos, docs, b"archivo falso").status_code == 422
    assert post(c, "seguro", datos, docs, b"%PDF-"+b"x"*(3*1024*1024)).status_code == 422
    assert post(c, "seguro", datos, docs).status_code == 201
    assert post(c, "seguro", dict(datos, valor="-1"), docs).status_code == 422

def test_gps_y_error_de_correo(cliente, monkeypatch):
    c, session = cliente
    async def fallo(*args): return False
    monkeypatch.setattr(modulo, "enviar_pdf_por_email", fallo)
    res = post(c, "gps", dict(BASE, instalacion="Oficina Moca", fecha="2099-01-01"))
    assert res.status_code == 201, res.text
    assert res.json()["email_enviado"] is False
    assert session.registros[0].email_enviado is False

@pytest.mark.asyncio
async def test_resend_con_pdf_y_documentos(monkeypatch):
    capturado = {}
    def handler(request):
        capturado.update(json.loads(request.content))
        assert request.headers["Authorization"] == "Bearer TEST-KEY"
        return httpx.Response(200, json={"id": "mail-prueba"})
    client = httpx.AsyncClient
    monkeypatch.setattr(notificaciones, "get_settings", lambda: SimpleNamespace(
        resend_api_key="TEST-KEY", notificaciones_email_from="prueba@example.com",
        notificaciones_email_to="oficina@example.com"))
    monkeypatch.setattr(notificaciones.httpx, "AsyncClient",
                        lambda **kwargs: client(transport=httpx.MockTransport(handler), **kwargs))
    assert await notificaciones.enviar_pdf_por_email("TEST-001", "formulario.pdf", PDF,
        [{"tipo": "cedula_frente", "nombre_archivo": "cedula.jpg", "contenido": b"imagen", "content_type": "image/jpeg"}])
    assert len(capturado["attachments"]) == 2
    assert base64.b64decode(capturado["attachments"][0]["content"]) == PDF
    assert capturado["to"] == ["oficina@example.com"]

def test_pdf_servicio_texto_y_render():
    visibles, docs = validar_servicio("traspaso", DatosServicio(**dict(TRASPASO, empresa=True,
        empresa_nombre="Empresa de prueba", empresa_rnc="RNC-PRUEBA", empresa_representante="Representante",
        empresa_direccion="Dirección de prueba de la empresa")))
    archivos = [{"tipo": k, "nombre_archivo": k+".pdf"} for k in docs]
    pdf = generar_pdf_servicio("SFS-PRUEBA", "Traspaso vehicular", visibles, archivos)
    salida = Path("../../tmp/pdfs")
    salida.mkdir(parents=True, exist_ok=True)
    (salida/"traspaso-prueba.pdf").write_bytes(pdf)
    doc = pymupdf.open(stream=pdf, filetype="pdf")
    texto = "".join(page.get_text() for page in doc)
    assert "Empresa de prueba" in texto and "Acto venta" in texto
    for n, page in enumerate(doc):
        page.get_pixmap(matrix=pymupdf.Matrix(1.3, 1.3)).save(str(salida/f"traspaso-prueba-{n+1}.png"))

def test_pdf_celular_incluye_equipo_tienda():
    persona = dict(nombre="Cliente prueba", apellido="Ejemplo", cedula="DOC-PRUEBA",
        fecha_nacimiento="1995-01-01", estado_civil="Soltero", tipo_vivienda="propia",
        telefono="8095550100", direccion="Dirección de prueba", ocupacion="Empleado")
    laboral = dict(empresa="Empresa de prueba", tipo_empresa="Privada", telefono="8095550100",
        cargo="Empleado", sueldo=30000, tiempo_empresa="2 años", direccion="Dirección laboral")
    solicitud = SolicitudCreate(cliente=persona, datos_laborales=laboral,
        caracteristicas=dict(monto_solicitado=20000, plazo_meses=12, modalidad="Mensual"),
        autorizacion_buro={"aceptado": True}, servicio="celular", equipo="Equipo de prueba", tienda="Tienda de prueba")
    pdf = generar_pdf_solicitud(1, solicitud)
    doc = pymupdf.open(stream=pdf, filetype="pdf")
    texto = "".join(page.get_text() for page in doc)
    assert "Equipo de prueba" in texto and "Tienda de prueba" in texto
    salida = Path("../../tmp/pdfs")
    (salida/"celular-prueba.pdf").write_bytes(pdf)
    for n, page in enumerate(doc):
        page.get_pixmap(matrix=pymupdf.Matrix(1.3, 1.3)).save(str(salida/f"celular-prueba-{n+1}.png"))
