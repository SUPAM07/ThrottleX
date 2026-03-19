import Redis from 'ioredis';
import type { RateLimitConfig, RateLimitResponse } from '../../../models';
export interface RateLimiterOptions {
    redis: Redis;
    defaultAlgorithm?: string;
    defaultLimit?: number;
    defaultWindowMs?: number;
    circuitBreakerEnabled?: boolean;
    metricsEnabled?: boolean;
}
/**
 * Main rate limiter orchestrator.
 * Wraps algorithm resolution, circuit breaker, fallback, and metrics into a single entry point.
 */
export declare class RateLimiter {
    private readonly opts;
    private readonly factory;
    private readonly circuitBreaker;
    private readonly fallback;
    private readonly metricsEnabled;
    constructor(opts: RateLimiterOptions);
    /**
     * Check whether a request should be allowed.
     */
    check(key: string, config?: Partial<RateLimitConfig>): Promise<RateLimitResponse>;
    /**
     * Reset rate limit state for a key.
     */
    reset(key: string, algorithm?: string): Promise<void>;
    /**
     * Get current state of a rate limit key.
     */
    getState(key: string, algorithm?: string): Promise<Record<string, unknown> | null>;
    getCircuitBreakerState(): string;
    private resolveConfig;
    private recordMetrics;
}
export default RateLimiter;
//# sourceMappingURL=rateLimiter.d.ts.map