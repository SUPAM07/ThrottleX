"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fallbackLimiter = exports.FallbackLimiter = void 0;
const constants_1 = require("../constants");
const logger_1 = __importDefault(require("../logger"));
// Simple in-memory fallback rate limiter when Redis is unavailable
class InMemoryCounter {
    counts = new Map();
    increment(key, windowMs) {
        const now = Date.now();
        const existing = this.counts.get(key);
        if (existing && existing.resetAt > now) {
            existing.count++;
            return existing;
        }
        const entry = { count: 1, resetAt: now + windowMs };
        this.counts.set(key, entry);
        return entry;
    }
    cleanup() {
        const now = Date.now();
        for (const [key, value] of this.counts) {
            if (value.resetAt <= now)
                this.counts.delete(key);
        }
    }
}
const counter = new InMemoryCounter();
// Cleanup expired entries every 60 seconds
setInterval(() => counter.cleanup(), 60_000).unref();
class FallbackLimiter {
    degradedLimitMultiplier = 0.5; // 50% of normal limit in degraded mode
    check(key, config) {
        const { limit, windowMs } = config;
        const degradedLimit = Math.max(1, Math.floor(limit * this.degradedLimitMultiplier));
        const { count, resetAt } = counter.increment(key, windowMs);
        const allowed = count <= degradedLimit;
        logger_1.default.warn('Fallback limiter active (Redis unavailable)', { key, count, limit: degradedLimit });
        return {
            allowed,
            remaining: Math.max(0, degradedLimit - count),
            limit: degradedLimit,
            resetMs: resetAt,
            algorithm: `fallback:${config.algorithm || constants_1.ALGORITHMS.FIXED_WINDOW}`,
            key,
            metadata: { degraded: true, originalLimit: limit },
        };
    }
}
exports.FallbackLimiter = FallbackLimiter;
exports.fallbackLimiter = new FallbackLimiter();
exports.default = FallbackLimiter;
//# sourceMappingURL=fallbackLimiter.js.map