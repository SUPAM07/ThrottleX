"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// Mock Redis for unit tests
vitest_1.vi.mock('../../src/redis/redisClient', () => ({
    getRedisClient: () => ({
        evalsha: vitest_1.vi.fn().mockResolvedValue([1, 99, Date.now() + 60000, 100]),
        call: vitest_1.vi.fn().mockResolvedValue('mock_sha'),
        hgetall: vitest_1.vi.fn().mockResolvedValue({ tokens: '50', lastRefillTime: String(Date.now()), capacity: '100', refillRate: '1' }),
        del: vitest_1.vi.fn().mockResolvedValue(1),
        hset: vitest_1.vi.fn(),
    }),
    default: () => ({}),
}));
// Mock fs to avoid reading Lua files
vitest_1.vi.mock('fs', () => ({
    default: { readFileSync: () => 'return {1, 99, 60000, 100}' },
    readFileSync: () => 'return {1, 99, 60000, 100}',
}));
const tokenBucket_1 = require("@/services/ratelimit/algorithms/tokenBucket");
(0, vitest_1.describe)('TokenBucket', () => {
    (0, vitest_1.it)('exports a valid algorithm name', () => {
        (0, vitest_1.expect)(tokenBucket_1.TokenBucketAlgorithm).toBeDefined();
        const algo = new tokenBucket_1.TokenBucketAlgorithm({});
        (0, vitest_1.expect)(algo.name).toBe('token_bucket');
    });
    (0, vitest_1.it)('has check, reset, and getState methods', () => {
        const algo = new tokenBucket_1.TokenBucketAlgorithm({});
        (0, vitest_1.expect)(typeof algo.check).toBe('function');
        (0, vitest_1.expect)(typeof algo.reset).toBe('function');
        (0, vitest_1.expect)(typeof algo.getState).toBe('function');
    });
    (0, vitest_1.it)('script SHA is loaded lazily', () => {
        const mockCall = vitest_1.vi.fn().mockResolvedValue('sha256_hash');
        const client = { call: mockCall, evalsha: vitest_1.vi.fn(), hgetall: vitest_1.vi.fn(), del: vitest_1.vi.fn() };
        const algo = new tokenBucket_1.TokenBucketAlgorithm(client);
        // SHA should not be loaded yet
        (0, vitest_1.expect)(mockCall).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=tokenBucket.test.js.map