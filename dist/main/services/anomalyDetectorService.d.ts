import { type PatternAnalysis } from './adaptive/trafficPatternAnalyzer';
/**
 * Wraps TrafficPatternAnalyzer with persistence-aware anomaly detection.
 * Maintains per-key analyzers and produces adaptation decisions.
 */
export declare class AnomalyDetectorService {
    private readonly analyzers;
    private readonly maxAnalyzers;
    constructor(maxAnalyzers?: number);
    /**
     * Record a traffic sample for a given key and return the current analysis.
     */
    recordAndAnalyze(key: string, requestCount: number, rejectionRate: number): PatternAnalysis;
    /**
     * Get the current analysis for a key without recording a new sample.
     */
    getAnalysis(key: string): PatternAnalysis | null;
    /**
     * Reset the analyzer for a specific key.
     */
    resetKey(key: string): void;
    /**
     * Get the number of active analyzers.
     */
    getActiveCount(): number;
    /**
     * Reset all analyzers.
     */
    resetAll(): void;
}
export default AnomalyDetectorService;
//# sourceMappingURL=anomalyDetectorService.d.ts.map