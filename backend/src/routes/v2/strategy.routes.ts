import { Router } from "express";
import { strategyController } from "../../controllers/strategy.controller";
import { authenticate } from "../../middlewares/auth";
import { validate } from "../../middlewares/validation";
import {
  createStrategySchema,
  updateStrategySchema,
  strategyByIdSchema,
} from "../../validators/strategy.validator";

const router = Router();

// 🔐 All strategy routes require authentication
router.use(authenticate);

/**
 * POST /api/strategies
 * Create a new strategy
 */
router.post(
  "/",
  validate(createStrategySchema),
  strategyController.createStrategy.bind(strategyController)
);

/**
 * GET /api/strategies
 * Get all strategies for user
 */
router.get("/", strategyController.getStrategies.bind(strategyController));

/**
 * GET /api/strategies/:id
 * Get strategy by ID
 */
router.get(
  "/:id",
  validate(strategyByIdSchema),
  strategyController.getStrategyById.bind(strategyController)
);

/**
 * PUT /api/strategies/:id
 * Update strategy
 */
router.put(
  "/:id",
  validate(updateStrategySchema),
  strategyController.updateStrategy.bind(strategyController)
);

/**
 * DELETE /api/strategies/:id
 * Delete strategy
 */
router.delete(
  "/:id",
  validate(strategyByIdSchema),
  strategyController.deleteStrategy.bind(strategyController)
);

export default router;
