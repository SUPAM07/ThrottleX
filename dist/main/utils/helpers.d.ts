/**
 * Sleep for specified milliseconds
 */
export declare const sleep: (ms: number) => Promise<void>;
/**
 * Retry an async operation with exponential backoff + jitter
 */
export declare function retry<T>(fn: () => Promise<T>, maxRetries?: number, baseDelayMs?: number): Promise<T>;
/**
 * Safely parse JSON, return null on failure
 */
export declare function safeJsonParse<T>(json: string): T | null;
/**
 * Debounce a function call
 */
export declare function debounce<T extends (...args: unknown[]) => void>(fn: T, delayMs: number): (...args: Parameters<T>) => void;
/**
 * Chunk an array into sub-arrays of specified size
 */
export declare function chunk<T>(arr: T[], size: number): T[][];
/**
 * Clamp a number between min and max
 */
export declare const clamp: (value: number, min: number, max: number) => number;
/**
 * Generate a random integer between min (inclusive) and max (exclusive)
 */
export declare const randomInt: (min: number, max: number) => number;
/**
 * Deep clone an object (JSON-serializable objects only)
 */
export declare function deepClone<T>(obj: T): T;
/**
 * Check if a value is defined and not null
 */
export declare function isDefined<T>(value: T | null | undefined): value is T;
/**
 * Format bytes to human-readable string
 */
export declare function formatBytes(bytes: number): string;
/**
 * Calculate percentile from sorted array
 */
export declare function percentile(sortedArr: number[], p: number): number;
/**
 * Map object values
 */
export declare function mapValues<T, U>(obj: Record<string, T>, fn: (value: T, key: string) => U): Record<string, U>;
//# sourceMappingURL=helpers.d.ts.map