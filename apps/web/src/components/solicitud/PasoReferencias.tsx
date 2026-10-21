import { useFieldArray, useFormContext } from "react-hook-form";
import { Button, FormField, TextInput } from "@ui";
import type { SolicitudFormValues } from "@/lib/schemas";

export function PasoReferencias() {
  const { register, control } = useFormContext<SolicitudFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "referencias" });

  return (
    <div className="flex flex-col gap-6">
      {fields.length === 0 && (
        <p className="text-body-sm text-steel">
          Agregá al menos una referencia comercial y una personal.
        </p>
      )}
      {fields.map((field, i) => (
        <div key={field.id} className="grid gap-4 rounded-card border border-silver p-4 sm:grid-cols-3">
          <FormField label="Tipo">
            <select
              {...register(`referencias.${i}.tipo`)}
              className="h-12 rounded-input bg-mist px-4 text-body-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal"
            >
              <option value="comercial">Comercial</option>
              <option value="personal">Personal</option>
            </select>
          </FormField>
          <FormField label="Nombre">
            <TextInput {...register(`referencias.${i}.nombre`)} />
          </FormField>
          <FormField label="Teléfono">
            <TextInput {...register(`referencias.${i}.telefono`)} />
          </FormField>
          <div className="sm:col-span-3">
            <Button type="button" variant="ghost" onClick={() => remove(i)}>
              Quitar
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="self-start"
        onClick={() => append({ tipo: "comercial", nombre: "", telefono: "" })}
      >
        + Agregar referencia
      </Button>
    </div>
  );
}
