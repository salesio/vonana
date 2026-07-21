'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireSessionUser } from '@/lib/session';
import { createNotification } from '@/features/notifications/service';

export type FollowResult =
  | { success: true; following: boolean }
  | { success: false; error: string };

export async function followUser(targetUserId: string): Promise<FollowResult> {
  try {
    const user = await requireSessionUser();
    if (user.id === targetUserId) {
      return { success: false, error: 'Não pode seguir a si próprio.' };
    }

    const target = await prisma.user.findFirst({
      where: { id: targetUserId, accountStatus: 'ACTIVE' },
      select: { id: true },
    });
    if (!target) return { success: false, error: 'Utilizador não encontrado.' };

    await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUserId,
        },
      },
      create: {
        followerId: user.id,
        followingId: targetUserId,
      },
      update: {},
    });

    await createNotification({
      recipientId: targetUserId,
      actorId: user.id,
      type: 'NEW_FOLLOWER',
      entityType: 'user',
      entityId: user.id,
    });

    revalidatePath('/people');
    revalidatePath('/profile');
    revalidatePath(`/u`);
    return { success: true, following: true };
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') {
      return { success: false, error: 'Sessão expirada. Inicie sessão novamente.' };
    }
    return { success: false, error: 'Não foi possível seguir este utilizador.' };
  }
}

export async function unfollowUser(targetUserId: string): Promise<FollowResult> {
  try {
    const user = await requireSessionUser();
    if (user.id === targetUserId) {
      return { success: false, error: 'Operação inválida.' };
    }

    await prisma.follow.deleteMany({
      where: {
        followerId: user.id,
        followingId: targetUserId,
      },
    });

    revalidatePath('/people');
    revalidatePath('/profile');
    revalidatePath(`/u`);
    return { success: true, following: false };
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') {
      return { success: false, error: 'Sessão expirada. Inicie sessão novamente.' };
    }
    return { success: false, error: 'Não foi possível deixar de seguir.' };
  }
}

export async function toggleFollow(targetUserId: string): Promise<FollowResult> {
  try {
    const user = await requireSessionUser();
    if (user.id === targetUserId) {
      return { success: false, error: 'Não pode seguir a si próprio.' };
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUserId,
        },
      },
    });

    if (existing) {
      return unfollowUser(targetUserId);
    }
    return followUser(targetUserId);
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') {
      return { success: false, error: 'Sessão expirada. Inicie sessão novamente.' };
    }
    return { success: false, error: 'Não foi possível actualizar o seguimento.' };
  }
}
