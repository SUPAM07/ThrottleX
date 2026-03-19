"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealthStatus = getHealthStatus;
const redisClient_1 = require("../../redis/redisClient");
const timeUtils_1 = require("../timeUtils");
const startTime = Date.now();
async function getHealthStatus() {
    const uptimeMs = Date.now() - startTime;
    // Redis check
    let redisStatus;
    const redisStart = Date.now();
    try {
        const ok = await (0, redisClient_1.pingRedis)();
        redisStatus = ok
            ? { status: 'ok', latencyMs: Date.now() - redisStart }
            : { status: 'error' };
    }
    catch {
        redisStatus = { status: 'error' };
    }
    // Memory check
    const mem = process.memoryUsage();
    const heapUsedMB = Math.round(mem.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(mem.heapTotal / 1024 / 1024);
    const memStatus = {
        status: heapUsedMB / heapTotalMB > 0.9 ? 'warning' : 'ok',
        heapUsedMB,
        heapTotalMB,
    };
    const allOk = redisStatus.status === 'ok' && memStatus.status === 'ok';
    const partialOk = redisStatus.status === 'ok' || memStatus.status === 'ok';
    return {
        status: allOk ? 'healthy' : partialOk ? 'degraded' : 'unhealthy',
        uptime: (0, timeUtils_1.formatDuration)(uptimeMs),
        uptimeMs,
        timestamp: new Date().toISOString(),
        checks: {
            redis: redisStatus,
            memory: memStatus,
            process: { status: 'ok', pid: process.pid, nodeVersion: process.version },
        },
    };
}
//# sourceMappingURL=healthCheck.js.map