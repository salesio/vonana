import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function requireSessionUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('UNAUTHORIZED');
  }
  return session.user;
}

export async function getOptionalSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}
