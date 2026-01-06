import { Request, Response, NextFunction } from "express";
import { ZodTypeAny, ZodError } from "zod";
import { AppError } from "../utils/errors";

export const validate = (schema: ZodTypeAny) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = parsed.body;
      req.query = parsed.query;
      req.params = parsed.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        next(new AppError(400, "VALIDATION_ERROR", "validation failed"));
      } else {
        next(error);
      }
    }
  };
};
