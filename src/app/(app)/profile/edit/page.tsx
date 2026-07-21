import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EditProfileForm } from './EditProfileForm';

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return null;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-navy dark:text-offwhite">Editar perfil</h1>
        <p className="text-sm text-navy-300">Actualize as suas informações públicas.</p>
      </div>
      <EditProfileForm
        user={{
          fullName: user.fullName,
          displayName: user.displayName ?? '',
          username: user.username,
          bio: user.bio ?? '',
          province: user.province ?? undefined,
          city: user.city ?? '',
          avatarUrl: user.avatarUrl,
        }}
      />
    </div>
  );
}
