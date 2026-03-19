"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const constants_1 = require("../utils/constants");
dotenv_1.default.config();
const rateLimiterConfig = {
    defaultAlgorithm: process.env.DEFAULT_ALGORITHM || constants_1.ALGORITHMS.TOKEN_BUCKET,
    defaultLimit: parseInt(process.env.DEFAULT_RATE_LIMIT || '100', 10),
    defaultWindowMs: parseInt(process.env.DEFAULT_WINDOW_MS || '60000', 10),
    burstMultiplier: parseFloat(process.env.BURST_MULTIPLIER || '1.5'),
    adaptiveEnabled: process.env.ADAPTIVE_ENABLED === 'true',
    adaptiveEvaluationIntervalMs: parseInt(process.env.ADAPTIVE_EVALUATION_INTERVAL_MS || '300000', 10),
    adaptiveMinConfidenceThreshold: parseFloat(process.env.ADAPTIVE_MIN_CONFIDENCE_THRESHOLD || '0.7'),
    adaptiveMaxAdjustmentFactor: parseFloat(process.env.ADAPTIVE_MAX_ADJUSTMENT_FACTOR || '2.0'),
    adaptiveMinCapacity: parseInt(process.env.ADAPTIVE_MIN_CAPACITY || '10', 10),
    adaptiveMaxCapacity: parseInt(process.env.ADAPTIVE_MAX_CAPACITY || '100000', 10),
    endpoints: {
        '/api/v1/data': {
            algorithm: constants_1.ALGORITHMS.TOKEN_BUCKET,
            limit: 1000,
            windowMs: constants_1.DEFAULT_LIMITS.WINDOW_MS,
            burstSize: 50,
            refillRate: 16,
        },
        '/api/v1/auth': {
            algorithm: constants_1.ALGORITHMS.FIXED_WINDOW,
            limit: 10,
            windowMs: constants_1.DEFAULT_LIMITS.WINDOW_MS,
        },
        '/api/v1/search': {
            algorithm: constants_1.ALGORITHMS.SLIDING_WINDOW,
            limit: 30,
            windowMs: constants_1.DEFAULT_LIMITS.WINDOW_MS,
        },
    },
    ip: {
        algorithm: constants_1.ALGORITHMS.SLIDING_WINDOW,
        limit: 200,
        windowMs: constants_1.DEFAULT_LIMITS.WINDOW_MS,
    },
    tenant: {
        algorithm: constants_1.ALGORITHMS.TOKEN_BUCKET,
        limit: 10000,
        windowMs: constants_1.DEFAULT_LIMITS.WINDOW_MS,
        burstSize: 500,
        refillRate: 166,
    },
};
exports.default = rateLimiterConfig;
//# sourceMappingURL=rateLimiterConfig.js.map