import type { MetricsResponse } from '../models';
/**
 * Aggregates metrics from Prometheus counters and in-memory state
 * to produce a unified MetricsResponse.
 */
export declare class MetricsService {
    private startTime;
    private totalRequests;
    private allowedRequests;
    private rejectedRequests;
    private latencies;
    private algorithmStats;
    recordRequest(algorithm: string, allowed: boolean, latencyMs: number): void;
    getMetrics(redisConnected: boolean, circuitBreakerState: string): MetricsResponse;
    getPrometheusText(): Promise<string>;
    reset(): void;
}
export default MetricsService;
//# sourceMappingURL=metricsService.d.ts.map