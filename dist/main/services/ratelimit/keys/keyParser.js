"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyParser = void 0;
class KeyParser {
    static PREFIX = 'rl';
    /**
     * Parse a Redis rate-limit key into its component parts.
     * Returns null if the key does not match the expected format.
     */
    static parse(key) {
        const parts = key.split(':');
        if (parts.length < 3 || parts[0] !== KeyParser.PREFIX) {
            return null;
        }
        return {
            prefix: parts[0],
            algorithm: parts[1],
            identifier: parts.slice(2).join(':'),
            raw: key,
        };
    }
    /**
     * Extract just the algorithm name from a key.
     */
    static extractAlgorithm(key) {
        const parsed = this.parse(key);
        return parsed?.algorithm ?? null;
    }
    /**
     * Extract just the identifier from a key.
     */
    static extractIdentifier(key) {
        const parsed = this.parse(key);
        return parsed?.identifier ?? null;
    }
    /**
     * Validate that a key matches the expected rate-limit key format.
     */
    static isValid(key) {
        return this.parse(key) !== null;
    }
}
exports.KeyParser = KeyParser;
exports.default = KeyParser;
//# sourceMappingURL=keyParser.js.map