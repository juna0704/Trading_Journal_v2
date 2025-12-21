// backend/src/middleware/rateLimit.ts
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { AppError } from "../types";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}

export const createRateLimiter = ({
  windowMs,
  max,
  message = "Too many requests. Please try again later.",
  skipSuccessfulRequests = false,
}: RateLimitOptions): RateLimitRequestHandler => {
  return rateLimit({
    windowMs,
    max,
    skipSuccessfulRequests,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      throw new AppError(429, "RATE_LIMIT_EXCEEDED", message);
    },
  });
};

// Default rate limiter for general API routes
export const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
});

// Strict rate limiter for auth routes
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  skipSuccessfulRequests: true, // Don't count successful logins
});
