'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, LoaderCircle, TriangleAlert } from 'lucide-react';

import { AppShell } from '@/components/app-shell';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { verifyMagicLink } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      setStatus('error');
      setMessage('Token não encontrado na URL.');
      return;
    }
    verifyMagicLink(token)
      .then((data) => {
        if (data?.access_token) {
          setStatus('ok');
          setTimeout(() => router.push('/dashboard'), 1000);
        } else {
          setStatus('error');
          setMessage('Resposta inválida do servidor.');
        }
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Falha ao verificar o link.');
      });
  }, [hasHydrated, token, router]);

  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="p-8 text-center">
      {status === 'loading' && (
        <>
          <LoaderCircle className="mx-auto mb-4 h-10 w-10 animate-spin text-[rgb(var(--brand-blue))]" />
          <h1 className="font-display mb-2 text-2xl font-bold text-[rgb(var(--brand-blue))]">Verificando link de acesso...</h1>
          <p className="text-slate-600">Estamos preparando sua sessão local.</p>
        </>
      )}
      {status === 'ok' && (
        <>
          <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-[rgb(var(--brand-teal))]" />
          <h1 className="font-display mb-2 text-2xl font-bold text-[rgb(var(--brand-teal))]">Login concluído</h1>
          <p className="text-slate-600">Redirecionando para o dashboard da Aggrandize...</p>
        </>
      )}
      {status === 'error' && (
        <>
          <TriangleAlert className="mx-auto mb-4 h-10 w-10 text-[rgb(var(--brand-magenta))]" />
          <h1 className="font-display mb-2 text-2xl font-bold text-[rgb(var(--brand-magenta))]">Não foi possível entrar</h1>
          <p className="mb-6 text-slate-600">{message}</p>
          <Link href="/login" className={cn(buttonVariants({ variant: 'default' }))}>
            Tentar novamente
          </Link>
        </>
      )}
      </CardContent>
    </Card>
  );
}

export default function VerifyAuthPage() {
  return (
    <AppShell active="login">
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <Suspense fallback={<div className="text-slate-600">Carregando...</div>}>
          <VerifyContent />
        </Suspense>
      </div>
    </AppShell>
  );
}
