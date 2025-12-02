import { z } from "zod";

export const positionSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),

  typePosition: z
    .enum(["AUTORIDAD", "ORGANO"])
    .refine((val) => val !== undefined, {
      message: "El tipo de puesto es requerido",
    }),

  totalVotes: z.number().min(0, "Debe ser mayor o igual a 0"),

  validPercentage: z
    .number()
    .min(0, "Debe ser mínimo 0%")
    .max(100, "Debe ser máximo 100%"),
});

export const positionUpdateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),

  typePosition: z
    .enum(["AUTORIDAD", "ORGANO"])
    .refine((val) => val !== undefined, {
      message: "El tipo de puesto es requerido",
    }),

  totalVotes: z.number().min(0, "Debe ser mayor o igual a 0"),

  validPercentage: z
    .number()
    .min(0, "Debe ser mínimo 0%")
    .max(100, "Debe ser máximo 100%"),
});

export type PositionFormValues = z.infer<typeof positionSchema>;
export type PositionUpdateFormValues = z.infer<typeof positionUpdateSchema>;
