import { useFormContext } from "react-hook-form";
import { FormField, TextInput } from "@ui";
import type { SolicitudFormValues } from "@/lib/schemas";

export function PasoDatosLaborales() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SolicitudFormValues>();
  const e = errors.datos_laborales;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label="Empresa" error={e?.empresa?.message}>
        <TextInput {...register("datos_laborales.empresa")} />
      </FormField>
      <FormField label="Tipo de empresa" error={e?.tipo_empresa?.message}>
        <TextInput {...register("datos_laborales.tipo_empresa")} />
      </FormField>
      <FormField label="Teléfono" error={e?.telefono?.message}>
        <TextInput {...register("datos_laborales.telefono")} />
      </FormField>
      <FormField label="Cargo" error={e?.cargo?.message}>
        <TextInput {...register("datos_laborales.cargo")} />
      </FormField>
      <FormField label="Sueldo (RD$)" error={e?.sueldo?.message}>
        <TextInput type="number" step="0.01" {...register("datos_laborales.sueldo")} />
      </FormField>
      <FormField label="Tiempo en la empresa" error={e?.tiempo_empresa?.message}>
        <TextInput placeholder="Ej. 2 años" {...register("datos_laborales.tiempo_empresa")} />
      </FormField>
      <FormField label="Jefe inmediato (opcional)">
        <TextInput {...register("datos_laborales.jefe_inmediato")} />
      </FormField>
      <FormField label="Otros ingresos (opcional)">
        <TextInput type="number" step="0.01" {...register("datos_laborales.otros_ingresos")} />
      </FormField>
      <div className="sm:col-span-2">
        <FormField label="Dirección de empleo" error={e?.direccion?.message}>
          <TextInput {...register("datos_laborales.direccion")} />
        </FormField>
      </div>
    </div>
  );
}
