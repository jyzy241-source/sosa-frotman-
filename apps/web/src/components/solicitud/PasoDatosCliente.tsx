import { useFormContext } from "react-hook-form";
import { FormField, TextInput } from "@ui";
import type { SolicitudFormValues } from "@/lib/schemas";

type Props = {
  cedulaFrente: File | null;
  cedulaReverso: File | null;
  errorImagenes?: string;
  onCedulaFrente: (file: File | null) => void;
  onCedulaReverso: (file: File | null) => void;
};

export function PasoDatosCliente({ cedulaFrente, cedulaReverso, errorImagenes, onCedulaFrente, onCedulaReverso }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SolicitudFormValues>();
  const e = errors.cliente;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label="Nombre" error={e?.nombre?.message}>
        <TextInput {...register("cliente.nombre")} />
      </FormField>
      <FormField label="Apellido" error={e?.apellido?.message}>
        <TextInput {...register("cliente.apellido")} />
      </FormField>
      <FormField label="Apodo (opcional)">
        <TextInput {...register("cliente.apodo")} />
      </FormField>
      <FormField label="Cédula" error={e?.cedula?.message}>
        <TextInput placeholder="000-0000000-0" {...register("cliente.cedula")} />
      </FormField>
      <div className="sm:col-span-2">
        <h3 className="mb-1 text-body-sm font-medium text-ink">Fotos de la cédula</h3>
        <p className="mb-3 text-caption text-graphite">Sube imágenes claras del frente y reverso (JPG, PNG o WebP; máximo 5 MB cada una).</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {([
            ["Frente", cedulaFrente, onCedulaFrente],
            ["Reverso", cedulaReverso, onCedulaReverso],
          ] as const).map(([lado, archivo, alCambiar]) => (
            <label key={lado} className="rounded-input border border-silver bg-white p-4 text-body-sm text-ink">
              <span className="mb-2 block font-medium">Cédula — {lado} *</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" required={!archivo} onChange={(event) => alCambiar(event.target.files?.[0] ?? null)} className="block w-full text-caption file:mr-3 file:rounded-tag file:border-0 file:bg-teal-wash file:px-3 file:py-2 file:text-ink" />
              {archivo && <span className="mt-2 block truncate text-caption text-graphite">{archivo.name}</span>}
            </label>
          ))}
        </div>
        {errorImagenes && <p role="alert" className="mt-2 text-caption text-red-700">{errorImagenes}</p>}
      </div>
      <FormField label="Fecha de nacimiento" error={e?.fecha_nacimiento?.message}>
        <TextInput type="date" {...register("cliente.fecha_nacimiento")} />
      </FormField>
      <FormField label="Estado civil" error={e?.estado_civil?.message}>
        <TextInput {...register("cliente.estado_civil")} />
      </FormField>
      <FormField label="Tipo de vivienda" error={e?.tipo_vivienda?.message}>
        <select
          {...register("cliente.tipo_vivienda")}
          className="h-12 rounded-input bg-mist px-4 text-body-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal"
        >
          <option value="propia">Propia</option>
          <option value="familiar">Familiar</option>
          <option value="alquilada">Alquilada</option>
        </select>
      </FormField>
      <FormField label="Teléfono" error={e?.telefono?.message}>
        <TextInput {...register("cliente.telefono")} />
      </FormField>
      <FormField label="Ocupación" error={e?.ocupacion?.message}>
        <TextInput {...register("cliente.ocupacion")} />
      </FormField>
      <div className="sm:col-span-2">
        <FormField label="Dirección" error={e?.direccion?.message}>
          <TextInput {...register("cliente.direccion")} />
        </FormField>
      </div>
    </div>
  );
}
