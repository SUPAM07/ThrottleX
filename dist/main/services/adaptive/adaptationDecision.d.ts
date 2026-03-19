import type { AdaptationSignal } from './adaptationSignal';
/**
 * Represents a decision made by the adaptive engine about how to adjust rate limits.
 */
export interface AdaptationDecision {
    /** The signal that triggered this decision */
    signal: AdaptationSignal;
    /** Multiplier to apply to the current limit (e.g., 0.8 = reduce by 20%) */
    limitMultiplier: number;
    /** Confidence level 0–1 */
    confidence: number;
    /** Human-readable reason */
    reason: string;
    /** Target key or scope */
    scope: string;
    /** When this decision was made */
    timestamp: number;
    /** Time-to-live: how long this decision should remain in effect (ms) */
    ttlMs: number;
}
/**
 * Decision engine that translates pattern analysis into concrete limit adjustments.
 */
export declare class AdaptationDecisionEngine {
    private readonly minMultiplier;
    private readonly maxMultiplier;
    private readonly defaultTtlMs;
    constructor(minMultiplier?: number, maxMultiplier?: number, defaultTtlMs?: number);
    /**
     * Produce an adaptation decision from a signal and analysis data.
     */
    decide(signal: AdaptationSignal, suggestedMultiplier: number, confidence: number, reason: string, scope?: string): AdaptationDecision;
    /**
     * Check whether a decision is still in effect.
     */
    isExpired(decision: AdaptationDecision): boolean;
}
export default AdaptationDecisionEngine;
//# sourceMappingURL=adaptationDecision.d.ts.map