// ─── Metrics ───
export interface SystemMetrics {
  uptime: number;
  memory: { heapUsed: number; heapTotal: number; rss: number };
  timestamp: string;
}

export interface TimeSeriesPoint {
  time: string;
  requests: number;
  allowed: number;
  rejected: number;
  latency: number;
}

// ─── Rate Limiting ───
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  algorithm: string;
  latencyMs: number;
  retryAfterMs?: number;
}

// ─── Admin Keys ───
export interface AdminKey {
  key: string;
  limit: string;
  windowMs: string;
  algorithm: string;
  updatedAt: string;
  expiresAt?: number;
}

export interface AdminKeysResponse {
  keys: AdminKey[];
  total: number;
}

// ─── Health ───
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    redis: { status: string; latencyMs?: number };
    [key: string]: any;
  };
  uptime?: number;
  timestamp?: string;
}

// ─── Benchmark ───
export interface BenchmarkRequest {
  scenario?: string;
  concurrency?: number;
  durationMs?: number;
  algorithm?: string;
}

export interface BenchmarkResult {
  scenario: string;
  totalRequests: number;
  allowedRequests: number;
  rejectedRequests: number;
  durationMs: number;
  actualRps: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  maxLatencyMs: number;
  errorRate: number;
  algorithm?: string;
}

// ─── Configuration ───
export interface RateLimitConfig {
  key: string;
  limit: number;
  windowMs: number;
  algorithm: string;
  expiresAt?: number;
}

// ─── Activity Feed ───
export interface ActivityEvent {
  id: string;
  type: 'allowed' | 'rejected' | 'config_change' | 'health_change';
  key: string;
  message: string;
  timestamp: Date;
  algorithm?: string;
}

// ─── Algorithm Simulation ───
export type AlgorithmType = 'token_bucket' | 'sliding_window' | 'fixed_window' | 'leaky_bucket';
export type TrafficPattern = 'steady' | 'bursty' | 'spike' | 'custom';

export interface SimulationConfig {
  algorithm: AlgorithmType;
  capacity: number;
  refillRate: number;
  windowMs: number;
  trafficPattern: TrafficPattern;
  requestRate: number;
}

export interface SimulationDataPoint {
  time: number;
  tokens: number;
  allowed: number;
  rejected: number;
  total: number;
}

// ─── Analytics (Demo) ───
export interface AnalyticsData {
  totalRequests: number;
  avgSuccessRate: number;
  peakRps: number;
  topKeys: { key: string; requests: number; algorithm: string; rejectionRate: number }[];
  timeSeries: { time: string; requests: number; rejections: number }[];
}

// ─── App State ───
export interface AppState {
  metrics: SystemMetrics | null;
  health: HealthStatus | null;
  keys: AdminKey[];
  timeSeries: TimeSeriesPoint[];
  activityFeed: ActivityEvent[];
  isBackendConnected: boolean;
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
}
