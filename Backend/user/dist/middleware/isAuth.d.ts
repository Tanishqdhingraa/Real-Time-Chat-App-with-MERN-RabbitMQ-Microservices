import { Request, Response, NextFunction } from "express";
export interface AuthenticateRequest extends Request {
    user?: any;
}
export declare const isAuth: (req: AuthenticateRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=isAuth.d.ts.map