import { getServerSession } from 'next-auth';
import { Users } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { UserCard } from '@/components/social/UserCard';
import { UserSearch } from '@/components/social/UserSearch';
import { EmptyState } from '@/components/ui/EmptyState';
import { searchPeople, suggestPeople } from '@/features/people/queries';

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const q = searchParams.q?.trim() ?? '';
  const [results, suggestions] = await Promise.all([
    searchPeople({ viewerId: session.user.id, query: q || undefined, limit: 30 }),
    q ? Promise.resolve([]) : suggestPeople(session.user.id, 8),
  ]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-navy dark:text-offwhite">Pessoas</h1>
        <p className="text-sm text-navy-300">Encontre e siga pessoas em Moçambique.</p>
      </div>

      <UserSearch initialQuery={q} compact={false} className="relative flex w-full items-center" />

      {q ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-navy dark:text-offwhite">
            Resultados para “{q}”
          </h2>
          {results.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Nenhum resultado"
              description="Tente outro nome ou username."
            />
          ) : (
            results.map((user) => <UserCard key={user.id} user={user} />)
          )}
        </section>
      ) : (
        <>
          {suggestions.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-navy dark:text-offwhite">
                Pessoas que talvez conheça
              </h2>
              {suggestions.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </section>
          )}

          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-navy dark:text-offwhite">Explorar pessoas</h2>
            {results.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Ainda não há outras pessoas"
                description="Convide amigos a criar conta na VONANA."
              />
            ) : (
              results.map((user) => <UserCard key={user.id} user={user} />)
            )}
          </section>
        </>
      )}
    </div>
  );
}
