import { z } from 'zod';
import { MOZAMBIQUE_PROVINCES } from '@/config/geography';

const provinceValues = MOZAMBIQUE_PROVINCES.map((p) => p.value) as [string, ...string[]];

export const editProfileSchema = z.object({
  fullName: z.string().trim().min(3, 'O nome completo deve ter pelo menos 3 caracteres.').max(100),
  displayName: z.string().trim().max(50).optional().or(z.literal('')),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'O username deve ter pelo menos 3 caracteres.')
    .max(30)
    .regex(/^[a-z0-9_]+$/, 'Use apenas letras minúsculas, números e underscore.'),
  bio: z.string().trim().max(280, 'A bio deve ter no máximo 280 caracteres.').optional().or(z.literal('')),
  // Empty string is submitted by the "Seleccionar..." option when no province is chosen.
  province: z.enum(provinceValues).optional().or(z.literal('')),
  city: z.string().trim().max(80).optional().or(z.literal('')),
});

export type EditProfileInput = z.infer<typeof editProfileSchema>;
