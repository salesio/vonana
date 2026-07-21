export type PostCardData = {
  id: string;
  content: string;
  visibility: 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE';
  createdAt: string | Date;
  authorId: string;
  author: {
    id: string;
    username: string;
    fullName: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  media: { id: string; url: string; type: string; position: number }[];
  _count: { reactions: number; comments: number };
  viewerReaction: string | null;
};

export function serializePost(post: {
  id: string;
  content: string;
  visibility: 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE';
  createdAt: Date | string;
  authorId: string;
  author: PostCardData['author'];
  media: PostCardData['media'];
  _count: PostCardData['_count'];
  viewerReaction: string | null;
}): PostCardData {
  return {
    id: post.id,
    content: post.content,
    visibility: post.visibility,
    createdAt: typeof post.createdAt === 'string' ? post.createdAt : post.createdAt.toISOString(),
    authorId: post.authorId,
    author: post.author,
    media: post.media,
    _count: post._count,
    viewerReaction: post.viewerReaction,
  };
}
