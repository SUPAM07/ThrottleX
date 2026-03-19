"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheKeyManager = void 0;
/*
  Cache key generation and namespace management for the local LRU cache.
  Ensures cache keys don't collide across different concern areas.
 */
class CacheKeyManager {
    namespace;
    static SEPARATOR = ':';
    constructor(namespace = 'rl') {
        this.namespace = namespace;
    }
    /*
     Generate a cache key for a rate limit result.
     */
    rateLimitKey(algorithm, identifier) {
        return `${this.namespace}${CacheKeyManager.SEPARATOR}result${CacheKeyManager.SEPARATOR}${algorithm}${CacheKeyManager.SEPARATOR}${identifier}`;
    }
    /*
      Generate a cache key for a configuration override.
     */
    configKey(identifier) {
        return `${this.namespace}${CacheKeyManager.SEPARATOR}config${CacheKeyManager.SEPARATOR}${identifier}`;
    }
    /*
      Generate a cache key for geo-resolution results.
     */
    geoKey(ip) {
        return `${this.namespace}${CacheKeyManager.SEPARATOR}geo${CacheKeyManager.SEPARATOR}${ip}`;
    }
    /*
      Generate a cache key for API key validation results.
     */
    apiKeyKey(apiKey) {
        return `${this.namespace}${CacheKeyManager.SEPARATOR}apikey${CacheKeyManager.SEPARATOR}${apiKey}`;
    }
    /*
      Generate a cache key for anomaly analysis results.
     */
    anomalyKey(identifier) {
        return `${this.namespace}${CacheKeyManager.SEPARATOR}anomaly${CacheKeyManager.SEPARATOR}${identifier}`;
    }
    /*
      Parse a cache key to extract its components.
     */
    parse(key) {
        const parts = key.split(CacheKeyManager.SEPARATOR);
        if (parts.length < 3 || parts[0] !== this.namespace)
            return null;
        return {
            namespace: parts[0],
            type: parts[1],
            identifier: parts.slice(2).join(CacheKeyManager.SEPARATOR),
        };
    }
}
exports.CacheKeyManager = CacheKeyManager;
exports.default = CacheKeyManager;
//# sourceMappingURL=cacheKeyManager.js.map