import type { PostVisibility } from '@prisma/client';
import type { Prisma } from '@prisma/client';

/**
 * Server-side visibility rule for a post as seen by `viewerId`.
 * PUBLIC — any logged-in user
 * FOLLOWERS — author or followers of the author
 * PRIVATE — author only
 */
export function canViewPost(
  post: { authorId: string; visibility: PostVisibility; deletedAt?: Date | null },
  viewerId: string | null | undefined,
  viewerFollowsAuthor: boolean,
): boolean {
  if (post.deletedAt) return false;
  if (!viewerId) return false;
  if (post.authorId === viewerId) return true;

  switch (post.visibility) {
    case 'PUBLIC':
      return true;
    case 'FOLLOWERS':
      return viewerFollowsAuthor;
    case 'PRIVATE':
      return false;
    default:
      return false;
  }
}

/** Prisma where fragment: posts the viewer is allowed to see. */
export function visiblePostsWhere(
  viewerId: string,
  followingIds: string[],
): Prisma.PostWhereInput {
  return {
    deletedAt: null,
    OR: [
      { authorId: viewerId },
      { visibility: 'PUBLIC' },
      {
        visibility: 'FOLLOWERS',
        authorId: { in: followingIds },
      },
    ],
  };
}
