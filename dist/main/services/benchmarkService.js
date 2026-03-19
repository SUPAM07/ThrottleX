"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BenchmarkService = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const timeUtils_1 = require("../utils/timeUtils");
/**
 * Orchestrates load generation scenarios for benchmarking the rate limiter.
 * Supports burst, sustained, mixed, and stress test scenarios.
 */
class BenchmarkService {
    /**
     * Run a benchmark scenario.
     * @param request  Benchmark configuration
     * @param checkFn Function to call for each rate-limit check
     */
    async run(request, checkFn) {
        const { scenario, concurrency, durationMs, algorithm } = request;
        logger_1.default.info('Starting benchmark', { scenario, concurrency, durationMs, algorithm });
        const latencies = [];
        let allowed = 0;
        let rejected = 0;
        let errors = 0;
        const stopAt = (0, timeUtils_1.nowMs)() + durationMs;
        let requestId = 0;
        const worker = async () => {
            while ((0, timeUtils_1.nowMs)() < stopAt) {
                const key = `bench:${scenario}:${requestId++}`;
                const start = (0, timeUtils_1.nowMs)();
                try {
                    const result = await checkFn(key);
                    const elapsed = (0, timeUtils_1.nowMs)() - start;
                    latencies.push(elapsed);
                    if (result.allowed)
                        allowed++;
                    else
                        rejected++;
                }
                catch {
                    errors++;
                }
                // For sustained scenario, add small delay between requests
                if (scenario === 'sustained') {
                    await this.sleep(1);
                }
            }
        };
        const start = (0, timeUtils_1.nowMs)();
        const workers = Array.from({ length: concurrency }, () => worker());
        await Promise.all(workers);
        const actualDuration = (0, timeUtils_1.nowMs)() - start;
        const sorted = [...latencies].sort((a, b) => a - b);
        const percentile = (p) => {
            if (sorted.length === 0)
                return 0;
            const idx = Math.ceil((p / 100) * sorted.length) - 1;
            return sorted[Math.max(0, idx)];
        };
        const total = allowed + rejected + errors;
        const result = {
            scenario,
            totalRequests: total,
            allowedRequests: allowed,
            rejectedRequests: rejected,
            durationMs: actualDuration,
            actualRps: total / (actualDuration / 1000),
            p50LatencyMs: percentile(50),
            p95LatencyMs: percentile(95),
            p99LatencyMs: percentile(99),
            maxLatencyMs: sorted.length > 0 ? sorted[sorted.length - 1] : 0,
            errorRate: total > 0 ? errors / total : 0,
            algorithm,
        };
        logger_1.default.info('Benchmark complete', result);
        return result;
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.BenchmarkService = BenchmarkService;
exports.default = BenchmarkService;
//# sourceMappingURL=benchmarkService.js.map