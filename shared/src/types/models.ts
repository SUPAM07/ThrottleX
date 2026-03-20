export interface RateLimitConfig {
  key: string;
  limit: number;
  windowMs: number;
  algorithm: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  active: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface GeoLocation {
  country: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface MetricsSnapshot {
  totalRequests: number;
  allowedRequests: number;
  rejectedRequests: number;
  averageLatencyMs: number;
  timestamp: string;
}
