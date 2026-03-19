"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
vitest_1.vi.mock('../../src/redis/redisClient', () => ({
    getRedisClient: () => ({
        evalsha: vitest_1.vi.fn().mockResolvedValue([1, 99, Date.now() + 60000, 100]),
        call: vitest_1.vi.fn().mockResolvedValue('mock_sha'),
        hgetall: vitest_1.vi.fn().mockResolvedValue({ queue: '5', last_drain: String(Date.now()) }),
        del: vitest_1.vi.fn().mockResolvedValue(1),
    }),
    default: () => ({}),
}));
vitest_1.vi.mock('fs', () => ({
    default: { readFileSync: () => 'return {1, 99, 60000, 100}' },
    readFileSync: () => 'return {1, 99, 60000, 100}',
}));
const leakyBucket_1 = require("@/services/ratelimit/algorithms/leakyBucket");
(0, vitest_1.describe)('LeakyBucket', () => {
    (0, vitest_1.it)('has a valid algorithm name', () => {
        const algo = new leakyBucket_1.LeakyBucketAlgorithm({});
        (0, vitest_1.expect)(algo.name).toBe('leaky_bucket');
    });
    (0, vitest_1.it)('implements the RateLimitAlgorithm interface', () => {
        const algo = new leakyBucket_1.LeakyBucketAlgorithm({});
        (0, vitest_1.expect)(typeof algo.check).toBe('function');
        (0, vitest_1.expect)(typeof algo.reset).toBe('function');
        (0, vitest_1.expect)(typeof algo.getState).toBe('function');
    });
    (0, vitest_1.it)('reset deletes the key from Redis', async () => {
        const delFn = vitest_1.vi.fn().mockResolvedValue(1);
        const client = { del: delFn };
        const algo = new leakyBucket_1.LeakyBucketAlgorithm(client);
        await algo.reset('leak-key');
        (0, vitest_1.expect)(delFn).toHaveBeenCalledWith('leak-key');
    });
    (0, vitest_1.it)('getState returns queue and lastDrain for existing keys', async () => {
        const client = {
            hgetall: vitest_1.vi.fn().mockResolvedValue({ queue: '10', last_drain: '1700000000' }),
        };
        const algo = new leakyBucket_1.LeakyBucketAlgorithm(client);
        const state = await algo.getState('test-key');
        (0, vitest_1.expect)(state).toBeTruthy();
        (0, vitest_1.expect)(state.queue).toBe(10);
        (0, vitest_1.expect)(state.lastDrain).toBe(1700000000);
    });
    (0, vitest_1.it)('getState returns null for non-existent keys', async () => {
        const client = {
            hgetall: vitest_1.vi.fn().mockResolvedValue(null),
        };
        const algo = new leakyBucket_1.LeakyBucketAlgorithm(client);
        const state = await algo.getState('missing-key');
        (0, vitest_1.expect)(state).toBeNull();
    });
    (0, vitest_1.it)('getState returns null for empty hash', async () => {
        const client = {
            hgetall: vitest_1.vi.fn().mockResolvedValue({}),
        };
        const algo = new leakyBucket_1.LeakyBucketAlgorithm(client);
        const state = await algo.getState('empty-key');
        (0, vitest_1.expect)(state).toBeNull();
    });
});
//# sourceMappingURL=leakyBucket.test.js.map