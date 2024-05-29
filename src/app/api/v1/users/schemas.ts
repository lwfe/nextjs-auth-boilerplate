import { z } from "zod";

export const userCreateSchema = z.object({
  name: z
    .string({ required_error: "Nome é obrigatório" })
    .min(1, "Nome é obrigatório"),
  email: z
    .string({ required_error: "Email é obrigatório" })
    .email("Email inválido"),
  password: z
    .string({ required_error: "Senha é obrigatório" })
    .min(6, "Senha deve ter pelo menos 6 digitos"),
});
