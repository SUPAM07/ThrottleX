"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeBaseline = storeBaseline;
exports.analyzeRegression = analyzeRegression;
exports.storeAndAnalyze = storeAndAnalyze;
exports.getBaselines = getBaselines;
exports.getTrend = getTrend;
exports.getHealth = getHealth;
const constants_1 = require("../utils/constants");
const performanceService_1 = require("../services/performanceService");
async function storeBaseline(req, res) {
    const baseline = req.body;
    performanceService_1.performanceService.storeBaseline(baseline);
    res.status(constants_1.HTTP_STATUS.OK).json({ message: 'Baseline stored successfully' });
}
async function analyzeRegression(req, res) {
    const current = req.body;
    const rtThreshold = req.query.responseTimeThreshold ? parseInt(req.query.responseTimeThreshold, 10) : 20;
    const tpThreshold = req.query.throughputThreshold ? parseInt(req.query.throughputThreshold, 10) : 15;
    const analysis = performanceService_1.performanceService.analyzeRegression(current, rtThreshold, tpThreshold);
    res.status(constants_1.HTTP_STATUS.OK).json(analysis);
}
async function storeAndAnalyze(req, res) {
    const current = req.body;
    const rtThreshold = req.query.responseTimeThreshold ? parseInt(req.query.responseTimeThreshold, 10) : 20;
    const tpThreshold = req.query.throughputThreshold ? parseInt(req.query.throughputThreshold, 10) : 15;
    const analysis = performanceService_1.performanceService.analyzeRegression(current, rtThreshold, tpThreshold);
    performanceService_1.performanceService.storeBaseline(current);
    res.status(constants_1.HTTP_STATUS.OK).json(analysis);
}
async function getBaselines(req, res) {
    const { testName } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const baselines = performanceService_1.performanceService.getBaselines(testName, limit);
    res.status(constants_1.HTTP_STATUS.OK).json(baselines);
}
async function getTrend(req, res) {
    const { testName } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
    const baselines = performanceService_1.performanceService.getBaselines(testName, limit);
    // Format for charting
    const trend = baselines.map(b => ({
        timestamp: b.timestamp,
        averageResponseTime: b.averageResponseTime,
        throughputPerSecond: b.throughputPerSecond,
        successRate: b.successRate,
    }));
    res.status(constants_1.HTTP_STATUS.OK).json(trend);
}
async function getHealth(req, res) {
    res.status(constants_1.HTTP_STATUS.OK).json({ status: 'UP', service: 'Performance Monitoring' });
}
//# sourceMappingURL=performanceController.js.map