export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

export interface RateLimitCheckRequest {
  key: string;
  limit: number;
  windowMs: number;
  algorithm?: RateLimitAlgorithm;
}

export interface RateLimitCheckResponse {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
  algorithm: string;
}

export type RateLimitAlgorithm =
  | 'token_bucket'
  | 'sliding_window'
  | 'fixed_window'
  | 'leaky_bucket'
  | 'composite';
