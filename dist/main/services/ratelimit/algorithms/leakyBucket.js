"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeakyBucketAlgorithm = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const timeUtils_1 = require("../../../utils/timeUtils");
const constants_1 = require("../../../utils/constants");
const SCRIPT = fs_1.default.readFileSync(path_1.default.join(__dirname, '../../../redis/luaScripts/leakyBucket.lua'), 'utf8');
class LeakyBucketAlgorithm {
    client;
    name = constants_1.ALGORITHMS.LEAKY_BUCKET;
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
        const { limit, capacity = constants_1.DEFAULT_LIMITS.LEAKY_BUCKET_CAPACITY, drainRate = constants_1.DEFAULT_LIMITS.LEAKY_BUCKET_DRAIN_RATE, } = config;
        const now = (0, timeUtils_1.nowMs)();
        const sha = await this.getScriptSha();
        const result = await this.client.evalsha(sha, 1, key, String(capacity), String(drainRate), String(now), String(1) // cost
        );
        const [allowed, remaining, resetMs, cap] = result;
        return {
            allowed: allowed === 1,
            remaining,
            limit: cap,
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
            queue: parseFloat(data.queue || '0'),
            lastDrain: parseInt(data.last_drain || '0', 10),
        };
    }
}
exports.LeakyBucketAlgorithm = LeakyBucketAlgorithm;
exports.default = LeakyBucketAlgorithm;
//# sourceMappingURL=leakyBucket.js.map