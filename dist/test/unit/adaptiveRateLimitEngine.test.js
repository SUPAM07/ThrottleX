"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const adaptiveRateLimitEngine_1 = require("../../main/services/adaptiveRateLimitEngine");
vitest_1.vi.mock('../../src/config/rateLimiterConfig', () => ({
    default: {
        adaptiveEnabled: true,
        adaptiveEvaluationIntervalMs: 300000,
        adaptiveMinConfidenceThreshold: 0.7,
        adaptiveMaxAdjustmentFactor: 2.0,
        adaptiveMinCapacity: 10,
        adaptiveMaxCapacity: 100000,
    },
}));
(0, vitest_1.describe)('AdaptiveRateLimitEngine', () => {
    let engine;
    let mockTrafficService;
    (0, vitest_1.beforeEach)(() => {
        mockTrafficService = {
            getAggregateStats: vitest_1.vi.fn().mockReturnValue({ totalKeys: 0, totalSnapshots: 0, signalCounts: {} }),
        };
        engine = new adaptiveRateLimitEngine_1.AdaptiveRateLimitEngine(mockTrafficService);
    });
    (0, vitest_1.describe)('Manual Overrides', () => {
        (0, vitest_1.it)('should set, retrieve, and clear a manual override', () => {
            engine.setManualOverride('test-key', 500);
            const status = engine.getStatus('test-key', 1.0);
            (0, vitest_1.expect)(status.isOverridden).toBe(true);
            (0, vitest_1.expect)(status.overrideLimit).toBe(500);
            const limit = engine.getAdjustedLimit('test-key', 100, 0.5, 0.9, 'THROTTLE', 'testing');
            (0, vitest_1.expect)(limit).toBe(500); // Override takes precedence
            engine.clearManualOverride('test-key');
            (0, vitest_1.expect)(engine.getStatus('test-key', 1.0).isOverridden).toBe(false);
        });
    });
    (0, vitest_1.describe)('Adaptive Adjustments', () => {
        (0, vitest_1.it)('returns the base limit when signal is STABLE', () => {
            const limit = engine.getAdjustedLimit('test-key', 100, 0.5, 0.9, 'STABLE', 'normal');
            (0, vitest_1.expect)(limit).toBe(100);
        });
        (0, vitest_1.it)('returns the base limit when confidence is below threshold', () => {
            const limit = engine.getAdjustedLimit('test-key', 100, 0.5, 0.5, 'THROTTLE', 'low confidence');
            (0, vitest_1.expect)(limit).toBe(100);
        });
        (0, vitest_1.it)('applies the limit multiplier and clamps within factors', () => {
            // Base limit 100, suggested 3.0x (300).
            // Since maxAdjustmentFactor is 2.0x, the multiplier should be clamped to 2.0
            // 100 * 2.0 = 200
            const limit = engine.getAdjustedLimit('test-key', 100, 3.0, 0.9, 'SCALE_UP', 'high traffic drop');
            (0, vitest_1.expect)(limit).toBe(200);
        });
        (0, vitest_1.it)('respects the absolute min and max capacity bounds', () => {
            // Rate limiter minimum capacity is configured to 10.
            const lowLimit = engine.getAdjustedLimit('low-key', 15, 0.1, 0.9, 'THROTTLE', 'testing');
            (0, vitest_1.expect)(lowLimit).toBe(10);
            // Rate limiter maximum capacity is configured to 100000.
            const highLimit = engine.getAdjustedLimit('high-key', 80000, 2.0, 0.9, 'SCALE_UP', 'testing');
            (0, vitest_1.expect)(highLimit).toBe(100000);
        });
    });
    (0, vitest_1.describe)('Config Status Lifecycle', () => {
        (0, vitest_1.it)('should return config matching properties', () => {
            const config = engine.getConfig();
            (0, vitest_1.expect)(config.enabled).toBe(true);
            (0, vitest_1.expect)(config.minCapacity).toBe(10);
            (0, vitest_1.expect)(config.maxAdjustmentFactor).toBe(2.0);
        });
    });
});
//# sourceMappingURL=adaptiveRateLimitEngine.test.js.map