"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitMiddleware = rateLimitMiddleware;
const rateLimiterService_1 = require("../services/rateLimiterService");
const ipAddressExtractor_1 = require("../services/security/ipAddressExtractor");
const constants_1 = require("../utils/constants");
const timeUtils_1 = require("../utils/timeUtils");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Core rate limit middleware — applies rate limiting then sets standard response headers
 */
function rateLimitMiddleware(options = {}) {
    return async (req, res, next) => {
        const ip = ipAddressExtractor_1.ipExtractor.extract(req);
        const key = options.key ? options.key(req) : ip;
        try {
            const result = await rateLimiterService_1.rateLimiterService.check({
                key,
                algorithm: options.algorithm,
                limit: options.limit,
                windowMs: options.windowMs,
                endpoint: req.path,
                ip,
                tenantId: req.context?.tenantId,
                userId: req.context?.userId,
            });
            // Set rate limit headers
            res.set(constants_1.HEADERS.RATE_LIMIT_LIMIT, String(result.limit));
            res.set(constants_1.HEADERS.RATE_LIMIT_REMAINING, String(result.remaining));
            res.set(constants_1.HEADERS.RATE_LIMIT_RESET, String(Math.ceil(result.resetMs / 1000)));
            res.set(constants_1.HEADERS.RATE_LIMIT_ALGORITHM, result.algorithm);
            if (!result.allowed) {
                const retryAfter = Math.ceil((result.resetMs - (0, timeUtils_1.nowMs)()) / 1000);
                res.set(constants_1.HEADERS.RATE_LIMIT_RETRY_AFTER, String(retryAfter));
                logger_1.default.warn('Request rate limited', { key, algorithm: result.algorithm, ip });
                res.status(constants_1.HTTP_STATUS.TOO_MANY_REQUESTS).json({
                    error: 'Too Many Requests',
                    message: `Rate limit exceeded. Retry after ${retryAfter} seconds.`,
                    retryAfter,
                    limit: result.limit,
                    remaining: 0,
                    resetAt: new Date(result.resetMs).toISOString(),
                    algorithm: result.algorithm,
                });
                return;
            }
            next();
        }
        catch (error) {
            logger_1.default.error('Rate limit middleware error', { error: error.message });
            // Fail-open: allow request on error
            next();
        }
    };
}
exports.default = rateLimitMiddleware;
//# sourceMappingURL=rateLimitMiddleware.js.map