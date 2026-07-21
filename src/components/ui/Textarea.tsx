import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const areaId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={areaId} className="text-sm font-medium text-navy dark:text-offwhite">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          className={cn(
            'min-h-[100px] rounded-xl border border-navy-100 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy-300',
            'focus:border-electric focus:outline-none focus:ring-2 focus:ring-electric/20',
            'dark:border-navy-500 dark:bg-navy-600 dark:text-offwhite dark:placeholder:text-navy-300',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
            className,
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
