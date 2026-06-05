import { Boxes } from 'lucide-react';

import { cn } from '@/lib/utils';

export function BrandLogo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 text-[rgb(var(--brand-blue))]', className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgb(var(--brand-violet))_0%,rgb(var(--brand-magenta))_58%,rgb(var(--brand-teal))_100%)] text-white shadow-lg shadow-[rgba(88,22,125,0.22)]">
        <Boxes className="h-5 w-5" />
      </div>
      <div>
        <p className="font-display text-xs font-semibold uppercase tracking-normal text-[rgb(var(--brand-plum))]">
          Aggrandize
        </p>
        <p className="font-display text-sm font-semibold text-[rgb(var(--brand-blue))]">Planner</p>
      </div>
    </div>
  );
}
