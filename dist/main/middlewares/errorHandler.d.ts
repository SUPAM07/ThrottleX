import { Request, Response, NextFunction } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    code?: string;
    details?: unknown;
}
export declare function errorHandler(err: AppError, req: Request, res: Response, _next: NextFunction): void;
export default errorHandler;
//# sourceMappingURL=errorHandler.d.ts.map