"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthController_1 = require("../controllers/healthController");
const router = (0, express_1.Router)();
router.get('/', healthController_1.healthFull);
router.get('/live', healthController_1.healthLive);
router.get('/ready', healthController_1.healthReady);
exports.default = router;
//# sourceMappingURL=healthRoutes.js.map