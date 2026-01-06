import { Router } from "express";
import { tradeController } from "../../controllers/trade.controller";
import { authenticate } from "../../middlewares/auth";
import { validate } from "../../middlewares/validation";
import {
  tradeCreateSchema,
  tradeUpdateSchema,
  tradeIdSchema,
} from "../../validators/trade.validator";

const router = Router();

// All trade routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/trades/stats
 * @desc    Get trade statistics for authenticated user
 * @access  Private
 */
router.get("/stats", tradeController.getTradeStats.bind(tradeController));

/**
 * @route   POST /api/trades
 * @desc    Create a new trade
 * @access  Private
 */
router.post(
  "/",
  validate(tradeCreateSchema),
  tradeController.createTrade.bind(tradeController)
);

/**
 * @route   GET /api/trades
 * @desc    Get all trades for authenticated user
 * @access  Private
 */
router.get("/", tradeController.getTrades.bind(tradeController));

/**
 * @route   GET /api/trades/:id
 * @desc    Get a single trade by ID
 * @access  Private
 */
router.get(
  "/:id",
  validate(tradeIdSchema),
  tradeController.getTradeById.bind(tradeController)
);

/**
 * @route   PUT /api/trades/:id
 * @desc    Update a trade
 * @access  Private
 */
router.put(
  "/:id",
  validate(tradeIdSchema),
  validate(tradeUpdateSchema),
  tradeController.updateTrade.bind(tradeController)
);

/**
 * @route   DELETE /api/trades/:id
 * @desc    Delete a trade
 * @access  Private
 */
router.delete(
  "/:id",
  validate(tradeIdSchema),
  tradeController.deleteTrade.bind(tradeController)
);

export default router;
