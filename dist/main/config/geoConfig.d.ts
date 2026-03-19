export interface GeoConfig {
    enabled: boolean;
    blockedCountries: string[];
    blockedRegions: string[];
    allowedCountries: string[];
    complianceStrictness: 'lenient' | 'standard' | 'strict';
    countryLimits: Record<string, {
        limit: number;
        windowMs: number;
    }>;
    cdnHeaders: {
        cloudflare: string;
        cloudfront: string;
        custom?: string;
    };
}
declare const geoConfig: GeoConfig;
export default geoConfig;
//# sourceMappingURL=geoConfig.d.ts.map