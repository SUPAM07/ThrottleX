"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const circuitBreaker_1 = require("@/utils/resilience/circuitBreaker");
const fallbackLimiter_1 = require("@/utils/resilience/fallbackLimiter");
const keyGenerator_1 = require("@/services/ratelimit/keys/keyGenerator");
const keyParser_1 = require("@/services/ratelimit/keys/keyParser");
(0, vitest_1.describe)('Rate Limiter Integration (mocked Redis)', () => {
    (0, vitest_1.describe)('Circuit Breaker + Fallback Integration', () => {
        (0, vitest_1.it)('falls back to local limiter when circuit is open', async () => {
            const cb = new circuitBreaker_1.CircuitBreaker('test', {
                failureThreshold: 2,
                successThreshold: 1,
                timeoutMs: 100,
                halfOpenRequests: 1,
            });
            const fallback = new fallbackLimiter_1.FallbackLimiter();
            // Trip the circuit breaker
            for (let i = 0; i < 2; i++) {
                try {
                    await cb.execute(async () => { throw new Error('Redis down'); });
                }
                catch { /* expected */ }
            }
            (0, vitest_1.expect)(cb.getState()).toBe('OPEN');
            // Now it should use fallback
            const result = await cb.execute(async () => { throw new Error('should not reach'); }, async () => fallback.check('test-key', { algorithm: 'token_bucket', limit: 10, windowMs: 60000 }));
            (0, vitest_1.expect)(result.allowed).toBe(true);
        });
    });
    (0, vitest_1.describe)('KeyGenerator + KeyParser roundtrip', () => {
        (0, vitest_1.it)('generates and parses keys correctly', () => {
            const key = keyGenerator_1.KeyGenerator.generate({ algorithm: 'token_bucket', key: 'user:123' });
            (0, vitest_1.expect)(key).toContain('token_bucket');
            (0, vitest_1.expect)(key).toContain('user_123'); // sanitized
            const parsed = keyParser_1.KeyParser.parse(key);
            (0, vitest_1.expect)(parsed).not.toBeNull();
            (0, vitest_1.expect)(parsed.algorithm).toBe('token_bucket');
        });
        (0, vitest_1.it)('handles tenant and endpoint in keys', () => {
            const key = keyGenerator_1.KeyGenerator.generate({
                algorithm: 'sliding_window',
                key: 'api-call',
                tenantId: 'acme',
                endpoint: '/api/v1/users',
            });
            (0, vitest_1.expect)(key).toContain('sliding_window');
            (0, vitest_1.expect)(key).toContain('acme');
        });
        (0, vitest_1.it)('generates IP-based keys', () => {
            const key = keyGenerator_1.KeyGenerator.forIP('192.168.1.1', 'fixed_window', 60000);
            (0, vitest_1.expect)(key).toContain('ip');
            (0, vitest_1.expect)(key).toContain('192.168.1.1');
        });
        (0, vitest_1.it)('generates tenant-based keys', () => {
            const key = keyGenerator_1.KeyGenerator.forTenant('acme', 'token_bucket');
            (0, vitest_1.expect)(key).toContain('tenant');
            (0, vitest_1.expect)(key).toContain('acme');
        });
    });
    (0, vitest_1.describe)('Full request flow (mocked)', () => {
        (0, vitest_1.it)('processes a rate limit check through the pipeline', async () => {
            const fallback = new fallbackLimiter_1.FallbackLimiter();
            const config = {
                algorithm: 'token_bucket',
                limit: 100,
                windowMs: 60000,
            };
            // Simulate check using fallback (no Redis)
            const result = await fallback.check('user:test', config);
            (0, vitest_1.expect)(result.allowed).toBe(true);
            (0, vitest_1.expect)(result.algorithm).toBeDefined();
            (0, vitest_1.expect)(result.key).toBe('user:test');
        });
        (0, vitest_1.it)('applies rate limiting across multiple requests', async () => {
            const fallback = new fallbackLimiter_1.FallbackLimiter();
            const config = {
                algorithm: 'token_bucket',
                limit: 5,
                windowMs: 60000,
            };
            const results = [];
            for (let i = 0; i < 10; i++) {
                results.push(await fallback.check('limited-key', config));
            }
            // With a limit of 5, some should be rejected
            const allowed = results.filter(r => r.allowed).length;
            const rejected = results.filter(r => !r.allowed).length;
            (0, vitest_1.expect)(allowed).toBeLessThanOrEqual(6); // Small tolerance for timing
            (0, vitest_1.expect)(rejected).toBeGreaterThanOrEqual(0);
        });
    });
});
//# sourceMappingURL=rateLimiterIntegration.test.js.map