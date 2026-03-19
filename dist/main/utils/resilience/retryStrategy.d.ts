export interface RetryOptions {
    maxRetries: number;
    baseDelayMs: number;
    maxDelayMs: number;
    jitterFactor: number;
    retryableErrors?: string[];
}
export declare function withRetry<T>(fn: () => Promise<T>, options?: Partial<RetryOptions>): Promise<T>;
export default withRetry;
//# sourceMappingURL=retryStrategy.d.ts.map