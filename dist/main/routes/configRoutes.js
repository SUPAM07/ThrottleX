"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const configController_1 = require("../controllers/configController");
const router = (0, express_1.Router)();
router.get('/', configController_1.getConfig);
router.post('/default', configController_1.updateDefaultConfig);
router.post('/keys/:key', configController_1.setKeyConfig);
router.delete('/keys/:key', configController_1.removeKeyConfig);
router.post('/patterns/:pattern', configController_1.setPatternConfig);
router.delete('/patterns/:pattern', configController_1.removePatternConfig);
router.post('/reload', configController_1.reloadConfig);
router.get('/stats', configController_1.getConfigStats);
exports.default = router;
//# sourceMappingURL=configRoutes.js.map