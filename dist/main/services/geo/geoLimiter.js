"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geoLimiter = exports.GeoLimiter = void 0;
const geoConfig_1 = __importDefault(require("../../config/geoConfig"));
const geoResolver_1 = require("./geoResolver");
class GeoLimiter {
    isBlocked(ip, req) {
        if (!geoConfig_1.default.enabled)
            return { blocked: false };
        const geo = geoResolver_1.geoResolver.resolve(ip, req);
        // Check blocked countries
        if (geo.country && geoConfig_1.default.blockedCountries.includes(geo.country)) {
            return { blocked: true, reason: 'Country blocked', country: geo.country };
        }
        // Check allowed countries (if list is defined, only allow those)
        if (geoConfig_1.default.allowedCountries.length > 0 &&
            geo.country &&
            !geoConfig_1.default.allowedCountries.includes(geo.country)) {
            return { blocked: true, reason: 'Country not in allowlist', country: geo.country };
        }
        return { blocked: false, country: geo.country };
    }
    getLimitMultiplier(country) {
        if (!country)
            return 1.0;
        const countryLimit = geoConfig_1.default.countryLimits[country];
        return countryLimit ? 1.0 : 1.0; // Future: per-country multipliers
    }
    getCountryConfig(country) {
        return geoConfig_1.default.countryLimits[country] || null;
    }
}
exports.GeoLimiter = GeoLimiter;
exports.geoLimiter = new GeoLimiter();
exports.default = GeoLimiter;
//# sourceMappingURL=geoLimiter.js.map