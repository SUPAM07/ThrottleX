"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyGenerator = void 0;
const constants_1 = require("../../../utils/constants");
/**
 * Generates structured Redis keys for rate limiters
 * Format: rl:{algorithm}:{tenant?}:{userId?}:{endpoint?}
 */
class KeyGenerator {
    static generate(params) {
        const { algorithm, key, tenantId, userId, endpoint } = params;
        const parts = [constants_1.REDIS_KEY_PREFIX.RATE_LIMIT, algorithm];
        if (tenantId)
            parts.push(`t:${this.sanitize(tenantId)}`);
        if (userId)
            parts.push(`u:${this.sanitize(userId)}`);
        if (endpoint)
            parts.push(`e:${this.sanitize(endpoint)}`);
        parts.push(this.sanitize(key));
        return parts.join(':');
    }
    static forIP(ip, algorithm, windowMs) {
        const windowBucket = Math.floor(Date.now() / windowMs);
        return `${constants_1.REDIS_KEY_PREFIX.RATE_LIMIT}:${algorithm}:ip:${ip}:${windowBucket}`;
    }
    static forTenant(tenantId, algorithm) {
        return `${constants_1.REDIS_KEY_PREFIX.RATE_LIMIT}:${algorithm}:tenant:${tenantId}`;
    }
    static forEndpoint(endpoint, algorithm, windowMs) {
        const windowBucket = Math.floor(Date.now() / windowMs);
        const cleanEndpoint = endpoint.replace(/\//g, '_');
        return `${constants_1.REDIS_KEY_PREFIX.RATE_LIMIT}:${algorithm}:ep:${cleanEndpoint}:${windowBucket}`;
    }
    static forFixedWindow(baseKey, windowMs) {
        const windowBucket = Math.floor(Date.now() / windowMs);
        return `${baseKey}:fw:${windowBucket}`;
    }
    static sanitize(value) {
        return value.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 64);
    }
}
exports.KeyGenerator = KeyGenerator;
exports.default = KeyGenerator;
//# sourceMappingURL=keyGenerator.js.map