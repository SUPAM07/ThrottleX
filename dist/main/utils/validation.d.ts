import { z } from 'zod';
/**
 * Zod schemas for request validation across all API endpoints.
 */
export declare const RateLimitCheckSchema: z.ZodObject<{
    key: z.ZodString;
    algorithm: z.ZodOptional<z.ZodEnum<["token_bucket", "sliding_window", "fixed_window", "leaky_bucket", "composite"]>>;
    limit: z.ZodOptional<z.ZodNumber>;
    windowMs: z.ZodOptional<z.ZodNumber>;
    cost: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    burstSize: z.ZodOptional<z.ZodNumber>;
    refillRate: z.ZodOptional<z.ZodNumber>;
    endpoint: z.ZodOptional<z.ZodString>;
    tenantId: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    ip: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    key: string;
    cost: number;
    metadata?: Record<string, unknown> | undefined;
    tenantId?: string | undefined;
    limit?: number | undefined;
    windowMs?: number | undefined;
    burstSize?: number | undefined;
    refillRate?: number | undefined;
    algorithm?: "token_bucket" | "sliding_window" | "fixed_window" | "leaky_bucket" | "composite" | undefined;
    userId?: string | undefined;
    endpoint?: string | undefined;
    ip?: string | undefined;
}, {
    key: string;
    metadata?: Record<string, unknown> | undefined;
    tenantId?: string | undefined;
    limit?: number | undefined;
    windowMs?: number | undefined;
    burstSize?: number | undefined;
    refillRate?: number | undefined;
    algorithm?: "token_bucket" | "sliding_window" | "fixed_window" | "leaky_bucket" | "composite" | undefined;
    userId?: string | undefined;
    endpoint?: string | undefined;
    cost?: number | undefined;
    ip?: string | undefined;
}>;
export declare const RateLimitRequestSchema: z.ZodObject<{
    key: z.ZodString;
    algorithm: z.ZodOptional<z.ZodEnum<["token_bucket", "sliding_window", "fixed_window", "leaky_bucket", "composite"]>>;
    limit: z.ZodOptional<z.ZodNumber>;
    windowMs: z.ZodOptional<z.ZodNumber>;
    cost: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    burstSize: z.ZodOptional<z.ZodNumber>;
    refillRate: z.ZodOptional<z.ZodNumber>;
    endpoint: z.ZodOptional<z.ZodString>;
    tenantId: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    ip: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    key: string;
    cost: number;
    metadata?: Record<string, unknown> | undefined;
    tenantId?: string | undefined;
    limit?: number | undefined;
    windowMs?: number | undefined;
    burstSize?: number | undefined;
    refillRate?: number | undefined;
    algorithm?: "token_bucket" | "sliding_window" | "fixed_window" | "leaky_bucket" | "composite" | undefined;
    userId?: string | undefined;
    endpoint?: string | undefined;
    ip?: string | undefined;
}, {
    key: string;
    metadata?: Record<string, unknown> | undefined;
    tenantId?: string | undefined;
    limit?: number | undefined;
    windowMs?: number | undefined;
    burstSize?: number | undefined;
    refillRate?: number | undefined;
    algorithm?: "token_bucket" | "sliding_window" | "fixed_window" | "leaky_bucket" | "composite" | undefined;
    userId?: string | undefined;
    endpoint?: string | undefined;
    cost?: number | undefined;
    ip?: string | undefined;
}>;
export declare const AdminLimitSchema: z.ZodObject<{
    key: z.ZodString;
    limit: z.ZodNumber;
    windowMs: z.ZodNumber;
    algorithm: z.ZodOptional<z.ZodEnum<["token_bucket", "sliding_window", "fixed_window", "leaky_bucket", "composite"]>>;
    expiresAt: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    key: string;
    limit: number;
    windowMs: number;
    expiresAt?: number | undefined;
    algorithm?: "token_bucket" | "sliding_window" | "fixed_window" | "leaky_bucket" | "composite" | undefined;
}, {
    key: string;
    limit: number;
    windowMs: number;
    expiresAt?: number | undefined;
    algorithm?: "token_bucket" | "sliding_window" | "fixed_window" | "leaky_bucket" | "composite" | undefined;
}>;
export declare const BenchmarkRequestSchema: z.ZodObject<{
    scenario: z.ZodEnum<["burst", "sustained", "mixed", "stress", "spike"]>;
    concurrency: z.ZodNumber;
    durationMs: z.ZodNumber;
    targetRps: z.ZodOptional<z.ZodNumber>;
    algorithm: z.ZodOptional<z.ZodEnum<["token_bucket", "sliding_window", "fixed_window", "leaky_bucket", "composite"]>>;
}, "strip", z.ZodTypeAny, {
    scenario: "burst" | "sustained" | "mixed" | "stress" | "spike";
    concurrency: number;
    durationMs: number;
    algorithm?: "token_bucket" | "sliding_window" | "fixed_window" | "leaky_bucket" | "composite" | undefined;
    targetRps?: number | undefined;
}, {
    scenario: "burst" | "sustained" | "mixed" | "stress" | "spike";
    concurrency: number;
    durationMs: number;
    algorithm?: "token_bucket" | "sliding_window" | "fixed_window" | "leaky_bucket" | "composite" | undefined;
    targetRps?: number | undefined;
}>;
export declare const PaginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
}, {
    limit?: number | undefined;
    page?: number | undefined;
}>;
/**
 * Validate a request body against a schema.
 * Throws on validation failure, returns the validated data on success.
 */
export declare function validate<T>(schema: z.ZodSchema<T>, data: unknown): T;
//# sourceMappingURL=validation.d.ts.map