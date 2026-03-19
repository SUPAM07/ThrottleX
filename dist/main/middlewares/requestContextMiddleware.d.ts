import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            context: {
                correlationId: string;
                tenantId: string;
                userId?: string;
                ip: string;
                startTime: number;
            };
        }
    }
}
export declare function requestContextMiddleware(req: Request, res: Response, next: NextFunction): Promise<void>;
export default requestContextMiddleware;
//# sourceMappingURL=requestContextMiddleware.d.ts.map