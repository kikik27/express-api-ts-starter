import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getUserById } from "../api/v1/users/user.service";
import { UserCredentials } from "../api/v1/auth/auth.schema";

// Add interface for JWT payload
interface JWTPayload {
  userId: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user: UserCredentials;
    }
  }
}

export const isAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Un-Authorized: Bearer token required");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    const user = await getUserById(payload.userId);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Un-Authorized: Invalid token" });
  }
}; 