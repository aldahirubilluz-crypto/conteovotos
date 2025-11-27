import { z } from "zod";

export const formSchemaRegister = z.object({
    mesa: z.string().min(1, "La mesa es requerida"),
    votes: z.record(z.string(), z.number().min(0).optional()),
});

export type FormValuesRegister = z.infer<typeof formSchemaRegister>;