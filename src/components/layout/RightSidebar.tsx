import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const suggestions = [
  { name: 'Ana Cumbe', role: 'Designer em Maputo', avatar: null },
  { name: 'Loja Capulana Viva', role: 'Página de negócio', avatar: null },
  { name: 'Comunidade Dev Moçambique', role: '1.240 membros', avatar: null },
];

export function RightSidebar() {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-80 shrink-0 flex-col gap-4 overflow-y-auto px-4 py-6 xl:flex">
      <Card>
        <CardHeader>
          <CardTitle>Sugestões para si</CardTitle>
        </CardHeader>
        <div className="flex flex-col gap-3">
          {suggestions.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <Avatar name={s.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-navy dark:text-offwhite">{s.name}</p>
                <p className="truncate text-xs text-navy-300">{s.role}</p>
              </div>
              <Button size="sm" variant="outline" className="shrink-0 px-3">
                Seguir
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Em destaque</CardTitle>
        </CardHeader>
        <div className="flex flex-col gap-2 text-sm text-navy-300">
          <p>#MadeInMozambique</p>
          <p>#EmpreendedorismoMZ</p>
          <p>#MaputoTech</p>
        </div>
      </Card>

      <Card className="bg-vonana-gradient text-white">
        <Badge className="mb-2 bg-white/15 text-white">Publicidade</Badge>
        <p className="text-sm font-semibold">Espaço patrocinado</p>
        <p className="mt-1 text-xs text-white/80">
          Reservado para conteúdo promovido em milestones futuros.
        </p>
      </Card>
    </aside>
  );
}
