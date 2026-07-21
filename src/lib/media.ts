/**
 * Media storage abstraction.
 *
 * Local development writes under /public/uploads and returns a public URL.
 * The MediaStorage contract is storage-agnostic so a future milestone can
 * swap in S3-compatible object storage without changing callers.
 */

import { randomBytes } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
export const ALLOWED_IMAGE_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

export interface MediaStorage {
  /** Upload a file and return its publicly accessible URL. */
  upload(file: File, folder: string): Promise<string>;
}

function sanitizeFolder(folder: string): string {
  return folder.replace(/[^a-zA-Z0-9/_-]/g, '').replace(/\.\./g, '').slice(0, 80) || 'general';
}

function uniqueFilename(mime: string): string {
  const ext = ALLOWED_IMAGE_EXT[mime] ?? '.bin';
  const stamp = Date.now().toString(36);
  const rand = randomBytes(8).toString('hex');
  return `${stamp}-${rand}${ext}`;
}

class LocalMediaStorage implements MediaStorage {
  async upload(file: File, folder: string): Promise<string> {
    if (!ALLOWED_IMAGE_MIME.has(file.type)) {
      throw new Error('Tipo de ficheiro não suportado. Use JPEG, PNG, WebP ou GIF.');
    }
    if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) {
      throw new Error('A imagem deve ter no máximo 5 MB.');
    }

    const safeFolder = sanitizeFolder(folder);
    const filename = uniqueFilename(file.type);
    const relativeDir = path.join('uploads', safeFolder);
    const absoluteDir = path.join(process.cwd(), 'public', relativeDir);
    await fs.mkdir(absoluteDir, { recursive: true });

    const absolutePath = path.join(absoluteDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(absolutePath, buffer);

    // Public URL served by Next.js from /public
    return `/${relativeDir.replace(/\\/g, '/')}/${filename}`;
  }
}

export const mediaStorage: MediaStorage = new LocalMediaStorage();

export function isAllowedImageMime(mime: string): boolean {
  return ALLOWED_IMAGE_MIME.has(mime);
}
