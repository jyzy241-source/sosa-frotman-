import base64
from datetime import date
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, ConfigDict, Field, ValidationError
from sqlmodel.ext.asyncio.session import AsyncSession
from app.core.db import get_session
from app.modules.servicios.models import SolicitudServicio
from app.modules.servicios.pdf import generar_pdf_servicio
from app.modules.solicitudes.notificaciones import enviar_pdf_por_email

router = APIRouter()
TITULOS = {"traspaso": "Traspaso vehicular", "gps": "Venta e instalación de GPS", "seguro": "Seguro vehicular"}
COMUNES = {"nombre": "Nombre completo", "telefono": "Teléfono", "direccion": "Dirección",
           "marca": "Marca", "modelo": "Modelo", "ano": "Año", "placa": "Placa", "chasis": "Chasis"}
EXTRAS = {
    "gps": {"instalacion": "Lugar de instalación", "fecha": "Fecha preferida"},
    "seguro": {"cedula": "Cédula", "provincia": "Provincia", "sector": "Sector", "color": "Color", "valor": "Valor del vehículo (RD$)"},
    "traspaso": {"comprador": "Nombre del comprador", "comprador_documento": "Documento del comprador", "comprador_extranjero": "Comprador extranjero", "comprador_vencimiento": "Vencimiento del pasaporte del comprador", "vendedor": "Nombre del vendedor", "vendedor_documento": "Documento del vendedor", "vendedor_extranjero": "Vendedor extranjero", "vendedor_vencimiento": "Vencimiento del pasaporte del vendedor", "empresa": "Vehículo a nombre de una empresa", "empresa_nombre": "Nombre de la empresa", "empresa_rnc": "RNC", "empresa_representante": "Representante", "empresa_direccion": "Dirección de la empresa"},
}

