"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rateLimitController_1 = require("../controllers/rateLimitController");
const rateLimitMiddleware_1 = require("../middlewares/rateLimitMiddleware");
const router = (0, express_1.Router)();
router.post('/check', (0, rateLimitMiddleware_1.rateLimitMiddleware)({ limit: 10000, windowMs: 60000 }), rateLimitController_1.checkRateLimit);
router.delete('/reset/:key', rateLimitController_1.resetRateLimit);
exports.default = router;
//# sourceMappingURL=rateLimitRoutes.js.map