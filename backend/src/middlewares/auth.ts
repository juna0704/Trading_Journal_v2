// backend/src/middleware/auth.ts
import { Response, NextFunction } from "express";
import { AuthRequest, AppError } from "../types/auth.types";
import { verifyAccessToken } from "../utils/jwt";
import { logger, prisma } from "../config";

/**
 * Middleware to authenticate user via JWT token
 * Adds user info to req.user
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(401, "UNAUTHORIZED", "No token provided");
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
      role: payload.role,
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

/**
 * Middleware to check if user is an admin (ADMIN or SUPER_ADMIN)
 * Must be used after authenticate middleware
 */
export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    }

    // Check if user has admin role
    if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
      throw new AppError(
        403,
        "FORBIDDEN",
        "Access denied. Admin privileges required."
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if user is a super admin
 * Must be used after authenticate middleware
 */
export const requireSuperAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    }

    // Check if user has super admin role
    if (req.user.role !== "SUPER_ADMIN") {
      throw new AppError(
        403,
        "FORBIDDEN",
        "Access denied. Super admin privileges required."
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
