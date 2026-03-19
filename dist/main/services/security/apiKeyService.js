"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyService = exports.ApiKeyService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const uuid_1 = require("uuid");
const redisClient_1 = require("../../redis/redisClient");
const localCache_1 = require("../cache/localCache");
const constants_1 = require("../../utils/constants");
const logger_1 = __importDefault(require("../../utils/logger"));
class ApiKeyService {
    redis = (0, redisClient_1.getRedisClient)();
    /** Generate a new API key, store hash in Redis */
    async generate(params) {
        const rawKey = `rl_${(0, uuid_1.v4)().replace(/-/g, '')}`;
        const keyHash = this.hash(rawKey);
        const id = (0, uuid_1.v4)();
        const metadata = {
            id,
            keyHash,
            tenantId: params.tenantId,
            name: params.name,
            scopes: params.scopes || ['rate_limit'],
            createdAt: Date.now(),
            expiresAt: params.expiresAt,
            rateLimit: params.rateLimit,
        };
        const redisKey = `${constants_1.REDIS_KEY_PREFIX.API_KEY}:${keyHash}`;
        await this.redis.set(redisKey, JSON.stringify(metadata));
        if (params.expiresAt) {
            const ttl = Math.ceil((params.expiresAt - Date.now()) / 1000);
            if (ttl > 0)
                await this.redis.expire(redisKey, ttl);
        }
        logger_1.default.info('API key generated', { id, tenantId: params.tenantId, name: params.name });
        return { key: rawKey, metadata };
    }
    /** Validate API key, returns metadata or null */
    async validate(rawKey) {
        const keyHash = this.hash(rawKey);
        // Check cache first
        const cached = localCache_1.globalCache.get(`ak:${keyHash}`);
        if (cached)
            return cached;
        const redisKey = `${constants_1.REDIS_KEY_PREFIX.API_KEY}:${keyHash}`;
        const data = await this.redis.get(redisKey);
        if (!data)
            return null;
        const metadata = JSON.parse(data);
        // Check expiry
        if (metadata.expiresAt && metadata.expiresAt < Date.now()) {
            await this.redis.del(redisKey);
            return null;
        }
        localCache_1.globalCache.set(`ak:${keyHash}`, metadata, constants_1.CACHE_TTL.API_KEY);
        return metadata;
    }
    /** Revoke an API key by hash */
    async revoke(rawKey) {
        const keyHash = this.hash(rawKey);
        await this.redis.del(`${constants_1.REDIS_KEY_PREFIX.API_KEY}:${keyHash}`);
        localCache_1.globalCache.delete(`ak:${keyHash}`);
        logger_1.default.info('API key revoked', { keyHash });
    }
    /** List all API keys for a tenant */
    async listForTenant(tenantId) {
        const pattern = `${constants_1.REDIS_KEY_PREFIX.API_KEY}:*`;
        const keys = await this.redis.keys(pattern);
        const results = [];
        for (const key of keys) {
            const data = await this.redis.get(key);
            if (data) {
                const meta = JSON.parse(data);
                if (meta.tenantId === tenantId)
                    results.push(meta);
            }
        }
        return results;
    }
    hash(key) {
        return crypto_1.default.createHash('sha256').update(key).digest('hex');
    }
}
exports.ApiKeyService = ApiKeyService;
exports.apiKeyService = new ApiKeyService();
exports.default = ApiKeyService;
//# sourceMappingURL=apiKeyService.js.map