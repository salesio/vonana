import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PostComposer } from '@/components/social/PostComposer';
import { FeedList } from '@/components/social/FeedList';
import { fetchFeedPage } from '@/features/posts/queries';
import { serializePost } from '@/features/posts/serialize';

const communities = [
  { name: 'Empreendedorismo MZ', members: '3.480 membros' },
  { name: 'Fotografia em Moçambique', members: '1.920 membros' },
  { name: 'Culinária Moçambicana', members: '2.610 membros' },
];

const marketplacePreview = [
  { name: 'Capulana artesanal', price: '850 MT' },
  { name: 'Mel de Niassa — 250ml', price: '280 MT' },
  { name: 'Serviço de fotografia', price: 'Desde 2.000 MT' },
];

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const firstName = (session.user.name ?? 'Bem-vindo(a)').split(' ')[0];
  const feed = await fetchFeedPage({ viewerId: session.user.id, limit: 10 });
  const posts = feed.items.map(serializePost);

  return (
    <div className="flex flex-col gap-5">
      <Card className="bg-vonana-gradient text-white">
        <p className="text-sm text-white/80">Bem-vindo(a) de volta,</p>
        <h1 className="text-2xl font-bold">{firstName} 👋</h1>
        <p className="mt-1 text-sm text-white/85">
          O seu feed social VONANA — publique, siga pessoas e interaja com a comunidade.
        </p>
      </Card>

      <PostComposer
        user={{
          name: session.user.name ?? session.user.username,
          avatarUrl: session.user.avatarUrl,
        }}
      />

      <FeedList
        initialPosts={posts}
        initialCursor={feed.nextCursor}
        currentUserId={session.user.id}
      />

      {/* Future milestones — keep discovery teaser without mock social posts */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-navy dark:text-offwhite">Comunidades sugeridas</h2>
          <Badge variant="outline">Em breve</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {communities.map((c) => (
            <div key={c.name} className="rounded-xl border border-navy-50 p-3 dark:border-navy-600">
              <p className="text-sm font-semibold text-navy dark:text-offwhite">{c.name}</p>
              <p className="mt-0.5 text-xs text-navy-300">{c.members}</p>
              <Button size="sm" variant="outline" className="mt-2 w-full" disabled>
                Participar
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-navy dark:text-offwhite">Marketplace</h2>
          <Badge variant="outline">Em breve</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {marketplacePreview.map((p) => (
            <div key={p.name} className="rounded-xl border border-navy-50 p-3 dark:border-navy-600">
              <div className="mb-2 h-20 w-full rounded-lg bg-vonana-gradient opacity-90" />
              <p className="text-sm font-semibold text-navy dark:text-offwhite">{p.name}</p>
              <p className="text-xs font-medium text-electric">{p.price}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
