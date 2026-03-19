/**
 * Calculates throughput (requests per second) over a sliding window.
 */
export declare class ThroughputCalculator {
    private timestamps;
    private readonly windowMs;
    constructor(windowMs?: number);
    /**
     * Record a request timestamp.
     */
    record(): void;
    /**
     * Get the current RPS (requests per second) based on the sliding window.
     */
    getRps(): number;
    /**
     * Get throughput statistics.
     */
    getStats(): {
        currentRps: number;
        totalRequests: number;
        windowMs: number;
    };
    /**
     * Reset all recordings.
     */
    reset(): void;
    private cleanup;
}
export default ThroughputCalculator;
//# sourceMappingURL=throughputCalculator.d.ts.map