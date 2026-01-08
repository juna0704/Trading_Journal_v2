import { Response, NextFunction } from "express";
import { tradeService } from "../services/trade.service";
import { CreateTradeRequest, UpdateTradeRequest } from "../types/trade.types";
import { AuthRequest } from "../types/auth.types";
import { TradeStatus, TradeSide } from "../generated/prisma";

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
      const userId = req.user!.userId;
      const tradeData: CreateTradeRequest = req.body;

      const trade = await tradeService.createTrade(userId, tradeData);

      let warning: string | undefined;
      if (!trade.strategyId) {
        warning =
          "This trade is not linked to any strategy. You can assign a strategy later to track performance.";
      }

      res.status(201).json({
        success: true,
        data: trade,
        meta: warning ? { warning } : undefined,
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
   * Get trades by pagination
   * GET /api/trades/
   */
  async getTrades(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;

      const {
        cursor,
        limit,
        status,
        symbol,
        side,
        strategyId,
        startDate,
        endDate,
      } = req.query;

      const parsedStatus = Object.values(TradeStatus).includes(
        status as TradeStatus
      )
        ? (status as TradeStatus)
        : undefined;

      const parsedSide = Object.values(TradeSide).includes(side as TradeSide)
        ? (side as TradeSide)
        : undefined;

      const result = await tradeService.getTradesPaginated(userId, {
        cursor: cursor as string,
        limit: limit ? Number(limit) : undefined,
        status: parsedStatus,
        symbol: symbol as string,
        side: parsedSide,
        strategyId: strategyId === "null" ? null : (strategyId as string),
        startDate: startDate as string,
        endDate: endDate as string,
      });

      res.status(200).json({
        success: true,
        data: result.items,
        pageInfo: result.pageInfo,
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
   * SoftDelete a trade
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

      await tradeService.softDeleteTrade(userId, tradeId);

      res.status(200).json({
        success: true,
        message: "Trade deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Restore Trade
   */
  async restoreTrade(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const tradeId = req.params.id;

      await tradeService.restoreTrade(userId, tradeId);

      res.status(200).json({
        success: true,
        message: "Trade restored",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Delete Trade(Restore)
   */
  async getDeletedTrades(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const trades = await tradeService.getDeletedTrades(userId);

      res.status(200).json({
        success: true,
        data: trades,
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

  /**
   * Permanently delete a trade (ADMIN only)
   * DELETE /api/trades/:id/permanent
   */
  // async permanentDeleteTrade(
  //   req: AuthRequest,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {
  //     const tradeId = req.params.id;
  //     const role = req.user!.role; // ADMIN | SUPER_ADMIN | USER

  //     await tradeService.permanentDeleteTrade(tradeId, role);

  //     res.status(200).json({
  //       success: true,
  //       message: "Trade permanently deleted",
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}

export const tradeController = new TradeController();
