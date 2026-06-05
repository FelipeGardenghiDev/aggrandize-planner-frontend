'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { verifyMagicLink } from '@/lib/api';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token não encontrado na URL.');
      return;
    }
    verifyMagicLink(token)
      .then((data) => {
        if (data?.access_token && typeof window !== 'undefined') {
          localStorage.setItem('aggrandize_token', data.access_token);
          setStatus('ok');
          setTimeout(() => router.push('/dashboard'), 1500);
        } else {
          setStatus('error');
          setMessage('Resposta inválida do servidor.');
        }
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Falha ao verificar o link.');
      });
  }, [token, router]);

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
      {status === 'loading' && (
        <>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Verificando…</h1>
          <p className="text-slate-600">Aguarde.</p>
        </>
      )}
      {status === 'ok' && (
        <>
          <h1 className="text-2xl font-bold text-emerald-700 mb-2">Login realizado</h1>
          <p className="text-slate-600">Redirecionando para o dashboard…</p>
        </>
      )}
      {status === 'error' && (
        <>
          <h1 className="text-2xl font-bold text-red-700 mb-2">Erro ao entrar</h1>
          <p className="text-slate-600 mb-6">{message}</p>
          <Link
            href="/login"
            className="inline-block px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
          >
            Tentar novamente
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyAuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Suspense fallback={<div className="text-slate-600">Carregando…</div>}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
