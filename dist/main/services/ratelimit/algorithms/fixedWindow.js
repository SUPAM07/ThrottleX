"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedWindowAlgorithm = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const timeUtils_1 = require("../../../utils/timeUtils");
const constants_1 = require("../../../utils/constants");
const keyGenerator_1 = __importDefault(require("../keys/keyGenerator"));
const SCRIPT = fs_1.default.readFileSync(path_1.default.join(__dirname, '../../../redis/luaScripts/fixedWindow.lua'), 'utf8');
class FixedWindowAlgorithm {
    client;
    name = constants_1.ALGORITHMS.FIXED_WINDOW;
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
        // Append window bucket to key for epoch alignment
        const windowKey = keyGenerator_1.default.forFixedWindow(key, windowMs);
        const ttlSeconds = (0, timeUtils_1.getWindowTTL)(windowMs);
        const sha = await this.getScriptSha();
        const result = await this.client.evalsha(sha, 1, windowKey, String(limit), String(ttlSeconds), String(1) // cost
        );
        const [allowed, remaining, ttl, capacity] = result;
        const resetMs = Date.now() + ttl * 1000;
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
        // Delete all window keys matching base key
        const pattern = `${key}:fw:*`;
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
            await this.client.del(...keys);
        }
    }
    async getState(key) {
        const pattern = `${key}:fw:*`;
        const keys = await this.client.keys(pattern);
        if (keys.length === 0)
            return null;
        const count = await this.client.get(keys[0]);
        const ttl = await this.client.ttl(keys[0]);
        return { count: parseInt(count || '0', 10), ttl };
    }
}
exports.FixedWindowAlgorithm = FixedWindowAlgorithm;
exports.default = FixedWindowAlgorithm;
//# sourceMappingURL=fixedWindow.js.map