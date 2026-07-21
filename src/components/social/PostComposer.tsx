'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, X } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { createPost } from '@/features/posts/actions';

type Visibility = 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE';

interface PostComposerProps {
  user: { name: string; avatarUrl: string | null };
  /** When true, render only the modal trigger bar (home). When false, full create page. */
  compact?: boolean;
  defaultOpen?: boolean;
}

const visibilityOptions: { value: Visibility; label: string }[] = [
  { value: 'PUBLIC', label: 'Público' },
  { value: 'FOLLOWERS', label: 'Seguidores' },
  { value: 'PRIVATE', label: 'Só eu' },
];

export function PostComposer({ user, compact = true, defaultOpen = false }: PostComposerProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(defaultOpen);
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('PUBLIC');
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  function reset() {
    setContent('');
    setVisibility('PUBLIC');
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);
    setError(null);
  }

  function close() {
    setOpen(false);
    reset();
  }

  function onPickFiles(files: FileList | null) {
    if (!files) return;
    const next: { file: File; url: string }[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setError('Apenas imagens são suportadas por agora.');
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Cada imagem deve ter no máximo 5 MB.');
        continue;
      }
      next.push({ file, url: URL.createObjectURL(file) });
    }
    setPreviews((prev) => [...prev, ...next].slice(0, 4));
  }

  async function uploadAll(): Promise<string[]> {
    const urls: string[] = [];
    for (const item of previews) {
      const form = new FormData();
      form.append('file', item.file);
      form.append('folder', 'posts');
      const res = await fetch('/api/media/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha no upload.');
      urls.push(data.url as string);
    }
    return urls;
  }

  function submit() {
    setError(null);
    if (!content.trim() && previews.length === 0) {
      setError('Escreva algo ou adicione uma imagem.');
      return;
    }

    startTransition(async () => {
      try {
        setUploading(true);
        const mediaUrls = await uploadAll();
        setUploading(false);
        const result = await createPost({ content, visibility, mediaUrls });
        if (!result.success) {
          setError(result.error);
          return;
        }
        close();
        router.refresh();
      } catch (e) {
        setUploading(false);
        setError(e instanceof Error ? e.message : 'Não foi possível publicar.');
      }
    });
  }

  const form = (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <Avatar name={user.name} src={user.avatarUrl} size="md" />
        <Textarea
          placeholder="No que está a pensar?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="flex-1"
        />
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {previews.map((p, i) => (
            <div key={p.url} className="relative overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" className="h-32 w-full object-cover" />
              <button
                type="button"
                className="absolute right-2 top-2 rounded-full bg-navy/70 p-1 text-white"
                onClick={() => {
                  URL.revokeObjectURL(p.url);
                  setPreviews((prev) => prev.filter((_, idx) => idx !== i));
                }}
                aria-label="Remover imagem"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-navy-300 hover:text-electric">
          <ImageIcon size={16} /> Foto
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => onPickFiles(e.target.files)}
          />
        </label>

        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as Visibility)}
          className="h-9 rounded-xl border border-navy-100 bg-white px-3 text-sm text-navy dark:border-navy-500 dark:bg-navy-600 dark:text-offwhite"
          aria-label="Visibilidade"
        >
          {visibilityOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <Button
          className="ml-auto"
          onClick={submit}
          isLoading={pending || uploading}
          disabled={!content.trim() && previews.length === 0}
        >
          Publicar
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );

  if (!compact) {
    return <Card>{form}</Card>;
  }

  return (
    <>
      <Card>
        <div className="flex items-center gap-3">
          <Avatar name={user.name} src={user.avatarUrl} size="md" />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex-1 rounded-full border border-navy-50 bg-navy-50/40 px-4 py-2.5 text-left text-sm text-navy-300 transition hover:border-electric/40 dark:border-navy-500 dark:bg-navy-600"
          >
            Criar publicação...
          </button>
        </div>
        <div className="mt-3 flex items-center gap-4 border-t border-navy-50 pt-3 text-sm text-navy-300 dark:border-navy-600">
          <button
            type="button"
            className="flex items-center gap-1.5 hover:text-electric"
            onClick={() => {
              setOpen(true);
              setTimeout(() => fileRef.current?.click(), 50);
            }}
          >
            <ImageIcon size={16} /> Foto
          </button>
        </div>
      </Card>

      <Modal isOpen={open} onClose={close} title="Criar publicação" className="max-w-lg">
        {form}
      </Modal>
    </>
  );
}
