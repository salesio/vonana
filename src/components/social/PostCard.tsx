'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MessageSquare, Share2, MoreHorizontal, Globe2, Users, Lock, Pencil, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { CommentSection } from '@/components/social/CommentSection';
import { deletePost, toggleReaction, updatePost } from '@/features/posts/actions';
import { formatRelativeTime } from '@/lib/time';
import { cn } from '@/lib/utils';
import type { PostCardData } from '@/features/posts/serialize';

export type { PostCardData };

interface PostCardProps {
  post: PostCardData;
  currentUserId: string;
  onDeleted?: (id: string) => void;
}

const visibilityMeta = {
  PUBLIC: { label: 'Público', icon: Globe2 },
  FOLLOWERS: { label: 'Seguidores', icon: Users },
  PRIVATE: { label: 'Só eu', icon: Lock },
} as const;

export function PostCard({ post, currentUserId, onDeleted }: PostCardProps) {
  const name = post.author.displayName || post.author.fullName;
  const isOwner = post.authorId === currentUserId;
  const [liked, setLiked] = useState(!!post.viewerReaction);
  const [reactionCount, setReactionCount] = useState(post._count.reactions);
  const [commentCount, setCommentCount] = useState(post._count.comments);
  const [showComments, setShowComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [content, setContent] = useState(post.content);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const VisIcon = visibilityMeta[post.visibility].icon;

  function onLike() {
    const previousLiked = liked;
    const previousCount = reactionCount;
    setLiked(!previousLiked);
    setReactionCount(previousCount + (previousLiked ? -1 : 1));
    startTransition(async () => {
      const result = await toggleReaction(post.id, 'LIKE');
      if (!result.success || !result.data) {
        setLiked(previousLiked);
        setReactionCount(previousCount);
        setError(result.success ? null : result.error);
        return;
      }
      setLiked(result.data.active);
      setReactionCount(result.data.count);
    });
  }

  function onSaveEdit() {
    startTransition(async () => {
      const result = await updatePost(post.id, { content: editContent });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setContent(editContent);
      setEditOpen(false);
    });
  }

  function onDelete() {
    startTransition(async () => {
      const result = await deletePost(post.id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      onDeleted?.(post.id);
    });
  }

  return (
    <Card>
      <div className="mb-3 flex items-start gap-3">
        <Link href={`/u/${post.author.username}`}>
          <Avatar name={name} src={post.author.avatarUrl} size="md" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={`/u/${post.author.username}`}
            className="text-sm font-semibold text-navy hover:text-electric dark:text-offwhite"
          >
            {name}
          </Link>
          <p className="flex flex-wrap items-center gap-1 text-xs text-navy-300">
            <span>@{post.author.username}</span>
            <span>·</span>
            <span>{formatRelativeTime(post.createdAt)}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-0.5" title={visibilityMeta[post.visibility].label}>
              <VisIcon size={12} />
              {visibilityMeta[post.visibility].label}
            </span>
          </p>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              type="button"
              className="rounded-full p-1.5 text-navy-300 hover:bg-navy-50 dark:hover:bg-navy-600"
              aria-label="Opções da publicação"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <MoreHorizontal size={18} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-xl border border-navy-50 bg-white py-1 shadow-card dark:border-navy-600 dark:bg-navy-700">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-navy hover:bg-navy-50 dark:text-offwhite dark:hover:bg-navy-600"
                  onClick={() => {
                    setMenuOpen(false);
                    setEditOpen(true);
                  }}
                >
                  <Pencil size={14} /> Editar
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-navy-600"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete();
                  }}
                >
                  <Trash2 size={14} /> Eliminar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {content && (
        <p className="whitespace-pre-wrap text-sm text-navy-400 dark:text-navy-100">{content}</p>
      )}

      {post.media.length > 0 && (
        <div
          className={cn(
            'mt-3 grid gap-2',
            post.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2',
          )}
        >
          {post.media.map((m) => (
            <div
              key={m.id}
              className="relative aspect-video overflow-hidden rounded-xl bg-navy-50 dark:bg-navy-600"
            >
              <Image src={m.url} alt="" fill className="object-cover" unoptimized sizes="(max-width:768px) 100vw, 560px" />
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 border-t border-navy-50 pt-3 text-sm dark:border-navy-600">
        <button
          type="button"
          onClick={onLike}
          className={cn(
            'flex items-center gap-1.5 transition-colors',
            liked ? 'font-medium text-electric' : 'text-navy-300 hover:text-electric',
          )}
          aria-pressed={liked}
        >
          <Heart size={16} className={liked ? 'fill-current' : undefined} />
          {reactionCount}
          <span className="hidden sm:inline">Gostar</span>
        </button>
        <button
          type="button"
          onClick={() => setShowComments((v) => !v)}
          className="flex items-center gap-1.5 text-navy-300 hover:text-electric"
        >
          <MessageSquare size={16} />
          {commentCount}
          <span className="hidden sm:inline">Comentar</span>
        </button>
        <span className="ml-auto flex cursor-not-allowed items-center gap-1.5 text-navy-300 opacity-60" title="Em breve">
          <Share2 size={16} />
          <span className="hidden sm:inline">Partilhar</span>
        </span>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {showComments && (
        <CommentSection
          postId={post.id}
          currentUserId={currentUserId}
          onCountChange={(delta) => setCommentCount((c) => Math.max(0, c + delta))}
        />
      )}

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Editar publicação" className="max-w-lg">
        <div className="flex flex-col gap-3">
          <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={4} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={onSaveEdit} isLoading={pending}>
              Guardar
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
