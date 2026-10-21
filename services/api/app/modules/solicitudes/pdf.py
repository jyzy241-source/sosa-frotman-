from app.modules.solicitudes.schemas import SolicitudCreate
from app.pdf_engine.engine import FieldSpec, FormSpec, SectionSpec, render_form_pdf

LOAN_SPEC = FormSpec(
    "Solicitud de financiamiento", "SF-000000",
    (
        SectionSpec("Datos del cliente", (
            (FieldSpec("Nombre y Apellido", "cliente_nombre"), FieldSpec("Apodo", "cliente_apodo")),
            (FieldSpec("Cédula", "cliente_cedula"), FieldSpec("Fecha de nacimiento", "cliente_fecha_nacimiento"), FieldSpec("Estado civil", "cliente_estado_civil")),
            (FieldSpec("Vivienda", "cliente_tipo_vivienda"), FieldSpec("Teléfono", "cliente_telefono"), FieldSpec("Ocupación", "cliente_ocupacion")),
            (FieldSpec("Dirección", "cliente_direccion"),),
        )),
        SectionSpec("Datos laborales", (
            (FieldSpec("Nombre de la Empresa", "laboral_empresa"), FieldSpec("Tipo de Empresa", "laboral_tipo_empresa")),
            (FieldSpec("Teléfono", "laboral_telefono"), FieldSpec("Cargo ocupado", "laboral_cargo"), FieldSpec("Sueldo", "laboral_sueldo")),
            (FieldSpec("Tiempo en la Empresa", "laboral_tiempo_empresa"), FieldSpec("Jefe inmediato", "laboral_jefe_inmediato"), FieldSpec("Otros ingresos", "laboral_otros_ingresos")),
            (FieldSpec("Dirección", "laboral_direccion"),),
        )),
        SectionSpec("Características de préstamo", (
            (FieldSpec("Monto solicitado", "prestamo_monto_solicitado"), FieldSpec("Plazo", "prestamo_plazo_meses"), FieldSpec("Modalidad", "prestamo_modalidad")),
            (FieldSpec("Solo interés", "prestamo_solo_interes"), FieldSpec("Préstamo adicional", "prestamo_adicional"), FieldSpec("Capacidad de pagos", "prestamo_capacidad_pago")),
            (FieldSpec("Tipo de garantía", "prestamo_tipo_garantia"),),
        )),
        SectionSpec("Financiamiento de celular", ((FieldSpec("Equipo", "equipo"), FieldSpec("Tienda", "tienda")), (FieldSpec("Dirección de la tienda", "direccion_tienda"),)),),
        SectionSpec("Codeudor", ((FieldSpec("Nombre", "codeudor_nombre"), FieldSpec("Cédula", "codeudor_cedula")), (FieldSpec("Teléfono", "codeudor_telefono"), FieldSpec("Dirección", "codeudor_direccion")))),
        SectionSpec("Fiador", ((FieldSpec("Nombre", "fiador_nombre"), FieldSpec("Cédula", "fiador_cedula")), (FieldSpec("Teléfono", "fiador_telefono"), FieldSpec("Dirección", "fiador_direccion")))),
        SectionSpec("Referencias", ((FieldSpec("Referencia 1", "referencia_1"), FieldSpec("Teléfono", "referencia_1_tel")), (FieldSpec("Referencia 2", "referencia_2"), FieldSpec("Teléfono", "referencia_2_tel")))),
    ),
    signatures=("FIRMA DEL CLIENTE", "FIRMA DEL CODEUDOR", "FIRMA DEL FIADOR", "FIRMA DE SUPERVISOR DE OFICIALES"),
)

def _flatten(solicitud: SolicitudCreate) -> dict[str, object]:
    data = solicitud.model_dump(mode="json")
    cliente = data.pop("cliente", {})
    laboral = data.pop("datos_laborales", {})
    prestamo = data.pop("caracteristicas", {})
    result = {**data}
    result.update({f"cliente_{k}": v for k, v in cliente.items()})
    result["cliente_nombre"] = f"{cliente.get('nombre', '')} {cliente.get('apellido', '')}".strip()
    result.update({f"laboral_{k}": v for k, v in laboral.items()})
    result.update({f"prestamo_{k}": v for k, v in prestamo.items()})
    for role in ("codeudor", "fiador"):
        person = data.get(role) or {}
        result.update({f"{role}_{k}": v for k, v in person.items()})
        result[f"{role}_nombre"] = f"{person.get('nombre', '')} {person.get('apellido', '')}".strip()
    for index, ref in enumerate(solicitud.referencias[:2], 1):
        result[f"referencia_{index}"] = ref.nombre
        result[f"referencia_{index}_tel"] = ref.telefono
    return result

def generar_pdf_solicitud(folio: int, solicitud: SolicitudCreate) -> bytes:
    spec = FormSpec(LOAN_SPEC.title, f"SF-{folio:06d}", LOAN_SPEC.sections, LOAN_SPEC.signatures)
    return render_form_pdf(spec, _flatten(solicitud))
