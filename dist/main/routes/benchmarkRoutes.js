"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const benchmarkController_1 = require("../controllers/benchmarkController");
const constants_1 = require("../utils/constants");
const router = (0, express_1.Router)();
router.post('/run', benchmarkController_1.runBenchmark);
router.get('/health', (req, res) => {
    res.status(constants_1.HTTP_STATUS.OK).json({ status: 'UP', service: 'Benchmark Engine' });
});
exports.default = router;
//# sourceMappingURL=benchmarkRoutes.js.map