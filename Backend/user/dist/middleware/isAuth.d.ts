import type { Request, Response, NextFunction } from "express";
import type { IUser } from "../model/User.js";
export interface AuthenticateRequest extends Request {
    user?: IUser | null;
}
export declare const isAuth: (req: AuthenticateRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=isAuth.d.ts.map