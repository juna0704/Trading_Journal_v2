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
      console.log("===== VALIDATION MIDDLEWARE HIT =====");

      console.log("REQ BODY:", JSON.stringify(req.body, null, 2));
      console.log("REQ QUERY:", JSON.stringify(req.query, null, 2));
      console.log("REQ PARAMS:", JSON.stringify(req.params, null, 2));

      if (error instanceof ZodError) {
        console.log("ZOD ERRORS RAW:", error.errors);

        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        console.log("ZOD ERRORS MAPPED:", errors);
      }

      console.log("===== END VALIDATION ERROR =====");

      next(error);
    }
  };
};
