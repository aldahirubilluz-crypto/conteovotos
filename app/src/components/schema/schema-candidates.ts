import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const candidateSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().min(1, "La descripción es requerida"),
    positionId: z.string().min(1, "El puesto es requerido"),
    image: z
        .instanceof(File)
        .optional()
        .refine(
            (file) => !file || file.size <= MAX_FILE_SIZE,
            "La imagen no debe superar 10MB"
        )
        .refine(
            (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Solo se permiten archivos PNG, JPG o JPEG"
        ),
});

export type CandidatesFormValues = z.infer<typeof candidateSchema>;


export const candidatesUpdateSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().min(1, "La descripción es requerida"),
    positionId: z.string().min(1, "El puesto es requerido"),
    isActive: z.boolean(),
    image: z
        .instanceof(File)
        .optional()
        .refine(
            (file) => !file || file.size <= MAX_FILE_SIZE,
            "La imagen no debe superar 10MB"
        )
        .refine(
            (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Solo se permiten archivos PNG, JPG o JPEG"
        ),
});


export type candidatesUpdateFormValues = z.infer<typeof candidatesUpdateSchema>;