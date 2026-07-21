import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { visiblePostsWhere } from '@/lib/posts-visibility';

export const postAuthorSelect = {
  id: true,
  username: true,
  fullName: true,
  displayName: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

export const postCardInclude = {
  author: { select: postAuthorSelect },
  media: { orderBy: { position: 'asc' as const } },
  _count: {
    select: {
      reactions: true,
      comments: { where: { deletedAt: null } },
    },
  },
} satisfies Prisma.PostInclude;

export type PostCardRecord = Prisma.PostGetPayload<{ include: typeof postCardInclude }> & {
  viewerReaction: string | null;
};

export async function getFollowingIds(userId: string): Promise<string[]> {
  const rows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  return rows.map((r) => r.followingId);
}

export async function fetchFeedPage(options: {
  viewerId: string;
  cursor?: string | null;
  limit?: number;
}) {
  const limit = Math.min(options.limit ?? 10, 30);
  const followingIds = await getFollowingIds(options.viewerId);

  // Prefer own + following content, but still include other public posts.
  const where: Prisma.PostWhereInput = {
    AND: [
      visiblePostsWhere(options.viewerId, followingIds),
      options.cursor ? { createdAt: { lt: new Date(options.cursor) } } : {},
    ],
  };

  const posts = await prisma.post.findMany({
    where,
    include: postCardInclude,
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
  });

  const hasMore = posts.length > limit;
  const page = hasMore ? posts.slice(0, limit) : posts;
  const nextCursor = hasMore ? page[page.length - 1]?.createdAt.toISOString() : null;

  const postIds = page.map((p) => p.id);
  const myReactions = postIds.length
    ? await prisma.reaction.findMany({
        where: { userId: options.viewerId, postId: { in: postIds } },
        select: { postId: true, type: true },
      })
    : [];
  const reactionMap = new Map(myReactions.map((r) => [r.postId, r.type]));

  const items: PostCardRecord[] = page.map((p) => ({
    ...p,
    viewerReaction: reactionMap.get(p.id) ?? null,
  }));

  return { items, nextCursor, hasMore };
}

export async function fetchUserPostsPage(options: {
  profileUserId: string;
  viewerId: string;
  cursor?: string | null;
  limit?: number;
}) {
  const limit = Math.min(options.limit ?? 10, 30);
  const isOwn = options.profileUserId === options.viewerId;
  let followsAuthor = isOwn;
  if (!isOwn) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: options.viewerId,
          followingId: options.profileUserId,
        },
      },
    });
    followsAuthor = !!follow;
  }

  const visibilityFilter: Prisma.PostWhereInput = isOwn
    ? {}
    : followsAuthor
      ? { visibility: { in: ['PUBLIC', 'FOLLOWERS'] } }
      : { visibility: 'PUBLIC' };

  const posts = await prisma.post.findMany({
    where: {
      authorId: options.profileUserId,
      deletedAt: null,
      ...visibilityFilter,
      ...(options.cursor ? { createdAt: { lt: new Date(options.cursor) } } : {}),
    },
    include: postCardInclude,
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
  });

  const hasMore = posts.length > limit;
  const page = hasMore ? posts.slice(0, limit) : posts;
  const nextCursor = hasMore ? page[page.length - 1]?.createdAt.toISOString() : null;

  const postIds = page.map((p) => p.id);
  const myReactions = postIds.length
    ? await prisma.reaction.findMany({
        where: { userId: options.viewerId, postId: { in: postIds } },
        select: { postId: true, type: true },
      })
    : [];
  const reactionMap = new Map(myReactions.map((r) => [r.postId, r.type]));

  const items: PostCardRecord[] = page.map((p) => ({
    ...p,
    viewerReaction: reactionMap.get(p.id) ?? null,
  }));

  return { items, nextCursor, hasMore };
}

export async function getPostForViewer(postId: string, viewerId: string) {
  const post = await prisma.post.findFirst({
    where: { id: postId, deletedAt: null },
    include: postCardInclude,
  });
  if (!post) return null;

  if (post.authorId !== viewerId) {
    if (post.visibility === 'PRIVATE') return null;
    if (post.visibility === 'FOLLOWERS') {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: { followerId: viewerId, followingId: post.authorId },
        },
      });
      if (!follow) return null;
    }
  }

  const reaction = await prisma.reaction.findUnique({
    where: { postId_userId: { postId, userId: viewerId } },
  });

  return {
    ...post,
    viewerReaction: reaction?.type ?? null,
  } satisfies PostCardRecord;
}
