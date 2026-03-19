"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlidingWindowAlgorithm = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const timeUtils_1 = require("../../../utils/timeUtils");
const constants_1 = require("../../../utils/constants");
const SCRIPT = fs_1.default.readFileSync(path_1.default.join(__dirname, '../../../redis/luaScripts/slidingWindow.lua'), 'utf8');
class SlidingWindowAlgorithm {
    client;
    name = constants_1.ALGORITHMS.SLIDING_WINDOW;
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
        const { limit, windowMs } = config;
        const now = (0, timeUtils_1.nowMs)();
        const sha = await this.getScriptSha();
        const result = await this.client.evalsha(sha, 1, key, String(windowMs), String(limit), String(now), (0, uuid_1.v4)());
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
        const count = await this.client.zcard(key);
        const ttl = await this.client.ttl(key);
        return { count, ttl };
    }
}
exports.SlidingWindowAlgorithm = SlidingWindowAlgorithm;
exports.default = SlidingWindowAlgorithm;
//# sourceMappingURL=slidingWindow.js.map