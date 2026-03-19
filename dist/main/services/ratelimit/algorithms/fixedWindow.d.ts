import Redis from 'ioredis';
import type { RateLimitAlgorithm } from '../core/rateLimitAlgorithm';
import type { RateLimitResponse, RateLimitConfig } from '../../../models';
export declare class FixedWindowAlgorithm implements RateLimitAlgorithm {
    private readonly client;
    readonly name: "fixed_window";
    private scriptSha;
    constructor(client: Redis);
    private getScriptSha;
    check(key: string, config: RateLimitConfig): Promise<RateLimitResponse>;
    reset(key: string): Promise<void>;
    getState(key: string): Promise<Record<string, unknown> | null>;
}
export default FixedWindowAlgorithm;
//# sourceMappingURL=fixedWindow.d.ts.map