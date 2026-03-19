/**
 * HDR-histogram-inspired latency tracker for benchmark measurements.
 * Tracks P50, P95, P99, min, max, and mean latencies.
 */
export declare class LatencyTracker {
    private samples;
    private sorted;
    /**
     * Record a latency measurement in milliseconds.
     */
    record(latencyMs: number): void;
    /**
     * Get a percentile value (0–100).
     */
    percentile(p: number): number;
    get p50(): number;
    get p95(): number;
    get p99(): number;
    get min(): number;
    get max(): number;
    get mean(): number;
    get count(): number;
    /**
     * Get a full summary of all tracked latencies.
     */
    getSummary(): {
        count: number;
        min: number;
        max: number;
        mean: number;
        p50: number;
        p95: number;
        p99: number;
    };
    /**
     * Reset all tracked samples.
     */
    reset(): void;
    private ensureSorted;
}
export default LatencyTracker;
//# sourceMappingURL=latencyTracker.d.ts.map