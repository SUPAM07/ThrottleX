"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const performanceController_1 = require("../controllers/performanceController");
const router = (0, express_1.Router)();
router.post('/baseline', performanceController_1.storeBaseline);
router.post('/regression/analyze', performanceController_1.analyzeRegression);
router.post('/baseline/store-and-analyze', performanceController_1.storeAndAnalyze);
router.get('/baseline/:testName', performanceController_1.getBaselines);
router.get('/trend/:testName', performanceController_1.getTrend);
router.get('/health', performanceController_1.getHealth);
exports.default = router;
//# sourceMappingURL=performanceRoutes.js.map