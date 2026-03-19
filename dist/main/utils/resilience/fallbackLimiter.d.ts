import type { RateLimitResponse, RateLimitConfig } from '../../models';
export declare class FallbackLimiter {
    private readonly degradedLimitMultiplier;
    check(key: string, config: RateLimitConfig): RateLimitResponse;
}
export declare const fallbackLimiter: FallbackLimiter;
export default FallbackLimiter;
//# sourceMappingURL=fallbackLimiter.d.ts.map