class DatosServicio(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    nombre: str = Field(min_length=2, max_length=150)
    telefono: str = Field(min_length=10, max_length=30)
    direccion: str = Field(min_length=5, max_length=300)
    marca: str = Field(min_length=1, max_length=100)
    modelo: str = Field(min_length=1, max_length=100)
    ano: str = Field(pattern=r"^\d{4}$")
    placa: str = Field(min_length=1, max_length=30)
    chasis: str = Field(min_length=1, max_length=100)
    instalacion: str = Field(default="", max_length=300)
    fecha: str = Field(default="", max_length=10)
    cedula: str = Field(default="", max_length=30)
    provincia: str = Field(default="", max_length=100)
    sector: str = Field(default="", max_length=100)
    color: str = Field(default="", max_length=50)
    valor: str = Field(default="", max_length=30)
    comprador: str = Field(default="", max_length=150)
    comprador_documento: str = Field(default="", max_length=50)
    comprador_extranjero: bool = False
    comprador_vencimiento: str = Field(default="", max_length=10)
    vendedor: str = Field(default="", max_length=150)
    vendedor_documento: str = Field(default="", max_length=50)
    vendedor_extranjero: bool = False
    vendedor_vencimiento: str = Field(default="", max_length=10)
    empresa: bool = False
    empresa_nombre: str = Field(default="", max_length=200)
    empresa_rnc: str = Field(default="", max_length=30)
    empresa_representante: str = Field(default="", max_length=150)
    empresa_direccion: str = Field(default="", max_length=300)

def validar_servicio(servicio: str, datos: DatosServicio) -> tuple[dict, set[str]]:
    valores = datos.model_dump()
    requeridos = {"gps": ["instalacion", "fecha"], "seguro": ["cedula", "provincia", "sector", "color", "valor"],
                  "traspaso": ["comprador", "comprador_documento", "vendedor", "vendedor_documento"]}[servicio]
    archivos = {"seguro": {"matricula_frente", "matricula_reverso"}, "gps": set(), "traspaso": {"acto_venta", "matricula_original"}}[servicio]
    if servicio == "traspaso":
        for rol in ("comprador", "vendedor"):
            if valores[f"{rol}_extranjero"]:
                try:
                    if date.fromisoformat(valores[f"{rol}_vencimiento"]) < date.today():
                        raise ValueError()
                except ValueError:
                    raise HTTPException(422, f"El pasaporte del {rol} debe estar vigente.")
                archivos.add(f"{rol}_pasaporte")
            else:
                archivos.update({f"{rol}_cedula_frente", f"{rol}_cedula_reverso"})
        if datos.empresa:
            requeridos += ["empresa_nombre", "empresa_rnc", "empresa_representante", "empresa_direccion"]
    if any(not valores[campo] for campo in requeridos):
        raise HTTPException(422, "Completa los campos requeridos del servicio.")
    if servicio == "seguro":
        try:
            if not (0 < float(datos.valor) < 1e12):
                raise ValueError()
        except ValueError:
            raise HTTPException(422, "Indica un valor de vehículo válido.")
    if servicio == "gps":
        try:
            if date.fromisoformat(datos.fecha) < date.today():
                raise ValueError()
        except ValueError:
            raise HTTPException(422, "Selecciona una fecha de instalación válida.")
    etiquetas = COMUNES | EXTRAS[servicio]
    visibles = {etiquetas[k]: ("Sí" if v else "No") if isinstance(v, bool) else v for k,v in valores.items() if k in etiquetas}
    if servicio == "traspaso":
        for rol in ("comprador", "vendedor"):
            if not valores[f"{rol}_extranjero"]:
                visibles.pop(etiquetas[f"{rol}_vencimiento"], None)
        if not datos.empresa:
            for k in ("empresa_nombre", "empresa_rnc", "empresa_representante", "empresa_direccion"):
                visibles.pop(etiquetas[k], None)
    return visibles, archivos

@router.post("/{servicio}", status_code=201)
async def crear_servicio(servicio: str, request: Request, session: AsyncSession = Depends(get_session)):
    if servicio not in TITULOS:
        raise HTTPException(404, "Servicio no encontrado.")
    async with request.form(max_files=8, max_fields=1, max_part_size=64*1024) as form:
        try:
            raw = form.get("payload")
            datos = DatosServicio.model_validate_json(raw if isinstance(raw, str) else "")
        except (ValidationError, ValueError):
            raise HTTPException(422, "Revisa los datos requeridos del formulario.")
        visibles, requeridos = validar_servicio(servicio, datos)
        recibidos = {k for k,v in form.multi_items() if hasattr(v, "read")}
        if recibidos != requeridos or len(form.multi_items()) != len(requeridos) + 1:
            raise HTTPException(422, "Adjunta todos los documentos requeridos para este servicio.")
        adjuntos = []
        for tipo in sorted(requeridos):
            archivo = form[tipo]
            contenido = await archivo.read(3*1024*1024 + 1)
            mime = archivo.content_type
            firma = ((mime == "application/pdf" and contenido.startswith(b"%PDF-")) or
                     (mime == "image/jpeg" and contenido.startswith(b"\xff\xd8\xff")) or
                     (mime == "image/png" and contenido.startswith(b"\x89PNG\r\n\x1a\n")) or
                     (mime == "image/webp" and contenido.startswith(b"RIFF") and contenido[8:12] == b"WEBP"))
            if not firma or not contenido or len(contenido) > 3*1024*1024:
                raise HTTPException(422, f"{tipo}: usa PDF, JPG, PNG o WebP de máximo 3 MB.")
            nombre = (archivo.filename or tipo).replace("/", "_").replace("\\", "_")[:120]
            adjuntos.append({"tipo": tipo, "nombre_archivo": nombre, "content_type": mime, "contenido": contenido})
    folio = f"SFS-{uuid4().hex[:12].upper()}"
    pdf = generar_pdf_servicio(folio, TITULOS[servicio], {**datos.model_dump(), **visibles}, adjuntos)
    registro = SolicitudServicio(servicio=servicio, datos={"folio": folio, **visibles}, pdf=pdf,
        documentos=[{**a, "contenido": base64.b64encode(a["contenido"]).decode()} for a in adjuntos])
    session.add(registro)
    await session.commit()
    enviado = await enviar_pdf_por_email(folio, f"{folio}.pdf", pdf, adjuntos, TITULOS[servicio])
    registro.email_enviado = enviado
    session.add(registro)
    await session.commit()
    return {"folio": folio, "email_enviado": enviado}
