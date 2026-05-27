const API_BASE = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001';

// Default workspace headers for Phase 1 mock auth
const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'x-workspace-id': '00000000-0000-0000-0000-000000000000', // replaced by seed
  'x-user-id': '00000000-0000-0000-0000-000000000001',
  'x-user-role': 'owner',
};

interface FetchOptions {
  method?: string;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, params } = options;

  let url = `${API_BASE}${path}`;
  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) searchParams.set(key, String(value));
    }
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    method,
    headers: DEFAULT_HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail ?? error.title ?? 'API Error');
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Contacts ───
export const contactsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiFetch<{ data: unknown[]; meta: unknown }>('/contacts', { params }),
  get: (id: string) => apiFetch<{ data: unknown }>(`/contacts/${id}`),
  create: (body: unknown) => apiFetch<{ data: unknown }>('/contacts', { method: 'POST', body }),
  update: (id: string, body: unknown) => apiFetch<{ data: unknown }>(`/contacts/${id}`, { method: 'PATCH', body }),
  delete: (id: string) => apiFetch<void>(`/contacts/${id}`, { method: 'DELETE' }),
};

// ─── Companies ───
export const companiesApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiFetch<{ data: unknown[]; meta: unknown }>('/companies', { params }),
  get: (id: string) => apiFetch<{ data: unknown }>(`/companies/${id}`),
  create: (body: unknown) => apiFetch<{ data: unknown }>('/companies', { method: 'POST', body }),
  update: (id: string, body: unknown) => apiFetch<{ data: unknown }>(`/companies/${id}`, { method: 'PATCH', body }),
  delete: (id: string) => apiFetch<void>(`/companies/${id}`, { method: 'DELETE' }),
};

// ─── Deals ───
export const dealsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiFetch<{ data: unknown[]; meta: unknown }>('/deals', { params }),
  get: (id: string) => apiFetch<{ data: unknown }>(`/deals/${id}`),
  create: (body: unknown) => apiFetch<{ data: unknown }>('/deals', { method: 'POST', body }),
  update: (id: string, body: unknown) => apiFetch<{ data: unknown }>(`/deals/${id}`, { method: 'PATCH', body }),
  moveStage: (id: string, stageId: string) =>
    apiFetch<{ data: unknown }>(`/deals/${id}/stage`, { method: 'PATCH', body: { stageId } }),
  timeline: (id: string) => apiFetch<{ data: unknown[] }>(`/deals/${id}/timeline`),
  delete: (id: string) => apiFetch<void>(`/deals/${id}`, { method: 'DELETE' }),
};

// ─── Pipelines ───
export const pipelinesApi = {
  list: () => apiFetch<{ data: unknown[] }>('/pipelines'),
  get: (id: string) => apiFetch<{ data: unknown }>(`/pipelines/${id}`),
  stages: (id: string) => apiFetch<{ data: unknown[] }>(`/pipelines/${id}/stages`),
};

// ─── Activities ───
export const activitiesApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiFetch<{ data: unknown[]; meta: unknown }>('/activities', { params }),
  create: (body: unknown) => apiFetch<{ data: unknown }>('/activities', { method: 'POST', body }),
};

// ─── Reports ───
export const reportsApi = {
  pipeline: (pipelineId?: string) =>
    apiFetch<{ data: unknown }>('/reports/pipeline', { params: pipelineId ? { pipelineId } : undefined }),
  revenue: () => apiFetch<{ data: unknown[] }>('/reports/revenue'),
  leaderboard: () => apiFetch<{ data: unknown[] }>('/reports/leaderboard'),
  activities: () => apiFetch<{ data: unknown[] }>('/reports/activities'),
};

// ─── Sales Orders ───
export const salesOrdersApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiFetch<{ data: unknown[]; meta: unknown }>('/sales-orders', { params }),
  get: (id: string) => apiFetch<{ data: unknown }>(`/sales-orders/${id}`),
  create: (body: unknown) => apiFetch<{ data: unknown }>('/sales-orders', { method: 'POST', body }),
  update: (id: string, body: unknown) => apiFetch<{ data: unknown }>(`/sales-orders/${id}`, { method: 'PATCH', body }),
  delete: (id: string) => apiFetch<void>(`/sales-orders/${id}`, { method: 'DELETE' }),
};

// ─── Invoices ───
export const invoicesApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiFetch<{ data: unknown[]; meta: unknown }>('/invoices', { params }),
  get: (id: string) => apiFetch<{ data: unknown }>(`/invoices/${id}`),
  create: (body: unknown) => apiFetch<{ data: unknown }>('/invoices', { method: 'POST', body }),
  update: (id: string, body: unknown) => apiFetch<{ data: unknown }>(`/invoices/${id}`, { method: 'PATCH', body }),
  delete: (id: string) => apiFetch<void>(`/invoices/${id}`, { method: 'DELETE' }),
};

// ─── Payments ───
export const paymentsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiFetch<{ data: unknown[]; meta: unknown }>('/payments', { params }),
  get: (id: string) => apiFetch<{ data: unknown }>(`/payments/${id}`),
  create: (body: unknown) => apiFetch<{ data: unknown }>('/payments', { method: 'POST', body }),
  update: (id: string, body: unknown) => apiFetch<{ data: unknown }>(`/payments/${id}`, { method: 'PATCH', body }),
  delete: (id: string) => apiFetch<void>(`/payments/${id}`, { method: 'DELETE' }),
};
