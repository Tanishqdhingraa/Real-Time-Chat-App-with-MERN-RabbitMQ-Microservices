import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";
interface IUser extends Document {
    name: string;
    email: string;
}
export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}
export declare const isAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export default isAuth;
//# sourceMappingURL=isAuth.d.ts.map