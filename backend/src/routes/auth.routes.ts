import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post('/register', asyncHandler(authController.register))

export default router;
