'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', href, children, ...props }, ref) => {
    const baseStyles = 'inline-flex relative items-center justify-center font-bold tracking-widest uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 overflow-hidden';
    
    const variants = {
      primary: 'bg-[var(--primary)] text-white hover:shadow-lg hover:shadow-[var(--primary)]/20 hover:brightness-110 border border-transparent',
      secondary: 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--ghost-hover)]',
      ghost: 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--ghost-hover)]',
      danger: 'bg-[var(--danger)] text-white hover:shadow-lg hover:shadow-[var(--danger)]/20 hover:brightness-110 border border-transparent',
    };

    const sizes = {
      sm: 'px-4 py-2 text-[10px] rounded-lg',
      md: 'px-6 py-3 text-xs rounded-xl',
      lg: 'px-8 py-4 text-sm rounded-2xl',
    };

    const MotionComponent = motion.button;
    
    const renderContent = (
      <MotionComponent
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...(props as any)}
      >
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />
        )}
        <span className="relative z-10 flex items-center">{children}</span>
      </MotionComponent>
    );

    if (href) {
      return (
        <Link href={href} passHref legacyBehavior>
          {renderContent}
        </Link>
      );
    }

    return renderContent;
  }
);
Button.displayName = 'Button';
