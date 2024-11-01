import { NextFunction, Request, Response } from 'express';
import { ErrorResponse } from './interfaces/response.interface';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
}

export const errorHandler = (err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  });
}

export const isAuthenticate = (req: Request, res: Response, err: Error, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401);
    throw new Error("Un-Authorized");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    req.body = payload;
  } catch (err) {
    res.status(401);
    if (err === "TokenExpiredError") {
      throw new Error(err);
    }
    throw new Error("Un-Authorized");
  }

  return next();
}

export const validateRequest = (schema: z.ZodSchema<any, any>) => (req: Request, res: Response, next: NextFunction) => {
try {
  schema.parse(req.body);
  next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((issue: any) => ({
        message: `${issue.path.join(".")} is ${issue.message}`,
    }));
      res
        .status(400)
        .json({ message: "Validation failed", details: errorMessages });
    } else {
      res
        .status(500)
        .json({ message: "Internal Server Error" });
    }
}
}