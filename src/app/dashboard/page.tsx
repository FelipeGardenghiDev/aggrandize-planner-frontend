'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listProjects, type Project } from '@/lib/api';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [mode, setMode] = useState<'loading' | 'live' | 'demo'>('loading');
  const [notice, setNotice] = useState<string>('');

  const demoProjects: Project[] = [
    {
      id: 'demo-1',
      name: 'Demo: MVP Aggrandize Planner',
      description:
        'Projeto de exemplo para explorar a UI sem autenticação/configuração de e-mail.',
      expected_end_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-2',
      name: 'Demo: Lançamento do Frontend',
      description:
        'Exemplo com foco em tarefas, dependências e cronograma (dados fictícios).',
      expected_end_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  useEffect(() => {
    let cancelled = false;
    listProjects()
      .then((data) => {
        if (cancelled) return;
        setProjects(Array.isArray(data) ? data : []);
        setMode('live');
      })
      .catch((err) => {
        if (cancelled) return;
        setProjects(demoProjects);
        setMode('demo');
        setNotice(
          err instanceof Error
            ? `Mostrando dados de demonstração (backend respondeu com erro: ${err.message}).`
            : 'Mostrando dados de demonstração (não foi possível conectar ao backend).'
        );
      })
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-slate-900">
            🎼 Aggrandize Planner
          </Link>
          <nav className="flex gap-4">
            <Link href="/dashboard" className="text-indigo-600 font-medium">
              Dashboard
            </Link>
            <Link href="/login" className="text-slate-600 hover:text-slate-900">
              Entrar
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Projetos</h1>
          <div className="flex items-center gap-3">
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Swagger (/docs)
            </a>
            <Link
              href="/login"
              className="text-sm px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Fazer login
            </Link>
          </div>
        </div>

        {mode === 'loading' && (
          <p className="text-slate-500">Carregando projetos…</p>
        )}

        {mode === 'demo' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-900 mb-6">
            <p className="font-medium">Modo demonstração (sem token).</p>
            <p className="text-sm mt-1">{notice}</p>
            <p className="text-sm mt-2">
              Para ver dados reais, faça login (Magic Link) e depois atualize a página.
            </p>
          </div>
        )}

        {mode !== 'loading' && projects.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-600">
            Nenhum projeto encontrado.
          </div>
        )}

        {mode !== 'loading' && projects.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => {
              const isDemo = mode === 'demo' && p.id.startsWith('demo-');

              const CardInner = (
                <div className="block bg-white rounded-xl border border-slate-200 p-6 hover:border-indigo-300 hover:shadow-md transition">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-semibold text-slate-900">{p.name}</h2>
                    {isDemo && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        Demo
                      </span>
                    )}
                  </div>
                  {p.description && (
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{p.description}</p>
                  )}
                  {p.expected_end_date && (
                    <p className="text-xs text-slate-500 mt-2">
                      Previsão: {new Date(p.expected_end_date).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                  {isDemo && (
                    <p className="text-xs text-slate-500 mt-3">
                      Faça login para abrir detalhes.
                    </p>
                  )}
                </div>
              );

              return (
                <li key={p.id}>
                  {isDemo ? (
                    CardInner
                  ) : (
                    <Link href={`/projects/${p.id}`} className="block">
                      {CardInner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
