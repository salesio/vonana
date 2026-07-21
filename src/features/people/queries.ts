import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export type PeopleCard = {
  id: string;
  username: string;
  fullName: string;
  displayName: string | null;
  avatarUrl: string | null;
  city: string | null;
  province: string | null;
  isFollowing: boolean;
  isSelf: boolean;
};

export async function searchPeople(options: {
  viewerId: string;
  query?: string;
  limit?: number;
}): Promise<PeopleCard[]> {
  const limit = Math.min(options.limit ?? 24, 50);
  const q = options.query?.trim();

  const where: Prisma.UserWhereInput = {
    accountStatus: 'ACTIVE',
    id: { not: options.viewerId },
    ...(q
      ? {
          OR: [
            { username: { contains: q, mode: 'insensitive' } },
            { fullName: { contains: q, mode: 'insensitive' } },
            { displayName: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const users = await prisma.user.findMany({
    where,
    take: limit,
    orderBy: [{ fullName: 'asc' }],
    select: {
      id: true,
      username: true,
      fullName: true,
      displayName: true,
      avatarUrl: true,
      city: true,
      province: true,
    },
  });

  const follows = await prisma.follow.findMany({
    where: {
      followerId: options.viewerId,
      followingId: { in: users.map((u) => u.id) },
    },
    select: { followingId: true },
  });
  const followingSet = new Set(follows.map((f) => f.followingId));

  return users.map((u) => ({
    ...u,
    isFollowing: followingSet.has(u.id),
    isSelf: false,
  }));
}

/** Simple suggestions: active users not yet followed, newest first. */
export async function suggestPeople(viewerId: string, limit = 8): Promise<PeopleCard[]> {
  const following = await prisma.follow.findMany({
    where: { followerId: viewerId },
    select: { followingId: true },
  });
  const exclude = new Set(following.map((f) => f.followingId));
  exclude.add(viewerId);

  const users = await prisma.user.findMany({
    where: {
      accountStatus: 'ACTIVE',
      id: { notIn: Array.from(exclude) },
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      username: true,
      fullName: true,
      displayName: true,
      avatarUrl: true,
      city: true,
      province: true,
    },
  });

  return users.map((u) => ({
    ...u,
    isFollowing: false,
    isSelf: false,
  }));
}
