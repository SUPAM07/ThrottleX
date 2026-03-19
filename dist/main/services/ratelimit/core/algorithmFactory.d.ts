import Redis from 'ioredis';
import type { RateLimitAlgorithm } from './rateLimitAlgorithm';
/**
 * Factory that creates and caches algorithm instances
 */
export declare class AlgorithmFactory {
    private client;
    constructor(client?: Redis);
    create(algorithmName: string): Promise<RateLimitAlgorithm>;
    getAvailableAlgorithms(): string[];
}
export default AlgorithmFactory;
//# sourceMappingURL=algorithmFactory.d.ts.map