"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceService = exports.PerformanceService = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
class PerformanceService {
    baselines = new Map();
    storeBaseline(baseline) {
        const list = this.baselines.get(baseline.testName) || [];
        list.push(baseline);
        // keep last 100
        if (list.length > 100)
            list.shift();
        this.baselines.set(baseline.testName, list);
        logger_1.default.info('Stored performance baseline', { testName: baseline.testName });
    }
    getBaselines(testName, limit = 10) {
        const list = this.baselines.get(testName) || [];
        return list.slice(-limit).reverse();
    }
    analyzeRegression(current, rtThreshold = 20, tpThreshold = 15) {
        const list = this.baselines.get(current.testName) || [];
        if (list.length === 0) {
            return {
                testName: current.testName,
                regressionDetected: false,
                severity: 'LOW',
                summary: 'No previous baselines to compare against.',
            };
        }
        // Compare against the latest baseline
        const baseline = list[list.length - 1];
        const rtChange = ((current.averageResponseTime - baseline.averageResponseTime) / baseline.averageResponseTime) * 100;
        const isRtRegression = rtChange > rtThreshold;
        const tpChange = ((current.throughputPerSecond - baseline.throughputPerSecond) / baseline.throughputPerSecond) * 100;
        const isTpRegression = tpChange < -tpThreshold; // Throughput drops are regressions
        const regressionDetected = isRtRegression || isTpRegression;
        let severity = 'LOW';
        if (regressionDetected) {
            severity = (rtChange > 50 || tpChange < -50) ? 'HIGH' : 'MEDIUM';
        }
        return {
            testName: current.testName,
            regressionDetected,
            severity,
            responseTimeRegression: {
                current: current.averageResponseTime,
                baseline: baseline.averageResponseTime,
                change: Number(rtChange.toFixed(2)),
                threshold: rtThreshold,
                isRegression: isRtRegression,
            },
            throughputRegression: {
                current: current.throughputPerSecond,
                baseline: baseline.throughputPerSecond,
                change: Number(tpChange.toFixed(2)),
                threshold: tpThreshold,
                isRegression: isTpRegression,
            },
            summary: regressionDetected
                ? 'Performance regression detected'
                : 'Performance is within acceptable thresholds',
        };
    }
}
exports.PerformanceService = PerformanceService;
exports.performanceService = new PerformanceService();
//# sourceMappingURL=performanceService.js.map