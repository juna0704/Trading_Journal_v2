// backend/src/routes/password.routes.ts
import { Router } from "express";
import { passwordController } from "../controllers/password.controller";
import { validate } from "../middlewares/validation";
import {
  requestResetSchema,
  resetPasswordSchema,
  validateTokenSchema,
} from "../validators/password.validator";
import { createRateLimiter } from "../middlewares/rateLimit";

const router = Router();

// Rate limiter: 3 requests per 15 minutes per IP
const passwordResetLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: "Too many password reset requests. Please try again later.",
});

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
