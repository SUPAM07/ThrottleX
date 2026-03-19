"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSignalEvent = createSignalEvent;
exports.isCapacitySignal = isCapacitySignal;
/**
 * Create a signal event with current timestamp.
 */
function createSignalEvent(signal, reason, key, metadata) {
    return {
        signal,
        timestamp: Date.now(),
        key,
        reason,
        metadata,
    };
}
/**
 * Check whether a signal indicates a capacity adjustment is needed.
 */
function isCapacitySignal(signal) {
    return signal === 'SCALE_UP' || signal === 'SCALE_DOWN' || signal === 'THROTTLE';
}
//# sourceMappingURL=adaptationSignal.js.map