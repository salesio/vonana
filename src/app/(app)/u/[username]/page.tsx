import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Newspaper } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProfileHeader } from '@/components/social/ProfileHeader';
import { FeedList } from '@/components/social/FeedList';
import { serializePost } from '@/features/posts/serialize';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { fetchUserPostsPage } from '@/features/posts/queries';
import { getUserSocialStats, isFollowing } from '@/features/follow/queries';
import { MOZAMBIQUE_PROVINCES } from '@/config/geography';

export default async function PublicProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = await prisma.user.findFirst({
    where: { username: params.username.toLowerCase(), accountStatus: 'ACTIVE' },
  });
  if (!user) notFound();

  const isOwn = user.id === session.user.id;
  const [stats, following, postsPage] = await Promise.all([
    getUserSocialStats(user.id),
    isOwn ? Promise.resolve(false) : isFollowing(session.user.id, user.id),
    fetchUserPostsPage({
      profileUserId: user.id,
      viewerId: session.user.id,
      limit: 10,
    }),
  ]);

  const posts = postsPage.items.map(serializePost);
  const provinceLabel = MOZAMBIQUE_PROVINCES.find((p) => p.value === user.province)?.label;

  return (
    <div className="flex flex-col gap-5">
      <ProfileHeader user={user} stats={stats} isOwn={isOwn} isFollowing={following} />

      <Tabs
        defaultTab="posts"
        tabs={[
          {
            id: 'posts',
            label: 'Publicações',
            content:
              posts.length === 0 ? (
                <EmptyState
                  icon={Newspaper}
                  title="Sem publicações visíveis"
                  description="Este utilizador ainda não partilhou publicações que possa ver."
                />
              ) : (
                <FeedList
                  initialPosts={posts}
                  initialCursor={postsPage.nextCursor}
                  currentUserId={session.user.id}
                  profileUserId={user.id}
                />
              ),
          },
          {
            id: 'about',
            label: 'Sobre',
            content: (
              <Card className="space-y-2 text-sm text-navy-400 dark:text-navy-100">
                <p>
                  <span className="font-medium text-navy dark:text-offwhite">Nome:</span>{' '}
                  {user.fullName}
                </p>
                <p>
                  <span className="font-medium text-navy dark:text-offwhite">Username:</span> @
                  {user.username}
                </p>
                {(user.city || provinceLabel) && (
                  <p>
                    <span className="font-medium text-navy dark:text-offwhite">Localização:</span>{' '}
                    {[user.city, provinceLabel].filter(Boolean).join(', ')}
                  </p>
                )}
                {user.bio && (
                  <p>
                    <span className="font-medium text-navy dark:text-offwhite">Bio:</span> {user.bio}
                  </p>
                )}
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}
