import { Request, Response, NextFunction } from 'express';
export declare function apiKeyAuthMiddleware(required?: boolean): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default apiKeyAuthMiddleware;
//# sourceMappingURL=apiKeyAuthMiddleware.d.ts.map