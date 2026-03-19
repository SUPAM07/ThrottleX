import type { PatternAnalysis, AdaptationSignal } from './adaptive/trafficPatternAnalyzer';
interface TrafficSnapshot {
    key: string;
    timestamp: number;
    requestCount: number;
    rejectionRate: number;
    analysis: PatternAnalysis;
}
/**
 * Real-time traffic pattern analysis service.
 * Aggregates per-key traffic data and produces adaptation signals.
 */
export declare class TrafficAnalysisService {
    private readonly detector;
    private readonly history;
    private readonly maxHistory;
    constructor(maxHistory?: number);
    /**
     * Record traffic data and analyze patterns.
     */
    analyze(key: string, requestCount: number, rejectionRate: number): PatternAnalysis;
    /**
     * Get the most recent snapshots, optionally filtered by signal.
     */
    getRecentSnapshots(limit?: number, signal?: AdaptationSignal): TrafficSnapshot[];
    /**
     * Get aggregate stats across all monitored keys.
     */
    getAggregateStats(): {
        totalKeys: number;
        totalSnapshots: number;
        signalCounts: Record<string, number>;
    };
    reset(): void;
}
export default TrafficAnalysisService;
//# sourceMappingURL=trafficAnalysisService.d.ts.map