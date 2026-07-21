'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { FollowButton } from '@/components/social/FollowButton';
import { MOZAMBIQUE_PROVINCES } from '@/config/geography';
import type { PeopleCard } from '@/features/people/queries';

export function UserCard({ user }: { user: PeopleCard }) {
  const name = user.displayName || user.fullName;
  const provinceLabel = MOZAMBIQUE_PROVINCES.find((p) => p.value === user.province)?.label;
  const location = [user.city, provinceLabel].filter(Boolean).join(', ');

  return (
    <Card className="flex items-center gap-3">
      <Link href={`/u/${user.username}`} className="shrink-0">
        <Avatar name={name} src={user.avatarUrl} size="md" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/u/${user.username}`} className="block truncate text-sm font-semibold text-navy hover:text-electric dark:text-offwhite">
          {name}
        </Link>
        <p className="truncate text-xs text-navy-300">@{user.username}</p>
        {location && (
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-navy-300">
            <MapPin size={12} /> {location}
          </p>
        )}
      </div>
      {!user.isSelf && (
        <FollowButton userId={user.id} initialFollowing={user.isFollowing} />
      )}
    </Card>
  );
}
