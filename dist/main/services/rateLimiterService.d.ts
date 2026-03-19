import type { RateLimitRequest, RateLimitResponse } from '../models';
export declare class RateLimiterService {
    private readonly factory;
    private readonly circuitBreaker;
    private readonly analyzers;
    constructor();
    check(request: RateLimitRequest): Promise<RateLimitResponse>;
    reset(key: string, algorithm?: string): Promise<void>;
    getCircuitBreakerState(): "CLOSED" | "OPEN" | "HALF_OPEN";
    private buildConfig;
    private applyAdaptiveAdjustment;
    private updateAnalyzer;
    private getOrCreateAnalyzer;
}
export declare const rateLimiterService: RateLimiterService;
export default RateLimiterService;
//# sourceMappingURL=rateLimiterService.d.ts.map