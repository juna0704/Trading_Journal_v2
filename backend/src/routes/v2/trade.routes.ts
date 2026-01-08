import { Router } from "express";
import { tradeController } from "../../controllers/trade.controller";
import { authenticate } from "../../middlewares/auth";
import { validate } from "../../middlewares/validation";
import {
  createTradeSchema,
  listTradesSchema,
  tradeByIdSchema,
  updateTradeSchema,
} from "../../validators/trade.validator";

const router = Router();

// All trade routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/trades
 * @desc    Create a new trade
 * @access  Private
 */
router.post(
  "/",
  validate(createTradeSchema),
  tradeController.createTrade.bind(tradeController)
);

/**
 * @route   GET /api/trades
 * @desc    Get all trades for authenticated user
 * @access  Private
 */
router.get(
  "/",
  validate(listTradesSchema),
  tradeController.getTrades.bind(tradeController)
);

/**
 * @route   GET /api/trades/stats
 * @desc    Get trade statistics for authenticated user
 * @access  Private
 */
router.get("/stats", tradeController.getTradeStats.bind(tradeController));

/**
 * @route   GET /api/trades/:id
 * @desc    Get a single trade by ID
 * @access  Private
 */
router.get(
  "/:id",
  validate(tradeByIdSchema),
  tradeController.getTradeById.bind(tradeController)
);

/**
 * @route   PUT /api/trades/:id
 * @desc    Update a trade
 * @access  Private
 */
router.put(
  "/:id",
  validate(updateTradeSchema),
  tradeController.updateTrade.bind(tradeController)
);

/**
 * @route   DELETE /api/trades/:id
 * @desc    Delete a trade
 * @access  Private
 */
router.delete(
  "/:id",
  validate(tradeByIdSchema),
  tradeController.deleteTrade.bind(tradeController)
);

export default router;
