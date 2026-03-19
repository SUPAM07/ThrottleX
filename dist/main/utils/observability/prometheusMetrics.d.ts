import client from 'prom-client';
declare const register: client.Registry<"text/plain; version=0.0.4; charset=utf-8">;
export declare const requestsTotal: client.Counter<"algorithm" | "tenant">;
export declare const requestsAllowed: client.Counter<"algorithm" | "tenant">;
export declare const requestsRejected: client.Counter<"algorithm" | "tenant">;
export declare const requestDuration: client.Histogram<"algorithm">;
export declare const activeKeys: client.Gauge<string>;
export declare const redisErrors: client.Counter<"operation">;
export declare const circuitBreakerState: client.Gauge<"name">;
export declare const adaptiveAdjustments: client.Counter<"algorithm" | "signal">;
export declare function getMetricsString(): Promise<string>;
export { register };
export default register;
//# sourceMappingURL=prometheusMetrics.d.ts.map