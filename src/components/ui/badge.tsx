import type * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-[rgba(var(--brand-violet),0.18)] bg-[rgba(var(--brand-violet),0.06)] text-[rgb(var(--brand-violet))]',
        success: 'border-[rgba(var(--brand-teal),0.25)] bg-[rgba(var(--brand-teal),0.10)] text-[rgb(var(--brand-teal))]',
        warning: 'border-[rgba(var(--brand-plum),0.25)] bg-[rgba(var(--brand-plum),0.09)] text-[rgb(var(--brand-plum))]',
        danger: 'border-[rgba(var(--brand-magenta),0.24)] bg-[rgba(var(--brand-magenta),0.08)] text-[rgb(var(--brand-magenta))]',
        info: 'border-[rgba(var(--brand-blue),0.22)] bg-[rgba(var(--brand-blue),0.08)] text-[rgb(var(--brand-blue))]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
