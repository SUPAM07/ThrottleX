"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceZoneService = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * GDPR/CCPA compliance zone management.
 * Maps countries to zones and applies limit multipliers.
 */
class ComplianceZoneService {
    zones = new Map();
    countryToZone = new Map();
    constructor() {
        this.loadDefaultZones();
    }
    /**
     * Load default compliance zones (GDPR, CCPA, etc.).
     */
    loadDefaultZones() {
        const defaults = [
            {
                name: 'GDPR',
                countries: [
                    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
                    'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
                    'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'NO', 'IS', 'LI',
                ],
                limitMultiplier: 0.8, // More conservative limits for GDPR regions
                blocked: false,
                description: 'European Union GDPR compliance zone',
            },
            {
                name: 'CCPA',
                countries: ['US'],
                regions: ['CA'],
                limitMultiplier: 0.9,
                blocked: false,
                description: 'California Consumer Privacy Act zone',
            },
            {
                name: 'RESTRICTED',
                countries: ['CN', 'RU', 'KP', 'IR'],
                limitMultiplier: 0.5,
                blocked: false,
                description: 'Restricted regions with stricter rate limits',
            },
            {
                name: 'BLOCKED',
                countries: [],
                limitMultiplier: 0,
                blocked: true,
                description: 'Blocked regions — no traffic allowed',
            },
        ];
        for (const zone of defaults) {
            this.addZone(zone);
        }
    }
    /**
     * Add or update a compliance zone.
     */
    addZone(zone) {
        this.zones.set(zone.name, zone);
        for (const country of zone.countries) {
            this.countryToZone.set(country.toUpperCase(), zone.name);
        }
        logger_1.default.info('Compliance zone registered', { name: zone.name, countries: zone.countries.length });
    }
    /**
     * Remove a compliance zone.
     */
    removeZone(name) {
        const zone = this.zones.get(name);
        if (!zone)
            return false;
        for (const country of zone.countries) {
            this.countryToZone.delete(country.toUpperCase());
        }
        this.zones.delete(name);
        return true;
    }
    /**
     * Resolve the compliance zone for a geo location.
     */
    resolveZone(location) {
        if (!location.country)
            return null;
        const zoneName = this.countryToZone.get(location.country.toUpperCase());
        return zoneName ? this.zones.get(zoneName) || null : null;
    }
    /**
     * Get the rate limit multiplier for a geo location.
     * Returns 1.0 if no zone matches (default: no adjustment).
     */
    getLimitMultiplier(location) {
        const zone = this.resolveZone(location);
        return zone?.limitMultiplier ?? 1.0;
    }
    /**
     * Check if traffic from a location should be blocked.
     */
    isBlocked(location) {
        const zone = this.resolveZone(location);
        return zone?.blocked ?? false;
    }
    /**
     * Get all registered zones.
     */
    listZones() {
        return Array.from(this.zones.values());
    }
    /**
     * Get a specific zone by name.
     */
    getZone(name) {
        return this.zones.get(name) || null;
    }
}
exports.ComplianceZoneService = ComplianceZoneService;
exports.default = ComplianceZoneService;
//# sourceMappingURL=complianceZoneService.js.map