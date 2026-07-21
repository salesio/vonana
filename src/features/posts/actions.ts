'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireSessionUser } from '@/lib/session';
import { createNotification } from '@/features/notifications/service';
import {
  commentSchema,
  createPostSchema,
  reactionTypeSchema,
  updatePostSchema,
  type CommentInput,
  type CreatePostInput,
  type ReactionTypeInput,
  type UpdatePostInput,
} from '@/features/posts/schemas';
import { fetchFeedPage, fetchUserPostsPage, getPostForViewer } from '@/features/posts/queries';

export type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string };

export async function createPost(input: CreatePostInput): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireSessionUser();
    const parsed = createPostSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? 'Dados inválidos.' };
    }

    const { content, visibility, mediaUrls } = parsed.data;

    // Only accept app-local upload URLs (never remote arbitrary URLs).
    const safeMedia = (mediaUrls ?? []).filter((url) => url.startsWith('/uploads/'));
    if ((mediaUrls?.length ?? 0) > 0 && safeMedia.length !== mediaUrls!.length) {
      return { success: false, error: 'URL de media inválida.' };
    }

    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        ownerType: 'USER',
        ownerId: user.id,
        content,
        visibility,
        media: {
          create: safeMedia.map((url, index) => ({
            url,
            type: 'IMAGE' as const,
            position: index,
          })),
        },
      },
    });

    revalidatePath('/home');
    revalidatePath('/profile');
    return { success: true, data: { id: post.id } };
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') {
      return { success: false, error: 'Sessão expirada. Inicie sessão novamente.' };
    }
    return { success: false, error: 'Não foi possível criar a publicação.' };
  }
}

export async function updatePost(
  postId: string,
  input: UpdatePostInput,
): Promise<ActionResult> {
  try {
    const user = await requireSessionUser();
    const parsed = updatePostSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? 'Dados inválidos.' };
    }

    const post = await prisma.post.findFirst({
      where: { id: postId, deletedAt: null },
    });
    if (!post) return { success: false, error: 'Publicação não encontrada.' };
    if (post.authorId !== user.id) {
      return { success: false, error: 'Não tem permissão para editar esta publicação.' };
    }

    await prisma.post.update({
      where: { id: postId },
      data: {
        content: parsed.data.content,
        ...(parsed.data.visibility ? { visibility: parsed.data.visibility } : {}),
      },
    });

    revalidatePath('/home');
    revalidatePath('/profile');
    return { success: true };
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') {
      return { success: false, error: 'Sessão expirada. Inicie sessão novamente.' };
    }
    return { success: false, error: 'Não foi possível actualizar a publicação.' };
  }
}

export async function deletePost(postId: string): Promise<ActionResult> {
  try {
    const user = await requireSessionUser();
    const post = await prisma.post.findFirst({
      where: { id: postId, deletedAt: null },
    });
    if (!post) return { success: false, error: 'Publicação não encontrada.' };
    if (post.authorId !== user.id) {
      return { success: false, error: 'Não tem permissão para eliminar esta publicação.' };
    }

    await prisma.post.update({
      where: { id: postId },
      data: { deletedAt: new Date() },
    });

    revalidatePath('/home');
    revalidatePath('/profile');
    return { success: true };
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') {
      return { success: false, error: 'Sessão expirada. Inicie sessão novamente.' };
    }
    return { success: false, error: 'Não foi possível eliminar a publicação.' };
  }
}

