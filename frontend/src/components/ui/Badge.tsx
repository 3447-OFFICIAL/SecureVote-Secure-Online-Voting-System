import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'success' | 'danger' | 'neutral';
  icon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'neutral', icon, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-[var(--primary)] text-white border-transparent',
      success: 'bg-[var(--success)] text-white border-transparent',
      danger: 'bg-[var(--danger)] text-white border-transparent',
      neutral: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border)]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm backdrop-blur-md',
          variants[variant],
          className
        )}
        {...props}
      >
        {icon && <span className="opacity-80 shrink-0">{icon}</span>}
        <span>{children}</span>
      </div>
    );
  }
);
Badge.displayName = 'Badge';
