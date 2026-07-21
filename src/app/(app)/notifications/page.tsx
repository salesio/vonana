import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { Bell } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { MarkAllReadButton, NotificationRow } from '@/components/social/NotificationList';
import { listNotifications, notificationMessage } from '@/features/notifications/queries';
import { formatRelativeTime } from '@/lib/time';

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const items = await listNotifications(session.user.id);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy dark:text-offwhite">Notificações</h1>
          <p className="text-sm text-navy-300">Seguidores, gostos e comentários.</p>
        </div>
        {items.some((n) => !n.readAt) && <MarkAllReadButton />}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Sem notificações"
          description="Quando alguém interagir consigo, verá aqui."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((n) => {
            const actorName = n.actor
              ? n.actor.displayName || n.actor.fullName
              : 'Alguém';
            const href =
              n.type === 'NEW_FOLLOWER' && n.actor
                ? `/u/${n.actor.username}`
                : '/home';
            return (
              <NotificationRow
                key={n.id}
                id={n.id}
                unread={!n.readAt}
                href={href}
              >
                <Card
                  className={`flex items-center gap-3 ${!n.readAt ? 'border-electric/30 bg-electric/5' : ''}`}
                >
                  <Avatar name={actorName} src={n.actor?.avatarUrl} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-navy dark:text-offwhite">
                      <span className="font-semibold">{actorName}</span>{' '}
                      {notificationMessage(n.type)}
                    </p>
                    <p className="text-xs text-navy-300">{formatRelativeTime(n.createdAt)}</p>
                  </div>
                  {n.actor && (
                    <Link
                      href={`/u/${n.actor.username}`}
                      className="text-xs font-medium text-electric hover:underline"
                    >
                      Ver
                    </Link>
                  )}
                </Card>
              </NotificationRow>
            );
          })}
        </div>
      )}
    </div>
  );
}
