"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const validation_1 = require("../../main/utils/validation");
(0, vitest_1.describe)('Validation Schemas', () => {
    (0, vitest_1.describe)('RateLimitRequestSchema', () => {
        (0, vitest_1.it)('validates a valid request', () => {
            const input = { key: 'user:123', algorithm: 'token_bucket', limit: 100, windowMs: 60000 };
            const result = (0, validation_1.validate)(validation_1.RateLimitRequestSchema, input);
            (0, vitest_1.expect)(result.key).toBe('user:123');
        });
        (0, vitest_1.it)('throws on empty key', () => {
            (0, vitest_1.expect)(() => (0, validation_1.validate)(validation_1.RateLimitRequestSchema, { key: '' })).toThrow();
        });
        (0, vitest_1.it)('throws on invalid algorithm', () => {
            (0, vitest_1.expect)(() => (0, validation_1.validate)(validation_1.RateLimitRequestSchema, { key: 'test', algorithm: 'unknownAlgo' })).toThrow();
        });
        (0, vitest_1.it)('throws on negative limit', () => {
            (0, vitest_1.expect)(() => (0, validation_1.validate)(validation_1.RateLimitRequestSchema, { key: 'test', limit: -1 })).toThrow();
        });
    });
    (0, vitest_1.describe)('AdminLimitSchema', () => {
        (0, vitest_1.it)('validates a valid admin limit', () => {
            const input = { key: 'tenant:xyz', limit: 1000, windowMs: 60000, algorithm: 'sliding_window' };
            const result = (0, validation_1.validate)(validation_1.AdminLimitSchema, input);
            (0, vitest_1.expect)(result.limit).toBe(1000);
        });
    });
});
//# sourceMappingURL=compositeLimiter.test.js.map