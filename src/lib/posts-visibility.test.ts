import { describe, expect, it } from 'vitest';
import { canViewPost } from '@/lib/posts-visibility';

describe('canViewPost', () => {
  const authorId = 'author-1';
  const viewerId = 'viewer-1';

  it('hides deleted posts', () => {
    expect(
      canViewPost(
        { authorId, visibility: 'PUBLIC', deletedAt: new Date() },
        viewerId,
        false,
      ),
    ).toBe(false);
  });

  it('allows author to see private posts', () => {
    expect(
      canViewPost({ authorId, visibility: 'PRIVATE' }, authorId, false),
    ).toBe(true);
  });

  it('blocks non-author from private posts', () => {
    expect(
      canViewPost({ authorId, visibility: 'PRIVATE' }, viewerId, true),
    ).toBe(false);
  });

  it('allows followers for FOLLOWERS visibility', () => {
    expect(
      canViewPost({ authorId, visibility: 'FOLLOWERS' }, viewerId, true),
    ).toBe(true);
  });

  it('blocks non-followers for FOLLOWERS visibility', () => {
    expect(
      canViewPost({ authorId, visibility: 'FOLLOWERS' }, viewerId, false),
    ).toBe(false);
  });

  it('allows any logged-in user for PUBLIC', () => {
    expect(
      canViewPost({ authorId, visibility: 'PUBLIC' }, viewerId, false),
    ).toBe(true);
  });

  it('blocks anonymous viewers', () => {
    expect(
      canViewPost({ authorId, visibility: 'PUBLIC' }, null, false),
    ).toBe(false);
  });
});
