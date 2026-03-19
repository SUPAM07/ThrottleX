"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const adminAuthConfig_1 = __importDefault(require("../config/adminAuthConfig"));
const constants_1 = require("../utils/constants");
const router = (0, express_1.Router)();
// Simple admin key guard
const adminGuard = (req, res, next) => {
    const key = req.headers['x-admin-key'];
    if (key !== adminAuthConfig_1.default.apiKey) {
        res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid admin key' });
        return;
    }
    next();
};
router.use(adminGuard);
// New API Reference mappings
router.get('/keys', adminController_1.listAdminKeys);
router.get('/limits/:key', adminController_1.getAdminKey);
router.put('/limits/:key', adminController_1.setAdminLimit);
router.delete('/limits/:key', adminController_1.deleteAdminKey);
// Backward compatibility alias for the old dashboard endpoints
router.get('/limits', adminController_1.listAdminKeys);
router.post('/limits', adminController_1.setAdminLimit);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map