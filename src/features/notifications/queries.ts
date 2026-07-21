import { prisma } from '@/lib/prisma';

export async function listNotifications(userId: string, limit = 40) {
  return prisma.notification.findMany({
    where: { recipientId: userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      actor: {
        select: {
          id: true,
          username: true,
          fullName: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
  });
}

export function notificationMessage(type: string): string {
  switch (type) {
    case 'NEW_FOLLOWER':
      return 'começou a segui-lo(a)';
    case 'POST_REACTION':
      return 'gostou da sua publicação';
    case 'POST_COMMENT':
      return 'comentou a sua publicação';
    default:
      return 'interagiu consigo';
  }
}
