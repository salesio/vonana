import Link from 'next/link';
import { MapPin, Pencil } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FollowButton } from '@/components/social/FollowButton';
import { MOZAMBIQUE_PROVINCES } from '@/config/geography';

type ProfileUser = {
  id: string;
  username: string;
  fullName: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  city: string | null;
  province: string | null;
  role: string;
};

interface ProfileHeaderProps {
  user: ProfileUser;
  stats: { posts: number; followers: number; following: number };
  isOwn: boolean;
  isFollowing: boolean;
}

export function ProfileHeader({ user, stats, isOwn, isFollowing }: ProfileHeaderProps) {
  const name = user.displayName || user.fullName;
  const provinceLabel = MOZAMBIQUE_PROVINCES.find((p) => p.value === user.province)?.label;

  return (
    <Card className="overflow-hidden p-0">
      <div
        className="h-32 bg-vonana-gradient sm:h-44"
        style={
          user.coverUrl
            ? { backgroundImage: `url(${user.coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : undefined
        }
      />
      <div className="px-5 pb-5">
        <div className="-mt-12 flex items-end justify-between gap-3">
          <Avatar
            name={name}
            src={user.avatarUrl}
            size="xl"
            className="border-4 border-white dark:border-navy-700"
          />
          {isOwn ? (
            <Link href="/profile/edit">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Pencil size={14} /> Editar perfil
              </Button>
            </Link>
          ) : (
            <FollowButton userId={user.id} initialFollowing={isFollowing} />
          )}
        </div>

        <div className="mt-4">
          <h1 className="text-xl font-bold text-navy dark:text-offwhite">{name}</h1>
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

        <div className="mt-4 flex flex-wrap gap-5 text-sm">
          <span className="text-navy dark:text-offwhite">
            <strong>{stats.posts}</strong>{' '}
            <span className="text-navy-300">publicações</span>
          </span>
          <Link
            href={isOwn ? '/profile/followers' : `/u/${user.username}/followers`}
            className="text-navy hover:text-electric dark:text-offwhite"
          >
            <strong>{stats.followers}</strong>{' '}
            <span className="text-navy-300">seguidores</span>
          </Link>
          <Link
            href={isOwn ? '/profile/following' : `/u/${user.username}/following`}
            className="text-navy hover:text-electric dark:text-offwhite"
          >
            <strong>{stats.following}</strong>{' '}
            <span className="text-navy-300">a seguir</span>
          </Link>
        </div>
      </div>
    </Card>
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
