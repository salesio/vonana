'use client';

import { useEffect, useState, useTransition } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import {
  createComment,
  deleteComment,
  listComments,
  updateComment,
} from '@/features/posts/actions';
import { formatRelativeTime } from '@/lib/time';

type CommentRow = {
  id: string;
  content: string;
  createdAt: string | Date;
  authorId: string;
  author: {
    id: string;
    username: string;
    fullName: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
};

interface CommentSectionProps {
  postId: string;
  currentUserId: string;
  onCountChange?: (delta: number) => void;
}

export function CommentSection({ postId, currentUserId, onCountChange }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const rows = await listComments(postId);
      if (!cancelled) {
        setComments(
          rows.map((c) => ({
            ...c,
            createdAt: c.createdAt,
          })),
        );
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await createComment(postId, { content: text });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setText('');
      const rows = await listComments(postId);
      setComments(rows);
      onCountChange?.(1);
    });
  }

  function saveEdit(id: string) {
    startTransition(async () => {
      const result = await updateComment(id, { content: editText });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setEditingId(null);
      const rows = await listComments(postId);
      setComments(rows);
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const result = await deleteComment(id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setComments((prev) => prev.filter((c) => c.id !== id));
      onCountChange?.(-1);
    });
  }

  return (
    <div className="mt-3 border-t border-navy-50 pt-3 dark:border-navy-600">
      {loading ? (
        <p className="text-xs text-navy-300">A carregar comentários...</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-navy-300">Ainda não há comentários. Seja o primeiro.</p>
      ) : (
        <ul className="mb-3 flex flex-col gap-3">
          {comments.map((c) => {
            const name = c.author.displayName || c.author.fullName;
            return (
              <li key={c.id} className="flex gap-2">
                <Avatar name={name} src={c.author.avatarUrl} size="sm" />
                <div className="min-w-0 flex-1 rounded-xl bg-navy-50/50 px-3 py-2 dark:bg-navy-600/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-navy dark:text-offwhite">{name}</span>
                    <span className="text-[11px] text-navy-300">@{c.author.username}</span>
                    <span className="text-[11px] text-navy-300">
                      · {formatRelativeTime(c.createdAt)}
                    </span>
                  </div>
                  {editingId === c.id ? (
                    <div className="mt-2 space-y-2">
                      <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={2} />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveEdit(c.id)} isLoading={pending}>
                          Guardar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-navy-400 dark:text-navy-100">{c.content}</p>
                  )}
                  {c.authorId === currentUserId && editingId !== c.id && (
                    <div className="mt-1 flex gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-[11px] text-navy-300 hover:text-electric"
                        onClick={() => {
                          setEditingId(c.id);
                          setEditText(c.content);
                        }}
                      >
                        <Pencil size={12} /> Editar
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-[11px] text-navy-300 hover:text-red-600"
                        onClick={() => remove(c.id)}
                      >
                        <Trash2 size={12} /> Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex flex-col gap-2">
        <Textarea
          placeholder="Escreva um comentário..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex justify-end">
          <Button size="sm" onClick={submit} isLoading={pending} disabled={!text.trim()}>
            Comentar
          </Button>
        </div>
      </div>
    </div>
  );
}
