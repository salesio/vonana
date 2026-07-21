import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-navy dark:text-offwhite">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-11 rounded-xl border border-navy-100 bg-white px-4 text-sm text-navy placeholder:text-navy-300',
            'focus:border-electric focus:outline-none focus:ring-2 focus:ring-electric/20',
            'dark:border-navy-500 dark:bg-navy-600 dark:text-offwhite dark:placeholder:text-navy-300',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
            className,
          )}
          aria-invalid={!!error}
          {...props}
        />
        {hint && !error && <p className="text-xs text-navy-300">{hint}</p>}
        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';
