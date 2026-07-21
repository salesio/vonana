import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { mediaStorage, isAllowedImageMime, MAX_IMAGE_BYTES } from '@/lib/media';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get('file');
    const folderRaw = form.get('folder');
    const folder = typeof folderRaw === 'string' ? folderRaw : 'posts';

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Ficheiro em falta.' }, { status: 400 });
    }

    if (!isAllowedImageMime(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de ficheiro não suportado. Use JPEG, PNG, WebP ou GIF.' },
        { status: 400 },
      );
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: 'A imagem deve ter no máximo 5 MB.' }, { status: 400 });
    }

    const url = await mediaStorage.upload(file, folder);
    return NextResponse.json({ url });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Falha no upload.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
