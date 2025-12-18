import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthController } from "../controllers/auth.controller";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { validateBody } from "../middlewares/validation";

const router = Router();
const authController = new AuthController();

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

export default router;
