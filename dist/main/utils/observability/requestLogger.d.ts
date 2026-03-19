export interface RequestLogEntry {
    correlationId: string;
    method: string;
    path: string;
    statusCode: number;
    durationMs: number;
    ip?: string;
    userAgent?: string;
    algorithm?: string;
    allowed?: boolean;
    rateLimitKey?: string;
    timestamp: string;
}
/**
 * Structured request logger for rate limiter operations.
 * Produces machine-parseable log entries for observability pipelines.
 */
export declare class RequestLogger {
    private static instance;
    static getInstance(): RequestLogger;
    /**
     * Log a rate limit check event.
     */
    logRateLimitCheck(entry: Omit<RequestLogEntry, 'timestamp'>): void;
    /**
     * Log an admin operation.
     */
    logAdminOperation(operation: string, details: Record<string, unknown>): void;
    /**
     * Log a security event (blocked IP, invalid API key, etc.).
     */
    logSecurityEvent(event: string, details: Record<string, unknown>): void;
    /**
     * Log an adaptive signal change.
     */
    logAdaptiveSignal(key: string, signal: string, details: Record<string, unknown>): void;
}
export default RequestLogger;
//# sourceMappingURL=requestLogger.d.ts.map