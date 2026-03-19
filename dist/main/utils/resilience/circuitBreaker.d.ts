import { CIRCUIT_STATES } from '../constants';
type CircuitState = typeof CIRCUIT_STATES[keyof typeof CIRCUIT_STATES];
export interface CircuitBreakerOptions {
    failureThreshold: number;
    successThreshold: number;
    timeoutMs: number;
    halfOpenRequests: number;
}
export declare class CircuitBreaker {
    private readonly name;
    private readonly opts;
    private state;
    private failureCount;
    private successCount;
    private lastFailureTime;
    private halfOpenAttempts;
    constructor(name: string, opts?: CircuitBreakerOptions);
    execute<T>(fn: () => Promise<T>, fallback?: () => Promise<T>): Promise<T>;
    private onSuccess;
    private onFailure;
    private shouldAttemptReset;
    private transitionTo;
    getState(): CircuitState;
    getStats(): {
        state: CircuitState;
        failureCount: number;
        successCount: number;
        lastFailureTime: number | null;
    };
}
export default CircuitBreaker;
//# sourceMappingURL=circuitBreaker.d.ts.map