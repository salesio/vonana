/**
 * Integration tests against the local development database.
 * Requires: PostgreSQL running + migrations applied + seed recommended.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { canViewPost } from '@/lib/posts-visibility';

const prisma = new PrismaClient();

const suffix = Date.now().toString(36);

describe('social core integration', () => {
  let userA: { id: string };
  let userB: { id: string };
  let postPublic: { id: string; authorId: string };
  let postPrivate: { id: string; authorId: string };
  let postFollowers: { id: string; authorId: string };

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash('Teste1234', 10);
    userA = await prisma.user.create({
      data: {
        email: `a_${suffix}@test.local`,
        username: `a_${suffix}`,
        fullName: 'User A',
        passwordHash,
        accountStatus: 'ACTIVE',
      },
    });
    userB = await prisma.user.create({
      data: {
        email: `b_${suffix}@test.local`,
        username: `b_${suffix}`,
        fullName: 'User B',
        passwordHash,
        accountStatus: 'ACTIVE',
      },
    });

    postPublic = await prisma.post.create({
      data: {
        authorId: userB.id,
        ownerId: userB.id,
        content: 'Public post',
        visibility: 'PUBLIC',
      },
    });
    postPrivate = await prisma.post.create({
      data: {
        authorId: userB.id,
        ownerId: userB.id,
        content: 'Private post',
        visibility: 'PRIVATE',
      },
    });
    postFollowers = await prisma.post.create({
      data: {
        authorId: userB.id,
        ownerId: userB.id,
        content: 'Followers post',
        visibility: 'FOLLOWERS',
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { id: { in: [userA.id, userB.id] } },
    });
    await prisma.$disconnect();
  });

  it('creates unique follow relationships', async () => {
    await prisma.follow.create({
      data: { followerId: userA.id, followingId: userB.id },
    });
    await expect(
      prisma.follow.create({
        data: { followerId: userA.id, followingId: userB.id },
      }),
    ).rejects.toThrow();
  });

  it('enforces visibility rules', async () => {
    const follows = true;
    expect(canViewPost({ ...postPublic, visibility: 'PUBLIC' }, userA.id, false)).toBe(true);
    expect(canViewPost({ ...postPrivate, visibility: 'PRIVATE' }, userA.id, follows)).toBe(false);
    expect(canViewPost({ ...postPrivate, visibility: 'PRIVATE' }, userB.id, false)).toBe(true);
    expect(canViewPost({ ...postFollowers, visibility: 'FOLLOWERS' }, userA.id, false)).toBe(
      false,
    );
    expect(canViewPost({ ...postFollowers, visibility: 'FOLLOWERS' }, userA.id, true)).toBe(true);
  });

  it('allows only one reaction per user per post', async () => {
    await prisma.reaction.create({
      data: { postId: postPublic.id, userId: userA.id, type: 'LIKE' },
    });
    await expect(
      prisma.reaction.create({
        data: { postId: postPublic.id, userId: userA.id, type: 'LOVE' },
      }),
    ).rejects.toThrow();

    await prisma.reaction.update({
      where: { postId_userId: { postId: postPublic.id, userId: userA.id } },
      data: { type: 'LOVE' },
    });
    const row = await prisma.reaction.findUnique({
      where: { postId_userId: { postId: postPublic.id, userId: userA.id } },
    });
    expect(row?.type).toBe('LOVE');
  });

  it('creates comments and soft-deletes', async () => {
    const comment = await prisma.comment.create({
      data: {
        postId: postPublic.id,
        authorId: userA.id,
        content: 'Olá Beira!',
      },
    });
    await prisma.comment.update({
      where: { id: comment.id },
      data: { deletedAt: new Date() },
    });
    const active = await prisma.comment.count({
      where: { postId: postPublic.id, deletedAt: null },
    });
    expect(active).toBe(0);
  });

  it('soft-deletes posts and hides them', async () => {
    await prisma.post.update({
      where: { id: postPublic.id },
      data: { deletedAt: new Date() },
    });
    expect(
      canViewPost(
        { authorId: userB.id, visibility: 'PUBLIC', deletedAt: new Date() },
        userA.id,
        true,
      ),
    ).toBe(false);
  });

  it('creates notifications for social events', async () => {
    const n = await prisma.notification.create({
      data: {
        recipientId: userB.id,
        actorId: userA.id,
        type: 'NEW_FOLLOWER',
        entityType: 'user',
        entityId: userA.id,
      },
    });
    expect(n.readAt).toBeNull();
    await prisma.notification.update({
      where: { id: n.id },
      data: { readAt: new Date() },
    });
    const updated = await prisma.notification.findUnique({ where: { id: n.id } });
    expect(updated?.readAt).not.toBeNull();
  });
});
