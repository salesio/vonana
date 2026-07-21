'use client';

import { useTransition, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { markAllNotificationsRead, markNotificationRead } from '@/features/notifications/actions';

export function MarkAllReadButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="outline"
      isLoading={pending}
      onClick={() =>
        startTransition(async () => {
          await markAllNotificationsRead();
          router.refresh();
        })
      }
    >
      Marcar todas como lidas
    </Button>
  );
}

export function NotificationRow({
  id,
  unread,
  href,
  children,
}: {
  id: string;
  unread: boolean;
  href: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="w-full text-left"
      onClick={() => {
        startTransition(async () => {
          if (unread) await markNotificationRead(id);
          router.push(href);
          router.refresh();
        });
      }}
    >
      {children}
    </button>
  );
}
