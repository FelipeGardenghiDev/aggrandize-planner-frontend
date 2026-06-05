import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { HealthStatus, Member, TaskStatus, WorkloadStatus } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(value));
}

export function formatLongDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatTaskStatus(status: TaskStatus) {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'doing':
      return 'Em progresso';
    case 'done':
      return 'Feito';
    case 'blocked':
      return 'Bloqueado';
    case 'cancelled':
      return 'Cancelado';
    default:
      return status;
  }
}

export function formatPriority(priority: 'Low' | 'Medium' | 'High') {
  switch (priority) {
    case 'Low':
      return 'Baixa prioridade';
    case 'Medium':
      return 'Média prioridade';
    case 'High':
      return 'Alta prioridade';
    default:
      return priority;
  }
}

export function formatWorkloadStatus(status: WorkloadStatus) {
  switch (status) {
    case 'Idle':
      return 'Ocioso';
    case 'Relaxed':
      return 'Tranquilo';
    case 'Healthy':
      return 'Saudável';
    case 'Tight':
      return 'No limite';
    case 'Impossible':
      return 'Crítico';
    default:
      return status;
  }
}

export function formatLevel(level: Member['level']) {
  switch (level) {
    case 'Junior':
      return 'Júnior';
    case 'Mid':
      return 'Pleno';
    case 'Senior':
      return 'Sênior';
    case 'Lead':
      return 'Líder';
    default:
      return level;
  }
}

export function formatRole(role: string) {
  switch (role) {
    case 'Product Manager':
      return 'Gerente de produto';
    case 'Frontend Engineer':
      return 'Engenheiro Frontend';
    case 'Product Designer':
      return 'Designer de produto';
    case 'Operations Lead':
      return 'Líder de operações';
    case 'Customer Success':
      return 'Sucesso do cliente';
    case 'Innovation Lead':
      return 'Líder de inovação';
    case 'Full Stack Engineer':
      return 'Engenheiro Full Stack';
    default:
      return role;
  }
}

export function formatAvailabilityStatus(status: Member['availability']) {
  switch (status) {
    case 'Available':
      return 'Disponível';
    case 'Busy':
      return 'Ocupado';
    case 'Blocked':
      return 'Bloqueado';
    default:
      return status;
  }
}

export function formatHealthStatus(status: HealthStatus) {
  switch (status) {
    case 'On track':
      return 'No prazo';
    case 'At risk':
      return 'Em risco';
    case 'Needs attention':
      return 'Precisa de atenção';
    default:
      return status;
  }
}
