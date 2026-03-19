"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRetry = withRetry;
const helpers_1 = require("../helpers");
const logger_1 = __importDefault(require("../logger"));
const defaultOptions = {
    maxRetries: 3,
    baseDelayMs: 50,
    maxDelayMs: 2000,
    jitterFactor: 0.3,
    retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'ERR_CLOSED'],
};
async function withRetry(fn, options = {}) {
    const opts = { ...defaultOptions, ...options };
    let lastError;
    for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            const isRetryable = shouldRetry(lastError, opts.retryableErrors);
            if (attempt < opts.maxRetries && isRetryable) {
                const delay = calculateDelay(attempt, opts);
                logger_1.default.warn('Retrying operation', { attempt: attempt + 1, delayMs: delay, error: lastError.message });
                await (0, helpers_1.sleep)(delay);
            }
            else {
                break;
            }
        }
    }
    throw lastError;
}
function shouldRetry(error, retryableErrors) {
    if (!retryableErrors || retryableErrors.length === 0)
        return true;
    return retryableErrors.some((code) => error.message.includes(code) || error.code === code);
}
function calculateDelay(attempt, opts) {
    const exponential = opts.baseDelayMs * Math.pow(2, attempt);
    const capped = Math.min(exponential, opts.maxDelayMs);
    const jitter = capped * opts.jitterFactor * Math.random();
    return Math.floor(capped + jitter);
}
exports.default = withRetry;
//# sourceMappingURL=retryStrategy.js.map