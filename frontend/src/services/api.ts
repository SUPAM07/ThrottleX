import type {
  SystemMetrics,
  HealthStatus,
  AdminKeysResponse,
  RateLimitResult,
  BenchmarkRequest,
  BenchmarkResult,
  RateLimitConfig,
} from '@/types';

const ADMIN_KEY = 'change-me-in-production-admin-secret-xyz';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function adminHeaders(): Record<string, string> {
  return { 'x-admin-key': ADMIN_KEY };
}

// ─── Metrics ───
export async function getMetrics(): Promise<SystemMetrics> {
  return fetchJson<SystemMetrics>('/metrics/json');
}

// ─── Health ───
export async function getHealth(): Promise<HealthStatus> {
  return fetchJson<HealthStatus>('/health');
}

// ─── Rate Limiting ───
export async function checkRateLimit(
  key: string,
  algorithm = 'token_bucket',
  limit = 10,
  windowMs = 60000
): Promise<RateLimitResult> {
  return fetchJson<RateLimitResult>('/api/ratelimit/check', {
    method: 'POST',
    body: JSON.stringify({ key, algorithm, limit, windowMs }),
  });
}

export async function resetRateLimit(key: string): Promise<void> {
  await fetch(`/api/ratelimit/reset/${encodeURIComponent(key)}`, {
    method: 'DELETE',
  });
}

// ─── Admin Keys ───
export async function listAdminKeys(): Promise<AdminKeysResponse> {
  return fetchJson<AdminKeysResponse>('/admin/keys', {
    headers: adminHeaders(),
  });
}

export async function getAdminKey(key: string): Promise<any> {
  return fetchJson(`/admin/limits/${encodeURIComponent(key)}`, {
    headers: adminHeaders(),
  });
}

export async function setAdminLimit(config: RateLimitConfig): Promise<any> {
  return fetchJson(`/admin/limits/${encodeURIComponent(config.key)}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(config),
  });
}

export async function deleteAdminKey(key: string): Promise<void> {
  await fetch(`/admin/limits/${encodeURIComponent(key)}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
}

// ─── Benchmark ───
export async function runBenchmark(config: BenchmarkRequest): Promise<BenchmarkResult> {
  return fetchJson<BenchmarkResult>('/api/benchmark/run', {
    method: 'POST',
    body: JSON.stringify(config),
  });
}
