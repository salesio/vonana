import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'electric' | 'turquoise' | 'orange' | 'outline';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  default: 'bg-navy-50 text-navy dark:bg-navy-600 dark:text-offwhite',
  electric: 'bg-electric/10 text-electric-dark',
  turquoise: 'bg-turquoise/10 text-turquoise-dark',
  orange: 'bg-orange/10 text-orange-dark',
  outline: 'border border-navy-100 text-navy dark:border-navy-400 dark:text-offwhite',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
