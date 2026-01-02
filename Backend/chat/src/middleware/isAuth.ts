import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";

interface IUser extends Document {
//   _id: Types.ObjectId;
  name: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Please login - NO AUTH HEADER",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT secret is missing in environment variables");
    }

    const decoded = jwt.verify(token, secret) as IUser;

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default isAuth;