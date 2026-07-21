import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { TopBar } from '@/components/layout/TopBar';
import { RightSidebar } from '@/components/layout/RightSidebar';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/entrar');
  }

  return (
    <div className="flex min-h-screen bg-offwhite dark:bg-navy-700">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar
          user={{
            name: session.user.name ?? session.user.username,
            username: session.user.username,
            avatarUrl: session.user.avatarUrl,
          }}
        />
        <div className="flex flex-1">
          <main className="w-full flex-1 px-4 pb-24 pt-6 lg:px-8 lg:pb-8">
            <div className="mx-auto max-w-2xl xl:mx-0 xl:max-w-none">{children}</div>
          </main>
          <RightSidebar />
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
