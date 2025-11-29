import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { IUser } from "../model/User.js";

export interface AuthenticateRequest extends Request {
  user?: IUser | null;
}

const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
  throw new Error("JWT_SECRET missing in .env");
}      
const JWT_SECRET: string = rawSecret;  // ✔ TS now knows it's ALWAYS a string

export const isAuth = (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization as string | undefined;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Please login - Missing token" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded || !decoded.id) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    req.user = {
      _id: decoded.id,
      email: decoded.email,
    } as IUser;

    next();
  } catch (error) {
    res.status(401).json({ message: "JWT verification failed" });
  }
};
