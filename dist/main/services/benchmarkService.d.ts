import type { BenchmarkRequest, BenchmarkResult } from '../models';
interface CheckFn {
    (key: string): Promise<{
        allowed: boolean;
    }>;
}
/**
 * Orchestrates load generation scenarios for benchmarking the rate limiter.
 * Supports burst, sustained, mixed, and stress test scenarios.
 */
export declare class BenchmarkService {
    /**
     * Run a benchmark scenario.
     * @param request  Benchmark configuration
     * @param checkFn Function to call for each rate-limit check
     */
    run(request: BenchmarkRequest, checkFn: CheckFn): Promise<BenchmarkResult>;
    private sleep;
}
export default BenchmarkService;
//# sourceMappingURL=benchmarkService.d.ts.map