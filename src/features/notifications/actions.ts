'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireSessionUser } from '@/lib/session';

export async function markNotificationRead(id: string) {
  try {
    const user = await requireSessionUser();
    await prisma.notification.updateMany({
      where: { id, recipientId: user.id, readAt: null },
      data: { readAt: new Date() },
    });
    revalidatePath('/notifications');
    return { success: true as const };
  } catch {
    return { success: false as const, error: 'Não foi possível marcar como lida.' };
  }
}

export async function markAllNotificationsRead() {
  try {
    const user = await requireSessionUser();
    await prisma.notification.updateMany({
      where: { recipientId: user.id, readAt: null },
      data: { readAt: new Date() },
    });
    revalidatePath('/notifications');
    return { success: true as const };
  } catch {
    return { success: false as const, error: 'Não foi possível marcar todas como lidas.' };
  }
}

export async function getUnreadNotificationCount() {
  try {
    const user = await requireSessionUser();
    return prisma.notification.count({
      where: { recipientId: user.id, readAt: null },
    });
  } catch {
    return 0;
  }
}
