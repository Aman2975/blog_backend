import { Request, Response, NextFunction } from "express";
import {  ZodObject, ZodRawShape, ZodError } from "zod";

export const validate = (schema: ZodObject<ZodRawShape>) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      schema.parse(req.body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.issues,
        });

        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};