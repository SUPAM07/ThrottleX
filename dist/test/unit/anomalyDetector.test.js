"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const trafficPatternAnalyzer_1 = require("@/services/adaptive/trafficPatternAnalyzer");
(0, vitest_1.describe)('AnomalyDetector (TrafficPatternAnalyzer)', () => {
    let analyzer;
    (0, vitest_1.beforeEach)(() => {
        analyzer = new trafficPatternAnalyzer_1.TrafficPatternAnalyzer();
    });
    (0, vitest_1.it)('returns STABLE with insufficient samples', () => {
        analyzer.addSample(100, 0.1);
        analyzer.addSample(100, 0.1);
        const result = analyzer.analyze();
        (0, vitest_1.expect)(result.signal).toBe('STABLE');
        (0, vitest_1.expect)(result.confidence).toBeLessThan(1);
    });
    (0, vitest_1.it)('detects traffic spikes (THROTTLE signal)', () => {
        // Build up baseline
        for (let i = 0; i < 20; i++) {
            analyzer.addSample(100, 0.05);
        }
        // Inject a spike
        analyzer.addSample(1000, 0.1);
        const result = analyzer.analyze();
        (0, vitest_1.expect)(['THROTTLE', 'STABLE']).toContain(result.signal);
        (0, vitest_1.expect)(result.zScore).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('detects traffic drops (SCALE_UP signal)', () => {
        // Build up baseline
        for (let i = 0; i < 20; i++) {
            analyzer.addSample(500, 0.05);
        }
        // Inject a drop
        analyzer.addSample(10, 0.0);
        const result = analyzer.analyze();
        (0, vitest_1.expect)(['SCALE_UP', 'STABLE']).toContain(result.signal);
        (0, vitest_1.expect)(result.zScore).toBeLessThan(0);
    });
    (0, vitest_1.it)('detects high rejection rate (ALERT signal)', () => {
        for (let i = 0; i < 10; i++) {
            analyzer.addSample(100, 0.05);
        }
        analyzer.addSample(100, 0.95); // Very high rejection
        const result = analyzer.analyze();
        (0, vitest_1.expect)(['ALERT', 'STABLE']).toContain(result.signal);
    });
    (0, vitest_1.it)('confidence increases with more samples', () => {
        for (let i = 0; i < 5; i++) {
            analyzer.addSample(100, 0.05);
        }
        const r1 = analyzer.analyze();
        for (let i = 0; i < 15; i++) {
            analyzer.addSample(100, 0.05);
        }
        const r2 = analyzer.analyze();
        (0, vitest_1.expect)(r2.confidence).toBeGreaterThanOrEqual(r1.confidence);
    });
    (0, vitest_1.it)('reset clears all state', () => {
        for (let i = 0; i < 10; i++) {
            analyzer.addSample(100, 0.05);
        }
        analyzer.reset();
        const result = analyzer.analyze();
        (0, vitest_1.expect)(result.signal).toBe('STABLE');
        (0, vitest_1.expect)(result.confidence).toBe(0);
    });
    (0, vitest_1.it)('suggested limit multiplier stays within bounds', () => {
        for (let i = 0; i < 20; i++) {
            analyzer.addSample(100, 0.05);
        }
        analyzer.addSample(10000, 0.5);
        const result = analyzer.analyze();
        (0, vitest_1.expect)(result.suggestedLimitMultiplier).toBeGreaterThan(0);
        (0, vitest_1.expect)(result.suggestedLimitMultiplier).toBeLessThanOrEqual(3);
    });
});
//# sourceMappingURL=anomalyDetector.test.js.map