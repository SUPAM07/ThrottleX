"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrometheusMetrics = getPrometheusMetrics;
exports.getMetricsJson = getMetricsJson;
const prometheusMetrics_1 = require("../utils/observability/prometheusMetrics");
const constants_1 = require("../utils/constants");
async function getPrometheusMetrics(req, res) {
    const metrics = await (0, prometheusMetrics_1.getMetricsString)();
    res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
    res.status(constants_1.HTTP_STATUS.OK).send(metrics);
}
async function getMetricsJson(req, res) {
    const mem = process.memoryUsage();
    res.json({
        uptime: process.uptime(),
        memory: {
            heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
            heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
            rss: Math.round(mem.rss / 1024 / 1024),
        },
        timestamp: new Date().toISOString(),
    });
}
//# sourceMappingURL=metricsController.js.map