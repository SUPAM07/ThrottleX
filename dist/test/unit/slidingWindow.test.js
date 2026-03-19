"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
vitest_1.vi.mock('../../src/redis/redisClient', () => ({
    getRedisClient: () => ({
        evalsha: vitest_1.vi.fn().mockResolvedValue([1, 9, Date.now() + 60000, 10]),
        call: vitest_1.vi.fn().mockResolvedValue('mock_sha'),
        zcard: vitest_1.vi.fn().mockResolvedValue(5),
        ttl: vitest_1.vi.fn().mockResolvedValue(55),
        del: vitest_1.vi.fn().mockResolvedValue(1),
    }),
    default: () => ({}),
}));
vitest_1.vi.mock('fs', () => ({
    default: { readFileSync: () => 'return {1, 9, 60000, 10}' },
    readFileSync: () => 'return {1, 9, 60000, 10}',
}));
const slidingWindow_1 = require("@/services/ratelimit/algorithms/slidingWindow");
(0, vitest_1.describe)('SlidingWindow', () => {
    (0, vitest_1.it)('has a valid algorithm name', () => {
        const algo = new slidingWindow_1.SlidingWindowAlgorithm({});
        (0, vitest_1.expect)(algo.name).toBe('sliding_window');
    });
    (0, vitest_1.it)('implements the RateLimitAlgorithm interface', () => {
        const algo = new slidingWindow_1.SlidingWindowAlgorithm({});
        (0, vitest_1.expect)(typeof algo.check).toBe('function');
        (0, vitest_1.expect)(typeof algo.reset).toBe('function');
        (0, vitest_1.expect)(typeof algo.getState).toBe('function');
    });
    (0, vitest_1.it)('getState returns count and ttl from sorted set', async () => {
        const client = {
            zcard: vitest_1.vi.fn().mockResolvedValue(7),
            ttl: vitest_1.vi.fn().mockResolvedValue(45),
        };
        const algo = new slidingWindow_1.SlidingWindowAlgorithm(client);
        const state = await algo.getState('test-key');
        (0, vitest_1.expect)(state).toEqual({ count: 7, ttl: 45 });
    });
});
//# sourceMappingURL=slidingWindow.test.js.map