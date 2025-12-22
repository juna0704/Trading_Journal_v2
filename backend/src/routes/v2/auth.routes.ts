import { Router } from "express";
import { AuthController } from "../../controllers/auth.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validation";
import { authenticate } from "../../middlewares/auth";
import { authLimiter } from "../../middlewares/rateLimit";
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from "../../validators/auth.validator";

const router = Router();
const authController = new AuthController();

/**
 * Public
 * Post /api/auth/register
 */
router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(authController.register)
);

/**
 * Public
 * Post /api/auth/login
 */
router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  asyncHandler(authController.login)
);

/**
 * Public
 * Post /api/auth/refresh
 */
router.post(
  "/refresh",
  validate(refreshTokenSchema),
  asyncHandler(authController.refresh)
);

/**
 * Public
 * Get /api/auth/verify-email
 */
router.get(
  "/verify-email",
  validate(verifyEmailSchema),
  asyncHandler(authController.verifyEmail)
);

/**
 * Public
 * Post /api/auth/resend-verification
 */
router.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  asyncHandler(authController.resendVerification)
);

/**
 * Public
 * Post /api/auth/logout
 */
router.post(
  "/logout",
  validate(refreshTokenSchema),
  asyncHandler(authController.logout)
);

// Protected (User)
/**
 * Private (User)
 * Get /api/auth/me
 */
router.get("/me", authenticate, asyncHandler(authController.getMe));

export default router;
