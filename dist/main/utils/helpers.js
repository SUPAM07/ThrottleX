"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomInt = exports.clamp = exports.sleep = void 0;
exports.retry = retry;
exports.safeJsonParse = safeJsonParse;
exports.debounce = debounce;
exports.chunk = chunk;
exports.deepClone = deepClone;
exports.isDefined = isDefined;
exports.formatBytes = formatBytes;
exports.percentile = percentile;
exports.mapValues = mapValues;
/**
 * Sleep for specified milliseconds
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.sleep = sleep;
/**
 * Retry an async operation with exponential backoff + jitter
 */
async function retry(fn, maxRetries = 3, baseDelayMs = 100) {
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (attempt < maxRetries) {
                const jitter = Math.random() * baseDelayMs;
                await (0, exports.sleep)(baseDelayMs * Math.pow(2, attempt) + jitter);
            }
        }
    }
    throw lastError;
}
/**
 * Safely parse JSON, return null on failure
 */
function safeJsonParse(json) {
    try {
        return JSON.parse(json);
    }
    catch {
        return null;
    }
}
/**
 * Debounce a function call
 */
function debounce(fn, delayMs) {
    let timer = null;
    return (...args) => {
        if (timer)
            clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delayMs);
    };
}
/**
 * Chunk an array into sub-arrays of specified size
 */
function chunk(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}
/**
 * Clamp a number between min and max
 */
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
exports.clamp = clamp;
/**
 * Generate a random integer between min (inclusive) and max (exclusive)
 */
const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
exports.randomInt = randomInt;
/**
 * Deep clone an object (JSON-serializable objects only)
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * Check if a value is defined and not null
 */
function isDefined(value) {
    return value !== null && value !== undefined;
}
/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
}
/**
 * Calculate percentile from sorted array
 */
function percentile(sortedArr, p) {
    if (sortedArr.length === 0)
        return 0;
    const index = Math.ceil((p / 100) * sortedArr.length) - 1;
    return sortedArr[Math.max(0, index)];
}
/**
 * Map object values
 */
function mapValues(obj, fn) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        result[key] = fn(value, key);
    }
    return result;
}
//# sourceMappingURL=helpers.js.map