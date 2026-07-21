import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { MapPin, Pencil } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOZAMBIQUE_PROVINCES } from '@/config/geography';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return null;

  const provinceLabel = MOZAMBIQUE_PROVINCES.find((p) => p.value === user.province)?.label;

  return (
    <div className="flex flex-col gap-5">
      <Card className="overflow-hidden p-0">
        <div className="h-32 bg-vonana-gradient sm:h-44" />
        <div className="px-5 pb-5">
          <div className="-mt-12 flex items-end justify-between">
            <Avatar name={user.fullName} src={user.avatarUrl} size="xl" className="border-4 border-white dark:border-navy-700" />
            <Link href="/profile/edit">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Pencil size={14} /> Editar perfil
              </Button>
            </Link>
          </div>

          <div className="mt-4">
            <h1 className="text-xl font-bold text-navy dark:text-offwhite">
              {user.displayName || user.fullName}
            </h1>
            <p className="text-sm text-navy-300">@{user.username}</p>
          </div>

          {user.bio && <p className="mt-3 text-sm text-navy-400 dark:text-navy-100">{user.bio}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {(provinceLabel || user.city) && (
              <span className="flex items-center gap-1 text-xs text-navy-300">
                <MapPin size={14} />
                {[user.city, provinceLabel].filter(Boolean).join(', ')}
              </span>
            )}
            <Badge variant="electric">{roleLabel(user.role)}</Badge>
          </div>
        </div>
      </Card>

      <Card>
        <p className="text-sm text-navy-300">
          As publicações, fotos e actividade deste perfil aparecerão aqui em milestones futuros.
        </p>
      </Card>
    </div>
  );
}

function roleLabel(role: string) {
  const labels: Record<string, string> = {
    USER: 'Membro',
    CREATOR: 'Criador(a)',
    SELLER: 'Vendedor(a)',
    ADMIN: 'Administrador(a)',
    SUPER_ADMIN: 'Super Administrador(a)',
  };
  return labels[role] ?? role;
}
