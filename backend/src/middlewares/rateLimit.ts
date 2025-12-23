import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";
import { AppError, RateLimitOptions } from "../types/auth.types";
import { env, logger } from "../config";

// Initialize Redis client
const redisClient = new Redis(env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redisClient.on("error", (err) => logger.error("RateLimit Redis Error", err));

/**
 * Factory function to create customized rate limiters
 */
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

    store: new RedisStore({
      // @ts-expect-error
      sendCommand: (...args: string[]) => redisClient.call(...args),
    }),

    handler: (req, res, next) => {
      next(new AppError(429, "RATE_LIMIT_EXCEEDED", message));
    },
  });
};

// ============================================
// PRE-DEFINED LIMITERS
// ============================================

/**
 * General API Limiter
 * Applied to all /api routes to prevent basic DoS
 */
export const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

/**
 * Strict Auth Limiter
 * Applied to login and registration to prevent brute force
 */
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Please try again in 15 minutes.",
  skipSuccessfulRequests: true, // Only punish failed attempts
});

/**
 * Password Reset Limiter
 * Applied to the request-reset email route
 */
export const passwordResetLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: "Too many password reset requests. Please try again in an hour.",
});
