'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { toggleFollow } from '@/features/follow/actions';

interface FollowButtonProps {
  userId: string;
  initialFollowing: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function FollowButton({
  userId,
  initialFollowing,
  size = 'sm',
  className,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onClick() {
    setError(null);
    const previous = following;
    setFollowing(!previous);
    startTransition(async () => {
      const result = await toggleFollow(userId);
      if (!result.success) {
        setFollowing(previous);
        setError(result.error);
        return;
      }
      setFollowing(result.following);
    });
  }

  return (
    <div className={className}>
      <Button
        type="button"
        size={size}
        variant={following ? 'outline' : 'primary'}
        isLoading={pending}
        onClick={onClick}
        aria-pressed={following}
      >
        {following ? 'A seguir' : 'Seguir'}
      </Button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
