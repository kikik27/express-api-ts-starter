import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "./interfaces/response.interface";
import jwt from "jsonwebtoken";
import { z } from "zod";
// import { User } from './db/schema/users';
import { getUserById } from "./api/v1/users/user.service";
import { UserCredentials } from "./api/v1/auth/auth.schema";
import { AppError } from "./utils/errors";

declare global {
  namespace Express {
    interface Request {
      user: UserCredentials;
    }
  }
}

// Add interface for JWT payload at the top
interface JWTPayload {
  userId: string;
  iat: number;
  exp: number;
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? "" : err.stack,
    });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "" : err.stack,
  });
};  

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
    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (error) {
    res.status(401).json({ message: "Un-Authorized: Invalid token" });
  }
};

export const validateRequest =
  (schema: z.ZodSchema<any, any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          error: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(400)
          .json({ message: "Validation failed", details: errorMessages });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  };
