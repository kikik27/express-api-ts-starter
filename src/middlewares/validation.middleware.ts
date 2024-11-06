import { NextFunction, Request, Response } from "express";
import { z } from "zod";

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