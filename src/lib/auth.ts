import { PrismaAdapter } from '@auth/prisma-adapter';
import type { AuthOptions } from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/hash';

export const authOptions: AuthOptions = {
  // Cast required: @auth/prisma-adapter types target Auth.js v5, while this
  // project uses NextAuth v4. Runtime behaviour is compatible for JWT + credentials.
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/entrar',
    error: '/entrar',
  },
  providers: [
    CredentialsProvider({
      name: 'Credenciais',
      credentials: {
        identifier: { label: 'Email ou username', type: 'text' },
        password: { label: 'Palavra-passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: credentials.identifier }, { username: credentials.identifier }],
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        if (user.accountStatus !== 'ACTIVE') {
          throw new Error('CONTA_INATIVA');
        }

        const isValid = await verifyPassword(credentials.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          username: user.username,
          role: user.role,
          avatarUrl: user.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.avatarUrl = user.avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? '';
        session.user.username = token.username ?? '';
        session.user.role = token.role ?? 'USER';
        session.user.avatarUrl = token.avatarUrl ?? null;
      }
      return session;
    },
  },
};
