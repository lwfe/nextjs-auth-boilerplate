import { z } from 'zod'

export const userUpdateSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(1, 'Nome é obrigatório')
    .optional(),
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido')
    .optional(),
  role: z
    .enum(['default', 'admin'], {
      errorMap: () => ({ message: "Role deve ser 'default' ou 'admin'" })
    })
    .optional()
})
