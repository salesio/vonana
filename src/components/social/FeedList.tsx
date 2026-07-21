'use client';

import { useState, useTransition } from 'react';
import { Newspaper } from 'lucide-react';
import { PostCard } from '@/components/social/PostCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { loadMoreFeed, loadMoreUserPosts } from '@/features/posts/actions';
import { serializePost, type PostCardData } from '@/features/posts/serialize';

interface FeedListProps {
  initialPosts: PostCardData[];
  initialCursor: string | null;
  currentUserId: string;
  /** When set, pagination loads that user's posts instead of the home feed. */
  profileUserId?: string;
}

export function FeedList({
  initialPosts,
  initialCursor,
  currentUserId,
  profileUserId,
}: FeedListProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [cursor, setCursor] = useState(initialCursor);
  const [pending, startTransition] = useTransition();

  function loadMore() {
    if (!cursor) return;
    startTransition(async () => {
      const page = profileUserId
        ? await loadMoreUserPosts(profileUserId, cursor)
        : await loadMoreFeed(cursor);
      const mapped = page.items.map(serializePost);
      setPosts((prev) => [...prev, ...mapped]);
      setCursor(page.nextCursor);
    });
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={Newspaper}
        title="Ainda não há publicações"
        description="Siga pessoas e publique a sua primeira actualização para ver o feed a encher."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onDeleted={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))}
        />
      ))}
      {cursor && (
        <Button variant="outline" onClick={loadMore} isLoading={pending} className="self-center">
          Carregar mais
        </Button>
      )}
    </div>
  );
}
