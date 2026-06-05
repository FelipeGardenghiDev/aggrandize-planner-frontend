'use client';

import Link from 'next/link';
import { LayoutDashboard, LogIn, RefreshCcw } from 'lucide-react';

import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

export function AppShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: 'dashboard' | 'login';
}) {
  const session = useAppStore((state) => state.session);
  const signOut = useAppStore((state) => state.signOut);
  const resetDemo = useAppStore((state) => state.resetDemo);

  return (
    <div className="brand-shell-bg min-h-screen">
      <header className="border-b border-[rgba(var(--brand-blue),0.08)] bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/">
            <BrandLogo />
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/dashboard"
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium text-[rgb(var(--brand-blue))] transition hover:bg-[rgba(var(--brand-blue),0.08)] hover:text-[rgb(var(--brand-violet))]',
                active === 'dashboard' &&
                  'bg-[rgb(var(--brand-violet))] text-white hover:bg-[rgb(var(--brand-plum))] hover:text-white'
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium text-[rgb(var(--brand-blue))] transition hover:bg-[rgba(var(--brand-blue),0.08)] hover:text-[rgb(var(--brand-violet))]',
                active === 'login' &&
                  'bg-[rgb(var(--brand-violet))] text-white hover:bg-[rgb(var(--brand-plum))] hover:text-white'
              )}
            >
              Login
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={resetDemo} className="hidden sm:inline-flex">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reiniciar demo
            </Button>
            {session ? (
              <div className="hidden rounded-full border border-[rgba(var(--brand-blue),0.12)] bg-white px-4 py-2 text-sm text-slate-600 lg:block">
                <span className="font-medium text-[rgb(var(--brand-blue))]">{session.name}</span> · {session.role}
              </div>
            ) : (
              <div className="hidden rounded-full border border-dashed border-[rgba(var(--brand-plum),0.28)] px-4 py-2 text-sm text-[rgb(var(--brand-plum))] lg:block">
                Preview visitante
              </div>
            )}
            {session && (
              <Button variant="outline" size="sm" onClick={signOut}>
                Sair
              </Button>
            )}
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 overflow-x-auto border-t border-[rgba(var(--brand-blue),0.08)] px-4 py-3 md:hidden sm:px-6">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className={cn(
                'inline-flex items-center rounded-full border px-3 py-2 text-sm font-medium text-[rgb(var(--brand-blue))] transition',
                active === 'dashboard'
                  ? 'border-[rgb(var(--brand-violet))] bg-[rgb(var(--brand-violet))] text-white'
                  : 'border-[rgba(var(--brand-blue),0.14)] bg-white'
              )}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/login"
              className={cn(
                'inline-flex items-center rounded-full border px-3 py-2 text-sm font-medium text-[rgb(var(--brand-blue))] transition',
                active === 'login'
                  ? 'border-[rgb(var(--brand-violet))] bg-[rgb(var(--brand-violet))] text-white'
                  : 'border-[rgba(var(--brand-blue),0.14)] bg-white'
              )}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Link>
          </div>
          <Button variant="ghost" size="sm" onClick={resetDemo}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 pb-4 md:hidden sm:px-6">
          {session ? (
            <Badge variant="info" className="max-w-full truncate">
              {session.name} · {session.role}
            </Badge>
          ) : (
            <Badge>Preview visitante</Badge>
          )}
          {session && (
            <Button variant="outline" size="sm" onClick={signOut}>
              Sair
            </Button>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
