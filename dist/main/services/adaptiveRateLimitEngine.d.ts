import { TrafficAnalysisService } from './trafficAnalysisService';
export interface AdaptiveStatus {
    key: string;
    enabled: boolean;
    isOverridden: boolean;
    overrideLimit?: number;
    currentMultiplier: number;
    lastEvaluated?: number;
}
export declare class AdaptiveRateLimitEngine {
    private readonly trafficAnalysisService;
    private manualOverrides;
    private timers;
    private readonly decisionEngine;
    constructor(trafficAnalysisService: TrafficAnalysisService);
    /**
     * Start the periodic evaluation task.
     */
    start(): void;
    /**
     * Stop the periodic evaluation task.
     */
    stop(): void;
    /**
     * Evaluates all tracked keys and computes heuristic logic constraint-checked limits.
     */
    private evaluateAll;
    /**
     * Get the adaptive limit for a given key, considering bounds, confidence, and overrides.
     * If there is a manual override, it returns the explicit limit.
     */
    getAdjustedLimit(key: string, baseLimit: number, suggestedMultiplier: number, confidence: number, signal: string, reason: string): number;
    setManualOverride(key: string, limit: number): void;
    clearManualOverride(key: string): void;
    getStatus(key: string, currentMultiplier?: number): AdaptiveStatus;
    getConfig(): Record<string, unknown>;
}
export declare const adaptiveRateLimitEngine: AdaptiveRateLimitEngine;
export default AdaptiveRateLimitEngine;
//# sourceMappingURL=adaptiveRateLimitEngine.d.ts.map