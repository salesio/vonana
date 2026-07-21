import { getServerSession } from 'next-auth';
import { Image as ImageIcon, Video, MapPin, Heart, MessageSquare, Share2 } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const mockPosts = [
  {
    author: 'Comunidade Dev Moçambique',
    handle: '@devmz',
    time: '2 h',
    content:
      'Hoje realizámos o primeiro encontro de programadores em Maputo! Obrigado a todos que participaram — já estamos a planear o próximo evento em Beira.',
    likes: 128,
    comments: 24,
  },
  {
    author: 'Ana Cumbe',
    handle: '@ana.cumbe',
    time: '5 h',
    content:
      'Acabei de lançar a minha nova colecção de capulanas com padrões inspirados em Inhambane. Em breve disponível no marketplace da VONANA 🧡',
    likes: 342,
    comments: 51,
  },
  {
    author: 'Rádio Moçambique Jovem',
    handle: '@rmjovem',
    time: '1 dia',
    content:
      'Qual foi a novidade que mais gostou esta semana em Moçambique? Deixe o seu comentário e vamos falar sobre isso no próximo programa.',
    likes: 89,
    comments: 63,
  },
];

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
  const firstName = (session?.user?.name ?? 'Bem-vindo(a)').split(' ')[0];

  return (
    <div className="flex flex-col gap-5">
      {/* Welcome card */}
      <Card className="bg-vonana-gradient text-white">
        <p className="text-sm text-white/80">Bem-vindo(a) de volta,</p>
        <h1 className="text-2xl font-bold">{firstName} 👋</h1>
        <p className="mt-1 text-sm text-white/85">
          Isto é o início da sua rede em VONANA — a área social está a ser construída milestone a
          milestone.
        </p>
      </Card>

      {/* Composer placeholder */}
      <Card>
        <div className="flex items-center gap-3">
          <Avatar name={session?.user?.name ?? 'Utilizador'} src={session?.user?.avatarUrl} size="md" />
          <button
            disabled
            className="flex-1 cursor-not-allowed rounded-full border border-navy-50 bg-navy-50/40 px-4 py-2.5 text-left text-sm text-navy-300 dark:border-navy-500 dark:bg-navy-600"
          >
            Criar publicação... (em breve)
          </button>
        </div>
        <div className="mt-3 flex items-center gap-4 border-t border-navy-50 pt-3 text-sm text-navy-300 dark:border-navy-600">
          <span className="flex items-center gap-1.5">
            <ImageIcon size={16} /> Foto
          </span>
          <span className="flex items-center gap-1.5">
            <Video size={16} /> Vídeo
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={16} /> Localização
          </span>
        </div>
      </Card>

      {/* Mock feed */}
      <div className="flex flex-col gap-4">
        {mockPosts.map((post) => (
          <Card key={post.author + post.time}>
            <div className="mb-3 flex items-center gap-3">
              <Avatar name={post.author} size="md" />
              <div>
                <p className="text-sm font-semibold text-navy dark:text-offwhite">{post.author}</p>
                <p className="text-xs text-navy-300">
                  {post.handle} &middot; {post.time}
                </p>
              </div>
            </div>
            <p className="text-sm text-navy-400 dark:text-navy-100">{post.content}</p>
            <div className="mt-4 flex items-center gap-6 border-t border-navy-50 pt-3 text-sm text-navy-300 dark:border-navy-600">
              <span className="flex items-center gap-1.5">
                <Heart size={16} /> {post.likes}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare size={16} /> {post.comments}
              </span>
              <span className="ml-auto flex items-center gap-1.5">
                <Share2 size={16} /> Partilhar
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Suggested communities */}
      <Card>
        <CardHeader>
          <CardTitle>Comunidades sugeridas</CardTitle>
          <Badge variant="outline">Em breve</Badge>
        </CardHeader>
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

      {/* Marketplace preview */}
      <Card>
        <CardHeader>
          <CardTitle>Marketplace</CardTitle>
          <Badge variant="outline">Em breve</Badge>
        </CardHeader>
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
