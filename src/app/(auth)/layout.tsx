import Link from 'next/link';
import { brand } from '@/config/brand';
import { Logo } from '@/components/layout/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-offwhite dark:bg-navy-700">
      <header className="px-6 py-6">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="px-6 pb-6 text-center text-xs text-navy-300">
        <Link href="/">&larr; Voltar para {brand.name}</Link>
      </footer>
    </div>
  );
}
