"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenarioRunner = void 0;
const loadGenerator_1 = require("./loadGenerator");
const latencyTracker_1 = require("./latencyTracker");
const throughputCalculator_1 = require("./throughputCalculator");
const logger_1 = __importDefault(require("../utils/logger"));
const timeUtils_1 = require("../utils/timeUtils");
/**
 * Orchestrates benchmark scenarios using LoadGenerator, LatencyTracker,
 * and ThroughputCalculator components.
 */
class ScenarioRunner {
    generator;
    latency;
    throughput;
    constructor() {
        this.generator = new loadGenerator_1.LoadGenerator();
        this.latency = new latencyTracker_1.LatencyTracker();
        this.throughput = new throughputCalculator_1.ThroughputCalculator();
    }
    /**
     * Run a complete benchmark scenario.
     */
    async run(request, checkFn) {
        const { scenario, concurrency, durationMs, algorithm } = request;
        const targetRps = request.targetRps || concurrency * 100;
        logger_1.default.info('Scenario starting', { scenario, concurrency, durationMs, targetRps });
        this.latency.reset();
        this.throughput.reset();
        let allowed = 0;
        let rejected = 0;
        let errors = 0;
        const start = (0, timeUtils_1.nowMs)();
        await this.generator.generate(targetRps, durationMs, concurrency, async (requestId) => {
            const key = `bench:${scenario}:${requestId}`;
            const reqStart = (0, timeUtils_1.nowMs)();
            try {
                const result = await checkFn(key);
                const elapsed = (0, timeUtils_1.nowMs)() - reqStart;
                this.latency.record(elapsed);
                this.throughput.record();
                if (result.allowed)
                    allowed++;
                else
                    rejected++;
            }
            catch {
                errors++;
            }
        });
        const actualDuration = (0, timeUtils_1.nowMs)() - start;
        const total = allowed + rejected + errors;
        const result = {
            scenario,
            totalRequests: total,
            allowedRequests: allowed,
            rejectedRequests: rejected,
            durationMs: actualDuration,
            actualRps: total / (actualDuration / 1000),
            p50LatencyMs: this.latency.p50,
            p95LatencyMs: this.latency.p95,
            p99LatencyMs: this.latency.p99,
            maxLatencyMs: this.latency.max,
            errorRate: total > 0 ? errors / total : 0,
            algorithm,
        };
        logger_1.default.info('Scenario complete', result);
        return result;
    }
    /**
     * Run multiple scenarios in sequence.
     */
    async runSuite(scenarios, checkFn) {
        const results = [];
        for (const scenario of scenarios) {
            const result = await this.run(scenario, checkFn);
            results.push(result);
            // Brief pause between scenarios
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
        return results;
    }
}
exports.ScenarioRunner = ScenarioRunner;
exports.default = ScenarioRunner;
//# sourceMappingURL=scenarioRunner.js.map