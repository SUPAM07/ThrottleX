"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redisConfig = {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0', 10),
    maxRetriesPerRequest: parseInt(process.env.REDIS_MAX_RETRIES || '3', 10),
    connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT || '5000', 10),
    commandTimeout: parseInt(process.env.REDIS_COMMAND_TIMEOUT || '2000', 10),
    poolSize: parseInt(process.env.REDIS_POOL_SIZE || '10', 10),
    enableReadyCheck: true,
    lazyConnect: false,
    keepAlive: 30000,
    keyPrefix: 'rl:',
};
exports.default = redisConfig;
//# sourceMappingURL=redisConfig.js.map