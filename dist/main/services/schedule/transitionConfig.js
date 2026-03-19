"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpolateLimit = interpolateLimit;
/**
 * Calculate the interpolated limit during a gradual transition.
 */
function interpolateLimit(fromLimit, toLimit, progress // 0.0–1.0
) {
    const clamped = Math.max(0, Math.min(1, progress));
    return Math.round(fromLimit + (toLimit - fromLimit) * clamped);
}
//# sourceMappingURL=transitionConfig.js.map