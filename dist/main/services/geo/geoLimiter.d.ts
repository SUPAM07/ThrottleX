import { Request } from 'express';
export declare class GeoLimiter {
    isBlocked(ip: string, req: Request): {
        blocked: boolean;
        reason?: string;
        country?: string;
    };
    getLimitMultiplier(country?: string): number;
    getCountryConfig(country: string): {
        limit: number;
        windowMs: number;
    };
}
export declare const geoLimiter: GeoLimiter;
export default GeoLimiter;
//# sourceMappingURL=geoLimiter.d.ts.map