import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
      avatarUrl: string | null;
    } & DefaultSession['user'];
  }

  /**
   * Custom fields returned by the credentials provider.
   * Optional so AdapterUser (OAuth) remains assignable; credentials always set them.
   */
  interface User {
    username?: string;
    role?: string;
    avatarUrl?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    username?: string;
    role?: string;
    avatarUrl?: string | null;
  }
}
