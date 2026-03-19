/**
 * Generates concurrent requests at a target rate.
 * Used by the benchmark suite for load testing.
 */
export declare class LoadGenerator {
    private running;
    private requestCount;
    /**
     * Generate load at a target rate for a specified duration.
     *
     * @param targetRps    Target requests per second
     * @param durationMs   How long to generate load
     * @param concurrency  Number of concurrent workers
     * @param requestFn    Function to execute per request
     * @returns Total requests generated
     */
    generate(targetRps: number, durationMs: number, concurrency: number, requestFn: (requestId: number) => Promise<void>): Promise<number>;
    /**
     * Stop the generator.
     */
    stop(): void;
    /**
     * Get the current request count.
     */
    getRequestCount(): number;
    private sleep;
}
export default LoadGenerator;
//# sourceMappingURL=loadGenerator.d.ts.map