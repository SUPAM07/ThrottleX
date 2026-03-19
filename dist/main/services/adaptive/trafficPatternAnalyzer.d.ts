export type AdaptationSignal = 'SCALE_UP' | 'SCALE_DOWN' | 'ALERT' | 'THROTTLE' | 'STABLE';
export interface TrafficWindow {
    timestamp: number;
    requestCount: number;
    rejectionRate: number;
}
export interface PatternAnalysis {
    signal: AdaptationSignal;
    ema: number;
    variance: number;
    zScore: number;
    anomalyScore: number;
    confidence: number;
    suggestedLimitMultiplier: number;
    reason: string;
}
/**
 * Adaptive rate limiting engine using Exponential Moving Average + Z-score anomaly detection
 */
export declare class TrafficPatternAnalyzer {
    private windows;
    private ema;
    private emaVariance;
    addSample(requestCount: number, rejectionRate: number): void;
    analyze(): PatternAnalysis;
    private stableResult;
    reset(): void;
}
export default TrafficPatternAnalyzer;
//# sourceMappingURL=trafficPatternAnalyzer.d.ts.map