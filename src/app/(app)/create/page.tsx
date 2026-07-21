import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PostComposer } from '@/components/social/PostComposer';

export default async function CreatePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-navy dark:text-offwhite">Criar publicação</h1>
        <p className="text-sm text-navy-300">Partilhe texto e imagens com a rede VONANA.</p>
      </div>
      <PostComposer
        compact={false}
        defaultOpen
        user={{
          name: session.user.name ?? session.user.username,
          avatarUrl: session.user.avatarUrl,
        }}
      />
    </div>
  );
}
