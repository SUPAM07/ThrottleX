import { Request, Response } from 'express';
/**
 * GET /api/ratelimit/adaptive/config
 * Get configuration settings for the adaptive ML engine
 */
export declare function getAdaptiveConfig(req: Request, res: Response): Promise<void>;
/**
 * GET /api/ratelimit/adaptive/:key/status
 * Get the current adaptive status and limits for a specific key
 */
export declare function getAdaptiveStatus(req: Request, res: Response): Promise<void>;
/**
 * POST /api/ratelimit/adaptive/:key/override
 * Manually override the adaptive limit for a specific key
 */
export declare function setAdaptiveOverride(req: Request, res: Response): Promise<void>;
/**
 * DELETE /api/ratelimit/adaptive/:key/override
 * Clear any manual rate limit override for a specific key
 */
export declare function clearAdaptiveOverride(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=adaptiveController.d.ts.map