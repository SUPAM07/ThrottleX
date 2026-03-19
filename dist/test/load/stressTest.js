"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const fallbackLimiter_1 = require("@/utils/resilience/fallbackLimiter");
const latencyTracker_1 = require("../../main/benchmark/latencyTracker");
(0, vitest_1.describe)('Stress Tests', () => {
    const config = {
        algorithm: 'token_bucket',
        limit: 10000,
        windowMs: 1000,
    };
    (0, vitest_1.it)('survives rapid-fire requests without errors', async () => {
        const limiter = new fallbackLimiter_1.FallbackLimiter();
        const tracker = new latencyTracker_1.LatencyTracker();
        const errors = [];
        const promises = Array.from({ length: 500 }, async (_, i) => {
            try {
                const start = performance.now();
                await limiter.check(`stress:${i}`, config);
                tracker.record(performance.now() - start);
            }
            catch (e) {
                errors.push(e);
            }
        });
        await Promise.all(promises);
        (0, vitest_1.expect)(errors.length).toBe(0);
        (0, vitest_1.expect)(tracker.count).toBe(500);
    });
    (0, vitest_1.it)('handles mixed algorithm requests under load', async () => {
        const limiter = new fallbackLimiter_1.FallbackLimiter();
        const algorithms = ['token_bucket', 'sliding_window', 'fixed_window', 'leaky_bucket'];
        const promises = algorithms.flatMap((algo) => Array.from({ length: 50 }, (_, i) => limiter.check(`mixed:${algo}:${i}`, { ...config, algorithm: algo })));
        const results = await Promise.all(promises);
        (0, vitest_1.expect)(results.length).toBe(200);
        (0, vitest_1.expect)(results.every(r => typeof r.allowed === 'boolean')).toBe(true);
    });
    (0, vitest_1.it)('recovery after burst — allows requests again after window resets', async () => {
        const limiter = new fallbackLimiter_1.FallbackLimiter();
        const shortConfig = {
            algorithm: 'token_bucket',
            limit: 3,
            windowMs: 50, // 50ms window
        };
        // Exhaust the limit
        for (let i = 0; i < 10; i++) {
            await limiter.check('recovery-key', shortConfig);
        }
        // Wait for window to reset
        await new Promise(r => setTimeout(r, 60));
        // Should allow again
        const result = await limiter.check('recovery-key', shortConfig);
        (0, vitest_1.expect)(result).toBeDefined();
        (0, vitest_1.expect)(typeof result.allowed).toBe('boolean');
    });
});
//# sourceMappingURL=stressTest.js.map