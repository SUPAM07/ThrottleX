"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptationDecisionEngine = void 0;
/**
 * Decision engine that translates pattern analysis into concrete limit adjustments.
 */
class AdaptationDecisionEngine {
    minMultiplier;
    maxMultiplier;
    defaultTtlMs;
    constructor(minMultiplier = 0.1, maxMultiplier = 3.0, defaultTtlMs = 60_000) {
        this.minMultiplier = minMultiplier;
        this.maxMultiplier = maxMultiplier;
        this.defaultTtlMs = defaultTtlMs;
    }
    /**
     * Produce an adaptation decision from a signal and analysis data.
     */
    decide(signal, suggestedMultiplier, confidence, reason, scope = 'global') {
        const clampedMultiplier = Math.max(this.minMultiplier, Math.min(this.maxMultiplier, suggestedMultiplier));
        // Only apply decisions we're confident about (>50%)
        const effectiveMultiplier = confidence >= 0.5 ? clampedMultiplier : 1.0;
        return {
            signal,
            limitMultiplier: effectiveMultiplier,
            confidence,
            reason,
            scope,
            timestamp: Date.now(),
            ttlMs: this.defaultTtlMs,
        };
    }
    /**
     * Check whether a decision is still in effect.
     */
    isExpired(decision) {
        return Date.now() > decision.timestamp + decision.ttlMs;
    }
}
exports.AdaptationDecisionEngine = AdaptationDecisionEngine;
exports.default = AdaptationDecisionEngine;
//# sourceMappingURL=adaptationDecision.js.map