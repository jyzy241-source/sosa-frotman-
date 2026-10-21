import { LogoBanner } from "@/components/common/LogoBanner";
import { useState, type FormEvent } from "react";
import { buttonStyles } from "@ui";
import { API_URL } from "@/lib/api";

type Servicio = "traspaso" | "gps" | "seguro";
type Campo = [string, string, string?];
const TITULOS = { traspaso: "Traspaso vehicular", gps: "Venta e instalación de GPS", seguro: "Seguro vehicular" };
const COMUNES: Campo[] = [["nombre", "Nombre completo"], ["telefono", "Teléfono", "tel"], ["direccion", "Dirección"]];
const VEHICULO: Campo[] = [["marca", "Marca"], ["modelo", "Modelo"], ["ano", "Año", "number"], ["placa", "Placa"], ["chasis", "Número de chasis"]];
const inputClass = "mt-2 block min-h-12 w-full rounded-input border-0 bg-[#f3f6f5] px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-teal";

export function FormularioServicio({ servicio }: { servicio: Servicio }) {
  const [datos, setDatos] = useState<Record<string, string | boolean>>({});
  const [archivos, setArchivos] = useState<Record<string, File>>({});
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState<{ folio: string; email_enviado: boolean } | null>(null);
  const actualizar = (campo: string, valor: string | boolean) => setDatos(prev => ({ ...prev, [campo]: valor }));
  const documentos: [string, string][] = servicio === "seguro" ? [["matricula_frente", "Matrícula: frente"], ["matricula_reverso", "Matrícula: reverso"]] : servicio === "traspaso" ? [
    ["acto_venta", "Acto de venta legalizado por notario"], ["matricula_original", "Copia de la matrícula original"],
    ...(["comprador", "vendedor"] as const).flatMap((rol): [string, string][] => datos[rol + "_extranjero"] ? [[rol + "_pasaporte", "Pasaporte vigente del " + rol]] : [[rol + "_cedula_frente", "Cédula del " + rol + ": frente"], [rol + "_cedula_reverso", "Cédula del " + rol + ": reverso"]]),
  ] : [];
  const campos = (lista: Campo[]) => <div className="mt-5 grid gap-5 sm:grid-cols-2">{lista.map(([id, label, type = "text"]) => <label key={id} htmlFor={id} className="text-sm font-medium text-ink">{label} *
    <input id={id} name={id} type={type} required maxLength={type === "number" ? undefined : 300} min={type === "number" ? (id === "ano" ? 1900 : 1) : type === "date" ? new Date().toLocaleDateString("en-CA") : undefined} max={id === "ano" ? new Date().getFullYear() + 1 : undefined} minLength={id === "telefono" ? 10 : undefined} value={String(datos[id] ?? "")} onChange={e => actualizar(id, e.target.value)} className={inputClass} />
  </label>)}</div>;
  async function enviar(event: FormEvent) {
    event.preventDefault();
    if (enviando) return;
    setError(""); setEnviando(true);
    try {
      const form = new FormData();
      const payload = { ...datos };
      if (!datos.empresa) for (const campo of ["empresa_nombre", "empresa_rnc", "empresa_representante", "empresa_direccion"]) delete payload[campo];
      for (const rol of ["comprador", "vendedor"]) if (!datos[rol + "_extranjero"]) delete payload[rol + "_vencimiento"];
      form.append("payload", JSON.stringify(payload));
      for (const [id, label] of documentos) {
        if (!archivos[id]) throw new Error("Adjunta: " + label);
        form.append(id, archivos[id]);
      }
      const res = await fetch(API_URL + "/servicios/" + servicio, { method: "POST", body: form });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        const detalle = Array.isArray(body?.detail)
          ? body.detail.map((item: { msg?: string }) => item.msg ?? "Dato inválido").join("; ")
          : body?.detail;
        throw new Error(typeof detalle === "string" ? detalle : `No se pudo procesar la solicitud (${res.status}).`);
      }
      setResultado(body);
    } catch (err) { setError(err instanceof Error ? err.message : "No se pudo conectar. Intenta nuevamente."); }
    finally { setEnviando(false); }
  }
  return <main>
    {servicio === "seguro" && <section className="relative isolate overflow-hidden bg-ink px-6 py-10 text-center text-snow md:py-14">
      <img src="/images/hero-seguro-vehicular.png" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[70%_center]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink/70" />
      <div className="relative"><LogoBanner align="center" /><h1 className="font-display text-heading-sm font-bold text-teal md:text-heading">Seguro vehicular</h1><p className="mt-3 text-silver">Completa tu solicitud y adjunta los documentos para iniciar el proceso.</p></div>
    </section>}
    <section className="relative mx-auto max-w-[1100px] px-6 py-8 md:py-12">
      {resultado ? <div role="status" className="rounded-card border border-teal bg-teal-wash p-8 text-center">
        <h2 className="font-display text-subheading text-ink">Solicitud registrada</h2>
        <p className="mt-4 font-medium">Folio: {resultado.folio}</p>
        <p className="mt-3 text-graphite">{resultado.email_enviado ? "El formulario PDF y los documentos se enviaron por correo a Sosa-Frotman. Te contactaremos para continuar." : "Guardamos tu solicitud, pero el correo no pudo enviarse. Contacta a la oficina e indica tu folio."}</p>
        <button type="button" className={buttonStyles("primary") + " mt-6"} onClick={() => window.location.reload()}>Nueva solicitud</button>
      </div> : <form onSubmit={enviar} className="relative overflow-hidden rounded-card border border-silver bg-snow p-6 md:p-10">
        <img src="/watermark-sosa.png" alt="" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-[0.10]" />
        <div className="relative z-10">
        <LogoBanner align="center" />
        <h1 className="mt-4 text-center font-display text-subheading font-bold text-teal">{TITULOS[servicio]}</h1>
        <p className="mt-2 text-center text-sm text-graphite">Completa tu solicitud y adjunta los documentos para iniciar el proceso.</p>
        <p className="text-sm text-graphite">Los campos con * son obligatorios.</p>
        <fieldset disabled={enviando}>
        <legend className="mt-6 font-display text-subheading text-ink">Datos del solicitante</legend>
        {campos(COMUNES)}
        {servicio === "seguro" && campos([["cedula", "Cédula"], ["provincia", "Provincia"], ["sector", "Sector"]])}
        <h2 className="mt-8 font-display text-subheading text-ink">Datos del vehículo</h2>
        {campos(VEHICULO)}
        {servicio === "seguro" && campos([["color", "Color"], ["valor", "Valor del vehículo (RD$)", "number"]])}
        {servicio === "gps" && campos([["instalacion", "Lugar de instalación"], ["fecha", "Fecha preferida", "date"]])}
        {servicio === "traspaso" && <>
          {(["comprador", "vendedor"] as const).map(rol => <section key={rol} className="mt-8 border-t border-silver pt-6">
            <h2 className="font-display text-subheading capitalize text-ink">Datos del {rol}</h2>
            <label className="mt-4 flex items-center gap-3 text-sm"><input type="checkbox" checked={Boolean(datos[rol + "_extranjero"])} onChange={e => actualizar(rol + "_extranjero", e.target.checked)} />El {rol} es extranjero</label>
            {campos([[rol, "Nombre completo del " + rol], [rol + "_documento", datos[rol + "_extranjero"] ? "Número de pasaporte" : "Número de cédula"]])}
            {Boolean(datos[rol + "_extranjero"]) && campos([[rol + "_vencimiento", "Vencimiento del pasaporte", "date"]])}
          </section>)}
          <section className="mt-8 border-t border-silver pt-6">
            <h2 className="font-display text-subheading text-ink">Datos de la empresa (opcional)</h2>
            <label className="mt-4 flex items-center gap-3 text-sm"><input type="checkbox" checked={Boolean(datos.empresa)} onChange={e => actualizar("empresa", e.target.checked)} />El vehículo está a nombre de una empresa</label>
            {Boolean(datos.empresa) && campos([["empresa_nombre", "Nombre de la empresa"], ["empresa_rnc", "RNC"], ["empresa_representante", "Representante"], ["empresa_direccion", "Dirección de la empresa"]])}
          </section>
        </>}
        {documentos.length > 0 && <section className="mt-8 border-t border-silver pt-6">
          <h2 className="font-display text-subheading text-ink">Documentos requeridos</h2>
          <p className="mt-2 text-sm text-graphite">PDF, JPG, PNG o WebP. Máximo 3 MB por documento.{servicio === "traspaso" && " Adjunta una copia legible de la matrícula y conserva el original para entregarlo en la oficina."}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">{documentos.map(([id, label]) => <label key={id} className="min-w-0 rounded-input border border-silver bg-white p-4 text-sm font-medium text-ink">{label} *
            <input key={id} type="file" required accept="application/pdf,image/jpeg,image/png,image/webp" className="mt-3 block w-full text-xs file:mr-2 file:rounded-tag file:border-0 file:bg-teal-wash file:p-2" onChange={e => {
              const file = e.target.files?.[0];
              setArchivos(prev => { const next = { ...prev }; delete next[id]; return next; });
              if (file && (file.size > 3*1024*1024 || !["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(file.type))) { e.target.value = ""; setError("Usa PDF, JPG, PNG o WebP de máximo 3 MB."); return; }
              setError(""); if (file) setArchivos(prev => ({ ...prev, [id]: file }));
            }} />
          </label>)}</div>
        </section>}
        <label className="mt-8 flex items-start gap-3 text-sm text-graphite"><input required type="checkbox" className="mt-1" />Confirmo que los datos y documentos proporcionados son correctos y autorizo su uso para gestionar esta solicitud.</label>
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={enviando} className={buttonStyles("primary") + " mt-6 w-full disabled:opacity-50"}>{enviando ? "Enviando solicitud…" : "Enviar solicitud"}</button>
        </fieldset>
        </div>
      </form>}
    </section>
  </main>;
}
