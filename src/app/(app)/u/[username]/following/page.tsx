import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Users } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { listFollowing } from '@/features/follow/queries';
import { UserCard } from '@/components/social/UserCard';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function UserFollowingPage({ params }: { params: { username: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = await prisma.user.findFirst({
    where: { username: params.username.toLowerCase(), accountStatus: 'ACTIVE' },
  });
  if (!user) notFound();

  const people = await listFollowing(user.id, session.user.id);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy dark:text-offwhite">
          @{user.username} a seguir
        </h1>
        <Link href={`/u/${user.username}`} className="text-sm text-electric hover:underline">
          Voltar ao perfil
        </Link>
      </div>
      {people.length === 0 ? (
        <EmptyState icon={Users} title="Não segue ninguém" />
      ) : (
        people.map((p) => <UserCard key={p.id} user={p} />)
      )}
    </div>
  );
}
