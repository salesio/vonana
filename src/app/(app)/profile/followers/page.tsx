import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listFollowers } from '@/features/follow/queries';
import { UserCard } from '@/components/social/UserCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Users } from 'lucide-react';

export default async function OwnFollowersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const people = await listFollowers(session.user.id, session.user.id);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy dark:text-offwhite">Seguidores</h1>
        <Link href="/profile" className="text-sm text-electric hover:underline">
          Voltar ao perfil
        </Link>
      </div>
      {people.length === 0 ? (
        <EmptyState icon={Users} title="Ainda sem seguidores" description="Quando alguém o seguir, aparece aqui." />
      ) : (
        people.map((user) => <UserCard key={user.id} user={user} />)
      )}
    </div>
  );
}
