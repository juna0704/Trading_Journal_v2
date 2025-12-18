// backend/src/middleware/auth.ts
import { Response, NextFunction } from "express";
import { AuthRequest, AppError } from "../types";
import { verifyAccessToken } from "../utils/jwt";
import { logger } from "../config";

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError(401, "NO_TOKEN", "No authorization token provided");
    }

    // Check if token is in Bearer format
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new AppError(
        401,
        "INVALID_TOKEN_FORMAT",
        "Token format must be: Bearer <token>"
      );
    }

    const token = parts[1];

    // Verify token
    const payload = verifyAccessToken(token);

    // Attach user info to request
    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error("Authentication error", { error });
      next(new AppError(401, "AUTH_ERROR", "Authentication failed"));
    }
  }
};

export const optionalAuthenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const parts = authHeader.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        const token = parts[1];
        const payload = verifyAccessToken(token);
        req.user = {
          userId: payload.userId,
          email: payload.email,
        };
      }
    }

    next();
  } catch (error) {
    // For optional auth, we don't fail on invalid tokens
    logger.warn("Optional authentication failed", { error });
    next();
  }
};
