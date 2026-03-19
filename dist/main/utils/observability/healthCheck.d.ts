export interface HealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    uptime: string;
    uptimeMs: number;
    timestamp: string;
    checks: {
        redis: {
            status: 'ok' | 'error';
            latencyMs?: number;
        };
        memory: {
            status: 'ok' | 'warning';
            heapUsedMB: number;
            heapTotalMB: number;
        };
        process: {
            status: 'ok';
            pid: number;
            nodeVersion: string;
        };
    };
}
export declare function getHealthStatus(): Promise<HealthStatus>;
//# sourceMappingURL=healthCheck.d.ts.map