"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdaptiveConfig = getAdaptiveConfig;
exports.getAdaptiveStatus = getAdaptiveStatus;
exports.setAdaptiveOverride = setAdaptiveOverride;
exports.clearAdaptiveOverride = clearAdaptiveOverride;
const adaptiveRateLimitEngine_1 = require("../services/adaptiveRateLimitEngine");
const constants_1 = require("../utils/constants");
/**
 * GET /api/ratelimit/adaptive/config
 * Get configuration settings for the adaptive ML engine
 */
async function getAdaptiveConfig(req, res) {
    res.status(constants_1.HTTP_STATUS.OK).json(adaptiveRateLimitEngine_1.adaptiveRateLimitEngine.getConfig());
}
/**
 * GET /api/ratelimit/adaptive/:key/status
 * Get the current adaptive status and limits for a specific key
 */
async function getAdaptiveStatus(req, res) {
    const { key } = req.params;
    // NOTE: This currently defaults the multiplier to 1.0. In a complete 
    // implementation, we would fetch the last evaluated multiplier from the ML inference.
    const status = adaptiveRateLimitEngine_1.adaptiveRateLimitEngine.getStatus(key, 1.0);
    res.status(constants_1.HTTP_STATUS.OK).json(status);
}
/**
 * POST /api/ratelimit/adaptive/:key/override
 * Manually override the adaptive limit for a specific key
 */
async function setAdaptiveOverride(req, res) {
    const { key } = req.params;
    const { limit } = req.body;
    if (typeof limit !== 'number' || limit < 1) {
        res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({ error: 'Valid limit number is required' });
        return;
    }
    adaptiveRateLimitEngine_1.adaptiveRateLimitEngine.setManualOverride(key, limit);
    res.status(constants_1.HTTP_STATUS.OK).json({ message: `Override set for ${key}`, limit });
}
/**
 * DELETE /api/ratelimit/adaptive/:key/override
 * Clear any manual rate limit override for a specific key
 */
async function clearAdaptiveOverride(req, res) {
    const { key } = req.params;
    adaptiveRateLimitEngine_1.adaptiveRateLimitEngine.clearManualOverride(key);
    res.status(constants_1.HTTP_STATUS.NO_CONTENT).send();
}
//# sourceMappingURL=adaptiveController.js.map