"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const complianceZoneService_1 = require("@/services/geo/complianceZoneService");
(0, vitest_1.describe)('Geo Limiter Integration', () => {
    let zoneService;
    (0, vitest_1.beforeEach)(() => {
        zoneService = new complianceZoneService_1.ComplianceZoneService();
    });
    (0, vitest_1.describe)('GDPR Zone', () => {
        (0, vitest_1.it)('identifies EU countries as GDPR zone', () => {
            const location = {
                ip: '1.2.3.4',
                country: 'DE',
                source: 'geoip',
            };
            const zone = zoneService.resolveZone(location);
            (0, vitest_1.expect)(zone).not.toBeNull();
            (0, vitest_1.expect)(zone.name).toBe('GDPR');
        });
        (0, vitest_1.it)('applies 0.8 multiplier for GDPR countries', () => {
            const location = {
                ip: '1.2.3.4',
                country: 'FR',
                source: 'geoip',
            };
            const multiplier = zoneService.getLimitMultiplier(location);
            (0, vitest_1.expect)(multiplier).toBe(0.8);
        });
        (0, vitest_1.it)('does not block GDPR countries', () => {
            const location = {
                ip: '1.2.3.4',
                country: 'IT',
                source: 'geoip',
            };
            (0, vitest_1.expect)(zoneService.isBlocked(location)).toBe(false);
        });
    });
    (0, vitest_1.describe)('Restricted Zone', () => {
        (0, vitest_1.it)('applies stricter limits for restricted countries', () => {
            const location = {
                ip: '5.6.7.8',
                country: 'CN',
                source: 'geoip',
            };
            const multiplier = zoneService.getLimitMultiplier(location);
            (0, vitest_1.expect)(multiplier).toBe(0.5);
        });
    });
    (0, vitest_1.describe)('Unknown Regions', () => {
        (0, vitest_1.it)('returns 1.0 multiplier for unknown countries', () => {
            const location = {
                ip: '9.10.11.12',
                country: 'XX',
                source: 'geoip',
            };
            const multiplier = zoneService.getLimitMultiplier(location);
            (0, vitest_1.expect)(multiplier).toBe(1.0);
        });
        (0, vitest_1.it)('returns 1.0 multiplier when country is undefined', () => {
            const location = {
                ip: '9.10.11.12',
                source: 'unknown',
            };
            const multiplier = zoneService.getLimitMultiplier(location);
            (0, vitest_1.expect)(multiplier).toBe(1.0);
        });
    });
    (0, vitest_1.describe)('Zone Management', () => {
        (0, vitest_1.it)('adds custom zones', () => {
            zoneService.addZone({
                name: 'CUSTOM',
                countries: ['AU', 'NZ'],
                limitMultiplier: 1.5,
                blocked: false,
                description: 'Oceania zone',
            });
            const location = { ip: '1.1.1.1', country: 'AU', source: 'geoip' };
            const multiplier = zoneService.getLimitMultiplier(location);
            (0, vitest_1.expect)(multiplier).toBe(1.5);
        });
        (0, vitest_1.it)('removes zones', () => {
            const removed = zoneService.removeZone('RESTRICTED');
            (0, vitest_1.expect)(removed).toBe(true);
            const location = { ip: '1.1.1.1', country: 'CN', source: 'geoip' };
            const multiplier = zoneService.getLimitMultiplier(location);
            (0, vitest_1.expect)(multiplier).toBe(1.0); // No zone match after removal
        });
        (0, vitest_1.it)('lists all zones', () => {
            const zones = zoneService.listZones();
            (0, vitest_1.expect)(zones.length).toBeGreaterThanOrEqual(3);
            (0, vitest_1.expect)(zones.map(z => z.name)).toContain('GDPR');
        });
    });
});
//# sourceMappingURL=geoLimiterIntegration.test.js.map