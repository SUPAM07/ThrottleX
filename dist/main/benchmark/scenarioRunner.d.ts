import type { BenchmarkRequest, BenchmarkResult } from '../models';
interface ScenarioCheckFn {
    (key: string): Promise<{
        allowed: boolean;
    }>;
}
/**
 * Orchestrates benchmark scenarios using LoadGenerator, LatencyTracker,
 * and ThroughputCalculator components.
 */
export declare class ScenarioRunner {
    private readonly generator;
    private readonly latency;
    private readonly throughput;
    constructor();
    /**
     * Run a complete benchmark scenario.
     */
    run(request: BenchmarkRequest, checkFn: ScenarioCheckFn): Promise<BenchmarkResult>;
    /**
     * Run multiple scenarios in sequence.
     */
    runSuite(scenarios: BenchmarkRequest[], checkFn: ScenarioCheckFn): Promise<BenchmarkResult[]>;
}
export default ScenarioRunner;
//# sourceMappingURL=scenarioRunner.d.ts.map