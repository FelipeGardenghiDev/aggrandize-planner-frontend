'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getProject,
  type Project,
  type Task,
  type Member,
} from '@/lib/api';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [project, setProject] = useState<(Project & { tasks?: Task[]; members?: Member[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getProject(id)
      .then((data) => {
        if (!cancelled) setProject(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar projeto');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (!id) return null;
  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando…</div>;
  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Projeto não encontrado'}</p>
          <Link href="/dashboard" className="text-indigo-600 hover:underline">Voltar ao Dashboard</Link>
        </div>
      </div>
    );
  }

  const tasks = project.tasks ?? [];
  const members = project.members ?? [];
  const statusColors: Record<string, string> = {
    todo: 'bg-slate-100 text-slate-700',
    doing: 'bg-amber-100 text-amber-800',
    done: 'bg-emerald-100 text-emerald-800',
    blocked: 'bg-red-100 text-red-800',
    cancelled: 'bg-slate-100 text-slate-500',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
            ← Dashboard
          </Link>
          <Link href="/" className="text-xl font-bold text-slate-900">
            🎼 Aggrandize Planner
          </Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{project.name}</h1>
        {project.description && (
          <p className="text-slate-600 mb-6">{project.description}</p>
        )}
        {project.expected_end_date && (
          <p className="text-sm text-slate-500 mb-6">
            Previsão de conclusão: {new Date(project.expected_end_date).toLocaleDateString('pt-BR')}
          </p>
        )}

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Tarefas</h2>
          {tasks.length === 0 ? (
            <p className="text-slate-500">Nenhuma tarefa no projeto.</p>
          ) : (
            <ul className="space-y-2">
              {tasks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between bg-white rounded-lg border border-slate-200 px-4 py-3"
                >
                  <div>
                    <span className="font-medium text-slate-900">{t.title}</span>
                    {t.difficulty != null && (
                      <span className="ml-2 text-xs text-slate-500">{t.difficulty} pts</span>
                    )}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColors[t.status] ?? 'bg-slate-100 text-slate-600'}`}
                  >
                    {t.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Membros</h2>
          {members.length === 0 ? (
            <p className="text-slate-500">Nenhum membro listado.</p>
          ) : (
            <ul className="space-y-2">
              {members.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between bg-white rounded-lg border border-slate-200 px-4 py-3"
                >
                  <span className="font-medium text-slate-900">{m.name ?? m.email ?? m.id}</span>
                  {m.role && (
                    <span className="text-sm text-slate-500">{m.role}{m.level ? ` · ${m.level}` : ''}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
