"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const metricsController_1 = require("../controllers/metricsController");
const router = (0, express_1.Router)();
router.get('/', metricsController_1.getPrometheusMetrics);
router.get('/json', metricsController_1.getMetricsJson);
exports.default = router;
//# sourceMappingURL=metricsRoutes.js.map