import { z } from 'zod';

const usernameRegex = /^[a-z0-9_]+$/;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, 'O nome completo deve ter pelo menos 3 caracteres.')
      .max(100, 'O nome completo é demasiado longo.'),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, 'O username deve ter pelo menos 3 caracteres.')
      .max(30, 'O username deve ter no máximo 30 caracteres.')
      .regex(usernameRegex, 'Use apenas letras minúsculas, números e underscore.'),
    email: z.string().trim().toLowerCase().email('Introduza um email válido.'),
    password: z
      .string()
      .min(8, 'A palavra-passe deve ter pelo menos 8 caracteres.')
      .regex(/[A-Z]/, 'A palavra-passe deve conter pelo menos uma letra maiúscula.')
      .regex(/[0-9]/, 'A palavra-passe deve conter pelo menos um número.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As palavras-passe não coincidem.',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Introduza o seu email ou username.'),
  password: z.string().min(1, 'Introduza a sua palavra-passe.'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('Introduza um email válido.'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'A palavra-passe deve ter pelo menos 8 caracteres.')
      .regex(/[A-Z]/, 'A palavra-passe deve conter pelo menos uma letra maiúscula.')
      .regex(/[0-9]/, 'A palavra-passe deve conter pelo menos um número.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As palavras-passe não coincidem.',
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
