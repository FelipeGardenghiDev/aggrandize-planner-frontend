'use client';

import { useState } from 'react';
import Link from 'next/link';
import { requestMagicLink } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await requestMagicLink(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar link');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Verifique seu e-mail</h1>
          <p className="text-slate-600 mb-6">
            Enviamos um link de acesso para <strong>{email}</strong>. Clique no link para entrar.
          </p>
          <Link href="/" className="text-indigo-600 hover:underline">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Entrar</h1>
        <p className="text-slate-600 mb-6">
          Autenticação via Magic Link. Informe seu e-mail para receber o link de acesso.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="seu@email.com"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading ? 'Enviando…' : 'Enviar link de acesso'}
          </button>
        </form>
        <p className="mt-6 text-center">
          <Link href="/" className="text-indigo-600 hover:underline text-sm">
            Voltar ao início
          </Link>
        </p>
      </div>
    </div>
  );
}
