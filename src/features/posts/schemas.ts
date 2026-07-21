import { z } from 'zod';

export const postVisibilitySchema = z.enum(['PUBLIC', 'FOLLOWERS', 'PRIVATE']);

export const createPostSchema = z
  .object({
    content: z.string().trim().max(2000, 'A publicação pode ter no máximo 2000 caracteres.'),
    visibility: postVisibilitySchema.default('PUBLIC'),
    mediaUrls: z.array(z.string().min(1)).max(4).optional().default([]),
  })
  .refine((data) => data.content.length > 0 || (data.mediaUrls?.length ?? 0) > 0, {
    message: 'Escreva algo ou adicione uma imagem.',
    path: ['content'],
  });

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const updatePostSchema = z
  .object({
    content: z.string().trim().max(2000, 'A publicação pode ter no máximo 2000 caracteres.'),
    visibility: postVisibilitySchema.optional(),
  })
  .refine((data) => data.content.length > 0, {
    message: 'O conteúdo não pode ficar vazio.',
    path: ['content'],
  });

export type UpdatePostInput = z.infer<typeof updatePostSchema>;

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Escreva um comentário.')
    .max(1000, 'O comentário pode ter no máximo 1000 caracteres.'),
});

export type CommentInput = z.infer<typeof commentSchema>;

export const reactionTypeSchema = z.enum([
  'LIKE',
  'LOVE',
  'CELEBRATE',
  'SUPPORT',
  'LAUGH',
  'WOW',
  'SAD',
]);

export type ReactionTypeInput = z.infer<typeof reactionTypeSchema>;
