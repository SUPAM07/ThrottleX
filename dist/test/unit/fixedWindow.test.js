"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
vitest_1.vi.mock('../../src/redis/redisClient', () => ({
    getRedisClient: () => ({
        evalsha: vitest_1.vi.fn().mockResolvedValue([1, 99, Date.now() + 60000, 100]),
        call: vitest_1.vi.fn().mockResolvedValue('mock_sha'),
        get: vitest_1.vi.fn().mockResolvedValue('5'),
        ttl: vitest_1.vi.fn().mockResolvedValue(55),
        del: vitest_1.vi.fn().mockResolvedValue(1),
        keys: vitest_1.vi.fn().mockResolvedValue([]),
    }),
    default: () => ({}),
}));
vitest_1.vi.mock('fs', () => ({
    default: { readFileSync: () => 'return {1, 99, 60000, 100}' },
    readFileSync: () => 'return {1, 99, 60000, 100}',
}));
const fixedWindow_1 = require("@/services/ratelimit/algorithms/fixedWindow");
(0, vitest_1.describe)('FixedWindow', () => {
    (0, vitest_1.it)('has a valid algorithm name', () => {
        const algo = new fixedWindow_1.FixedWindowAlgorithm({});
        (0, vitest_1.expect)(algo.name).toBe('fixed_window');
    });
    (0, vitest_1.it)('implements the RateLimitAlgorithm interface', () => {
        const algo = new fixedWindow_1.FixedWindowAlgorithm({});
        (0, vitest_1.expect)(typeof algo.check).toBe('function');
        (0, vitest_1.expect)(typeof algo.reset).toBe('function');
        (0, vitest_1.expect)(typeof algo.getState).toBe('function');
    });
    (0, vitest_1.it)('getState returns count and ttl when keys exist', async () => {
        const client = {
            keys: vitest_1.vi.fn().mockResolvedValue(['test-key:fw:123']),
            get: vitest_1.vi.fn().mockResolvedValue('42'),
            ttl: vitest_1.vi.fn().mockResolvedValue(30),
        };
        const algo = new fixedWindow_1.FixedWindowAlgorithm(client);
        const state = await algo.getState('test-key');
        (0, vitest_1.expect)(state).toEqual({ count: 42, ttl: 30 });
    });
    (0, vitest_1.it)('getState returns null when no window keys exist', async () => {
        const client = {
            keys: vitest_1.vi.fn().mockResolvedValue([]),
        };
        const algo = new fixedWindow_1.FixedWindowAlgorithm(client);
        const state = await algo.getState('missing-key');
        (0, vitest_1.expect)(state).toBeNull();
    });
    (0, vitest_1.it)('reset deletes all matching window keys', async () => {
        const delFn = vitest_1.vi.fn().mockResolvedValue(2);
        const client = {
            keys: vitest_1.vi.fn().mockResolvedValue(['key:fw:1', 'key:fw:2']),
            del: delFn,
        };
        const algo = new fixedWindow_1.FixedWindowAlgorithm(client);
        await algo.reset('key');
        (0, vitest_1.expect)(delFn).toHaveBeenCalledWith('key:fw:1', 'key:fw:2');
    });
    (0, vitest_1.it)('reset does nothing when no matching keys exist', async () => {
        const delFn = vitest_1.vi.fn();
        const client = {
            keys: vitest_1.vi.fn().mockResolvedValue([]),
            del: delFn,
        };
        const algo = new fixedWindow_1.FixedWindowAlgorithm(client);
        await algo.reset('key');
        (0, vitest_1.expect)(delFn).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=fixedWindow.test.js.map