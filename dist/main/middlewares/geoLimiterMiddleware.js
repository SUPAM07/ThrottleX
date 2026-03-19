"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geoLimiterMiddleware = geoLimiterMiddleware;
const geoLimiter_1 = require("../services/geo/geoLimiter");
const ipAddressExtractor_1 = require("../services/security/ipAddressExtractor");
const constants_1 = require("../utils/constants");
const logger_1 = __importDefault(require("../utils/logger"));
async function geoLimiterMiddleware(req, res, next) {
    const ip = ipAddressExtractor_1.ipExtractor.extract(req);
    const { blocked, reason, country } = geoLimiter_1.geoLimiter.isBlocked(ip, req);
    if (blocked) {
        logger_1.default.warn('Request blocked by geo policy', { ip, country, reason });
        res.status(constants_1.HTTP_STATUS.FORBIDDEN).json({
            error: 'Forbidden',
            message: 'Access denied from your region',
            country,
            reason,
        });
        return;
    }
    next();
}
exports.default = geoLimiterMiddleware;
//# sourceMappingURL=geoLimiterMiddleware.js.map