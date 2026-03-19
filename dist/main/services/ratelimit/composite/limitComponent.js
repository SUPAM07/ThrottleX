"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLimitComponent = createLimitComponent;
/**
 * Creates a LimitComponent from a partial configuration.
 */
function createLimitComponent(id, algorithm, config, weight = 1.0) {
    return {
        id,
        algorithm,
        config: {
            algorithm,
            limit: config.limit ?? 100,
            windowMs: config.windowMs ?? 60_000,
            burstSize: config.burstSize,
            refillRate: config.refillRate,
            drainRate: config.drainRate,
            capacity: config.capacity,
        },
        weight,
    };
}
//# sourceMappingURL=limitComponent.js.map