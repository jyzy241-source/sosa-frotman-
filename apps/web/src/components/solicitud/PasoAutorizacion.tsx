import { useFormContext } from "react-hook-form";
import type { SolicitudFormValues } from "@/lib/schemas";

export function PasoAutorizacion() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SolicitudFormValues>();

  return (
    <div className="rounded-card border border-silver bg-mist p-6">
      <h3 className="font-display text-subheading text-ink">Autorización de consulta al buró</h3>
      <p className="mt-2 text-body-sm text-graphite">
        Autorizo(amos) a Inversiones Sosa Frotman SRL a consultar mi información crediticia
        en los BIC (Buró de Información Crediticia), en cumplimiento del artículo 14 de la
        ley 172-13, que regula las sociedades de información crediticia y protección al
        titular de la información.
      </p>
      <label className="mt-4 flex items-start gap-3 text-body text-ink">
        <input
          id="aceptar-autorizacion-buro"
          type="checkbox"
          aria-invalid={Boolean(errors.autorizacion_buro?.aceptado)}
          {...register("autorizacion_buro.aceptado")}
          className="mt-1 h-4 w-4 accent-teal"
        />
        <span>Acepto la autorización de consulta al buró de crédito</span>
      </label>
      {errors.autorizacion_buro?.aceptado && (
        <p className="mt-1 text-[13px] text-alert">
          {errors.autorizacion_buro.aceptado.message}
        </p>
      )}
    </div>
  );
}
