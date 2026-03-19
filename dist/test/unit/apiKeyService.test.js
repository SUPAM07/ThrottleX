"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const circuitBreaker_1 = require("@/utils/resilience/circuitBreaker");
(0, vitest_1.describe)('CircuitBreaker', () => {
    let cb;
    (0, vitest_1.beforeEach)(() => {
        cb = new circuitBreaker_1.CircuitBreaker('test', {
            failureThreshold: 3,
            successThreshold: 2,
            timeoutMs: 100,
            halfOpenRequests: 2,
        });
    });
    (0, vitest_1.it)('allows requests in CLOSED state', async () => {
        const result = await cb.execute(() => Promise.resolve('ok'));
        (0, vitest_1.expect)(result).toBe('ok');
        (0, vitest_1.expect)(cb.getState()).toBe('CLOSED');
    });
    (0, vitest_1.it)('opens after failure threshold reached', async () => {
        const failing = () => Promise.reject(new Error('Redis error'));
        for (let i = 0; i < 3; i++) {
            try {
                await cb.execute(failing);
            }
            catch { }
        }
        (0, vitest_1.expect)(cb.getState()).toBe('OPEN');
    });
    (0, vitest_1.it)('uses fallback when OPEN', async () => {
        const failing = () => Promise.reject(new Error('fail'));
        for (let i = 0; i < 3; i++) {
            try {
                await cb.execute(failing);
            }
            catch { }
        }
        const result = await cb.execute(() => Promise.reject(new Error('fail')), () => Promise.resolve('fallback'));
        (0, vitest_1.expect)(result).toBe('fallback');
    });
    (0, vitest_1.it)('transitions to HALF_OPEN after timeout', async () => {
        const failing = () => Promise.reject(new Error('fail'));
        for (let i = 0; i < 3; i++) {
            try {
                await cb.execute(failing);
            }
            catch { }
        }
        (0, vitest_1.expect)(cb.getState()).toBe('OPEN');
        await new Promise((r) => setTimeout(r, 150));
        // Next execute should move to HALF_OPEN
        try {
            await cb.execute(() => Promise.resolve('ok'));
        }
        catch { }
        (0, vitest_1.expect)(['HALF_OPEN', 'CLOSED']).toContain(cb.getState());
    });
});
//# sourceMappingURL=apiKeyService.test.js.map