export async function toggleReaction(
  postId: string,
  type: ReactionTypeInput = 'LIKE',
): Promise<ActionResult<{ active: boolean; count: number; type: string | null }>> {
  try {
    const user = await requireSessionUser();
    const parsedType = reactionTypeSchema.safeParse(type);
    if (!parsedType.success) {
      return { success: false, error: 'Tipo de reacção inválido.' };
    }

    const post = await getPostForViewer(postId, user.id);
    if (!post) return { success: false, error: 'Publicação não encontrada.' };

    const existing = await prisma.reaction.findUnique({
      where: { postId_userId: { postId, userId: user.id } },
    });

    let active = false;
    let reactionType: string | null = null;

    if (existing && existing.type === parsedType.data) {
      await prisma.reaction.delete({ where: { id: existing.id } });
      active = false;
      reactionType = null;
    } else if (existing) {
      await prisma.reaction.update({
        where: { id: existing.id },
        data: { type: parsedType.data },
      });
      active = true;
      reactionType = parsedType.data;
    } else {
      await prisma.reaction.create({
        data: {
          postId,
          userId: user.id,
          type: parsedType.data,
        },
      });
      active = true;
      reactionType = parsedType.data;
      await createNotification({
        recipientId: post.authorId,
        actorId: user.id,
        type: 'POST_REACTION',
        entityType: 'post',
        entityId: postId,
      });
    }

    const count = await prisma.reaction.count({ where: { postId } });
    revalidatePath('/home');
    return { success: true, data: { active, count, type: reactionType } };
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') {
      return { success: false, error: 'Sessão expirada. Inicie sessão novamente.' };
    }
    return { success: false, error: 'Não foi possível registar a reacção.' };
  }
}

export async function createComment(
  postId: string,
  input: CommentInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireSessionUser();
    const parsed = commentSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? 'Dados inválidos.' };
    }

    const post = await getPostForViewer(postId, user.id);
    if (!post) return { success: false, error: 'Publicação não encontrada.' };

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId: user.id,
        content: parsed.data.content,
      },
    });

    await createNotification({
      recipientId: post.authorId,
      actorId: user.id,
      type: 'POST_COMMENT',
      entityType: 'comment',
      entityId: comment.id,
    });

    revalidatePath('/home');
    return { success: true, data: { id: comment.id } };
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') {
      return { success: false, error: 'Sessão expirada. Inicie sessão novamente.' };
    }
    return { success: false, error: 'Não foi possível comentar.' };
  }
}

export async function updateComment(
  commentId: string,
  input: CommentInput,
): Promise<ActionResult> {
  try {
    const user = await requireSessionUser();
    const parsed = commentSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? 'Dados inválidos.' };
    }

    const comment = await prisma.comment.findFirst({
      where: { id: commentId, deletedAt: null },
    });
    if (!comment) return { success: false, error: 'Comentário não encontrado.' };
    if (comment.authorId !== user.id) {
      return { success: false, error: 'Não tem permissão para editar este comentário.' };
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: { content: parsed.data.content },
    });

    revalidatePath('/home');
    return { success: true };
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') {
      return { success: false, error: 'Sessão expirada. Inicie sessão novamente.' };
    }
    return { success: false, error: 'Não foi possível actualizar o comentário.' };
  }
}

export async function deleteComment(commentId: string): Promise<ActionResult> {
  try {
    const user = await requireSessionUser();
    const comment = await prisma.comment.findFirst({
      where: { id: commentId, deletedAt: null },
    });
    if (!comment) return { success: false, error: 'Comentário não encontrado.' };
    if (comment.authorId !== user.id) {
      return { success: false, error: 'Não tem permissão para eliminar este comentário.' };
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: { deletedAt: new Date() },
    });

    revalidatePath('/home');
    return { success: true };
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') {
      return { success: false, error: 'Sessão expirada. Inicie sessão novamente.' };
    }
    return { success: false, error: 'Não foi possível eliminar o comentário.' };
  }
}

export async function loadMoreFeed(cursor: string | null) {
  try {
    const user = await requireSessionUser();
    return await fetchFeedPage({ viewerId: user.id, cursor });
  } catch {
    return { items: [], nextCursor: null, hasMore: false };
  }
}

export async function loadMoreUserPosts(profileUserId: string, cursor: string | null) {
  try {
    const user = await requireSessionUser();
    return await fetchUserPostsPage({
      profileUserId,
      viewerId: user.id,
      cursor,
    });
  } catch {
    return { items: [], nextCursor: null, hasMore: false };
  }
}

export async function listComments(postId: string) {
  try {
    const user = await requireSessionUser();
    const post = await getPostForViewer(postId, user.id);
    if (!post) return [];

    return prisma.comment.findMany({
      where: { postId, deletedAt: null, parentId: null },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });
  } catch {
    return [];
  }
}
