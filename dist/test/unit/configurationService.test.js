"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const configurationService_1 = require("../../main/services/configurationService");
(0, vitest_1.describe)('ConfigurationService', () => {
    let service;
    (0, vitest_1.beforeEach)(() => {
        service = new configurationService_1.ConfigurationService();
    });
    (0, vitest_1.describe)('Hierarchy Resolution', () => {
        (0, vitest_1.it)('returns null when no overrides exist', () => {
            (0, vitest_1.expect)(service.getEffectiveConfig('api:user:123')).toBeNull();
        });
        (0, vitest_1.it)('returns exact key match over pattern match', () => {
            service.setPatternOverride('api:user:*', { limit: 50 });
            service.setOverride('api:user:123', { limit: 100 });
            const config = service.getEffectiveConfig('api:user:123');
            (0, vitest_1.expect)(config?.limit).toBe(100);
            const patternConfig = service.getEffectiveConfig('api:user:456');
            (0, vitest_1.expect)(patternConfig?.limit).toBe(50);
        });
        (0, vitest_1.it)('properly resolves wildcard patterns in the middle', () => {
            service.setPatternOverride('api:*:status', { limit: 200, algorithm: 'sliding_window' });
            const config1 = service.getEffectiveConfig('api:system:status');
            const config2 = service.getEffectiveConfig('api:billing:status');
            const noMatch = service.getEffectiveConfig('api:system:health');
            (0, vitest_1.expect)(config1?.limit).toBe(200);
            (0, vitest_1.expect)(config1?.algorithm).toBe('sliding_window');
            (0, vitest_1.expect)(config2?.limit).toBe(200);
            (0, vitest_1.expect)(noMatch).toBeNull();
        });
        (0, vitest_1.it)('respects expiration times on keys and patterns', () => {
            const past = Date.now() - 10000;
            service.setOverride('expired:key', { limit: 10 }, past);
            service.setPatternOverride('expired:*', { limit: 20 }, past);
            (0, vitest_1.expect)(service.getEffectiveConfig('expired:key')).toBeNull();
            (0, vitest_1.expect)(service.getEffectiveConfig('expired:test')).toBeNull();
        });
    });
    (0, vitest_1.describe)('Dynamic Defaults', () => {
        (0, vitest_1.it)('updates defaults seamlessly', () => {
            // Verify base defaults first
            (0, vitest_1.expect)(service.getDefaultConfig().defaultLimit).toBe(100);
            // Update default capacity dynamically
            service.updateDefaultConfig({ defaultLimit: 500 });
            (0, vitest_1.expect)(service.getDefaultConfig().defaultLimit).toBe(500);
        });
    });
});
//# sourceMappingURL=configurationService.test.js.map