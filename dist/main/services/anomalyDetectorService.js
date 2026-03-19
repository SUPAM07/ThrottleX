"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnomalyDetectorService = void 0;
const trafficPatternAnalyzer_1 = require("./adaptive/trafficPatternAnalyzer");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Wraps TrafficPatternAnalyzer with persistence-aware anomaly detection.
 * Maintains per-key analyzers and produces adaptation decisions.
 */
class AnomalyDetectorService {
    analyzers = new Map();
    maxAnalyzers;
    constructor(maxAnalyzers = 1000) {
        this.maxAnalyzers = maxAnalyzers;
    }
    /**
     * Record a traffic sample for a given key and return the current analysis.
     */
    recordAndAnalyze(key, requestCount, rejectionRate) {
        let analyzer = this.analyzers.get(key);
        if (!analyzer) {
            if (this.analyzers.size >= this.maxAnalyzers) {
                // Evict oldest key (first entry in Map insertion order)
                const firstKey = this.analyzers.keys().next().value;
                if (firstKey !== undefined) {
                    this.analyzers.delete(firstKey);
                }
            }
            analyzer = new trafficPatternAnalyzer_1.TrafficPatternAnalyzer();
            this.analyzers.set(key, analyzer);
        }
        analyzer.addSample(requestCount, rejectionRate);
        const analysis = analyzer.analyze();
        if (analysis.signal !== 'STABLE') {
            logger_1.default.info('Anomaly detected', { key, signal: analysis.signal, zScore: analysis.zScore });
        }
        return analysis;
    }
    /**
     * Get the current analysis for a key without recording a new sample.
     */
    getAnalysis(key) {
        const analyzer = this.analyzers.get(key);
        return analyzer ? analyzer.analyze() : null;
    }
    /**
     * Reset the analyzer for a specific key.
     */
    resetKey(key) {
        this.analyzers.delete(key);
    }
    /**
     * Get the number of active analyzers.
     */
    getActiveCount() {
        return this.analyzers.size;
    }
    /**
     * Reset all analyzers.
     */
    resetAll() {
        this.analyzers.clear();
    }
}
exports.AnomalyDetectorService = AnomalyDetectorService;
exports.default = AnomalyDetectorService;
//# sourceMappingURL=anomalyDetectorService.js.map