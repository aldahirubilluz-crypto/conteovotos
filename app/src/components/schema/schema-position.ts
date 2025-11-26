import { z } from "zod";

export const positionSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().min(1, "La descripción es requerida"),
});

export const positionUpdateSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().min(1, "La descripción es requerida"),
    isActive: z.boolean(),
});

export type PositionFormValues = z.infer<typeof positionSchema>;
export type PositionUpdateFormValues = z.infer<typeof positionUpdateSchema>;