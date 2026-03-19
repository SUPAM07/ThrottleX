/**
 * OpenTelemetry-compatible tracing setup.
 * Provides span creation and context propagation for distributed tracing.
 */
export interface SpanContext {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    startTime: number;
    endTime?: number;
    name: string;
    attributes: Record<string, string | number | boolean>;
    status: 'OK' | 'ERROR' | 'UNSET';
}
/**
 * Simple tracing implementation for rate limiter operations.
 * In production, replace with OpenTelemetry SDK.
 */
export declare class Tracer {
    private static instance;
    private spans;
    private readonly maxSpans;
    private readonly enabled;
    private constructor();
    static getInstance(): Tracer;
    /**
     * Start a new span.
     */
    startSpan(name: string, attributes?: Record<string, string | number | boolean>): SpanContext;
    /**
     * End a span with a status.
     */
    endSpan(span: SpanContext, status?: 'OK' | 'ERROR'): void;
    /**
     * Create a child span.
     */
    startChildSpan(parent: SpanContext, name: string, attributes?: Record<string, string | number | boolean>): SpanContext;
    /**
     * Get recent spans, optionally filtered by name.
     */
    getSpans(limit?: number, nameFilter?: string): SpanContext[];
    /**
     * Convenience: trace an async function.
     */
    trace<T>(name: string, fn: (span: SpanContext) => Promise<T>, attributes?: Record<string, string | number | boolean>): Promise<T>;
    private generateId;
}
export default Tracer;
//# sourceMappingURL=tracing.d.ts.map