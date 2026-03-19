"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBucketAlgorithm = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const timeUtils_1 = require("../../../utils/timeUtils");
const constants_1 = require("../../../utils/constants");
const SCRIPT = fs_1.default.readFileSync(path_1.default.join(__dirname, '../../../redis/luaScripts/tokenBucket.lua'), 'utf8');
class TokenBucketAlgorithm {
    client;
    name = constants_1.ALGORITHMS.TOKEN_BUCKET;
    scriptSha = null;
    constructor(client) {
        this.client = client;
    }
    async getScriptSha() {
        if (!this.scriptSha) {
            this.scriptSha = await this.client.call('SCRIPT', 'LOAD', SCRIPT);
        }
        return this.scriptSha;
    }
    async check(key, config) {
        const { limit, windowMs, burstSize = limit, refillRate = limit / (windowMs / 1000), } = config;
        const now = (0, timeUtils_1.nowMs)();
        const sha = await this.getScriptSha();
        const result = await this.client.evalsha(sha, 1, key, String(1), // cost or tokensToConsume
        String(burstSize), // capacity
        String(refillRate), String(now));
        const [allowed, remaining, resetMs, capacity] = result;
        return {
            allowed: allowed === 1,
            remaining,
            limit: capacity,
            resetMs,
            algorithm: this.name,
            key,
        };
    }
    async reset(key) {
        await this.client.del(key);
    }
    async getState(key) {
        const data = await this.client.hgetall(key);
        if (!data || Object.keys(data).length === 0)
            return null;
        return {
            tokens: parseFloat(data.tokens || '0'),
            lastRefill: parseInt(data.lastRefillTime || '0', 10),
            capacity: parseInt(data.capacity || '0', 10),
            refillRate: parseFloat(data.refillRate || '0'),
        };
    }
}
exports.TokenBucketAlgorithm = TokenBucketAlgorithm;
exports.default = TokenBucketAlgorithm;
//# sourceMappingURL=tokenBucket.js.map