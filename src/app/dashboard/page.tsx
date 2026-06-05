'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  CircleAlert,
  FolderKanban,
  ListChecks,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';

import { AppShell } from '@/components/app-shell';
import { StatCard } from '@/components/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { getDashboardSnapshot, type ProjectSummary } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import { cn, formatDate, formatHealthStatus, formatPercent } from '@/lib/utils';

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalMembers: 0,
    totalTasks: 0,
    avgProgress: 0,
  });
  const search = useAppStore((state) => state.projectSearch);
  const session = useAppStore((state) => state.session);
  const setProjectSearch = useAppStore((state) => state.setProjectSearch);

  useEffect(() => {
    let cancelled = false;
    getDashboardSnapshot()
      .then((snapshot) => {
        if (cancelled) return;
        setProjects(snapshot.projects);
        setStats(snapshot.stats);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Não foi possível carregar o dashboard.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      })
    return () => { cancelled = true; };
  }, []);

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return projects;

    return projects.filter((project) => {
      return (
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    });
  }, [projects, search]);

  const healthVariant = (health: ProjectSummary['health']) => {
    if (health === 'On track') return 'success';
    if (health === 'At risk') return 'warning';
    return 'danger';
  };

  const highestRiskProject = useMemo(
    () => projects.find((project) => project.health !== 'On track') ?? projects[0],
    [projects]
  );

  return (
    <AppShell active="dashboard">
      <div className="space-y-8">
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="brand-panel border-[rgba(var(--brand-violet),0.16)] text-white">
            <CardContent className="p-6 sm:p-8">
              <Badge variant="info" className="mb-5 border-white/18 bg-white/10 text-white/90">
                Ambiente com dados locais
              </Badge>
              <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
                {session ? `Olá, ${session.name.split(' ')[0]}.` : 'Aggrandize em modo de visualização.'}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">
                Explore um portfólio de projetos com dados persistidos no navegador, indicadores
                visuais e interações locais prontas para mostrar domínio de estado e clareza
                operacional.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: 'secondary' }))}
                >
                  {session ? 'Trocar usuário' : 'Ativar login'}
                </Link>
                <Button variant="ghost" className="bg-white/5 text-white hover:bg-white/10 hover:text-white">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Dados persistidos com Zustand
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Encontrar projeto</CardTitle>
              <CardDescription>
                Filtre por nome, tag ou problema que você quer apresentar na demonstração.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={(event) => setProjectSearch(event.target.value)}
                  placeholder="Buscar por projeto, dashboard, AI..."
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-slate-500">
                Dica: pesquise por <strong>AI</strong>, <strong>Dashboard</strong> ou{' '}
                <strong>Operações</strong>.
              </p>
              <div className="flex flex-wrap gap-2">
                {['AI', 'Discovery', 'Operações'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setProjectSearch(term)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={FolderKanban}
            label="Projetos ativos"
            value={String(stats.totalProjects)}
            helper="Portfólio mockado para demonstração"
          />
          <StatCard
            icon={Users}
            label="Pessoas envolvidas"
            value={String(stats.totalMembers)}
            helper="Time distribuído entre produto, design e operações"
          />
          <StatCard
            icon={BriefcaseBusiness}
            label="Tarefas mapeadas"
            value={String(stats.totalTasks)}
            helper="Status atualizados localmente no detalhe do projeto"
          />
          <StatCard
            icon={Sparkles}
            label="Progresso médio"
            value={formatPercent(stats.avgProgress)}
            helper="Indicador agregado do portfólio"
          />
        </section>

        <section className="grid gap-6">
          <Card className="brand-panel border-[rgba(var(--brand-violet),0.16)] text-white">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/12 p-2 text-white">
                  <CircleAlert className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="font-display text-white">Projeto que vale mostrar primeiro</CardTitle>
                  <CardDescription className="text-white/78">
                    Comece com o caso mais rico para dar contexto rapidamente.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {highestRiskProject && (
                <div className="rounded-3xl border border-[rgba(var(--brand-magenta),0.14)] bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-950">{highestRiskProject.name}</p>
                      <p className="mt-1 text-sm text-slate-600">{highestRiskProject.description}</p>
                    </div>
                    <Badge variant={healthVariant(highestRiskProject.health)}>
                      {formatHealthStatus(highestRiskProject.health)}
                    </Badge>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-[rgba(var(--brand-magenta),0.05)] p-3">
                      <p className="text-xs uppercase tracking-wide text-[rgb(var(--brand-magenta))]">Equipe</p>
                      <p className="mt-1 text-lg font-semibold text-slate-950">{highestRiskProject.teamSize}</p>
                    </div>
                    <div className="rounded-2xl bg-[rgba(var(--brand-magenta),0.05)] p-3">
                      <p className="text-xs uppercase tracking-wide text-[rgb(var(--brand-magenta))]">Data de entrega</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">
                        {formatDate(highestRiskProject.expectedEndDate)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[rgba(var(--brand-magenta),0.05)] p-3">
                      <p className="text-xs uppercase tracking-wide text-[rgb(var(--brand-magenta))]">Andamento</p>
                      <p className="mt-1 text-lg font-semibold text-slate-950">
                        {formatPercent(highestRiskProject.progress)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {error && (
          <Card className="border-[rgba(var(--brand-magenta),0.18)] bg-[rgba(var(--brand-magenta),0.08)]">
            <CardContent className="p-6 text-sm text-[rgb(var(--brand-magenta))]">{error}</CardContent>
          </Card>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Projetos priorizados</h2>
              <p className="mt-1 text-sm text-slate-500">
                Abra um projeto para explorar tarefas, equipe e atualizações.
              </p>
            </div>
            <Badge variant="default">{filteredProjects.length} exibidos</Badge>
          </div>

          {loading ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {[1, 2].map((item) => (
                <Card key={item} className="animate-pulse">
                  <CardContent className="space-y-4 p-6">
                    <div className="h-6 w-2/3 rounded bg-slate-100" />
                    <div className="h-4 w-full rounded bg-slate-100" />
                    <div className="h-4 w-3/4 rounded bg-slate-100" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center">
                <p className="text-slate-600">Nenhum projeto combina com o filtro atual.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`} className="block">
                  <Card className="h-full transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xl">
                    <CardContent className="space-y-5 p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-semibold">{project.name}</h3>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                            {project.description}
                          </p>
                        </div>
                        <Badge variant={healthVariant(project.health)}>
                          {formatHealthStatus(project.health)}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <span>Progresso</span>
                          <span>{formatPercent(project.progress)}</span>
                        </div>
                        <Progress value={project.progress} />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs uppercase tracking-wide text-slate-400">Equipe</p>
                          <p className="mt-2 text-lg font-semibold text-slate-950">
                            {project.teamSize}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs uppercase tracking-wide text-slate-400">Concluídas</p>
                          <p className="mt-2 text-lg font-semibold text-slate-950">
                            {project.completedTasks}/{project.totalTasks}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs uppercase tracking-wide text-slate-400">Prazo curto</p>
                          <p className="mt-2 text-lg font-semibold text-slate-950">{project.dueSoon}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </div>

                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                          <ListChecks className="h-4 w-4 text-slate-500" />
                          Narrativa rápida
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Gestor: {project.manager}. Sprint atual: {project.activeSprint}. Ideal
                          para mostrar leitura executiva e progressão do backlog.
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
                        <span>{project.activeSprint}</span>
                        <span>Data de entrega: {formatDate(project.expectedEndDate)}</span>
                      </div>

                      <div className="flex items-center text-sm font-medium text-slate-900">
                        Abrir projeto
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
