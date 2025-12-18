// backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { AppError, ApiResponse } from "../types";
import { logger } from "../config";
import { Prisma } from "../generated/prisma/client";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error
  logger.error("Error occurred", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle AppError
  if (err instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    let statusCode = 400;
    let code = "DATABASE_ERROR";
    let message = "Database operation failed";

    switch (err.code) {
      case "P2002":
        statusCode = 409;
        code = "UNIQUE_CONSTRAINT_VIOLATION";
        message = "Resource already exists";
        break;
      case "P2025":
        statusCode = 404;
        code = "NOT_FOUND";
        message = "Resource not found";
        break;
      case "P2003":
        statusCode = 400;
        code = "FOREIGN_KEY_CONSTRAINT_VIOLATION";
        message = "Invalid reference";
        break;
    }

    const response: ApiResponse = {
      success: false,
      error: { code, message },
    };
    res.status(statusCode).json(response);
    return;
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    const response: ApiResponse = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: err.message,
      },
    };
    res.status(400).json(response);
    return;
  }

  // Default error response
  const response: ApiResponse = {
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message:
        process.env.NODE_ENV === "production"
          ? "An unexpected error occurred"
          : err.message,
    },
  };
  res.status(500).json(response);
};
