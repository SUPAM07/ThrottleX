"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const prometheusMetrics_1 = require("../utils/observability/prometheusMetrics");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Aggregates metrics from Prometheus counters and in-memory state
 * to produce a unified MetricsResponse.
 */
class MetricsService {
    startTime = Date.now();
    totalRequests = 0;
    allowedRequests = 0;
    rejectedRequests = 0;
    latencies = [];
    algorithmStats = {};
    recordRequest(algorithm, allowed, latencyMs) {
        this.totalRequests++;
        if (allowed) {
            this.allowedRequests++;
        }
        else {
            this.rejectedRequests++;
        }
        this.latencies.push(latencyMs);
        // Keep latencies bounded (rolling 10k window)
        if (this.latencies.length > 10_000) {
            this.latencies = this.latencies.slice(-10_000);
        }
        if (!this.algorithmStats[algorithm]) {
            this.algorithmStats[algorithm] = { requests: 0, rejections: 0 };
        }
        this.algorithmStats[algorithm].requests++;
        if (!allowed) {
            this.algorithmStats[algorithm].rejections++;
        }
    }
    getMetrics(redisConnected, circuitBreakerState) {
        const sorted = [...this.latencies].sort((a, b) => a - b);
        const pct = (p) => {
            if (sorted.length === 0)
                return 0;
            const idx = Math.ceil((p / 100) * sorted.length) - 1;
            return sorted[Math.max(0, idx)];
        };
        return {
            uptime: Date.now() - this.startTime,
            totalRequests: this.totalRequests,
            allowedRequests: this.allowedRequests,
            rejectedRequests: this.rejectedRequests,
            rejectionRate: this.totalRequests > 0 ? this.rejectedRequests / this.totalRequests : 0,
            p50LatencyMs: pct(50),
            p95LatencyMs: pct(95),
            p99LatencyMs: pct(99),
            activeKeys: 0, // Populated by caller via Redis DBSIZE
            redisConnected,
            circuitBreakerState,
            algorithm: { ...this.algorithmStats },
            timestamp: new Date().toISOString(),
        };
    }
    async getPrometheusText() {
        try {
            return await (0, prometheusMetrics_1.getMetricsString)();
        }
        catch (error) {
            logger_1.default.error('Failed to get Prometheus metrics', { error });
            return '# Error collecting metrics\n';
        }
    }
    reset() {
        this.totalRequests = 0;
        this.allowedRequests = 0;
        this.rejectedRequests = 0;
        this.latencies = [];
        this.algorithmStats = {};
    }
}
exports.MetricsService = MetricsService;
exports.default = MetricsService;
//# sourceMappingURL=metricsService.js.map