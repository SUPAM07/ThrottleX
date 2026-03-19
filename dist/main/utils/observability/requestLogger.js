"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLogger = void 0;
const logger_1 = __importDefault(require("../logger"));
/**
 * Structured request logger for rate limiter operations.
 * Produces machine-parseable log entries for observability pipelines.
 */
class RequestLogger {
    static instance;
    static getInstance() {
        if (!RequestLogger.instance) {
            RequestLogger.instance = new RequestLogger();
        }
        return RequestLogger.instance;
    }
    /**
     * Log a rate limit check event.
     */
    logRateLimitCheck(entry) {
        const fullEntry = {
            ...entry,
            timestamp: new Date().toISOString(),
        };
        logger_1.default.info('rate_limit_check', fullEntry);
    }
    /**
     * Log an admin operation.
     */
    logAdminOperation(operation, details) {
        logger_1.default.info('admin_operation', {
            operation,
            ...details,
            timestamp: new Date().toISOString(),
        });
    }
    /**
     * Log a security event (blocked IP, invalid API key, etc.).
     */
    logSecurityEvent(event, details) {
        logger_1.default.warn('security_event', {
            event,
            ...details,
            timestamp: new Date().toISOString(),
        });
    }
    /**
     * Log an adaptive signal change.
     */
    logAdaptiveSignal(key, signal, details) {
        logger_1.default.info('adaptive_signal', {
            key,
            signal,
            ...details,
            timestamp: new Date().toISOString(),
        });
    }
}
exports.RequestLogger = RequestLogger;
exports.default = RequestLogger;
//# sourceMappingURL=requestLogger.js.map