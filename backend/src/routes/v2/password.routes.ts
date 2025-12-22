// backend/src/routes/password.routes.ts
import { Router } from "express";
import { passwordController } from "../../controllers/password.controller";
import { validate } from "../../middlewares/validation";
import {
  requestResetSchema,
  resetPasswordSchema,
  validateTokenSchema,
} from "../../validators/password.validator";
import { passwordResetLimiter } from "../../middlewares/rateLimit";

const router = Router();

// Public routes
router.post(
  "/request-reset",
  passwordResetLimiter,
  validate(requestResetSchema),
  passwordController.requestReset
);

router.post(
  "/reset",
  validate(resetPasswordSchema),
  passwordController.resetPassword
);

router.get(
  "/validate-token",
  validate(validateTokenSchema),
  passwordController.validateToken
);

export default router;
