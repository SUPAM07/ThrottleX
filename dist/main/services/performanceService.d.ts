export interface PerformanceBaseline {
    testName: string;
    timestamp: string;
    averageResponseTime: number;
    throughputPerSecond: number;
    successRate: number;
    maxResponseTime?: number;
    p95ResponseTime?: number;
    errorRate?: number;
}
export interface RegressionAnalysis {
    testName: string;
    regressionDetected: boolean;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    responseTimeRegression?: {
        current: number;
        baseline: number;
        change: number;
        threshold: number;
        isRegression: boolean;
    };
    throughputRegression?: {
        current: number;
        baseline: number;
        change: number;
        threshold: number;
        isRegression: boolean;
    };
    summary: string;
}
export declare class PerformanceService {
    private baselines;
    storeBaseline(baseline: PerformanceBaseline): void;
    getBaselines(testName: string, limit?: number): PerformanceBaseline[];
    analyzeRegression(current: PerformanceBaseline, rtThreshold?: number, tpThreshold?: number): RegressionAnalysis;
}
export declare const performanceService: PerformanceService;
//# sourceMappingURL=performanceService.d.ts.map