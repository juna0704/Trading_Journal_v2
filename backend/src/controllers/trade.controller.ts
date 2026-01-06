import { Request, Response, NextFunction } from "express";
import { tradeService } from "../services/trade.service";
import { CreateTradeRequest, UpdateTradeRequest } from "../types/trade.types";
import { AuthRequest } from "../types/auth.types";

export class TradeController {
  /**
   * Create a new trade
   * POST /api/trades
   */
  async createTrade(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId; // From auth middleware
      const tradeData: CreateTradeRequest = req.body;

      const trade = await tradeService.createTrade(userId, tradeData);

      res.status(201).json({
        success: true,
        data: trade,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all trades for the authenticated user
   * GET /api/trades
   */
  async getTrades(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;

      const trades = await tradeService.getTrades(userId);

      res.status(200).json({
        success: true,
        data: trades,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single trade by ID
   * GET /api/trades/:id
   */
  async getTradeById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const tradeId = req.params.id;

      const trade = await tradeService.getTradeById(userId, tradeId);

      res.status(200).json({
        success: true,
        data: trade,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a trade
   * PUT /api/trades/:id
   */
  async updateTrade(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const tradeId = req.params.id;
      const updateData: UpdateTradeRequest = req.body;

      const trade = await tradeService.updateTrade(userId, tradeId, updateData);

      res.status(200).json({
        success: true,
        data: trade,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a trade
   * DELETE /api/trades/:id
   */
  async deleteTrade(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const tradeId = req.params.id;

      await tradeService.deleteTrade(userId, tradeId);

      res.status(200).json({
        success: true,
        message: "Trade deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get trade statistics
   * GET /api/trades/stats
   */
  async getTradeStats(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;

      const stats = await tradeService.getTradeStats(userId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const tradeController = new TradeController();
