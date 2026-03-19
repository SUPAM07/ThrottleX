"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.adaptiveAdjustments = exports.circuitBreakerState = exports.redisErrors = exports.activeKeys = exports.requestDuration = exports.requestsRejected = exports.requestsAllowed = exports.requestsTotal = void 0;
exports.getMetricsString = getMetricsString;
const prom_client_1 = __importDefault(require("prom-client"));
const constants_1 = require("../constants");
// Enable default Node.js metrics (CPU, memory, GC, event loop)
const register = new prom_client_1.default.Registry();
exports.register = register;
prom_client_1.default.collectDefaultMetrics({ register });
// Request counter
exports.requestsTotal = new prom_client_1.default.Counter({
    name: constants_1.METRICS.REQUESTS_TOTAL,
    help: 'Total rate limit check requests',
    labelNames: ['algorithm', 'tenant'],
    registers: [register],
});
// Allowed counter
exports.requestsAllowed = new prom_client_1.default.Counter({
    name: constants_1.METRICS.REQUESTS_ALLOWED,
    help: 'Total allowed requests',
    labelNames: ['algorithm', 'tenant'],
    registers: [register],
});
// Rejected counter
exports.requestsRejected = new prom_client_1.default.Counter({
    name: constants_1.METRICS.REQUESTS_REJECTED,
    help: 'Total rejected (rate-limited) requests',
    labelNames: ['algorithm', 'tenant'],
    registers: [register],
});
// Latency histogram (P50/P95/P99)
exports.requestDuration = new prom_client_1.default.Histogram({
    name: constants_1.METRICS.REQUEST_DURATION,
    help: 'Rate limit check latency in seconds',
    labelNames: ['algorithm'],
    buckets: [0.0001, 0.0005, 0.001, 0.002, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
    registers: [register],
});
// Active keys gauge
exports.activeKeys = new prom_client_1.default.Gauge({
    name: constants_1.METRICS.ACTIVE_KEYS,
    help: 'Number of active rate limit keys in Redis',
    registers: [register],
});
// Redis errors counter
exports.redisErrors = new prom_client_1.default.Counter({
    name: constants_1.METRICS.REDIS_ERRORS,
    help: 'Total Redis operation errors',
    labelNames: ['operation'],
    registers: [register],
});
// Circuit breaker state gauge
exports.circuitBreakerState = new prom_client_1.default.Gauge({
    name: constants_1.METRICS.CIRCUIT_STATE,
    help: 'Circuit breaker state (0=CLOSED, 1=HALF_OPEN, 2=OPEN)',
    labelNames: ['name'],
    registers: [register],
});
// Adaptive adjustments counter
exports.adaptiveAdjustments = new prom_client_1.default.Counter({
    name: constants_1.METRICS.ADAPTIVE_ADJUSTMENTS,
    help: 'Total adaptive rate limit adjustments made',
    labelNames: ['signal', 'algorithm'],
    registers: [register],
});
async function getMetricsString() {
    return register.metrics();
}
exports.default = register;
//# sourceMappingURL=prometheusMetrics.js.map