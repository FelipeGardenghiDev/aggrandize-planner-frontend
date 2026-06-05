'use client';

import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Flag,
  MessageSquarePlus,
  PauseCircle,
  PlayCircle,
  ShieldAlert,
  Target,
  Users,
} from 'lucide-react';

import { AppShell } from '@/components/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { addTaskReport, getProject, updateTaskStatus, type Project } from '@/lib/api';
import {
  formatAvailabilityStatus,
  formatDate,
  formatHealthStatus,
  formatLongDate,
  formatTaskStatus,
  formatWorkloadStatus,
} from '@/lib/utils';

const reportSchema = z.object({
  taskId: z.string().min(1, 'Selecione uma tarefa.'),
  message: z.string().min(12, 'Escreva um update com pelo menos 12 caracteres.'),
});

type ReportValues = z.infer<typeof reportSchema>;

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReportValues>({
    resolver: zodResolver(reportSchema),
  });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getProject(id)
      .then((data) => {
        if (!cancelled) setProject(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Erro ao carregar projeto');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  const groupedTasks = useMemo(() => {
    if (!project) return [];

    const groups = [
      { key: 'todo', title: 'To Do' },
      { key: 'doing', title: 'Em progresso' },
      { key: 'blocked', title: 'Bloqueado' },
      { key: 'done', title: 'Feito' },
    ] as const;

    return groups.map((group) => ({
      ...group,
      tasks: project.tasks.filter((task) => task.status === group.key),
    }));
  }, [project]);

  if (!id) return null;

  async function refreshProject() {
    const nextProject = await getProject(id);
    setProject(nextProject);
  }

  async function handleTaskMove(taskId: string, status: 'todo' | 'doing' | 'blocked' | 'done') {
    setSavingTaskId(taskId);
    setActionError('');

    try {
      await updateTaskStatus(id, taskId, status);
      await refreshProject();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não foi possível atualizar a tarefa.');
    } finally {
      setSavingTaskId(null);
    }
  }

  async function onSubmit(values: ReportValues) {
    setActionError('');

    try {
      await addTaskReport(id, values.taskId, values.message);
      await refreshProject();
      reset({ taskId: values.taskId, message: '' });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não foi possível registrar o update.');
    }
  }

  if (loading) {
    return (
      <AppShell active="dashboard">
        <div className="flex min-h-[70vh] items-center justify-center text-slate-500">Carregando...</div>
      </AppShell>
    );
  }

  if (loadError || !project) {
    return (
      <AppShell active="dashboard">
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <Card className="max-w-xl">
            <CardContent className="p-8 text-center">
              <p className="mb-4 text-[rgb(var(--brand-magenta))]">{loadError || 'Projeto não encontrado.'}</p>
              <Link href="/dashboard" className="text-slate-900 underline">
                Voltar ao dashboard
              </Link>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  const taskOptions = project.tasks.map((task) => ({
    value: task.id,
    label: task.title,
  }));

  const completedTasks = project.tasks.filter((task) => task.status === 'done').length;
  const progress = project.tasks.length ? (completedTasks / project.tasks.length) * 100 : 0;
  const nextDueTask = project.tasks
    .filter((task) => task.status !== 'done')
    .sort((first, second) => new Date(first.dueDate).getTime() - new Date(second.dueDate).getTime())[0];

  return (
    <AppShell active="dashboard">
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-950">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao dashboard
            </Link>
            <h1 className="mt-3 text-4xl font-semibold">{project.name}</h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">{project.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="brand-panel border-[rgba(var(--brand-violet),0.16)] text-white">
            <CardContent className="space-y-6 p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-secondary text-sm uppercase tracking-[0.22em] text-white/72">Visão do projeto</p>
                  <h2 className="font-display mt-2 text-3xl font-semibold text-white">{project.activeSprint}</h2>
                </div>
                <Badge
                  variant={
                    project.health === 'On track'
                      ? 'success'
                      : project.health === 'At risk'
                        ? 'warning'
                        : 'danger'
                  }
                >
                  {formatHealthStatus(project.health)}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Conclusão do backlog atual</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="bg-white/10" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Manager</p>
                  <p className="mt-2 text-lg font-semibold text-white">{project.manager}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Deadline</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {formatLongDate(project.expectedEndDate)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Velocity</p>
                  <p className="mt-2 text-lg font-semibold text-white">{project.metrics.velocity} pts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Objetivos desta fase</CardTitle>
              <CardDescription>
                Contexto resumido para alinhar objetivos, prioridades e escopo da fase.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.goals.map((goal) => (
                <div key={goal} className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  {goal}
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Progresso geral</p>
                  <p className="text-2xl font-semibold text-slate-950">{Math.round(progress)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[rgba(var(--brand-plum),0.10)] p-2 text-[rgb(var(--brand-plum))]">
                  <Flag className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Próxima entrega</p>
                  <p className="text-base font-semibold text-slate-950">
                    {nextDueTask ? formatDate(nextDueTask.dueDate) : 'Sem pendências'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[rgba(var(--brand-magenta),0.10)] p-2 text-[rgb(var(--brand-magenta))]">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Itens bloqueados</p>
                  <p className="text-2xl font-semibold text-slate-950">{project.metrics.blocked}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {actionError && (
          <Card className="border-[rgba(var(--brand-magenta),0.18)] bg-[rgba(var(--brand-magenta),0.08)]">
            <CardContent className="p-4 text-sm text-[rgb(var(--brand-magenta))]">{actionError}</CardContent>
          </Card>
        )}

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tarefas por status</CardTitle>
                <CardDescription>
                  Atualize estados localmente para demonstrar interação e persistência.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 xl:grid-cols-2">
                {groupedTasks.map((group) => (
                  <div key={group.key} className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">{group.title}</h3>
                      <Badge>{group.tasks.length}</Badge>
                    </div>
                    {group.tasks.length === 0 ? (
                      <p className="text-sm text-slate-500">Nenhuma tarefa neste status.</p>
                    ) : (
                      group.tasks.map((task) => (
                        <div key={task.id} className="rounded-2xl border border-white bg-white p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-slate-950">{task.title}</p>
                              <p className="mt-1 text-sm leading-6 text-slate-600">{task.description}</p>
                            </div>
                            <Badge
                              variant={
                                task.status === 'done'
                                  ? 'success'
                                  : task.status === 'blocked'
                                    ? 'danger'
                                    : task.status === 'doing'
                                      ? 'warning'
                                      : 'default'
                              }
                            >
                              {formatTaskStatus(task.status)}
                            </Badge>
                          </div>
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span>{task.priority} priority</span>
                              <span>{task.difficulty} pts</span>
                            </div>
                            <Progress value={task.progress} />
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {task.tags.map((tag) => (
                              <Badge key={tag}>{tag}</Badge>
                            ))}
                            <Badge variant="info">Até {formatDate(task.dueDate)}</Badge>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={savingTaskId === task.id}
                              onClick={() => handleTaskMove(task.id, 'todo')}
                            >
                              Backlog
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={savingTaskId === task.id}
                              onClick={() => handleTaskMove(task.id, 'doing')}
                            >
                              <PlayCircle className="mr-2 h-4 w-4" />
                              Em progresso
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={savingTaskId === task.id}
                              onClick={() => handleTaskMove(task.id, 'blocked')}
                            >
                              <PauseCircle className="mr-2 h-4 w-4" />
                              Bloqueado
                            </Button>
                            <Button
                              size="sm"
                              disabled={savingTaskId === task.id}
                              onClick={() => handleTaskMove(task.id, 'done')}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Feito
                            </Button>
                          </div>
                          {task.reports.length > 0 && (
                            <div className="mt-4 rounded-2xl bg-slate-50 p-3">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                 Último update
                               </p>
                              <p className="mt-2 text-sm text-slate-600">{task.reports[0].message}</p>
                              <p className="mt-2 text-xs text-slate-400">
                                {task.reports[0].author} · {formatDate(task.reports[0].createdAt)}
                              </p>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atualização rápida</CardTitle>
                <CardDescription>
                  Registre um update para reforçar o fluxo de formulários validado com Zod.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="taskId" className="text-sm font-medium text-slate-700">
                      Tarefa
                    </label>
                    <select
                      id="taskId"
                      {...register('taskId')}
                      className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/10"
                    >
                      <option value="">Selecione uma tarefa</option>
                      {taskOptions.map((task) => (
                        <option key={task.value} value={task.value}>
                          {task.label}
                        </option>
                      ))}
                    </select>
                    {errors.taskId && (
                      <p className="text-sm text-[rgb(var(--brand-magenta))]">{errors.taskId.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-slate-700">
                      Update
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Ex.: Ajustei o fluxo de navegação e deixei pronto para a rodada final de polish."
                      {...register('message')}
                    />
                    {errors.message && (
                      <p className="text-sm text-[rgb(var(--brand-magenta))]">{errors.message.message}</p>
                    )}
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    Dica: registre updates curtos e objetivos, como se estivesse demonstrando um
                    check-in de sprint para um gerente de produto.
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    <MessageSquarePlus className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Salvando...' : 'Registrar update'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Equipe</CardTitle>
                <CardDescription>Capacidade e foco atual do time.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.members.map((member) => (
                  <div key={member.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-950">{member.name}</p>
                        <p className="text-sm text-slate-500">
                          {member.role} · {member.level}
                        </p>
                      </div>
                      <Badge
                        variant={
                          member.workloadStatus === 'Impossible'
                            ? 'danger'
                            : member.workloadStatus === 'Tight'
                              ? 'warning'
                              : 'success'
                        }
                      >
                        {formatWorkloadStatus(member.workloadStatus)}
                      </Badge>
                    </div>
                    <div className="mt-4 grid gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        {member.focus}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-slate-400" />
                        Score {member.workloadScore} / capacidade {member.capacity}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={member.availability === 'Blocked' ? 'danger' : member.availability === 'Busy' ? 'warning' : 'success'}>
                          {formatAvailabilityStatus(member.availability)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atividade recente</CardTitle>
                <CardDescription>Timeline curta para narrativa de produto.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.recentActivity.map((activity) => (
                  <div key={activity.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-950">{activity.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{activity.description}</p>
                      </div>
                      {activity.tone === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-[rgb(var(--brand-plum))]" />
                      ) : activity.tone === 'success' ? (
                        <CheckCircle2 className="h-4 w-4 text-[rgb(var(--brand-teal))]" />
                      ) : (
                        <Clock3 className="h-4 w-4 text-[rgb(var(--brand-sky))]" />
                      )}
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">
                      {formatDate(activity.createdAt)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas do projeto</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Throughput</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {project.metrics.throughput} entregas
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Itens bloqueados</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {project.metrics.blocked}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
