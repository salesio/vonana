'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface UserSearchProps {
  initialQuery?: string;
  /** Compact style for TopBar */
  compact?: boolean;
  className?: string;
}

export function UserSearch({ initialQuery = '', compact = true, className }: UserSearchProps) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  useEffect(() => {
    setQ(initialQuery);
  }, [initialQuery]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = q.trim();
    if (!value) {
      router.push('/people');
      return;
    }
    router.push(`/people?q=${encodeURIComponent(value)}`);
  }

  return (
    <form onSubmit={submit} className={className ?? 'relative hidden flex-1 max-w-md items-center md:flex'}>
      <Search size={16} className="absolute left-3 text-navy-300" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={compact ? 'Pesquisar pessoas em VONANA...' : 'Pesquisar por nome ou username...'}
        className="h-10 w-full rounded-xl border border-navy-50 bg-navy-50/40 pl-9 pr-4 text-sm text-navy placeholder:text-navy-300 focus:border-electric focus:outline-none focus:ring-2 focus:ring-electric/20 dark:border-navy-500 dark:bg-navy-600 dark:text-offwhite"
        aria-label="Pesquisar pessoas"
      />
    </form>
  );
}
