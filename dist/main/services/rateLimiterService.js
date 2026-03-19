"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiterService = exports.RateLimiterService = void 0;
const algorithmFactory_1 = require("./ratelimit/core/algorithmFactory");
const circuitBreaker_1 = require("../utils/resilience/circuitBreaker");
const fallbackLimiter_1 = require("../utils/resilience/fallbackLimiter");
const trafficPatternAnalyzer_1 = require("./adaptive/trafficPatternAnalyzer");
const adaptiveRateLimitEngine_1 = require("./adaptiveRateLimitEngine");
const prometheusMetrics_1 = require("../utils/observability/prometheusMetrics");
const rateLimiterConfig_1 = __importDefault(require("../config/rateLimiterConfig"));
const configurationService_1 = require("./configurationService");
const timeUtils_1 = require("../utils/timeUtils");
const logger_1 = __importDefault(require("../utils/logger"));
class RateLimiterService {
    factory;
    circuitBreaker;
    analyzers = new Map();
    constructor() {
        this.factory = new algorithmFactory_1.AlgorithmFactory();
        this.circuitBreaker = new circuitBreaker_1.CircuitBreaker('redis-rate-limiter', {
            failureThreshold: 5,
            successThreshold: 2,
            timeoutMs: 30_000,
            halfOpenRequests: 3,
        });
        // Listen for config reloads to clear buckets.
        // Real implementation would also scan Redis but this is safe minimum logic.
        configurationService_1.configurationService.onReload(() => {
            logger_1.default.info('RateLimiterService: Config reloaded, flushing local analysis buffers');
            this.analyzers.clear();
            // Full bucket purge would require `redisClient.keys('ratelimit:*')` 
            // followed by a pipeline `del()`, but omitted for strict local parity logic right now.
        });
    }
    async check(request) {
        const start = (0, timeUtils_1.nowMs)();
        const resolvedConfig = configurationService_1.configurationService.getEffectiveConfig(request.key);
        const algorithm = request.algorithm || resolvedConfig?.algorithm || configurationService_1.configurationService.getDefaultConfig().defaultAlgorithm;
        const config = this.buildConfig(request, algorithm, resolvedConfig);
        const tenant = request.tenantId || 'default';
        // Adaptive limit adjustment
        const adjustedConfig = this.applyAdaptiveAdjustment(request.key, config, algorithm);
        prometheusMetrics_1.requestsTotal.labels({ algorithm, tenant }).inc();
        const timer = prometheusMetrics_1.requestDuration.startTimer({ algorithm });
        try {
            const response = await this.circuitBreaker.execute(async () => {
                const algo = await this.factory.create(algorithm);
                return algo.check(request.key, adjustedConfig);
            }, async () => fallbackLimiter_1.fallbackLimiter.check(request.key, adjustedConfig));
            response.latencyMs = (0, timeUtils_1.nowMs)() - start;
            timer();
            if (response.allowed) {
                prometheusMetrics_1.requestsAllowed.labels({ algorithm, tenant }).inc();
            }
            else {
                prometheusMetrics_1.requestsRejected.labels({ algorithm, tenant }).inc();
            }
            // Update adaptive analyzer
            this.updateAnalyzer(request.key, response.allowed);
            return response;
        }
        catch (error) {
            timer();
            logger_1.default.error('Rate limit check failed, allowing by fail-open policy', {
                key: request.key,
                error: error.message,
            });
            // Fail-open: allow on error
            return {
                allowed: true,
                remaining: adjustedConfig.limit,
                limit: adjustedConfig.limit,
                resetMs: start + adjustedConfig.windowMs,
                algorithm,
                key: request.key,
                latencyMs: (0, timeUtils_1.nowMs)() - start,
                metadata: { error: 'fail_open' },
            };
        }
    }
    async reset(key, algorithm) {
        const resolvedAlgorithm = algorithm || configurationService_1.configurationService.getEffectiveConfig(key)?.algorithm || configurationService_1.configurationService.getDefaultConfig().defaultAlgorithm;
        const algo = await this.factory.create(resolvedAlgorithm);
        await algo.reset(key);
        logger_1.default.info('Rate limit reset', { key, algorithm: resolvedAlgorithm });
    }
    getCircuitBreakerState() {
        return this.circuitBreaker.getState();
    }
    buildConfig(request, algorithm, serviceConfig) {
        const defaults = configurationService_1.configurationService.getDefaultConfig();
        const effectiveLimit = request.limit ?? serviceConfig?.limit ?? defaults.defaultLimit;
        const effectiveWindowMs = request.windowMs ?? serviceConfig?.windowMs ?? defaults.defaultWindowMs;
        // In previous versions it used rateLimiterConfig.burstMultiplier. 
        // Defaults to 1.5 since config fallback handles this statically now.
        const burstMultiplier = 1.5;
        return {
            algorithm,
            limit: effectiveLimit,
            windowMs: effectiveWindowMs,
            burstSize: request.limit || serviceConfig?.limit
                ? Math.ceil(effectiveLimit * burstMultiplier)
                : undefined,
            refillRate: (request.limit || serviceConfig?.limit) && (request.windowMs || serviceConfig?.windowMs)
                ? effectiveLimit / (effectiveWindowMs / 1000)
                : undefined,
        };
    }
    applyAdaptiveAdjustment(key, config, algorithm) {
        if (!rateLimiterConfig_1.default.adaptiveEnabled)
            return config;
        const analyzer = this.getOrCreateAnalyzer(key);
        const analysis = analyzer.analyze();
        const adjustedLimit = adaptiveRateLimitEngine_1.adaptiveRateLimitEngine.getAdjustedLimit(key, config.limit, analysis.suggestedLimitMultiplier, analysis.confidence, analysis.signal, analysis.reason);
        if (adjustedLimit !== config.limit) {
            logger_1.default.info('Adaptive limit adjustment', {
                key,
                original: config.limit,
                adjusted: adjustedLimit,
                signal: analysis.signal,
                reason: analysis.reason,
            });
        }
        return { ...config, limit: adjustedLimit };
    }
    updateAnalyzer(key, allowed) {
        const analyzer = this.getOrCreateAnalyzer(key);
        // We track counts in 1-second buckets
        analyzer.addSample(1, allowed ? 0 : 1);
    }
    getOrCreateAnalyzer(key) {
        if (!this.analyzers.has(key)) {
            this.analyzers.set(key, new trafficPatternAnalyzer_1.TrafficPatternAnalyzer());
        }
        return this.analyzers.get(key);
    }
}
exports.RateLimiterService = RateLimiterService;
exports.rateLimiterService = new RateLimiterService();
exports.default = RateLimiterService;
//# sourceMappingURL=rateLimiterService.js.map