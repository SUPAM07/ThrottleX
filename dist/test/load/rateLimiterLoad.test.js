"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const fallbackLimiter_1 = require("@/utils/resilience/fallbackLimiter");
const latencyTracker_1 = require("../../main/benchmark/latencyTracker");
const throughputCalculator_1 = require("../../main/benchmark/throughputCalculator");
(0, vitest_1.describe)('Rate Limiter Load Tests', () => {
    const config = {
        algorithm: 'token_bucket',
        limit: 1000,
        windowMs: 1000,
    };
    (0, vitest_1.it)('handles 1000 sequential requests with consistent latency', async () => {
        const limiter = new fallbackLimiter_1.FallbackLimiter();
        const tracker = new latencyTracker_1.LatencyTracker();
        const COUNT = 1000;
        for (let i = 0; i < COUNT; i++) {
            const start = performance.now();
            await limiter.check(`load:${i}`, config);
            tracker.record(performance.now() - start);
        }
        const summary = tracker.getSummary();
        (0, vitest_1.expect)(summary.count).toBe(COUNT);
        (0, vitest_1.expect)(summary.p95).toBeLessThan(10); // < 10ms for in-memory fallback
        (0, vitest_1.expect)(summary.mean).toBeLessThan(5);
    });
    (0, vitest_1.it)('handles concurrent requests across workers', async () => {
        const limiter = new fallbackLimiter_1.FallbackLimiter();
        const CONCURRENCY = 10;
        const PER_WORKER = 100;
        const throughput = new throughputCalculator_1.ThroughputCalculator(5000);
        const worker = async (workerId) => {
            const results = [];
            for (let i = 0; i < PER_WORKER; i++) {
                const result = await limiter.check(`concurrent:${workerId}:${i}`, config);
                results.push(result);
                throughput.record();
            }
            return results;
        };
        const allResults = await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i)));
        const flat = allResults.flat();
        (0, vitest_1.expect)(flat.length).toBe(CONCURRENCY * PER_WORKER);
        (0, vitest_1.expect)(throughput.getRps()).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('maintains correctness under load', async () => {
        const limiter = new fallbackLimiter_1.FallbackLimiter();
        const strictConfig = {
            algorithm: 'token_bucket',
            limit: 5,
            windowMs: 60000,
        };
        const results = [];
        for (let i = 0; i < 20; i++) {
            results.push(await limiter.check('strict-key', strictConfig));
        }
        const allowed = results.filter(r => r.allowed).length;
        // With limit=5, at most ~6 should be allowed (with timing tolerance)
        (0, vitest_1.expect)(allowed).toBeLessThanOrEqual(7);
    });
});
//# sourceMappingURL=rateLimiterLoad.test.js.map