import type { AlgorithmName } from '../utils/constants';
export interface AlgorithmConfig {
    algorithm: AlgorithmName;
    limit: number;
    windowMs: number;
    burstSize?: number;
    refillRate?: number;
    drainRate?: number;
    capacity?: number;
    components?: ComponentConfig[];
}
export interface ComponentConfig {
    algorithm: AlgorithmName;
    limit: number;
    windowMs: number;
    weight?: number;
}
export interface RateLimiterConfig {
    defaultAlgorithm: AlgorithmName;
    defaultLimit: number;
    defaultWindowMs: number;
    burstMultiplier: number;
    adaptiveEnabled: boolean;
    adaptiveEvaluationIntervalMs: number;
    adaptiveMinConfidenceThreshold: number;
    adaptiveMaxAdjustmentFactor: number;
    adaptiveMinCapacity: number;
    adaptiveMaxCapacity: number;
    endpoints: Record<string, AlgorithmConfig>;
    ip: AlgorithmConfig;
    tenant: AlgorithmConfig;
}
declare const rateLimiterConfig: RateLimiterConfig;
export default rateLimiterConfig;
//# sourceMappingURL=rateLimiterConfig.d.ts.map