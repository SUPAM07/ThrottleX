/**
 * Get current timestamp in milliseconds
 */
export declare const nowMs: () => number;
/**
 * Get current timestamp in seconds
 */
export declare const nowSeconds: () => number;
/**
 * Get the start of the current fixed window (epoch aligned)
 * @param windowMs - window size in milliseconds
 */
export declare function getWindowStart(windowMs: number): number;
/**
 * Get the end of the current fixed window
 */
export declare function getWindowEnd(windowMs: number): number;
/**
 * Get TTL (in seconds) until next window reset
 */
export declare function getWindowTTL(windowMs: number): number;
/**
 * Convert milliseconds to seconds (ceiling)
 */
export declare const msToSeconds: (ms: number) => number;
/**
 * Format Unix timestamp to ISO string
 */
export declare const toISOString: (unixMs: number) => string;
/**
 * Calculate elapsed seconds since a timestamp (in seconds)
 */
export declare const elapsedSeconds: (sinceSeconds: number) => number;
/**
 * Round to N decimal places
 */
export declare const round: (value: number, decimals?: number) => number;
/**
 * Format duration as human-readable string
 */
export declare function formatDuration(ms: number): string;
/**
 * Get sliding window bucket key suffix for sub-window precision
 */
export declare function getSlidingWindowBucket(windowMs: number, buckets: number): number;
//# sourceMappingURL=timeUtils.d.ts.map