import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  ChartNoAxesCombined,
  CheckSquare2,
  Layers3,
  LayoutDashboard,
  Shield,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { BrandLogo } from '@/components/brand-logo';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const highlights = [
  'Workspace de demo com dados mockados persistidos no navegador',
  'Fluxo de autenticação via magic link simulado',
  'Dashboard executivo e detalhe operacional por projeto',
];

const pillars = [
  {
    icon: LayoutDashboard,
    title: 'Visão executiva',
    description: 'Indicadores de saúde, sprint ativa e status do portfólio em um painel claro.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Operação tangível',
    description: 'Tarefas, equipe, risco e progresso atualizados em tempo real pelo estado local.',
  },
  {
    icon: ShieldCheck,
    title: 'Pronto para evoluir',
    description: 'Camada mockada organizada para receber API real sem reescrever a interface.',
  },
];

export default function HomePage() {
  return (
    <div className="brand-shell-bg min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <BrandLogo />
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
            Ver demo
          </Link>
          <Link href="/login" className={cn(buttonVariants({ size: 'sm' }))}>
            Entrar
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-8">
        <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <h1 className="font-display max-w-3xl text-balance text-5xl font-semibold leading-tight md:text-6xl">
              Aggrandize Planner organiza operações com clareza de produto.
            </h1>
            <p className="brand-subtle mt-6 max-w-2xl text-lg leading-8">
              Uma experiência pensada para dar visibilidade ao trabalho do time: login simples,
              dashboard executivo, visão detalhada por projeto e interações locais que deixam o
              fluxo mais ágil e confiável.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/dashboard" className={cn(buttonVariants({ size: 'lg' }))}>
                  Explorar workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              <Link
                href="/login"
                  className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
                >
                  Testar login
                </Link>
              </div>
            <ul className="brand-subtle mt-10 grid gap-3 text-sm">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <BadgeCheck className="h-4 w-4 text-[rgb(var(--brand-teal))]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card className="brand-panel overflow-hidden border-[rgba(var(--brand-violet),0.16)] text-white">
            <CardContent className="space-y-6 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-secondary text-sm uppercase tracking-[0.22em] text-white/70">
                    Workspace snapshot
                  </p>
                  <h2 className="font-display mt-2 text-2xl font-semibold text-white">
                    Visão operacional em um só lugar
                  </h2>
                </div>
                <div className="rounded-2xl bg-white/12 px-3 py-2 text-sm text-white/80">
                  Experiência local
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['3', 'projetos ativos'],
                  ['9', 'membros envolvidos'],
                  ['10+', 'interações locais'],
                  ['0', 'custo de infraestrutura'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-3xl font-semibold text-white">{value}</p>
                    <p className="mt-1 text-sm text-slate-300">{label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-white/20 bg-white/10 p-5">
                <p className="text-sm text-white/82">
                  O workspace usa dados mockados persistidos no navegador, com interações reais de
                  UI para demonstrar fluxo, validação e gerenciamento de estado.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="brand-panel-secondary mt-12 grid gap-4 rounded-[2rem] border border-[rgba(var(--brand-violet),0.10)] p-6 shadow-[0_24px_55px_-42px_rgba(0,46,128,0.24)] md:grid-cols-3">
          {[
            {
              icon: Layers3,
              title: 'Arquitetura limpa',
              description: 'Serviços mockados separados da UI para troca futura por API real.',
            },
            {
              icon: CheckSquare2,
              title: 'Navegação guiada',
              description: 'Fluxo curto e convincente para navegar pelos principais pontos do produto.',
            },
            {
              icon: Shield,
              title: 'Zero custo',
              description: 'Sem banco, sem API e sem risco de indisponibilidade durante a apresentação.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-100 bg-white p-5">
              <div className="mb-4 inline-flex rounded-2xl bg-[rgba(var(--brand-blue),0.08)] p-3 text-[rgb(var(--brand-blue))]">
                <item.icon className="h-5 w-5" />
              </div>
              <h2 className="font-display text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-7">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="mt-20 grid gap-5 md:grid-cols-3">
          {pillars.map((pillar) => (
            <Card key={pillar.title}>
              <CardContent className="space-y-4 p-6">
                <div className="inline-flex rounded-2xl bg-slate-100 p-3 text-slate-700">
                  <pillar.icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold">{pillar.title}</h2>
                  <p className="mt-2 leading-7">{pillar.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-20">
          <Card className="brand-panel border-[rgba(var(--brand-violet),0.16)] text-white">
            <CardContent className="space-y-6 p-7">
              <div>
                <p className="font-secondary text-sm uppercase tracking-[0.22em] text-white/70">Core routes</p>
                <h2 className="font-display mt-2 text-3xl font-semibold text-white">
                  Quatro rotas, uma experiência completa
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['/', 'Proposta de valor e posicionamento do produto'],
                  ['/login', 'Formulário validado com magic link simulado'],
                  ['/dashboard', 'Portfólio com busca, métricas e status'],
                  ['/projects/[id]', 'Atualização de tarefas, equipe e atividade recente'],
                ].map(([route, text]) => (
                  <div key={route} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-white">{route}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard" className={cn(buttonVariants({ size: 'lg' }))}>
                  Ver dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}
                >
                  Iniciar acesso
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
