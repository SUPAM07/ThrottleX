"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.round = exports.elapsedSeconds = exports.toISOString = exports.msToSeconds = exports.nowSeconds = exports.nowMs = void 0;
exports.getWindowStart = getWindowStart;
exports.getWindowEnd = getWindowEnd;
exports.getWindowTTL = getWindowTTL;
exports.formatDuration = formatDuration;
exports.getSlidingWindowBucket = getSlidingWindowBucket;
/**
 * Get current timestamp in milliseconds
 */
const nowMs = () => Date.now();
exports.nowMs = nowMs;
/**
 * Get current timestamp in seconds
 */
const nowSeconds = () => Math.floor(Date.now() / 1000);
exports.nowSeconds = nowSeconds;
/**
 * Get the start of the current fixed window (epoch aligned)
 * @param windowMs - window size in milliseconds
 */
function getWindowStart(windowMs) {
    return Math.floor(Date.now() / windowMs) * windowMs;
}
/**
 * Get the end of the current fixed window
 */
function getWindowEnd(windowMs) {
    return getWindowStart(windowMs) + windowMs;
}
/**
 * Get TTL (in seconds) until next window reset
 */
function getWindowTTL(windowMs) {
    return Math.ceil((getWindowEnd(windowMs) - Date.now()) / 1000);
}
/**
 * Convert milliseconds to seconds (ceiling)
 */
const msToSeconds = (ms) => Math.ceil(ms / 1000);
exports.msToSeconds = msToSeconds;
/**
 * Format Unix timestamp to ISO string
 */
const toISOString = (unixMs) => new Date(unixMs).toISOString();
exports.toISOString = toISOString;
/**
 * Calculate elapsed seconds since a timestamp (in seconds)
 */
const elapsedSeconds = (sinceSeconds) => (0, exports.nowSeconds)() - sinceSeconds;
exports.elapsedSeconds = elapsedSeconds;
/**
 * Round to N decimal places
 */
const round = (value, decimals = 3) => Math.round(value * 10 ** decimals) / 10 ** decimals;
exports.round = round;
/**
 * Format duration as human-readable string
 */
function formatDuration(ms) {
    if (ms < 1000)
        return `${ms}ms`;
    if (ms < 60_000)
        return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3_600_000)
        return `${(ms / 60_000).toFixed(1)}m`;
    return `${(ms / 3_600_000).toFixed(1)}h`;
}
/**
 * Get sliding window bucket key suffix for sub-window precision
 */
function getSlidingWindowBucket(windowMs, buckets) {
    const bucketSize = windowMs / buckets;
    return Math.floor(Date.now() / bucketSize);
}
//# sourceMappingURL=timeUtils.js.map