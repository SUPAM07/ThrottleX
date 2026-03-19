"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeLimiterAlgorithm = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const timeUtils_1 = require("../../../utils/timeUtils");
const constants_1 = require("../../../utils/constants");
const SCRIPT = fs_1.default.readFileSync(path_1.default.join(__dirname, '../../../redis/luaScripts/compositeLimiter.lua'), 'utf8');
class CompositeLimiterAlgorithm {
    client;
    name = constants_1.ALGORITHMS.COMPOSITE;
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
        const { components = [], combinationMode = 'AND' } = config;
        if (components.length === 0) {
            // Fallback: no sub-components, allow
            return {
                allowed: true,
                remaining: config.limit,
                limit: config.limit,
                resetMs: Date.now() + config.windowMs,
                algorithm: this.name,
                key,
            };
        }
        const now = (0, timeUtils_1.nowMs)();
        const sha = await this.getScriptSha();
        const keys = components.map((c) => c.key || `${key}:c:${c.algorithm}`);
        // Build ARGV: mode, count, then per-component: limit, windowMs, cost, now
        const argv = [combinationMode, String(components.length)];
        for (const comp of components) {
            argv.push(String(comp.limit), String(comp.windowMs), String(1), String(now));
        }
        const result = await this.client.evalsha(sha, keys.length, ...keys, ...argv);
        const [allowed, remaining, resetMs, numComponents] = result;
        return {
            allowed: allowed === 1,
            remaining,
            limit: components[0]?.limit || 0,
            resetMs,
            algorithm: this.name,
            key,
            metadata: { components: numComponents, mode: combinationMode },
        };
    }
    async reset(key) {
        const pattern = `${key}:c:*`;
        const keys = await this.client.keys(pattern);
        if (keys.length > 0)
            await this.client.del(...keys);
    }
    async getState(key) {
        const pattern = `${key}:c:*`;
        const keys = await this.client.keys(pattern);
        return { subKeys: keys.length };
    }
}
exports.CompositeLimiterAlgorithm = CompositeLimiterAlgorithm;
exports.default = CompositeLimiterAlgorithm;
//# sourceMappingURL=compositeLimiter.js.map