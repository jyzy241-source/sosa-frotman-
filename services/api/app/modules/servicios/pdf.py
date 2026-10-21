from app.pdf_engine.engine import FieldSpec, FormSpec, SectionSpec, render_form_pdf

SERVICE_FORMS = {
    "gps": FormSpec("Venta e instalacion de GPS", "SF-GPS-000001", (
        SectionSpec("Datos del cliente", tuple((FieldSpec(label, key),) for key, label in (("nombre", "Nombre completo"), ("telefono", "Telefono"), ("direccion", "Direccion")))),
        SectionSpec("Datos del vehiculo", tuple((FieldSpec(label, key),) for key, label in (("marca", "Marca"), ("modelo", "Modelo"), ("ano", "Ano"), ("placa", "Placa"), ("chasis", "Chasis")))),
        SectionSpec("Plan / equipo GPS", ((FieldSpec("Lugar de instalacion", "instalacion"), FieldSpec("Fecha preferida", "fecha")),)),
    )),
    "seguro": FormSpec("Seguro vehicular", "SF-SEG-000001", (
        SectionSpec("Datos del cliente", tuple((FieldSpec(label, key),) for key, label in (("nombre", "Nombre completo"), ("telefono", "Telefono"), ("direccion", "Direccion"), ("cedula", "Cedula")))),
        SectionSpec("Datos del vehiculo", (
            (FieldSpec("Marca", "marca"), FieldSpec("Modelo", "modelo")),
            (FieldSpec("Ano", "ano"), FieldSpec("Placa", "placa")),
            (FieldSpec("Chasis", "chasis"), FieldSpec("Color", "color")),
            (FieldSpec("Valor del vehiculo", "valor"),),
        )),
        SectionSpec("Cobertura y vigencia", ((FieldSpec("Provincia", "provincia"), FieldSpec("Sector", "sector")),)),
    )),
    "traspaso": FormSpec("Traspaso vehicular", "SF-TRA-000001", (
        SectionSpec("Datos del vendedor", ((FieldSpec("Nombre", "vendedor"), FieldSpec("Documento", "vendedor_documento")),)),
        SectionSpec("Datos del comprador", ((FieldSpec("Nombre", "comprador"), FieldSpec("Documento", "comprador_documento")),)),
        SectionSpec("Datos del vehiculo", (
            (FieldSpec("Marca", "marca"), FieldSpec("Modelo", "modelo")),
            (FieldSpec("Ano", "ano"), FieldSpec("Placa", "placa")),
            (FieldSpec("Chasis", "chasis"),),
        )),
        SectionSpec("Precio y condiciones", ((FieldSpec("Direccion", "direccion"),),)),
    )),
}

def generar_pdf_servicio(folio: str, titulo: str, datos: dict, documentos: list[dict]) -> bytes:
    slug = next((key for key, spec in SERVICE_FORMS.items() if spec.title == titulo), "gps")
    payload = {**datos, "documentos": ", ".join(a["nombre_archivo"] for a in documentos)}
    return render_form_pdf(SERVICE_FORMS[slug], payload)
