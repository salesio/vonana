import type { NotificationType } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type CreateNotificationInput = {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  entityType?: string;
  entityId?: string;
};

/** Never notify the actor about their own actions. */
export async function createNotification(input: CreateNotificationInput) {
  if (input.recipientId === input.actorId) return null;

  return prisma.notification.create({
    data: {
      recipientId: input.recipientId,
      actorId: input.actorId,
      type: input.type,
      entityType: input.entityType,
      entityId: input.entityId,
    },
  });
}
