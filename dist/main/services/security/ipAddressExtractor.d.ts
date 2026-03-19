import { Request } from 'express';
/**
 * Extracts the real client IP from multiple header sources with priority ordering
 */
export declare class IpAddressExtractor {
    extract(req: Request): string;
    private isPrivate;
}
export declare const ipExtractor: IpAddressExtractor;
export default IpAddressExtractor;
//# sourceMappingURL=ipAddressExtractor.d.ts.map