'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mobileNav } from '@/config/routes';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-navy-50 bg-white/95 py-2 backdrop-blur dark:border-navy-600 dark:bg-navy-700/95 lg:hidden">
      {mobileNav.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.implemented ? item.href : `${item.href}?em-breve=1`}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium',
              active ? 'text-electric' : 'text-navy-300',
            )}
          >
            <Icon size={22} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
