"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThroughputCalculator = void 0;
const timeUtils_1 = require("../utils/timeUtils");
/**
 * Calculates throughput (requests per second) over a sliding window.
 */
class ThroughputCalculator {
    timestamps = [];
    windowMs;
    constructor(windowMs = 1000) {
        this.windowMs = windowMs;
    }
    /**
     * Record a request timestamp.
     */
    record() {
        const now = (0, timeUtils_1.nowMs)();
        this.timestamps.push(now);
        this.cleanup(now);
    }
    /**
     * Get the current RPS (requests per second) based on the sliding window.
     */
    getRps() {
        const now = (0, timeUtils_1.nowMs)();
        this.cleanup(now);
        const windowSec = this.windowMs / 1000;
        return this.timestamps.length / windowSec;
    }
    /**
     * Get throughput statistics.
     */
    getStats() {
        return {
            currentRps: Math.round(this.getRps() * 100) / 100,
            totalRequests: this.timestamps.length,
            windowMs: this.windowMs,
        };
    }
    /**
     * Reset all recordings.
     */
    reset() {
        this.timestamps = [];
    }
    cleanup(now) {
        const cutoff = now - this.windowMs;
        // Binary search for the cutoff point
        let low = 0;
        let high = this.timestamps.length;
        while (low < high) {
            const mid = (low + high) >>> 1;
            if (this.timestamps[mid] < cutoff)
                low = mid + 1;
            else
                high = mid;
        }
        if (low > 0) {
            this.timestamps = this.timestamps.slice(low);
        }
    }
}
exports.ThroughputCalculator = ThroughputCalculator;
exports.default = ThroughputCalculator;
//# sourceMappingURL=throughputCalculator.js.map