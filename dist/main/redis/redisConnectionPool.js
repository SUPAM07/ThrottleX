"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisConnectionPool = void 0;
exports.getConnectionPool = getConnectionPool;
const redisConfig_1 = __importDefault(require("../config/redisConfig"));
const logger_1 = __importDefault(require("../utils/logger"));
const redisClient_1 = require("./redisClient");
class RedisConnectionPool {
    pool = [];
    idle = [];
    size;
    constructor(size = redisConfig_1.default.poolSize) {
        this.size = size;
    }
    async initialize() {
        logger_1.default.info(`Redis pool: initializing ${this.size} connections`);
        for (let i = 0; i < this.size; i++) {
            const client = (0, redisClient_1.createRedisClient)();
            this.pool.push(client);
            this.idle.push(true);
        }
        logger_1.default.info('Redis pool: initialized');
    }
    async acquire() {
        // Find idle connection
        for (let i = 0; i < this.pool.length; i++) {
            if (this.idle[i]) {
                this.idle[i] = false;
                return { client: this.pool[i], index: i };
            }
        }
        // All busy — return a round-robin one anyway
        const index = Math.floor(Math.random() * this.size);
        return { client: this.pool[index], index };
    }
    release(index) {
        if (index >= 0 && index < this.pool.length) {
            this.idle[index] = true;
        }
    }
    async executeWithClient(fn) {
        const { client, index } = await this.acquire();
        try {
            return await fn(client);
        }
        finally {
            this.release(index);
        }
    }
    getStats() {
        const idleCount = this.idle.filter(Boolean).length;
        return { total: this.size, idle: idleCount, busy: this.size - idleCount };
    }
    async close() {
        await Promise.all(this.pool.map((c) => c.quit()));
        this.pool = [];
        this.idle = [];
        logger_1.default.info('Redis pool: all connections closed');
    }
}
exports.RedisConnectionPool = RedisConnectionPool;
let poolInstance = null;
async function getConnectionPool() {
    if (!poolInstance) {
        poolInstance = new RedisConnectionPool();
        await poolInstance.initialize();
    }
    return poolInstance;
}
exports.default = RedisConnectionPool;
//# sourceMappingURL=redisConnectionPool.js.map