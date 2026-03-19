"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalCache = exports.LocalCache = void 0;
const lru_cache_1 = require("lru-cache");
const constants_1 = require("../../utils/constants");
class LocalCache {
    cache;
    constructor(maxSize = 10_000) {
        this.cache = new lru_cache_1.LRUCache({ max: maxSize });
    }
    set(key, value, ttlSeconds = constants_1.CACHE_TTL.CONFIG) {
        this.cache.set(key, {
            value,
            expiresAt: Date.now() + ttlSeconds * 1000,
        });
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return entry.value;
    }
    delete(key) {
        this.cache.delete(key);
    }
    has(key) {
        return this.get(key) !== null;
    }
    clear() {
        this.cache.clear();
    }
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.cache.max,
            calculatedSize: this.cache.calculatedSize,
        };
    }
}
exports.LocalCache = LocalCache;
exports.globalCache = new LocalCache();
exports.default = LocalCache;
//# sourceMappingURL=localCache.js.map