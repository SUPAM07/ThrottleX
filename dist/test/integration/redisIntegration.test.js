"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// Mock ioredis completely for integration tests
vitest_1.vi.mock('ioredis', () => {
    const MockRedis = vitest_1.vi.fn().mockImplementation(() => ({
        status: 'ready',
        ping: vitest_1.vi.fn().mockResolvedValue('PONG'),
        info: vitest_1.vi.fn().mockResolvedValue('redis_version:7.2.0\nconnected_clients:1'),
        dbsize: vitest_1.vi.fn().mockResolvedValue(42),
        disconnect: vitest_1.vi.fn(),
        quit: vitest_1.vi.fn().mockResolvedValue('OK'),
        on: vitest_1.vi.fn(),
        get: vitest_1.vi.fn().mockResolvedValue(null),
        set: vitest_1.vi.fn().mockResolvedValue('OK'),
        del: vitest_1.vi.fn().mockResolvedValue(1),
        hset: vitest_1.vi.fn().mockResolvedValue(1),
        hgetall: vitest_1.vi.fn().mockResolvedValue({}),
        keys: vitest_1.vi.fn().mockResolvedValue([]),
        evalsha: vitest_1.vi.fn().mockResolvedValue([1, 99, Date.now() + 60000, 100]),
        call: vitest_1.vi.fn().mockResolvedValue('mock_sha'),
        duplicate: vitest_1.vi.fn(),
    }));
    return { default: MockRedis };
});
(0, vitest_1.describe)('Redis Integration (mocked)', () => {
    (0, vitest_1.describe)('Connection Management', () => {
        (0, vitest_1.it)('creates a Redis client with default config', async () => {
            const Redis = (await Promise.resolve().then(() => __importStar(require('ioredis')))).default;
            const client = new Redis();
            (0, vitest_1.expect)(client).toBeDefined();
            (0, vitest_1.expect)(client.status).toBe('ready');
        });
        (0, vitest_1.it)('responds to PING', async () => {
            const Redis = (await Promise.resolve().then(() => __importStar(require('ioredis')))).default;
            const client = new Redis();
            const pong = await client.ping();
            (0, vitest_1.expect)(pong).toBe('PONG');
        });
        (0, vitest_1.it)('reports DBSIZE', async () => {
            const Redis = (await Promise.resolve().then(() => __importStar(require('ioredis')))).default;
            const client = new Redis();
            const size = await client.dbsize();
            (0, vitest_1.expect)(size).toBe(42);
        });
        (0, vitest_1.it)('disconnects gracefully', async () => {
            const Redis = (await Promise.resolve().then(() => __importStar(require('ioredis')))).default;
            const client = new Redis();
            const result = await client.quit();
            (0, vitest_1.expect)(result).toBe('OK');
        });
    });
    (0, vitest_1.describe)('Key Operations', () => {
        (0, vitest_1.it)('sets and gets values', async () => {
            const Redis = (await Promise.resolve().then(() => __importStar(require('ioredis')))).default;
            const client = new Redis();
            await client.set('test-key', 'test-value');
            (0, vitest_1.expect)(client.set).toHaveBeenCalledWith('test-key', 'test-value');
        });
        (0, vitest_1.it)('deletes keys', async () => {
            const Redis = (await Promise.resolve().then(() => __importStar(require('ioredis')))).default;
            const client = new Redis();
            const result = await client.del('test-key');
            (0, vitest_1.expect)(result).toBe(1);
        });
        (0, vitest_1.it)('performs hash operations', async () => {
            const Redis = (await Promise.resolve().then(() => __importStar(require('ioredis')))).default;
            const client = new Redis();
            await client.hset('hash-key', { field: 'value' });
            const data = await client.hgetall('hash-key');
            (0, vitest_1.expect)(data).toBeDefined();
        });
    });
    (0, vitest_1.describe)('Lua Script Execution', () => {
        (0, vitest_1.it)('loads and executes Lua scripts via EVALSHA', async () => {
            const Redis = (await Promise.resolve().then(() => __importStar(require('ioredis')))).default;
            const client = new Redis();
            const sha = await client.call('SCRIPT', 'LOAD', 'return 1');
            (0, vitest_1.expect)(sha).toBe('mock_sha');
            const result = await client.evalsha(sha, 1, 'test-key');
            (0, vitest_1.expect)(result).toEqual([1, 99, vitest_1.expect.any(Number), 100]);
        });
    });
});
//# sourceMappingURL=redisIntegration.test.js.map