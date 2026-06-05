import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <main className="max-w-2xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          🎼 Aggrandize Planner
        </h1>
        <p className="text-slate-600 mb-8">
          Gestão de projetos com dependências dinâmicas, balanceamento de carga e
          integração com agentes de IA.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/login"
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            Entrar
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition"
          >
            Dashboard
          </Link>
        </div>
        <p className="mt-12 text-sm text-slate-500">
          Conecte o backend em <code className="bg-slate-200 px-1 rounded">NEXT_PUBLIC_API_URL</code> (ex: http://localhost:8000)
        </p>
      </main>
    </div>
  );
}
