"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const adminAuthConfig = {
    apiKey: process.env.ADMIN_API_KEY || 'change-me-admin-key',
    jwtSecret: process.env.ADMIN_JWT_SECRET || 'change-me-jwt-secret',
    allowedIPs: (process.env.ADMIN_ALLOWED_IPS || '127.0.0.1,::1').split(',').map((ip) => ip.trim()),
};
exports.default = adminAuthConfig;
//# sourceMappingURL=adminAuthConfig.js.map