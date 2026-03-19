"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adaptiveController_1 = require("../controllers/adaptiveController");
const router = (0, express_1.Router)();
router.get('/config', adaptiveController_1.getAdaptiveConfig);
router.get('/:key/status', adaptiveController_1.getAdaptiveStatus);
router.post('/:key/override', adaptiveController_1.setAdaptiveOverride);
router.delete('/:key/override', adaptiveController_1.clearAdaptiveOverride);
exports.default = router;
//# sourceMappingURL=adaptiveRoutes.js.map