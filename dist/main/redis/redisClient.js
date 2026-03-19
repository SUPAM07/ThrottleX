"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisClient = createRedisClient;
exports.getRedisClient = getRedisClient;
exports.pingRedis = pingRedis;
exports.closeRedis = closeRedis;
const ioredis_1 = __importDefault(require("ioredis"));
const redisConfig_1 = __importDefault(require("../config/redisConfig"));
const logger_1 = __importDefault(require("../utils/logger"));
let redisInstance = null;
function createRedisClient() {
    const client = new ioredis_1.default(redisConfig_1.default.url, {
        password: redisConfig_1.default.password,
        db: redisConfig_1.default.db,
        maxRetriesPerRequest: redisConfig_1.default.maxRetriesPerRequest,
        connectTimeout: redisConfig_1.default.connectTimeout,
        commandTimeout: redisConfig_1.default.commandTimeout,
        enableReadyCheck: redisConfig_1.default.enableReadyCheck,
        lazyConnect: redisConfig_1.default.lazyConnect,
        keepAlive: redisConfig_1.default.keepAlive,
        retryStrategy(times) {
            if (times > 10) {
                logger_1.default.error('Redis: max reconnection attempts reached');
                return null;
            }
            const delay = Math.min(times * 200, 5000);
            logger_1.default.warn(`Redis: reconnecting in ${delay}ms (attempt ${times})`);
            return delay;
        },
    });
    client.on('connect', () => logger_1.default.info('Redis: connected'));
    client.on('ready', () => logger_1.default.info('Redis: ready'));
    client.on('error', (err) => logger_1.default.error('Redis error', { error: err.message }));
    client.on('close', () => logger_1.default.warn('Redis: connection closed'));
    client.on('reconnecting', () => logger_1.default.warn('Redis: reconnecting...'));
    client.on('end', () => logger_1.default.warn('Redis: connection ended'));
    return client;
}
function getRedisClient() {
    if (!redisInstance) {
        redisInstance = createRedisClient();
    }
    return redisInstance;
}
async function pingRedis() {
    try {
        const client = getRedisClient();
        const result = await client.ping();
        return result === 'PONG';
    }
    catch {
        return false;
    }
}
async function closeRedis() {
    if (redisInstance) {
        await redisInstance.quit();
        redisInstance = null;
        logger_1.default.info('Redis: connection closed gracefully');
    }
}
exports.default = getRedisClient;
//# sourceMappingURL=redisClient.js.map