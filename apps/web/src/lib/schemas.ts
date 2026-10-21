import { z } from "zod";

// Espeja los schemas Pydantic del backend (app/modules/solicitudes/schemas.py).
// Estándar: valores de tipo_vivienda en minúsculas ("propia", "familiar",
// "alquilada"). El backend los recibe como string libre, sin restricción
// de mayúsculas/minúsculas.

export const datosClienteSchema = z.object({
  nombre: z.string().min(2, "Requerido"),
  apellido: z.string().min(2, "Requerido"),
  apodo: z.string().optional(),
  cedula: z.string().min(9, "Cédula inválida"),
  fecha_nacimiento: z.string().min(1, "Requerido"),
  estado_civil: z.string().min(1, "Requerido"),
  tipo_vivienda: z.enum(["propia", "familiar", "alquilada"]),
  telefono: z.string().min(10, "Teléfono inválido"),
  direccion: z.string().min(5, "Requerido"),
  ocupacion: z.string().min(2, "Requerido"),
});

export const datosLaboralesSchema = z.object({
  empresa: z.string().min(2, "Requerido"),
  tipo_empresa: z.string().min(1, "Requerido"),
  telefono: z.string().min(10, "Teléfono inválido"),
  cargo: z.string().min(2, "Requerido"),
  sueldo: z.coerce.number().positive("Debe ser mayor a 0"),
  tiempo_empresa: z.string().min(1, "Requerido"),
  jefe_inmediato: z.string().optional(),
  otros_ingresos: z.coerce.number().optional(),
  direccion: z.string().min(5, "Requerido"),
});

export const caracteristicasPrestamoSchema = z.object({
  monto_solicitado: z.coerce.number().positive("Debe ser mayor a 0"),
  plazo_meses: z.coerce.number().int().positive("Debe ser mayor a 0"),
  modalidad: z.string().min(1, "Requerido"),
  solo_interes: z.boolean().default(false),
  prestamo_adicional: z.boolean().default(false),
  capacidad_pago: z.coerce.number().optional(),
  tipo_garantia: z.string().optional(),
});

export const personaVinculadaSchema = z.object({
  nombre: z.string().optional(),
  apellido: z.string().optional(),
  cedula: z.string().optional(),
  fecha_nacimiento: z.string().optional(),
  estado_civil: z.string().optional(),
  tipo_vivienda: z.enum(["propia", "familiar", "alquilada"]).optional(),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  empresa: z.string().optional(),
  cargo: z.string().optional(),
  sueldo: z.coerce.number().optional(),
}).superRefine((persona, ctx) => {
  // Codeudor y fiador son opcionales. Si se incluye una cédula, validamos
  // todos los datos obligatorios que el backend necesita para guardarlos.
  if (!persona.cedula?.trim()) return;

  const requeridos: [keyof typeof persona, string, (value: string) => boolean][] = [
    ["nombre", "Nombre requerido (mínimo 2 caracteres)", (value) => value.trim().length >= 2],
    ["apellido", "Apellido requerido (mínimo 2 caracteres)", (value) => value.trim().length >= 2],
    ["cedula", "Cédula inválida", (value) => value.replace(/\D/g, "").length >= 9],
    ["fecha_nacimiento", "Fecha de nacimiento requerida", (value) => value.length > 0],
    ["estado_civil", "Estado civil requerido", (value) => value.length > 0],
    ["telefono", "Teléfono requerido (mínimo 10 dígitos)", (value) => value.replace(/\D/g, "").length >= 10],
    ["direccion", "Dirección requerida (mínimo 5 caracteres)", (value) => value.trim().length >= 5],
  ];

  for (const [campo, mensaje, validar] of requeridos) {
    const valor = persona[campo];
    if (typeof valor !== "string" || !validar(valor)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [campo], message: mensaje });
    }
  }
  if (!persona.tipo_vivienda) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["tipo_vivienda"], message: "Tipo de vivienda requerido" });
  }
});

export const referenciaSchema = z.object({
  tipo: z.enum(["comercial", "personal"]),
  nombre: z.string().min(2, "Requerido"),
  telefono: z.string().min(10, "Teléfono inválido"),
});

export const solicitudSchema = z.object({
  servicio: z.enum(["personal", "hipotecario", "vehiculo", "celular"]).default("personal"),
  equipo: z.string().optional(),
  tienda: z.string().optional(),
  direccion_tienda: z.string().optional(),
  cliente: datosClienteSchema,
  datos_laborales: datosLaboralesSchema,
  caracteristicas: caracteristicasPrestamoSchema,
  codeudor: personaVinculadaSchema.optional(),
  fiador: personaVinculadaSchema.optional(),
  referencias: z.array(referenciaSchema).default([]),
  autorizacion_buro: z.object({
    aceptado: z.boolean().refine((v) => v === true, "Debés aceptar la autorización"),
    firma_digital_url: z.string().optional(),
  }),
}).superRefine((data, ctx) => {
  if (data.servicio === "celular") {
    for (const campo of ["equipo", "tienda", "direccion_tienda"] as const) {
      if (!data[campo]?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [campo], message: "Requerido" });
    }
  }
});

export type SolicitudFormValues = z.infer<typeof solicitudSchema>;
