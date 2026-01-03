import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";
export interface IUser extends Document<string> {
    _id: string;
    name: string;
    email: string;
}
export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}
export declare const isAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export default isAuth;
//# sourceMappingURL=isAuth.d.ts.map