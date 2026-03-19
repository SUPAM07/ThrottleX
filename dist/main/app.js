"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const morgan_1 = __importDefault(require("morgan"));
const requestContextMiddleware_1 = require("./middlewares/requestContextMiddleware");
const geoLimiterMiddleware_1 = require("./middlewares/geoLimiterMiddleware");
const errorHandler_1 = require("./middlewares/errorHandler");
const rateLimitRoutes_1 = __importDefault(require("./routes/rateLimitRoutes"));
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
const metricsRoutes_1 = __importDefault(require("./routes/metricsRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const benchmarkRoutes_1 = __importDefault(require("./routes/benchmarkRoutes"));
const configRoutes_1 = __importDefault(require("./routes/configRoutes"));
const performanceRoutes_1 = __importDefault(require("./routes/performanceRoutes"));
const openApiConfig_1 = require("./config/openApiConfig");
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
// Security & compression
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGINS?.split(',') || '*' }));
app.use((0, compression_1.default)());
// Body parsing
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// HTTP request logging
if (process.env.NODE_ENV !== 'test') {
    app.use((0, morgan_1.default)('combined', {
        stream: { write: (msg) => logger_1.default.info(msg.trim()) },
    }));
}
// Request context (correlationId, tenant, IP)
app.use(requestContextMiddleware_1.requestContextMiddleware);
// Geo limiting
app.use(geoLimiterMiddleware_1.geoLimiterMiddleware);
// OpenAPI docs
const swaggerSpec = (0, swagger_jsdoc_1.default)(openApiConfig_1.swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
const adaptiveRoutes_1 = __importDefault(require("./routes/adaptiveRoutes"));
// Routes - New API Reference mapping
app.use('/api/ratelimit/config', configRoutes_1.default);
app.use('/api/ratelimit/adaptive', adaptiveRoutes_1.default);
app.use('/api/ratelimit', rateLimitRoutes_1.default);
app.use('/api/benchmark', benchmarkRoutes_1.default);
app.use('/api/performance', performanceRoutes_1.default);
// Admin & Metrics
app.use('/admin', adminRoutes_1.default);
app.use('/metrics', metricsRoutes_1.default);
// Health & Actuator
app.use('/health', healthRoutes_1.default);
app.use('/actuator/health', healthRoutes_1.default);
app.use('/actuator/metrics', metricsRoutes_1.default);
app.use('/actuator/prometheus', metricsRoutes_1.default);
// Backward compatibility aliases for existing dashboard
app.use('/rate-limit/adaptive', adaptiveRoutes_1.default);
app.use('/rate-limit', rateLimitRoutes_1.default);
app.use('/benchmark', benchmarkRoutes_1.default);
// Root redirect to docs
app.get('/', (req, res) => res.redirect('/api-docs'));
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        path: req.path,
        method: req.method,
    });
});
// Global error handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map