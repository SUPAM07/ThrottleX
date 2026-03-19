"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthFull = healthFull;
exports.healthLive = healthLive;
exports.healthReady = healthReady;
const healthCheck_1 = require("../utils/observability/healthCheck");
const constants_1 = require("../utils/constants");
async function healthFull(req, res) {
    const status = await (0, healthCheck_1.getHealthStatus)();
    const httpStatus = status.status === 'healthy'
        ? constants_1.HTTP_STATUS.OK
        : status.status === 'degraded'
            ? 200
            : constants_1.HTTP_STATUS.SERVICE_UNAVAILABLE;
    res.status(httpStatus).json(status);
}
async function healthLive(req, res) {
    res.status(constants_1.HTTP_STATUS.OK).json({ status: 'alive', timestamp: new Date().toISOString() });
}
async function healthReady(req, res) {
    const status = await (0, healthCheck_1.getHealthStatus)();
    const isReady = status.checks.redis.status === 'ok';
    res.status(isReady ? constants_1.HTTP_STATUS.OK : constants_1.HTTP_STATUS.SERVICE_UNAVAILABLE).json({
        status: isReady ? 'ready' : 'not_ready',
        redis: status.checks.redis,
    });
}
//# sourceMappingURL=healthController.js.map