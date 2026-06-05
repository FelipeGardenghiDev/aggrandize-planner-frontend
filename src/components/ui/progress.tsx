import { cn } from '@/lib/utils';

export function Progress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-[rgba(var(--brand-blue),0.10)]', className)}>
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,rgb(var(--brand-violet))_0%,rgb(var(--brand-magenta))_50%,rgb(var(--brand-teal))_100%)] transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
