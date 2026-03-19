"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationSchema = exports.BenchmarkRequestSchema = exports.AdminLimitSchema = exports.RateLimitRequestSchema = exports.RateLimitCheckSchema = void 0;
exports.validate = validate;
const zod_1 = require("zod");
/**
 * Zod schemas for request validation across all API endpoints.
 */
exports.RateLimitCheckSchema = zod_1.z.object({
    key: zod_1.z.string().min(1).max(512),
    algorithm: zod_1.z
        .enum(['token_bucket', 'sliding_window', 'fixed_window', 'leaky_bucket', 'composite'])
        .optional(),
    limit: zod_1.z.number().int().positive().max(1_000_000).optional(),
    windowMs: zod_1.z.number().int().positive().max(86_400_000).optional(), // max 24h
    cost: zod_1.z.number().int().positive().max(1000).optional().default(1),
    burstSize: zod_1.z.number().int().positive().optional(),
    refillRate: zod_1.z.number().positive().optional(),
    endpoint: zod_1.z.string().max(256).optional(),
    tenantId: zod_1.z.string().max(128).optional(),
    userId: zod_1.z.string().max(128).optional(),
    ip: zod_1.z.string().max(45).optional(), // IPv6 max length
    metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
});
// Alias for backward compatibility
exports.RateLimitRequestSchema = exports.RateLimitCheckSchema;
exports.AdminLimitSchema = zod_1.z.object({
    key: zod_1.z.string().min(1).max(512),
    limit: zod_1.z.number().int().positive().max(1_000_000),
    windowMs: zod_1.z.number().int().positive().max(86_400_000),
    algorithm: zod_1.z
        .enum(['token_bucket', 'sliding_window', 'fixed_window', 'leaky_bucket', 'composite'])
        .optional(),
    expiresAt: zod_1.z.number().int().positive().optional(),
});
exports.BenchmarkRequestSchema = zod_1.z.object({
    scenario: zod_1.z.enum(['burst', 'sustained', 'mixed', 'stress', 'spike']),
    concurrency: zod_1.z.number().int().positive().max(500),
    durationMs: zod_1.z.number().int().positive().max(300_000), // max 5 min
    targetRps: zod_1.z.number().int().positive().optional(),
    algorithm: zod_1.z
        .enum(['token_bucket', 'sliding_window', 'fixed_window', 'leaky_bucket', 'composite'])
        .optional(),
});
exports.PaginationSchema = zod_1.z.object({
    page: zod_1.z.number().int().positive().default(1),
    limit: zod_1.z.number().int().positive().max(100).default(20),
});
/**
 * Validate a request body against a schema.
 * Throws on validation failure, returns the validated data on success.
 */
function validate(schema, data) {
    return schema.parse(data);
}
//# sourceMappingURL=validation.js.map