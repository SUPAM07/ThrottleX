export declare const ALGORITHMS: {
    readonly TOKEN_BUCKET: "token_bucket";
    readonly SLIDING_WINDOW: "sliding_window";
    readonly FIXED_WINDOW: "fixed_window";
    readonly LEAKY_BUCKET: "leaky_bucket";
    readonly COMPOSITE: "composite";
};
export type AlgorithmName = (typeof ALGORITHMS)[keyof typeof ALGORITHMS];
export declare const REDIS_KEY_PREFIX: {
    readonly RATE_LIMIT: "rl";
    readonly TOKEN_BUCKET: "rl:tb";
    readonly SLIDING_WINDOW: "rl:sw";
    readonly FIXED_WINDOW: "rl:fw";
    readonly LEAKY_BUCKET: "rl:lb";
    readonly COMPOSITE: "rl:cp";
    readonly API_KEY: "ak";
    readonly GEO: "geo";
    readonly METRICS: "metrics";
    readonly CONFIG: "cfg";
    readonly BLOCKLIST: "bl";
    readonly CIRCUIT: "cb";
    readonly ADAPTIVE: "adapt";
};
export declare const DEFAULT_LIMITS: {
    readonly REQUESTS_PER_MINUTE: 100;
    readonly REQUESTS_PER_HOUR: 5000;
    readonly REQUESTS_PER_DAY: 50000;
    readonly BURST_SIZE: 20;
    readonly WINDOW_MS: 60000;
    readonly TOKEN_REFILL_RATE: 10;
    readonly LEAKY_BUCKET_CAPACITY: 100;
    readonly LEAKY_BUCKET_DRAIN_RATE: 10;
};
export declare const HEADERS: {
    readonly RATE_LIMIT_LIMIT: "X-RateLimit-Limit";
    readonly RATE_LIMIT_REMAINING: "X-RateLimit-Remaining";
    readonly RATE_LIMIT_RESET: "X-RateLimit-Reset";
    readonly RATE_LIMIT_RETRY_AFTER: "Retry-After";
    readonly RATE_LIMIT_ALGORITHM: "X-RateLimit-Algorithm";
    readonly RATE_LIMIT_POLICY: "X-RateLimit-Policy";
    readonly CORRELATION_ID: "X-Correlation-ID";
    readonly API_KEY: "X-API-Key";
    readonly TENANT_ID: "X-Tenant-ID";
    readonly FORWARDED_FOR: "X-Forwarded-For";
    readonly CF_CONNECTING_IP: "CF-Connecting-IP";
    readonly CF_IP_COUNTRY: "CF-IPCountry";
    readonly CLOUDFRONT_VIEWER_COUNTRY: "CloudFront-Viewer-Country";
    readonly REAL_IP: "X-Real-IP";
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly SERVICE_UNAVAILABLE: 503;
};
export declare const CIRCUIT_STATES: {
    readonly CLOSED: "CLOSED";
    readonly OPEN: "OPEN";
    readonly HALF_OPEN: "HALF_OPEN";
};
export declare const ADAPTIVE: {
    readonly MIN_SAMPLES: 100;
    readonly WINDOW_MINUTES: 5;
    readonly SENSITIVITY: 0.8;
    readonly EMA_ALPHA: 0.2;
    readonly ZSCORE_THRESHOLD: 2.5;
    readonly MIN_LIMIT_FLOOR: 10;
    readonly MAX_SCALE_FACTOR: 5;
    readonly MIN_SCALE_FACTOR: 0.1;
};
export declare const METRICS: {
    readonly REQUESTS_TOTAL: "rate_limiter_requests_total";
    readonly REQUESTS_ALLOWED: "rate_limiter_requests_allowed_total";
    readonly REQUESTS_REJECTED: "rate_limiter_requests_rejected_total";
    readonly REQUEST_DURATION: "rate_limiter_request_duration_seconds";
    readonly ACTIVE_KEYS: "rate_limiter_active_keys";
    readonly REDIS_ERRORS: "rate_limiter_redis_errors_total";
    readonly CIRCUIT_STATE: "rate_limiter_circuit_breaker_state";
    readonly ADAPTIVE_ADJUSTMENTS: "rate_limiter_adaptive_adjustments_total";
};
export declare const TIME: {
    readonly SECOND_MS: 1000;
    readonly MINUTE_MS: 60000;
    readonly HOUR_MS: 3600000;
    readonly DAY_MS: 86400000;
};
export declare const CACHE_TTL: {
    readonly GEO_LOOKUP: 3600;
    readonly API_KEY: 300;
    readonly CONFIG: 60;
    readonly METRICS: 10;
};
//# sourceMappingURL=constants.d.ts.map