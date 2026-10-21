import { useFormContext } from "react-hook-form";
import { FormField, TextInput } from "@ui";
import type { SolicitudFormValues } from "@/lib/schemas";

type Props = {
  rol: "codeudor" | "fiador";
  titulo: string;
};

export function PasoPersonaVinculada({ rol, titulo }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SolicitudFormValues>();
  const e = errors[rol];

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-subheading text-ink">{titulo}</h3>
      <p className="text-body-sm text-steel">
        Opcional — completá solo si esta solicitud lleva {rol}.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Nombre" error={e?.nombre?.message}>
          <TextInput {...register(`${rol}.nombre`)} />
        </FormField>
        <FormField label="Apellido" error={e?.apellido?.message}>
          <TextInput {...register(`${rol}.apellido`)} />
        </FormField>
        <FormField label="Cédula" error={e?.cedula?.message}>
          <TextInput {...register(`${rol}.cedula`)} />
        </FormField>
        <FormField label="Fecha de nacimiento" error={e?.fecha_nacimiento?.message}>
          <TextInput type="date" {...register(`${rol}.fecha_nacimiento`)} />
        </FormField>
        <FormField label="Estado civil" error={e?.estado_civil?.message}>
          <TextInput {...register(`${rol}.estado_civil`)} />
        </FormField>
        <FormField label="Tipo de vivienda" error={e?.tipo_vivienda?.message}>
          <select
            {...register(`${rol}.tipo_vivienda`)}
            className="h-11 rounded-input border border-silver bg-mist px-3 text-body text-ink"
          >
            <option value="propia">Propia</option>
            <option value="familiar">Familiar</option>
            <option value="alquilada">Alquilada</option>
          </select>
        </FormField>
        <FormField label="Teléfono (requerido si se incluye esta persona)" error={e?.telefono?.message}>
          <TextInput {...register(`${rol}.telefono`)} />
        </FormField>
        <FormField label="Empresa (opcional)">
          <TextInput {...register(`${rol}.empresa`)} />
        </FormField>
        <FormField label="Cargo (opcional)">
          <TextInput {...register(`${rol}.cargo`)} />
        </FormField>
        <FormField label="Sueldo (opcional)">
          <TextInput type="number" step="0.01" {...register(`${rol}.sueldo`)} />
        </FormField>
        <div className="sm:col-span-2">
          <FormField label="Dirección" error={e?.direccion?.message}>
            <TextInput {...register(`${rol}.direccion`)} />
          </FormField>
        </div>
      </div>
    </div>
  );
}
