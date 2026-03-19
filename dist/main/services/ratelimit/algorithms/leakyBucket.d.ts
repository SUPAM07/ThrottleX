import Redis from 'ioredis';
import type { RateLimitAlgorithm } from '../core/rateLimitAlgorithm';
import type { RateLimitResponse, RateLimitConfig } from '../../../models';
export declare class LeakyBucketAlgorithm implements RateLimitAlgorithm {
    private readonly client;
    readonly name: "leaky_bucket";
    private scriptSha;
    constructor(client: Redis);
    private getScriptSha;
    check(key: string, config: RateLimitConfig): Promise<RateLimitResponse>;
    reset(key: string): Promise<void>;
    getState(key: string): Promise<Record<string, unknown> | null>;
}
export default LeakyBucketAlgorithm;
//# sourceMappingURL=leakyBucket.d.ts.map