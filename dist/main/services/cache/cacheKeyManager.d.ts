export declare class CacheKeyManager {
    private readonly namespace;
    private static readonly SEPARATOR;
    constructor(namespace?: string);
    rateLimitKey(algorithm: string, identifier: string): string;
    configKey(identifier: string): string;
    geoKey(ip: string): string;
    apiKeyKey(apiKey: string): string;
    anomalyKey(identifier: string): string;
    parse(key: string): {
        namespace: string;
        type: string;
        identifier: string;
    } | null;
}
export default CacheKeyManager;
//# sourceMappingURL=cacheKeyManager.d.ts.map