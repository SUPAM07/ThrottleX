export const RATE_LIMIT_ALGORITHMS = [
  'token_bucket',
  'sliding_window',
  'fixed_window',
  'leaky_bucket',
  'composite',
] as const;

export const DEFAULT_RATE_LIMIT = 100;
export const DEFAULT_WINDOW_MS = 60_000;
export const DEFAULT_ALGORITHM = 'token_bucket';

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const COMPLIANCE_ZONES = {
  GDPR: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'SE', 'DK', 'FI', 'IE', 'PT'],
  CCPA: ['US-CA'],
} as const;
