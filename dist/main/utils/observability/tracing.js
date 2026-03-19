"use strict";
/**
 * OpenTelemetry-compatible tracing setup.
 * Provides span creation and context propagation for distributed tracing.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracer = void 0;
/**
 * Simple tracing implementation for rate limiter operations.
 * In production, replace with OpenTelemetry SDK.
 */
class Tracer {
    static instance;
    spans = [];
    maxSpans;
    enabled;
    constructor(maxSpans = 10_000) {
        this.maxSpans = maxSpans;
        this.enabled = process.env.TRACING_ENABLED !== 'false';
    }
    static getInstance() {
        if (!Tracer.instance) {
            Tracer.instance = new Tracer();
        }
        return Tracer.instance;
    }
    /**
     * Start a new span.
     */
    startSpan(name, attributes = {}) {
        const span = {
            traceId: this.generateId(),
            spanId: this.generateId(),
            startTime: Date.now(),
            name,
            attributes,
            status: 'UNSET',
        };
        if (this.enabled) {
            this.spans.push(span);
            if (this.spans.length > this.maxSpans) {
                this.spans = this.spans.slice(-this.maxSpans);
            }
        }
        return span;
    }
    /**
     * End a span with a status.
     */
    endSpan(span, status = 'OK') {
        span.endTime = Date.now();
        span.status = status;
    }
    /**
     * Create a child span.
     */
    startChildSpan(parent, name, attributes = {}) {
        const child = this.startSpan(name, attributes);
        child.traceId = parent.traceId;
        child.parentSpanId = parent.spanId;
        return child;
    }
    /**
     * Get recent spans, optionally filtered by name.
     */
    getSpans(limit = 100, nameFilter) {
        let filtered = this.spans;
        if (nameFilter) {
            filtered = filtered.filter((s) => s.name.includes(nameFilter));
        }
        return filtered.slice(-limit);
    }
    /**
     * Convenience: trace an async function.
     */
    async trace(name, fn, attributes = {}) {
        const span = this.startSpan(name, attributes);
        try {
            const result = await fn(span);
            this.endSpan(span, 'OK');
            return result;
        }
        catch (error) {
            this.endSpan(span, 'ERROR');
            throw error;
        }
    }
    generateId() {
        return Math.random().toString(36).substring(2, 18);
    }
}
exports.Tracer = Tracer;
exports.default = Tracer;
//# sourceMappingURL=tracing.js.map