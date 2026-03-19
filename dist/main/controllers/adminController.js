"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminKey = getAdminKey;
exports.setAdminLimit = setAdminLimit;
exports.deleteAdminKey = deleteAdminKey;
exports.listAdminKeys = listAdminKeys;
const redisClient_1 = require("../redis/redisClient");
const constants_1 = require("../utils/constants");
const validation_1 = require("../utils/validation");
const logger_1 = __importDefault(require("../utils/logger"));
const redis = (0, redisClient_1.getRedisClient)();
async function getAdminKey(req, res) {
    const { key } = req.params;
    const data = await redis.hgetall(`${constants_1.REDIS_KEY_PREFIX.CONFIG}:limit:${key}`);
    if (!data || Object.keys(data).length === 0) {
        res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({ error: 'Key not found' });
        return;
    }
    res.json(data);
}
async function setAdminLimit(req, res) {
    // If key is provided in path (PUT /limits/:key), override body key
    if (req.params.key) {
        req.body.key = req.params.key;
    }
    const input = (0, validation_1.validate)(validation_1.AdminLimitSchema, req.body);
    const redisKey = `${constants_1.REDIS_KEY_PREFIX.CONFIG}:limit:${input.key}`;
    const data = {
        key: input.key,
        limit: String(input.limit),
        windowMs: String(input.windowMs),
        algorithm: input.algorithm || 'token_bucket',
        updatedAt: new Date().toISOString(),
    };
    await redis.hset(redisKey, data);
    if (input.expiresAt) {
        const ttl = Math.ceil((input.expiresAt - Date.now()) / 1000);
        if (ttl > 0)
            await redis.expire(redisKey, ttl);
    }
    logger_1.default.info('Admin limit set', { key: input.key });
    res.status(constants_1.HTTP_STATUS.OK).json({ ...data, expiresAt: input.expiresAt });
}
async function deleteAdminKey(req, res) {
    const { key } = req.params;
    await redis.del(`${constants_1.REDIS_KEY_PREFIX.CONFIG}:limit:${key}`);
    res.status(constants_1.HTTP_STATUS.NO_CONTENT).send();
}
async function listAdminKeys(req, res) {
    const pattern = `${constants_1.REDIS_KEY_PREFIX.CONFIG}:limit:*`;
    const keys = await redis.keys(pattern);
    const items = await Promise.all(keys.map(async (k) => redis.hgetall(k)));
    res.json({ keys: items.filter(Boolean), total: items.length });
}
//# sourceMappingURL=adminController.js.map