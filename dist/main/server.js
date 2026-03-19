"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const redisClient_1 = require("./redis/redisClient");
const logger_1 = __importDefault(require("./utils/logger"));
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
async function start() {
    // Initialize Redis connection
    const redis = (0, redisClient_1.getRedisClient)();
    try {
        await redis.ping();
        logger_1.default.info('Redis connection established');
    }
    catch (err) {
        logger_1.default.warn('Could not connect to Redis at startup — will retry automatically', { error: err.message });
    }
    const server = app_1.default.listen(PORT, HOST, () => {
        logger_1.default.info(`🚀 Distributed Rate Limiter running`, {
            url: `http://${HOST}:${PORT}`,
            env: process.env.NODE_ENV || 'development',
            pid: process.pid,
        });
        logger_1.default.info('📊 Endpoints:', {
            health: `http://localhost:${PORT}/health`,
            metrics: `http://localhost:${PORT}/metrics`,
            rateLimit: `http://localhost:${PORT}/rate-limit/check`,
            docs: `http://localhost:${PORT}/api-docs`,
        });
    });
    // Graceful shutdown handler
    const shutdown = async (signal) => {
        logger_1.default.info(`${signal} received — shutting down gracefully`);
        server.close(async () => {
            await (0, redisClient_1.closeRedis)();
            logger_1.default.info('Server shut down cleanly');
            process.exit(0);
        });
        // Force exit after 10 seconds
        setTimeout(() => {
            logger_1.default.error('Forced shutdown after timeout');
            process.exit(1);
        }, 10_000).unref();
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('uncaughtException', (err) => {
        logger_1.default.error('Uncaught exception', { error: err.message, stack: err.stack });
        process.exit(1);
    });
    process.on('unhandledRejection', (reason) => {
        logger_1.default.error('Unhandled promise rejection', { reason });
        process.exit(1);
    });
}
start().catch((err) => {
    logger_1.default.error('Failed to start server', { error: err.message });
    process.exit(1);
});
//# sourceMappingURL=server.js.map