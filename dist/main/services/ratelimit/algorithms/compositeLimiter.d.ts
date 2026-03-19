import Redis from 'ioredis';
import type { RateLimitAlgorithm } from '../core/rateLimitAlgorithm';
import type { RateLimitResponse, RateLimitConfig } from '../../../models';
export declare class CompositeLimiterAlgorithm implements RateLimitAlgorithm {
    private readonly client;
    readonly name: "composite";
    private scriptSha;
    constructor(client: Redis);
    private getScriptSha;
    check(key: string, config: RateLimitConfig): Promise<RateLimitResponse>;
    reset(key: string): Promise<void>;
    getState(key: string): Promise<Record<string, unknown> | null>;
}
export default CompositeLimiterAlgorithm;
//# sourceMappingURL=compositeLimiter.d.ts.map