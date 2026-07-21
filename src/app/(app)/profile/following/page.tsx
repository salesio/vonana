import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listFollowing } from '@/features/follow/queries';
import { UserCard } from '@/components/social/UserCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Users } from 'lucide-react';

export default async function OwnFollowingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const people = await listFollowing(session.user.id, session.user.id);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy dark:text-offwhite">A seguir</h1>
        <Link href="/profile" className="text-sm text-electric hover:underline">
          Voltar ao perfil
        </Link>
      </div>
      {people.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Ainda não segue ninguém"
          description="Explore Pessoas e comece a construir a sua rede."
        />
      ) : (
        people.map((user) => <UserCard key={user.id} user={user} />)
      )}
    </div>
  );
}
