import { getDashboardStats, getProjectSummaries, useAppStore } from '@/lib/store';
import type { Project, ProjectSummary, SessionUser, TaskStatus } from '@/lib/types';

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

export type { Project, ProjectSummary, SessionUser } from '@/lib/types';

export async function requestMagicLink(email: string) {
  await wait(700);

  if (email.toLowerCase().includes('blocked')) {
    throw new Error('Este ambiente de demonstração bloqueia o domínio informado. Use um e-mail válido para continuar.');
  }

  const link = useAppStore.getState().createMagicLink(email.toLowerCase());

  return {
    message: 'Magic link simulado com sucesso.',
    demoToken: link.token,
    expiresAt: link.expiresAt,
    previewUrl: `/auth/verify?token=${link.token}`,
  };
}

export async function verifyMagicLink(token: string) {
  await wait(800);
  const session = useAppStore.getState().verifyMagicLinkToken(token);

  return {
    access_token: session.accessToken,
    token_type: 'demo',
    user: session,
  };
}

export async function getSession() {
  await wait(250);
  return useAppStore.getState().session;
}

export async function listProjects() {
  await wait(500);
  return getProjectSummaries(useAppStore.getState().projects);
}

export async function getProject(projectId: string) {
  await wait(500);
  const project = useAppStore.getState().projects.find((item) => item.id === projectId);

  if (!project) {
    throw new Error('Projeto não encontrado neste ambiente de demonstração.');
  }

  return project;
}

export async function getDashboardSnapshot() {
  await wait(300);
  const projects = useAppStore.getState().projects;

  return {
    stats: getDashboardStats(projects),
    projects: getProjectSummaries(projects),
    user: useAppStore.getState().session,
  };
}

export async function updateTaskStatus(projectId: string, taskId: string, status: TaskStatus) {
  await wait(350);
  useAppStore.getState().updateTaskStatus(projectId, taskId, status);
  return getProject(projectId);
}

export async function addTaskReport(projectId: string, taskId: string, text: string) {
  await wait(350);
  const session = useAppStore.getState().session;
  const author = session?.name ?? 'Revisor visitante';
  useAppStore.getState().addTaskReport(projectId, taskId, text, author);
  return getProject(projectId);
}
