import * as z from "zod";

export const contactoSchema = z.object({
   id: z.string().optional(), 
  idType: z.coerce.number().min(1, "Seleccione un tipo de contacto"),
  value: z.string().min(1, "El contacto es obligatorio"),
  description: z.string().optional().default(""),
}).superRefine((data, ctx) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^[0-9+\s()-]{6,20}$/
  // 2 = Email
  if (data.idType === 2 && !emailRegex.test(data.value)) {
    ctx.addIssue({
      path: ["value"], // Cambié "valor_contacto" a "value" para que coincida con tu schema
      message: "Email inválido",
      code: z.ZodIssueCode.custom,
    })
  }

  // 1 = Teléfono Fijo, 3 = Teléfono Móvil
  if ([1, 3].includes(data.idType) && !phoneRegex.test(data.value)) {
    ctx.addIssue({
      path: ["value"], 
      message: "Teléfono inválido",
      code: z.ZodIssueCode.custom,
    })
  }
})

// Exporta el tipo inferido
export type ContactoType = z.infer<typeof contactoSchema>;