"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const geoConfig = {
    enabled: process.env.GEO_ENABLED === 'true',
    blockedCountries: (process.env.GEO_BLOCKED_COUNTRIES || '').split(',').filter(Boolean),
    blockedRegions: (process.env.GEO_BLOCKED_REGIONS || '').split(',').filter(Boolean),
    allowedCountries: (process.env.GEO_ALLOWED_COUNTRIES || '').split(',').filter(Boolean),
    complianceStrictness: process.env.COMPLIANCE_STRICTNESS || 'standard',
    countryLimits: {
        US: { limit: 1000, windowMs: 60_000 },
        EU: { limit: 500, windowMs: 60_000 },
        CN: { limit: 200, windowMs: 60_000 },
    },
    cdnHeaders: {
        cloudflare: 'CF-IPCountry',
        cloudfront: 'CloudFront-Viewer-Country',
        custom: process.env.GEO_CUSTOM_HEADER,
    },
};
exports.default = geoConfig;
//# sourceMappingURL=geoConfig.js.map