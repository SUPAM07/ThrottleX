"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
const algorithmFactory_1 = require("./algorithmFactory");
const circuitBreaker_1 = require("../../../utils/resilience/circuitBreaker");
const fallbackLimiter_1 = require("../../../utils/resilience/fallbackLimiter");
const prometheusMetrics_1 = require("../../../utils/observability/prometheusMetrics");
const keyGenerator_1 = require("../keys/keyGenerator");
const logger_1 = __importDefault(require("../../../utils/logger"));
const timeUtils_1 = require("../../../utils/timeUtils");
/**
 * Main rate limiter orchestrator.
 * Wraps algorithm resolution, circuit breaker, fallback, and metrics into a single entry point.
 */
class RateLimiter {
    opts;
    factory;
    circuitBreaker;
    fallback;
    metricsEnabled;
    constructor(opts) {
        this.opts = opts;
        this.factory = new algorithmFactory_1.AlgorithmFactory(opts.redis);
        this.circuitBreaker = new circuitBreaker_1.CircuitBreaker('rate-limiter');
        this.fallback = new fallbackLimiter_1.FallbackLimiter();
        this.metricsEnabled = opts.metricsEnabled ?? true;
    }
    /**
     * Check whether a request should be allowed.
     */
    async check(key, config = {}) {
        const start = (0, timeUtils_1.nowMs)();
        const fullConfig = this.resolveConfig(config);
        const prefixedKey = keyGenerator_1.KeyGenerator.generate({ algorithm: fullConfig.algorithm, key });
        try {
            const response = await this.circuitBreaker.execute(async () => {
                const algorithm = await this.factory.create(fullConfig.algorithm);
                return algorithm.check(prefixedKey, fullConfig);
            }, async () => this.fallback.check(prefixedKey, fullConfig));
            const latencyMs = (0, timeUtils_1.nowMs)() - start;
            if (this.metricsEnabled) {
                this.recordMetrics(fullConfig.algorithm, response.allowed, latencyMs);
            }
            return { ...response, latencyMs };
        }
        catch (error) {
            logger_1.default.error('Rate limiter check failed', { key, error });
            // Fail-open: allow the request on error
            return {
                allowed: true,
                remaining: -1,
                limit: fullConfig.limit,
                resetMs: start + fullConfig.windowMs,
                algorithm: fullConfig.algorithm,
                key: prefixedKey,
                latencyMs: (0, timeUtils_1.nowMs)() - start,
                metadata: { error: 'fail_open' },
            };
        }
    }
    /**
     * Reset rate limit state for a key.
     */
    async reset(key, algorithm) {
        const algo = algorithm || this.opts.defaultAlgorithm || 'token_bucket';
        const prefixedKey = keyGenerator_1.KeyGenerator.generate({ algorithm: algo, key });
        const alg = await this.factory.create(algo);
        await alg.reset(prefixedKey);
    }
    /**
     * Get current state of a rate limit key.
     */
    async getState(key, algorithm) {
        const algo = algorithm || this.opts.defaultAlgorithm || 'token_bucket';
        const prefixedKey = keyGenerator_1.KeyGenerator.generate({ algorithm: algo, key });
        const alg = await this.factory.create(algo);
        return alg.getState(prefixedKey);
    }
    getCircuitBreakerState() {
        return this.circuitBreaker.getState();
    }
    resolveConfig(partial) {
        return {
            algorithm: partial.algorithm || this.opts.defaultAlgorithm || 'token_bucket',
            limit: partial.limit || this.opts.defaultLimit || 100,
            windowMs: partial.windowMs || this.opts.defaultWindowMs || 60_000,
            burstSize: partial.burstSize,
            refillRate: partial.refillRate,
            drainRate: partial.drainRate,
            capacity: partial.capacity,
            components: partial.components,
            combinationMode: partial.combinationMode,
        };
    }
    recordMetrics(algorithm, allowed, latencyMs) {
        try {
            prometheusMetrics_1.requestsTotal.inc({ algorithm, tenant: 'default' });
            if (allowed) {
                prometheusMetrics_1.requestsAllowed.inc({ algorithm, tenant: 'default' });
            }
            else {
                prometheusMetrics_1.requestsRejected.inc({ algorithm, tenant: 'default' });
            }
            prometheusMetrics_1.requestDuration.observe({ algorithm }, latencyMs / 1000);
        }
        catch {
            // Metrics should never block the main path
        }
    }
}
exports.RateLimiter = RateLimiter;
exports.default = RateLimiter;
//# sourceMappingURL=rateLimiter.js.map