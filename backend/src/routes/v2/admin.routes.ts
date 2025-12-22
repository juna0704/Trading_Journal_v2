import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validation";
import { authenticate, requireAdmin } from "../../middlewares/auth";
import {
  adminRegisterSchema,
  approveUserSchema,
} from "../../validators/auth.validator";
import { AdminController } from "../../controllers/admin.controller";

const router = Router();
const adminController = new AdminController();

// Admin protection to ALL routes
router.use(authenticate);
router.use(requireAdmin);

/**
 * GET /api/admin/pending-users
 */
router.get("/pending-users", asyncHandler(adminController.getPendingUsers));

/**
 * POST /api/admin/register
 */
router.post(
  "/users",
  validate(adminRegisterSchema),
  asyncHandler(adminController.adminRegister)
);

/**
 * POST /api/admin/approve/:userId
 */
router.post(
  "/approve/:userId",
  validate(approveUserSchema),
  asyncHandler(adminController.approveUser)
);

/**
 * POST /api/admin/deactivate/:userId
 */
router.post(
  "/deactivate/:userId",
  validate(approveUserSchema),
  asyncHandler(adminController.deactivateUser)
);

/**
 * POST /api/admin/activate/:userId
 */
router.post(
  "/activate/:userId",
  validate(approveUserSchema),
  asyncHandler(adminController.activateUser)
);

export default router;
