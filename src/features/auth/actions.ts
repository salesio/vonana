'use server';

import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/hash';
import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type RegisterInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from '@/features/auth/schemas';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export type RegisterResult =
  | { success: true }
  | { success: false; error: string; field?: 'email' | 'username' };

export async function registerUser(input: RegisterInput): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Dados inválidos. Verifique o formulário.' };
  }

  const { fullName, username, email, password } = parsed.data;

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return { success: false, error: 'Este email já está registado.', field: 'email' };
  }

  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) {
    return { success: false, error: 'Este username já está em uso.', field: 'username' };
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.create({
    data: {
      fullName,
      username,
      email,
      passwordHash,
      displayName: fullName.split(' ')[0],
    },
  });

  return { success: true };
}

export type ForgotPasswordResult = { success: true };

/**
 * Requests a password reset. Always returns success regardless of whether
 * the email exists, to avoid leaking which emails are registered.
 *
 * NOTE (Milestone 1 architecture placeholder): this creates a reset token
 * in the database but does not yet dispatch an email — outbound email
 * delivery (e.g. via a transactional email provider) is wired up in a
 * later milestone. In development, the generated link is logged to the
 * server console so the flow can be tested end-to-end.
 */
export async function requestPasswordReset(input: ForgotPasswordInput): Promise<ForgotPasswordResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return { success: true };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return { success: true };

  const token = crypto.randomBytes(32).toString('hex');
  await prisma.passwordResetToken.create({
    data: {
      email: user.email,
      token,
      expires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/redefinir-password?token=${token}`;
  // eslint-disable-next-line no-console
  console.log(`[VONANA] Link de redefinição de palavra-passe para ${user.email}: ${resetUrl}`);

  return { success: true };
}

export type ResetPasswordResult = { success: true } | { success: false; error: string };

export async function resetPassword(
  token: string,
  input: ResetPasswordInput,
): Promise<ResetPasswordResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Dados inválidos. Verifique o formulário.' };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!resetToken || resetToken.expires < new Date()) {
    return { success: false, error: 'Este link expirou ou é inválido. Solicite um novo.' };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.user.update({
    where: { email: resetToken.email },
    data: { passwordHash },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return { success: true };
}
