import { LogoBanner } from "@/components/common/LogoBanner";
import { useSearchParams } from "react-router-dom";
import { useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import type { Variants } from "motion/react";
import { Button, buttonStyles } from "@ui";
import { MarcaAguaSosa } from "@/components/common/MarcaAguaSosa";
import { API_URL } from "@/lib/api";
import { solicitudSchema, type SolicitudFormValues } from "@/lib/schemas";
import { PasoDatosCliente } from "@/components/solicitud/PasoDatosCliente";
import { PasoDatosLaborales } from "@/components/solicitud/PasoDatosLaborales";
import { PasoCaracteristicas } from "@/components/solicitud/PasoCaracteristicas";
import { PasoPersonaVinculada } from "@/components/solicitud/PasoPersonaVinculada";
import { PasoReferencias } from "@/components/solicitud/PasoReferencias";
import { PasoAutorizacion } from "@/components/solicitud/PasoAutorizacion";

const PASOS = [
  "Datos del cliente",
  "Datos laborales",
  "Características del préstamo",
  "Codeudor",
  "Fiador",
  "Referencias y autorización",
] as const;

const pasoVariants: Variants = {
  enter: (direccion: number) => ({ opacity: 0, x: direccion * 24 }),
  center: { opacity: 1, x: 0 },
  exit: (direccion: number) => ({ opacity: 0, x: direccion * -24 }),
};

export default function Solicitud() {
  const [params] = useSearchParams();
  const opciones = { personal: "Préstamo personal", hipotecario: "Préstamo hipotecario", vehiculo: "Financiamiento de vehículos", celular: "Financiamiento de celulares" };
  const seleccionado = params.get("servicio") || "personal";
  const servicio = (Object.prototype.hasOwnProperty.call(opciones, seleccionado) ? seleccionado : "personal") as keyof typeof opciones;
  const [emailEnviado, setEmailEnviado] = useState(false);
  const [pasoActual, setPasoActual] = useState(0);
  const [enviado, setEnviado] = useState(false);
  const [folioSolicitud, setFolioSolicitud] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);
  const [cedulaFrente, setCedulaFrente] = useState<File | null>(null);
  const [cedulaReverso, setCedulaReverso] = useState<File | null>(null);
  const [errorImagenes, setErrorImagenes] = useState("");
  const direccionRef = useRef(1);

  const methods = useForm<SolicitudFormValues>({
    resolver: zodResolver(solicitudSchema),
    defaultValues: {
      servicio,
      equipo: "",
      tienda: "",
      direccion_tienda: "",
      cliente: {
        nombre: "",
        apellido: "",
        apodo: "",
        cedula: "",
        fecha_nacimiento: "1995-01-01",
        estado_civil: "Soltero",
        tipo_vivienda: "alquilada",
        telefono: "",
        direccion: "",
        ocupacion: "",
      },
      datos_laborales: {
        empresa: "",
        tipo_empresa: "Privada",
        telefono: "",
        cargo: "",
        sueldo: 0,
        tiempo_empresa: "",
        jefe_inmediato: "",
        otros_ingresos: 0,
        direccion: "",
      },
      caracteristicas: {
        monto_solicitado: 50000,
        plazo_meses: 12,
        modalidad: "Mensual",
        solo_interes: false,
        prestamo_adicional: false,
        capacidad_pago: 5000,
        tipo_garantia: "Personal",
      },
      codeudor: {
        nombre: "",
        apellido: "",
        cedula: "",
        fecha_nacimiento: "1995-01-01",
        estado_civil: "Soltero",
        tipo_vivienda: "propia",
        empresa: "",
        cargo: "",
        sueldo: 0,
        direccion: "",
      },
      fiador: {
        nombre: "",
        apellido: "",
        cedula: "",
        fecha_nacimiento: "1995-01-01",
        estado_civil: "Soltero",
        tipo_vivienda: "propia",
        empresa: "",
        cargo: "",
        sueldo: 0,
        direccion: "",
      },
      referencias: [
        { tipo: "comercial", nombre: "Referencia Comercial 1", telefono: "8090000000" },
        { tipo: "personal", nombre: "Referencia Personal 1", telefono: "8090000000" },
      ],
      autorizacion_buro: {
        aceptado: false,
      },
    },
  });

  const irAPaso = (nuevo: number) => {
    if (nuevo > pasoActual && pasoActual === 0 && (!cedulaFrente || !cedulaReverso)) {
      setErrorImagenes("Agrega las dos imágenes de la cédula para continuar.");
      return;
    }
    setErrorImagenes("");
    direccionRef.current = nuevo > pasoActual ? 1 : -1;
    setPasoActual(nuevo);
  };

  const onSubmit = async (data: SolicitudFormValues) => {
    setCargando(true);

    const payload = {
      ...data,
      cliente: {
        ...data.cliente,
        cedula: data.cliente.cedula.replace(/\D/g, ""),
      },
      datos_laborales: {
        ...data.datos_laborales,
        sueldo: Number(data.datos_laborales.sueldo) || 0,
        otros_ingresos: Number(data.datos_laborales.otros_ingresos) || 0,
      },
      caracteristicas: {
        ...data.caracteristicas,
        monto_solicitado: Number(data.caracteristicas.monto_solicitado) || 0,
        plazo_meses: Number(data.caracteristicas.plazo_meses) || 1,
        capacidad_pago: Number(data.caracteristicas.capacidad_pago) || 0,
      },
      codeudor: data.codeudor?.cedula
        ? {
            ...data.codeudor,
            cedula: data.codeudor.cedula.replace(/\D/g, ""),
            sueldo: Number(data.codeudor.sueldo) || 0,
          }
        : null,
      fiador: data.fiador?.cedula
        ? {
            ...data.fiador,
            cedula: data.fiador.cedula.replace(/\D/g, ""),
            sueldo: Number(data.fiador.sueldo) || 0,
          }
        : null,
    };

    try {
      if (!cedulaFrente || !cedulaReverso) {
        setPasoActual(0);
        setErrorImagenes("Agrega las dos imágenes de la cédula antes de enviar.");
        return;
      }
      const formData = new FormData();
      formData.append("payload", JSON.stringify(payload));
      formData.append("cedula_frente", cedulaFrente);
      formData.append("cedula_reverso", cedulaReverso);
      const res = await fetch(`${API_URL}/solicitudes`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const resultado: { id: number; email_enviado: boolean } = await res.json();
        setFolioSolicitud(resultado.id);
        setEmailEnviado(resultado.email_enviado);
        setEnviado(true);
      } else {
        const errData = await res.json().catch(() => null);
        console.error("Detalle de validación Pydantic en FastAPI:", errData);

        if (errData?.detail && Array.isArray(errData.detail)) {
          const erroresCampos = errData.detail
            .map((err: { loc: string[]; msg: string }) => `${err.loc.join(" -> ")}: ${err.msg}`)
            .join("\n");
          alert(`Errores de validación en la API:\n\n${erroresCampos}`);
        } else {
          alert("Error al procesar la solicitud en el servidor.");
        }
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con la API.");
    } finally {
      setCargando(false);
    }
  };

  const onError = (errors: unknown) => {
    console.log("Errores de validación en el formulario:", errors);
    alert("Por favor completa los campos requeridos antes de enviar.");
  };

  if (enviado) {
    return (
      <main className="mx-auto max-w-[800px] px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="rounded-card border border-silver bg-snow p-12"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-wash text-teal-deep">
            ✓
          </div>
          <h2 className="font-display text-subheading font-medium tracking-tight text-ink">
            ¡Solicitud registrada exitosamente!
          </h2>
          <p className="mt-2 text-body-sm text-graphite">
            Un oficial de crédito de Sosa-Frotman Inversiones evaluará tu solicitud en breve.
          </p>
          <p className="mt-3 text-body-sm text-graphite">{emailEnviado ? "El formulario PDF y los documentos se enviaron por correo." : "La solicitud quedó guardada, pero el correo no pudo enviarse. Contacta a la oficina e indica tu folio."}</p>
          {folioSolicitud !== null && (
            <p className="mt-3 text-body-sm font-medium text-ink">
              Folio: SF-{String(folioSolicitud).padStart(6, "0")}
            </p>
          )}
          <button onClick={() => window.location.reload()} className={`${buttonStyles("primary")} mt-6`}>
            Nueva solicitud
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main>
      <section className="relative isolate flex min-h-[260px] items-center overflow-hidden bg-ink py-12 text-snow md:min-h-[320px] md:py-14">
        <img src="/images/hero-solicitud.png" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[68%_center]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/75 to-ink/35" />
        <div className="relative mx-auto w-full max-w-[1200px] px-6">
          <LogoBanner />
          <h1 className="mt-3 font-display text-heading-sm font-bold tracking-tight text-teal md:text-heading">
            {opciones[servicio]} en línea
          </h1>
          <p className="mt-3 text-body-sm text-snow/80">
            Completá los datos para procesar tu financiamiento.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-[1200px] px-6 py-12">

      <ol aria-label="Pasos de la solicitud" className="mb-6 flex flex-wrap gap-2">
        {PASOS.map((paso, i) => {
          const esActivo = pasoActual === i;
          return (
            <li key={paso}>
              <button
                type="button"
                aria-current={esActivo ? "step" : undefined}
                onClick={() => irAPaso(i)}
                className={`rounded-tag border px-4 py-2 text-caption font-medium tracking-tight transition-colors ${
                  esActivo
                    ? "border-teal bg-teal text-snow"
                    : "border-transparent bg-snow text-graphite hover:border-silver hover:text-ink"
                }`}
              >
                {i + 1}. {paso}
              </button>
            </li>
          );
        })}
      </ol>

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit, onError)}
          className="relative overflow-hidden rounded-card border border-silver bg-snow p-6 md:p-8"
        >
          <MarcaAguaSosa />
          <img src="/logo-sosa.png" alt="Sosa-Frotman Inversiones" className="relative mx-auto mb-6 h-20 w-auto object-contain" />

          <AnimatePresence mode="wait" custom={direccionRef.current} initial={false}>
            <motion.div
              key={pasoActual}
              custom={direccionRef.current}
              variants={pasoVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative"
            >
              {pasoActual === 0 && <PasoDatosCliente cedulaFrente={cedulaFrente} cedulaReverso={cedulaReverso} errorImagenes={errorImagenes} onCedulaFrente={(file) => { setCedulaFrente(file); setErrorImagenes(""); }} onCedulaReverso={(file) => { setCedulaReverso(file); setErrorImagenes(""); }} />}
              {pasoActual === 1 && <PasoDatosLaborales />}
              {pasoActual === 2 && <PasoCaracteristicas />}
              {pasoActual === 3 && <PasoPersonaVinculada rol="codeudor" titulo="4. Codeudor" />}
              {pasoActual === 4 && <PasoPersonaVinculada rol="fiador" titulo="5. Fiador" />}
              {pasoActual === 5 && (
                <div className="flex flex-col gap-8">
                  <PasoReferencias />
                  <PasoAutorizacion />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="relative mt-8 flex justify-between gap-4 border-t border-silver pt-6">
            <Button type="button" variant="ghost" disabled={pasoActual === 0} onClick={() => irAPaso(Math.max(0, pasoActual - 1))}>Anterior</Button>

            {pasoActual < PASOS.length - 1 ? (
              <button type="button" onClick={(e) => { e.preventDefault(); irAPaso(Math.min(PASOS.length - 1, pasoActual + 1)); }} className={buttonStyles("primary")}>Siguiente</button>
            ) : (
              <button type="submit" disabled={cargando} className={`${buttonStyles("primary")} disabled:opacity-50`}>{cargando ? "Enviando..." : "Enviar solicitud"}</button>
            )}
          </div>
        </form>
      </FormProvider>
      </div>
    </main>
  );
}
