import { Request, Response } from 'express';
export declare function getConfig(req: Request, res: Response): Promise<void>;
export declare function updateDefaultConfig(req: Request, res: Response): Promise<void>;
export declare function setKeyConfig(req: Request, res: Response): Promise<void>;
export declare function setPatternConfig(req: Request, res: Response): Promise<void>;
export declare function removeKeyConfig(req: Request, res: Response): Promise<void>;
export declare function removePatternConfig(req: Request, res: Response): Promise<void>;
export declare function reloadConfig(req: Request, res: Response): Promise<void>;
export declare function getConfigStats(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=configController.d.ts.map