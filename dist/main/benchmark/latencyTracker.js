"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LatencyTracker = void 0;
/**
 * HDR-histogram-inspired latency tracker for benchmark measurements.
 * Tracks P50, P95, P99, min, max, and mean latencies.
 */
class LatencyTracker {
    samples = [];
    sorted = false;
    /**
     * Record a latency measurement in milliseconds.
     */
    record(latencyMs) {
        this.samples.push(latencyMs);
        this.sorted = false;
    }
    /**
     * Get a percentile value (0–100).
     */
    percentile(p) {
        this.ensureSorted();
        if (this.samples.length === 0)
            return 0;
        const idx = Math.ceil((p / 100) * this.samples.length) - 1;
        return this.samples[Math.max(0, idx)];
    }
    get p50() { return this.percentile(50); }
    get p95() { return this.percentile(95); }
    get p99() { return this.percentile(99); }
    get min() {
        return this.samples.length > 0 ? Math.min(...this.samples) : 0;
    }
    get max() {
        return this.samples.length > 0 ? Math.max(...this.samples) : 0;
    }
    get mean() {
        if (this.samples.length === 0)
            return 0;
        return this.samples.reduce((sum, s) => sum + s, 0) / this.samples.length;
    }
    get count() {
        return this.samples.length;
    }
    /**
     * Get a full summary of all tracked latencies.
     */
    getSummary() {
        return {
            count: this.count,
            min: this.min,
            max: this.max,
            mean: Math.round(this.mean * 100) / 100,
            p50: this.p50,
            p95: this.p95,
            p99: this.p99,
        };
    }
    /**
     * Reset all tracked samples.
     */
    reset() {
        this.samples = [];
        this.sorted = false;
    }
    ensureSorted() {
        if (!this.sorted) {
            this.samples.sort((a, b) => a - b);
            this.sorted = true;
        }
    }
}
exports.LatencyTracker = LatencyTracker;
exports.default = LatencyTracker;
//# sourceMappingURL=latencyTracker.js.map