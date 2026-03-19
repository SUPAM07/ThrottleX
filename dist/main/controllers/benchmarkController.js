"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBenchmark = runBenchmark;
const rateLimiterService_1 = require("../services/rateLimiterService");
const validation_1 = require("../utils/validation");
const helpers_1 = require("../utils/helpers");
const helpers_2 = require("../utils/helpers");
const constants_1 = require("../utils/constants");
async function runBenchmark(req, res) {
    const input = (0, validation_1.validate)(validation_1.BenchmarkRequestSchema, req.body);
    const scenario = input.scenario ?? 'sustained';
    const concurrency = input.concurrency ?? 50;
    const durationMs = input.durationMs ?? 30_000;
    const algorithm = input.algorithm;
    const startTime = Date.now();
    const latencies = [];
    let totalRequests = 0;
    let allowedRequests = 0;
    let rejectedRequests = 0;
    const testKey = `benchmark:${scenario}:${Date.now()}`;
    const endTime = startTime + durationMs;
    const sendRequest = async () => {
        while (Date.now() < endTime) {
            const reqStart = Date.now();
            const result = await rateLimiterService_1.rateLimiterService.check({
                key: testKey,
                algorithm: algorithm || constants_1.ALGORITHMS.TOKEN_BUCKET,
                limit: 10000,
                windowMs: 1000,
            });
            latencies.push(Date.now() - reqStart);
            totalRequests++;
            result.allowed ? allowedRequests++ : rejectedRequests++;
            await (0, helpers_1.sleep)(0); // yield
        }
    };
    // Run concurrent workers
    await Promise.all(Array.from({ length: concurrency }, sendRequest));
    const actualDuration = Date.now() - startTime;
    latencies.sort((a, b) => a - b);
    const result = {
        scenario,
        totalRequests,
        allowedRequests,
        rejectedRequests,
        durationMs: actualDuration,
        actualRps: Math.round((totalRequests / actualDuration) * 1000),
        p50LatencyMs: (0, helpers_2.percentile)(latencies, 50),
        p95LatencyMs: (0, helpers_2.percentile)(latencies, 95),
        p99LatencyMs: (0, helpers_2.percentile)(latencies, 99),
        maxLatencyMs: latencies[latencies.length - 1] || 0,
        errorRate: totalRequests > 0 ? rejectedRequests / totalRequests : 0,
        algorithm,
    };
    res.status(constants_1.HTTP_STATUS.OK).json(result);
}
//# sourceMappingURL=benchmarkController.js.map