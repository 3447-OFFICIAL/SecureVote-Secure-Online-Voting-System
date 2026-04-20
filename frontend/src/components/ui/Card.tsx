'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLMotionProps<'div'> {
  glass?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={{ y: -5 }}
        className={cn(
          'relative overflow-hidden rounded-[2rem] p-8 border border-[var(--border)] transition-colors duration-500 group will-change-transform',
          glass ? 'bg-[var(--bg-glass)] backdrop-blur-xl' : 'bg-[var(--bg-primary)]',
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
        <div className="relative z-10">{(children as React.ReactNode)}</div>
      </motion.div>
    );
  }
);
Card.displayName = 'Card';
