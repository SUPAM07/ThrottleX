import { Request, Response, NextFunction } from 'express';
/**
 * Core rate limit middleware — applies rate limiting then sets standard response headers
 */
export declare function rateLimitMiddleware(options?: {
    key?: (req: Request) => string;
    limit?: number;
    windowMs?: number;
    algorithm?: string;
}): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default rateLimitMiddleware;
//# sourceMappingURL=rateLimitMiddleware.d.ts.map