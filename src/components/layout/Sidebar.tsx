'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { primaryNav } from '@/config/routes';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-navy-50 bg-white px-4 py-6 dark:border-navy-600 dark:bg-navy-700 lg:flex">
      <Logo className="mb-8 px-2" />
      <nav className="flex flex-1 flex-col gap-1">
        {primaryNav.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.implemented ? item.href : `${item.href}?em-breve=1`}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-electric/10 text-electric'
                  : 'text-navy-400 hover:bg-navy-50 dark:text-navy-100 dark:hover:bg-navy-600',
              )}
            >
              <Icon size={19} />
              {item.label}
              {!item.implemented && (
                <span className="ml-auto rounded-full bg-orange/10 px-2 py-0.5 text-[10px] font-semibold text-orange-dark">
                  em breve
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
