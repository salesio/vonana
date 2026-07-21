import { prisma } from '@/lib/prisma';

export async function getUserSocialStats(userId: string) {
  const [posts, followers, following] = await Promise.all([
    prisma.post.count({ where: { authorId: userId, deletedAt: null } }),
    prisma.follow.count({ where: { followingId: userId } }),
    prisma.follow.count({ where: { followerId: userId } }),
  ]);
  return { posts, followers, following };
}

export async function isFollowing(followerId: string, followingId: string) {
  if (followerId === followingId) return false;
  const row = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId, followingId },
    },
    select: { id: true },
  });
  return !!row;
}

export async function listFollowers(userId: string, viewerId: string) {
  const rows = await prisma.follow.findMany({
    where: { followingId: userId },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      follower: {
        select: {
          id: true,
          username: true,
          fullName: true,
          displayName: true,
          avatarUrl: true,
          city: true,
          province: true,
        },
      },
    },
  });

  const ids = rows.map((r) => r.follower.id);
  const myFollows = await prisma.follow.findMany({
    where: { followerId: viewerId, followingId: { in: ids } },
    select: { followingId: true },
  });
  const followingSet = new Set(myFollows.map((f) => f.followingId));

  return rows.map((r) => ({
    ...r.follower,
    isFollowing: followingSet.has(r.follower.id),
    isSelf: r.follower.id === viewerId,
  }));
}

export async function listFollowing(userId: string, viewerId: string) {
  const rows = await prisma.follow.findMany({
    where: { followerId: userId },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      following: {
        select: {
          id: true,
          username: true,
          fullName: true,
          displayName: true,
          avatarUrl: true,
          city: true,
          province: true,
        },
      },
    },
  });

  const ids = rows.map((r) => r.following.id);
  const myFollows = await prisma.follow.findMany({
    where: { followerId: viewerId, followingId: { in: ids } },
    select: { followingId: true },
  });
  const followingSet = new Set(myFollows.map((f) => f.followingId));

  return rows.map((r) => ({
    ...r.following,
    isFollowing: followingSet.has(r.following.id),
    isSelf: r.following.id === viewerId,
  }));
}
