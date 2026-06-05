export type TaskStatus = 'todo' | 'doing' | 'done' | 'blocked' | 'cancelled';

export type WorkloadStatus = 'Idle' | 'Relaxed' | 'Healthy' | 'Tight' | 'Impossible';

export type HealthStatus = 'On track' | 'At risk' | 'Needs attention';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  accessToken: string;
}

export interface MagicLink {
  token: string;
  email: string;
  expiresAt: string;
}

export interface TaskReport {
  id: string;
  author: string;
  message: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  difficulty: number;
  progress: number;
  priority: 'Low' | 'Medium' | 'High';
  roleRequired: string;
  assigneeId?: string;
  dueDate: string;
  tags: string[];
  reports: TaskReport[];
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  workloadScore: number;
  capacity: number;
  workloadStatus: WorkloadStatus;
  focus: string;
  availability: 'Available' | 'Busy' | 'Blocked';
}

export interface ProjectActivity {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  tone: 'info' | 'success' | 'warning';
}

export interface ProjectMetrics {
  velocity: number;
  blocked: number;
  throughput: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  manager: string;
  activeSprint: string;
  health: HealthStatus;
  expectedEndDate: string;
  goals: string[];
  tags: string[];
  tasks: Task[];
  members: Member[];
  recentActivity: ProjectActivity[];
  metrics: ProjectMetrics;
}

export interface ProjectSummary {
  id: string;
  name: string;
  description: string;
  manager: string;
  activeSprint: string;
  health: HealthStatus;
  expectedEndDate: string;
  progress: number;
  teamSize: number;
  completedTasks: number;
  totalTasks: number;
  dueSoon: number;
  tags: string[];
}

export interface DashboardStats {
  totalProjects: number;
  totalMembers: number;
  totalTasks: number;
  avgProgress: number;
}
