'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { editProfileSchema, type EditProfileInput } from '@/features/profile/schemas';
import type { Province } from '@prisma/client';

export type UpdateProfileResult = { success: true } | { success: false; error: string };

export async function updateProfile(input: EditProfileInput): Promise<UpdateProfileResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Sessão expirada. Inicie sessão novamente.' };
  }

  const parsed = editProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Dados inválidos. Verifique o formulário.' };
  }

  const { username, ...rest } = parsed.data;

  if (username) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== session.user.id) {
      return { success: false, error: 'Este username já está em uso.' };
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      fullName: rest.fullName,
      displayName: rest.displayName || null,
      username,
      bio: rest.bio || null,
      province: (rest.province as Province) || null,
      city: rest.city || null,
    },
  });

  revalidatePath('/profile');
  return { success: true };
}
