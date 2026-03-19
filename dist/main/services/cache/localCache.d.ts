export declare class LocalCache {
    private cache;
    constructor(maxSize?: number);
    set<T>(key: string, value: T, ttlSeconds?: number): void;
    get<T>(key: string): T | null;
    delete(key: string): void;
    has(key: string): boolean;
    clear(): void;
    getStats(): {
        size: number;
        maxSize: number;
        calculatedSize: number;
    };
}
export declare const globalCache: LocalCache;
export default LocalCache;
//# sourceMappingURL=localCache.d.ts.map