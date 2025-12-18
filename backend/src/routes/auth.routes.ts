import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthController } from "../controllers/auth.controller";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "../validators/auth.validator";
import { validateBody } from "../middlewares/validation";

const router = Router();
const authController = new AuthController();

// Public routes
router.post(
  "/register",
  validateBody(registerSchema),
  asyncHandler(authController.register)
);

router.post(
  "/login",
  validateBody(loginSchema),
  asyncHandler(authController.login)
);

router.post(
  "/refresh",
  validateBody(refreshTokenSchema),
  asyncHandler(authController.refresh)
);

export default router;
