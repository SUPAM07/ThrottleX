"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrafficAnalysisService = void 0;
const anomalyDetectorService_1 = require("./anomalyDetectorService");
/**
 * Real-time traffic pattern analysis service.
 * Aggregates per-key traffic data and produces adaptation signals.
 */
class TrafficAnalysisService {
    detector;
    history = [];
    maxHistory;
    constructor(maxHistory = 1000) {
        this.detector = new anomalyDetectorService_1.AnomalyDetectorService();
        this.maxHistory = maxHistory;
    }
    /**
     * Record traffic data and analyze patterns.
     */
    analyze(key, requestCount, rejectionRate) {
        const analysis = this.detector.recordAndAnalyze(key, requestCount, rejectionRate);
        this.history.push({
            key,
            timestamp: Date.now(),
            requestCount,
            rejectionRate,
            analysis,
        });
        // Trim history
        if (this.history.length > this.maxHistory) {
            this.history.splice(0, this.history.length - this.maxHistory);
        }
        return analysis;
    }
    /**
     * Get the most recent snapshots, optionally filtered by signal.
     */
    getRecentSnapshots(limit = 50, signal) {
        let snapshots = this.history;
        if (signal) {
            snapshots = snapshots.filter((s) => s.analysis.signal === signal);
        }
        return snapshots.slice(-limit);
    }
    /**
     * Get aggregate stats across all monitored keys.
     */
    getAggregateStats() {
        const signalCounts = {};
        for (const snapshot of this.history) {
            signalCounts[snapshot.analysis.signal] =
                (signalCounts[snapshot.analysis.signal] || 0) + 1;
        }
        return {
            totalKeys: this.detector.getActiveCount(),
            totalSnapshots: this.history.length,
            signalCounts,
        };
    }
    reset() {
        this.detector.resetAll();
        this.history.length = 0;
    }
}
exports.TrafficAnalysisService = TrafficAnalysisService;
exports.default = TrafficAnalysisService;
//# sourceMappingURL=trafficAnalysisService.js.map