'use client';

import { Bell, MessageCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';
import { signOut } from 'next-auth/react';

interface TopBarProps {
  user: { name: string; username: string; avatarUrl: string | null };
}

export function TopBar({ user }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-navy-50 bg-white/90 px-4 backdrop-blur dark:border-navy-600 dark:bg-navy-700/90 lg:px-6">
      <div className="lg:hidden">
        <Logo />
      </div>

      <div className="relative hidden flex-1 max-w-md items-center md:flex">
        <Search size={16} className="absolute left-3 text-navy-300" />
        <input
          placeholder="Pesquisar em VONANA..."
          className="h-10 w-full rounded-xl border border-navy-50 bg-navy-50/40 pl-9 pr-4 text-sm text-navy placeholder:text-navy-300 focus:border-electric focus:outline-none focus:ring-2 focus:ring-electric/20 dark:border-navy-500 dark:bg-navy-600 dark:text-offwhite"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="/notifications?em-breve=1"
          className="flex h-10 w-10 items-center justify-center rounded-full text-navy-400 hover:bg-navy-50 dark:text-navy-100 dark:hover:bg-navy-600"
          aria-label="Notificações"
        >
          <Bell size={19} />
        </Link>
        <Link
          href="/messages?em-breve=1"
          className="flex h-10 w-10 items-center justify-center rounded-full text-navy-400 hover:bg-navy-50 dark:text-navy-100 dark:hover:bg-navy-600"
          aria-label="Mensagens"
        >
          <MessageCircle size={19} />
        </Link>

        <Dropdown
          trigger={
            <button className="ml-1 cursor-pointer">
              <Avatar src={user.avatarUrl} name={user.name} size="sm" />
            </button>
          }
        >
          <div className="px-3 py-2">
            <p className="text-sm font-semibold text-navy dark:text-offwhite">{user.name}</p>
            <p className="text-xs text-navy-300">@{user.username}</p>
          </div>
          <DropdownItem onClick={() => (window.location.href = '/profile')}>
            Ver perfil
          </DropdownItem>
          <DropdownItem onClick={() => (window.location.href = '/profile/edit')}>
            Editar perfil
          </DropdownItem>
          <DropdownItem onClick={() => signOut({ callbackUrl: '/' })} className="text-red-600">
            Terminar sessão
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
