/**
 * Cliente API para o backend Aggrandize Planner (FastAPI)
 * Baseado nos endpoints documentados no frontend README do repositório.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('aggrandize_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${path}`;
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error((err as { detail?: string }).detail || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// --- Auth ---
export async function requestMagicLink(email: string) {
  return request<{ message?: string }>('/auth/magic-link', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function verifyMagicLink(token: string) {
  return request<{ access_token: string; token_type: string }>('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

// --- Projects ---
export interface Project {
  id: string;
  name: string;
  description?: string;
  expected_end_date?: string;
  created_at?: string;
}

export async function createProject(data: { name: string; description?: string }) {
  return request<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getProject(projectId: string) {
  return request<Project & { tasks?: Task[]; members?: Member[] }>(
    `/projects/${projectId}`
  );
}

export async function listProjects() {
  return request<Project[]>('/projects');
}

export async function configureProjectLlm(projectId: string, data: { provider: string; api_key: string }) {
  return request(`/projects/${projectId}/llm`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// --- Tasks ---
export interface Task {
  id: string;
  title: string;
  description?: string;
  difficulty?: number;
  status: 'todo' | 'doing' | 'done' | 'blocked' | 'cancelled';
  progress?: number;
  expected_start_date?: string;
  expected_end_date?: string;
  assignee_id?: string;
  role_required?: string;
}

export async function createTask(projectId: string, data: { title: string; description?: string; role_required?: string }) {
  return request<Task>(`/projects/${projectId}/tasks`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function setTaskDifficulty(projectId: string, taskId: string, points: number) {
  return request<Task>(`/projects/${projectId}/tasks/${taskId}/difficulty`, {
    method: 'POST',
    body: JSON.stringify({ points }),
  });
}

export async function selectTask(projectId: string, taskId: string) {
  return request<Task>(`/projects/${projectId}/tasks/${taskId}/select`, {
    method: 'POST',
  });
}

export async function completeTask(projectId: string, taskId: string) {
  return request<Task>(`/projects/${projectId}/tasks/${taskId}/complete`, {
    method: 'POST',
  });
}

export async function abandonTask(projectId: string, taskId: string, reason: string) {
  return request<Task>(`/projects/${projectId}/tasks/${taskId}/abandon`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function addTaskReport(projectId: string, taskId: string, text: string) {
  return request(`/projects/${projectId}/tasks/${taskId}/report`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

// --- Members & Roles ---
export interface Member {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  level?: string;
}

export async function createRole(projectId: string, name: string) {
  return request<{ id: string; name: string }>(`/projects/${projectId}/roles`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export async function fireMember(projectId: string, userId: string) {
  return request(`/projects/${projectId}/members/${userId}/fire`, {
    method: 'POST',
  });
}

export async function resignFromProject(projectId: string) {
  return request(`/projects/${projectId}/members/me/resign`, {
    method: 'POST',
  });
}

// --- Invites ---
export async function createInvite(projectId: string, roleId: string) {
  return request<{ url: string; token: string }>(`/projects/${projectId}/invites`, {
    method: 'POST',
    body: JSON.stringify({ role_id: roleId }),
  });
}

export async function acceptInvite(token: string, seniority_level: string) {
  return request(`/invites/${token}/accept`, {
    method: 'POST',
    body: JSON.stringify({ seniority_level }),
  });
}

export { API_URL };
