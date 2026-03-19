import { Request } from 'express';
import type { GeoLocation } from '../../models';
export declare class GeoResolver {
    resolve(ip: string, req?: Request): GeoLocation;
}
export declare const geoResolver: GeoResolver;
export default GeoResolver;
//# sourceMappingURL=geoResolver.d.ts.map