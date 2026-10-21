import { useFormContext } from "react-hook-form";
import { FormField, TextInput } from "@ui";
import type { SolicitudFormValues } from "@/lib/schemas";

export function PasoCaracteristicas() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<SolicitudFormValues>();
  const e = errors.caracteristicas;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {watch("servicio") === "celular" && <>
        <FormField label="Equipo (marca y modelo)" error={errors.equipo?.message}><TextInput {...register("equipo")} /></FormField>
        <FormField label="Tienda" error={errors.tienda?.message}><TextInput {...register("tienda")} /></FormField>
        <FormField label="Dirección de la tienda" error={errors.direccion_tienda?.message}><TextInput {...register("direccion_tienda")} /></FormField>
      </>}
      <FormField label="Monto solicitado (RD$)" error={e?.monto_solicitado?.message}>
        <TextInput type="number" step="0.01" {...register("caracteristicas.monto_solicitado")} />
      </FormField>
      <FormField label="Plazo (meses)" error={e?.plazo_meses?.message}>
        <TextInput type="number" {...register("caracteristicas.plazo_meses")} />
      </FormField>
      <FormField label="Modalidad" error={e?.modalidad?.message}>
        <TextInput placeholder="Ej. personal, hipotecario, vehicular" {...register("caracteristicas.modalidad")} />
      </FormField>
      <FormField label="Tipo de garantía (opcional)">
        <TextInput {...register("caracteristicas.tipo_garantia")} />
      </FormField>
      <FormField label="Capacidad de pago (opcional)">
        <TextInput type="number" step="0.01" {...register("caracteristicas.capacidad_pago")} />
      </FormField>
      <div className="flex flex-col justify-center gap-2 pt-6">
        <label className="flex items-center gap-2 text-body-sm text-ink">
          <input type="checkbox" {...register("caracteristicas.solo_interes")} />
          Solo interés
        </label>
        <label className="flex items-center gap-2 text-body-sm text-ink">
          <input type="checkbox" {...register("caracteristicas.prestamo_adicional")} />
          Préstamo adicional
        </label>
      </div>
    </div>
  );
}
