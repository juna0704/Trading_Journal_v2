import { Router } from "express";
import authRoutes from "./v2/auth.routes";
import adminRoutes from "./v2/admin.routes";
import passwordRoutes from "./v2/password.routes";
import tradeRoutes from "./v2/trade.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/password", passwordRoutes);
router.use("/trades", tradeRoutes);

export default router;
