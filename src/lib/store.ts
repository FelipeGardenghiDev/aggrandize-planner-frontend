'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { seedProjects } from '@/lib/mock-data';
import type {
  DashboardStats,
  MagicLink,
  Project,
  ProjectSummary,
  SessionUser,
  TaskStatus,
} from '@/lib/types';

type AppState = {
  projects: Project[];
  session: SessionUser | null;
  magicLinks: MagicLink[];
  projectSearch: string;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setProjectSearch: (value: string) => void;
  resetDemo: () => void;
  createMagicLink: (email: string) => MagicLink;
  verifyMagicLinkToken: (token: string) => SessionUser;
  signOut: () => void;
  updateTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => void;
  addTaskReport: (projectId: string, taskId: string, message: string, author: string) => void;
};

const tokenTtlMs = 15 * 60 * 1000;

function calculateProjectSummary(project: Project): ProjectSummary {
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((task) => task.status === 'done').length;
  const dueSoon = project.tasks.filter((task) => {
    const timeLeft = new Date(task.dueDate).getTime() - Date.now();
    const twoDays = 1000 * 60 * 60 * 24 * 2;
    return timeLeft > 0 && timeLeft <= twoDays && task.status !== 'done';
  }).length;

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    manager: project.manager,
    activeSprint: project.activeSprint,
    health: project.health,
    expectedEndDate: project.expectedEndDate,
    progress: totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100,
    teamSize: project.members.length,
    completedTasks,
    totalTasks,
    dueSoon,
    tags: project.tags,
  };
}

export function getProjectSummaries(projects: Project[]) {
  return projects.map(calculateProjectSummary);
}

export function getDashboardStats(projects: Project[]): DashboardStats {
  const summaries = getProjectSummaries(projects);
  const totalMembers = projects.reduce((sum, project) => sum + project.members.length, 0);
  const totalTasks = projects.reduce((sum, project) => sum + project.tasks.length, 0);
  const avgProgress =
    summaries.length === 0
      ? 0
      : summaries.reduce((sum, summary) => sum + summary.progress, 0) / summaries.length;

  return {
    totalProjects: projects.length,
    totalMembers,
    totalTasks,
    avgProgress,
  };
}

function createToken() {
  return `demo_${Math.random().toString(36).slice(2, 10)}`;
}

function createSessionFromEmail(email: string): SessionUser {
  const [rawName] = email.split('@');
  const normalizedEmail = email.toLowerCase();
  const name = rawName
    .split(/[.\-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return {
    id: `user_${rawName.toLowerCase()}`,
    name: name || 'Guest User',
    email,
    role:
      normalizedEmail === 'felipe@aggrandize.com'
        ? 'Front-End'
        : email.endsWith('@aggrandize.com')
          ? 'Product Ops'
          : 'Guest Reviewer',
    company: 'Aggrandize',
    accessToken: createToken(),
  };
}

function cloneSeedProjects() {
  return structuredClone(seedProjects);
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: cloneSeedProjects(),
      session: null,
      magicLinks: [],
      projectSearch: '',
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      setProjectSearch: (value) => set({ projectSearch: value }),
      resetDemo: () =>
        set({
          projects: cloneSeedProjects(),
          session: null,
          magicLinks: [],
          projectSearch: '',
        }),
      createMagicLink: (email) => {
        const link = {
          token: createToken(),
          email,
          expiresAt: new Date(Date.now() + tokenTtlMs).toISOString(),
        };

        set((state) => ({
          magicLinks: [
            ...state.magicLinks.filter((item) => item.email !== email),
            link,
          ],
        }));

        return link;
      },
      verifyMagicLinkToken: (token) => {
        const match = get().magicLinks.find((item) => item.token === token);

        if (!match) {
          throw new Error('O link de acesso não foi encontrado. Gere um novo link na tela de login.');
        }

        if (new Date(match.expiresAt).getTime() < Date.now()) {
          throw new Error('O link de acesso expirou. Gere um novo link para continuar.');
        }

        const session = createSessionFromEmail(match.email);

        set((state) => ({
          session,
          magicLinks: state.magicLinks.filter((item) => item.token !== token),
        }));

        return session;
      },
      signOut: () => set({ session: null }),
      updateTaskStatus: (projectId, taskId, status) =>
        set((state) => ({
          projects: state.projects.map((project) => {
            if (project.id !== projectId) return project;

            const tasks = project.tasks.map((task) => {
              if (task.id !== taskId) return task;

              const progress =
                status === 'done'
                  ? 100
                  : status === 'doing'
                    ? Math.max(task.progress, 45)
                    : status === 'blocked'
                      ? task.progress
                      : 0;

              return {
                ...task,
                status,
                progress,
              };
            });

            const task = tasks.find((item) => item.id === taskId);
            const activityTitle =
              status === 'done'
                ? 'Entrega concluída'
                : status === 'doing'
                  ? 'Trabalho retomado'
                  : status === 'blocked'
                    ? 'Bloqueio registrado'
                    : 'Tarefa voltou ao backlog';

            return {
              ...project,
              tasks,
              recentActivity: task
                ? [
                      {
                        id: createToken(),
                        title: activityTitle,
                        description: `${task.title} agora esta em ${status.toUpperCase()}.`,
                        createdAt: new Date().toISOString(),
                        tone: status === 'blocked' ? ('warning' as const) : ('info' as const),
                      },
                    ...project.recentActivity,
                  ].slice(0, 6)
                : project.recentActivity,
            };
          }),
        })),
      addTaskReport: (projectId, taskId, message, author) =>
        set((state) => ({
          projects: state.projects.map((project) => {
            if (project.id !== projectId) return project;

            const tasks = project.tasks.map((task) => {
              if (task.id !== taskId) return task;

              return {
                ...task,
                reports: [
                  {
                    id: createToken(),
                    author,
                    message,
                    createdAt: new Date().toISOString(),
                  },
                  ...task.reports,
                ].slice(0, 4),
              };
            });

            const task = project.tasks.find((item) => item.id === taskId);

            return {
              ...project,
              tasks,
              recentActivity: task
                ? [
                      {
                        id: createToken(),
                        title: 'Update registrado',
                        description: `${author} adicionou uma observação em ${task.title}.`,
                        createdAt: new Date().toISOString(),
                        tone: 'success' as const,
                      },
                    ...project.recentActivity,
                  ].slice(0, 6)
                : project.recentActivity,
            };
          }),
        })),
    }),
    {
      name: 'aggrandize-planner-store',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
