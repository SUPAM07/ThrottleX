import { Request, Response } from 'express';
/**
 * POST /rate-limit/check
 * Check if a request should be allowed based on the configured rate limit
 */
export declare function checkRateLimit(req: Request, res: Response): Promise<void>;
/**
 * DELETE /rate-limit/reset/:key
 */
export declare function resetRateLimit(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=rateLimitController.d.ts.map