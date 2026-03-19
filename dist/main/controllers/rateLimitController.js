"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRateLimit = checkRateLimit;
exports.resetRateLimit = resetRateLimit;
const rateLimiterService_1 = require("../services/rateLimiterService");
const validation_1 = require("../utils/validation");
const constants_1 = require("../utils/constants");
/**
 * POST /rate-limit/check
 * Check if a request should be allowed based on the configured rate limit
 */
async function checkRateLimit(req, res) {
    const input = (0, validation_1.validate)(validation_1.RateLimitRequestSchema, req.body);
    const result = await rateLimiterService_1.rateLimiterService.check(input);
    res.status(result.allowed ? constants_1.HTTP_STATUS.OK : constants_1.HTTP_STATUS.TOO_MANY_REQUESTS).json(result);
}
/**
 * DELETE /rate-limit/reset/:key
 */
async function resetRateLimit(req, res) {
    const { key } = req.params;
    const algorithm = req.query.algorithm;
    await rateLimiterService_1.rateLimiterService.reset(key, algorithm);
    res.status(constants_1.HTTP_STATUS.NO_CONTENT).send();
}
//# sourceMappingURL=rateLimitController.js.map