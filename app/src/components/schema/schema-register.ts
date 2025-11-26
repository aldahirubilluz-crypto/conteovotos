import { z } from "zod";

export const formSchema = z.object({
    mesa: z.string().min(1, "La mesa es requerida"),
    votes: z.record(z.string(), z.number().min(0, "No puede ser negativo")),
});

export type FormValues = z.infer<typeof formSchema>;