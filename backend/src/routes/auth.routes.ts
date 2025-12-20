import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthController } from "../controllers/auth.controller";
import {
  adminRegisterSchema,
  approveUserSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resendVerificationSchema,
  verifyEmailSchema,
} from "../validators/auth.validator";
import { validate } from "../middlewares/validation";
import { authenticate, requireAdmin } from "../middlewares/auth";

const router = Router();
const authController = new AuthController();

// ============================================
// PUBLIC ROUTES
// ============================================
/**
 * POST /auth/register
 * Public registration with admin approval required
 * User can register but account is inactive until approved
 */
router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(authController.register)
);

/**
 * POST /auth/login
 * Login for all users (USER, ADMIN, SUPER_ADMIN)
 */
router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(authController.login)
);

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
router.post(
  "/refresh",
  validate(refreshTokenSchema),
  asyncHandler(authController.refresh)
);

/**
 * POST /auth/verify-email
 * Verify email address using token sent via email
 */
router.get(
  "/verify-email",
  validate(verifyEmailSchema),
  asyncHandler(authController.verifyEmail)
);

/**
 * POST /auth/resend-verification
 * Resend email verification link
 */
router.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  asyncHandler(authController.resendVerification)
);

/**
 * POST /auth/logout
 * Logout and revoke refresh token
 */
router.post(
  "/logout",
  validate(refreshTokenSchema),
  asyncHandler(authController.logout)
);

// ============================================
// PROTECTED ROUTES (Authenticated Users)
// ============================================
/**
 * GET /auth/me
 * Get current user profile
 * Requires: Authentication
 */
router.get("/me", authenticate, asyncHandler(authController.getMe));

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * POST /auth/admin/register
 * Admin creates a new user account
 * Can assign role (USER or ADMIN)
 * Requires: Admin authentication
 */
router.post(
  "/admin/register",
  authenticate,
  requireAdmin,
  validate(adminRegisterSchema),
  asyncHandler(authController.adminRegister)
);

/**
 * POST /auth/admin/approve/:userId
 * Admin approves a pending user registration
 * Activates the user account
 * Requires: Admin authentication
 */
router.post(
  "/admin/approve/:userId",
  authenticate,
  requireAdmin,
  validate(approveUserSchema),
  asyncHandler(authController.approveUser)
);

/**
 * GET /auth/admin/pending-users
 * List all users pending approval
 * Requires: Admin authentication
 */
router.get(
  "/admin/pending-users",
  authenticate,
  requireAdmin,
  asyncHandler(authController.getPendingUsers)
);

/**
 * POST /auth/admin/deactivate/:userId
 * Admin deactivates a user account
 * Requires: Admin authentication
 */
router.post(
  "/admin/deactivate/:userId",
  authenticate,
  requireAdmin,
  validate(approveUserSchema),
  asyncHandler(authController.deactivateUser)
);

/**
 * POST /auth/admin/activate/:userId
 * Admin activates a user account
 * Requires: Admin authentication
 */
router.post(
  "/admin/activate/:userId",
  authenticate,
  requireAdmin,
  validate(approveUserSchema),
  asyncHandler(authController.activateUser)
);

export default router;
