import type { ComplianceZone, GeoLocation } from '../../models';
/**
 * GDPR/CCPA compliance zone management.
 * Maps countries to zones and applies limit multipliers.
 */
export declare class ComplianceZoneService {
    private readonly zones;
    private readonly countryToZone;
    constructor();
    /**
     * Load default compliance zones (GDPR, CCPA, etc.).
     */
    private loadDefaultZones;
    /**
     * Add or update a compliance zone.
     */
    addZone(zone: ComplianceZone): void;
    /**
     * Remove a compliance zone.
     */
    removeZone(name: string): boolean;
    /**
     * Resolve the compliance zone for a geo location.
     */
    resolveZone(location: GeoLocation): ComplianceZone | null;
    /**
     * Get the rate limit multiplier for a geo location.
     * Returns 1.0 if no zone matches (default: no adjustment).
     */
    getLimitMultiplier(location: GeoLocation): number;
    /**
     * Check if traffic from a location should be blocked.
     */
    isBlocked(location: GeoLocation): boolean;
    /**
     * Get all registered zones.
     */
    listZones(): ComplianceZone[];
    /**
     * Get a specific zone by name.
     */
    getZone(name: string): ComplianceZone | null;
}
export default ComplianceZoneService;
//# sourceMappingURL=complianceZoneService.d.ts.map