import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background',
  {
    variants: {
      variant: {
        default:
          'bg-[rgb(var(--brand-violet))] text-white hover:bg-[rgb(var(--brand-plum))] focus-visible:ring-[rgba(var(--brand-magenta),0.35)]',
        secondary:
          'bg-[rgb(var(--brand-blue))] text-white hover:bg-[rgb(var(--brand-sky))] focus-visible:ring-[rgba(var(--brand-blue),0.28)]',
        outline:
          'border border-[rgba(var(--brand-violet),0.2)] bg-white text-[rgb(var(--brand-violet))] hover:bg-[rgba(var(--brand-violet),0.05)] focus-visible:ring-[rgba(var(--brand-violet),0.18)]',
        ghost:
          'text-[rgb(var(--brand-blue))] hover:bg-[rgba(var(--brand-blue),0.08)] focus-visible:ring-[rgba(var(--brand-blue),0.18)]',
      },
      size: {
        default: 'h-11 px-4 py-2',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-12 rounded-xl px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
