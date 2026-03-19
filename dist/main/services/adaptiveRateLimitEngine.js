"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptiveRateLimitEngine = exports.AdaptiveRateLimitEngine = void 0;
const rateLimiterConfig_1 = __importDefault(require("../config/rateLimiterConfig"));
const trafficAnalysisService_1 = require("./trafficAnalysisService");
const adaptationDecision_1 = require("./adaptive/adaptationDecision");
const logger_1 = __importDefault(require("../utils/logger"));
class AdaptiveRateLimitEngine {
    trafficAnalysisService;
    manualOverrides = new Map();
    timers = [];
    decisionEngine;
    constructor(trafficAnalysisService) {
        this.trafficAnalysisService = trafficAnalysisService;
        this.decisionEngine = new adaptationDecision_1.AdaptationDecisionEngine(1 / rateLimiterConfig_1.default.adaptiveMaxAdjustmentFactor, rateLimiterConfig_1.default.adaptiveMaxAdjustmentFactor, rateLimiterConfig_1.default.adaptiveEvaluationIntervalMs * 2 // TTL is double the interval
        );
    }
    /**
     * Start the periodic evaluation task.
     */
    start() {
        if (!rateLimiterConfig_1.default.adaptiveEnabled)
            return;
        logger_1.default.info('Starting Adaptive ML Rate Limit Engine evaluation task');
        const timer = setInterval(() => {
            this.evaluateAll();
        }, rateLimiterConfig_1.default.adaptiveEvaluationIntervalMs);
        this.timers.push(timer);
    }
    /**
     * Stop the periodic evaluation task.
     */
    stop() {
        for (const timer of this.timers) {
            clearInterval(timer);
        }
        this.timers = [];
    }
    /**
     * Evaluates all tracked keys and computes heuristic logic constraint-checked limits.
     */
    evaluateAll() {
        // Phase 1 implementation applies rules proactively and logs.
        const stats = this.trafficAnalysisService.getAggregateStats();
        logger_1.default.info('Adaptive Engine Evaluation Cycle Started', { stats });
        // Core decision-making logic is driven through analyzing the TrafficPatternAnalyzer inside applyAdaptiveAdjustment proactively currently.
    }
    /**
     * Get the adaptive limit for a given key, considering bounds, confidence, and overrides.
     * If there is a manual override, it returns the explicit limit.
     */
    getAdjustedLimit(key, baseLimit, suggestedMultiplier, confidence, signal, reason) {
        if (this.manualOverrides.has(key)) {
            return this.manualOverrides.get(key);
        }
        if (signal === 'STABLE' || confidence < rateLimiterConfig_1.default.adaptiveMinConfidenceThreshold) {
            return baseLimit;
        }
        const decision = this.decisionEngine.decide(signal, suggestedMultiplier, confidence, reason, key);
        const minLimit = rateLimiterConfig_1.default.adaptiveMinCapacity;
        const maxLimit = rateLimiterConfig_1.default.adaptiveMaxCapacity;
        const adjustedLimit = Math.floor(baseLimit * decision.limitMultiplier);
        return Math.max(minLimit, Math.min(maxLimit, adjustedLimit));
    }
    setManualOverride(key, limit) {
        this.manualOverrides.set(key, limit);
        logger_1.default.info(`Manual override set for ${key}: ${limit}`);
    }
    clearManualOverride(key) {
        this.manualOverrides.delete(key);
        logger_1.default.info(`Manual override cleared for ${key}`);
    }
    getStatus(key, currentMultiplier = 1.0) {
        return {
            key,
            enabled: rateLimiterConfig_1.default.adaptiveEnabled,
            isOverridden: this.manualOverrides.has(key),
            overrideLimit: this.manualOverrides.get(key),
            currentMultiplier,
            lastEvaluated: Date.now(), // Abstracted for now
        };
    }
    getConfig() {
        return {
            enabled: rateLimiterConfig_1.default.adaptiveEnabled,
            evaluationIntervalMs: rateLimiterConfig_1.default.adaptiveEvaluationIntervalMs,
            minConfidenceThreshold: rateLimiterConfig_1.default.adaptiveMinConfidenceThreshold,
            maxAdjustmentFactor: rateLimiterConfig_1.default.adaptiveMaxAdjustmentFactor,
            minCapacity: rateLimiterConfig_1.default.adaptiveMinCapacity,
            maxCapacity: rateLimiterConfig_1.default.adaptiveMaxCapacity,
        };
    }
}
exports.AdaptiveRateLimitEngine = AdaptiveRateLimitEngine;
// Ensure the singleton binds to existing traffic service
const defaultTrafficService = new trafficAnalysisService_1.TrafficAnalysisService();
exports.adaptiveRateLimitEngine = new AdaptiveRateLimitEngine(defaultTrafficService);
exports.default = AdaptiveRateLimitEngine;
//# sourceMappingURL=adaptiveRateLimitEngine.js.map