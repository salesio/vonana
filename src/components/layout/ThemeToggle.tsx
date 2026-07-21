'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';

const options = [
  { value: 'light', icon: Sun, label: 'Claro' },
  { value: 'dark', icon: Moon, label: 'Escuro' },
  { value: 'system', icon: Monitor, label: 'Sistema' },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-navy-50 p-0.5 dark:border-navy-500">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          aria-label={opt.label}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-full transition-colors',
            theme === opt.value
              ? 'bg-electric text-white'
              : 'text-navy-300 hover:bg-navy-50 dark:hover:bg-navy-600',
          )}
        >
          <opt.icon size={14} />
        </button>
      ))}
    </div>
  );
}
