import { Trade, TradeSide, TradeStatus, Prisma } from "../generated/prisma";
import {
  CreateTradeRequest,
  UpdateTradeRequest,
  TradeResponse,
  GetTradeParams,
} from "../types/trade.types";
import { AppError } from "../utils/errors";
import prisma from "../config/database";

export class TradeService {
  /**
   * Calculate PnL for a trade
   */
  private calculatePnL(
    side: TradeSide,
    entryPrice: number,
    exitPrice: number,
    quantity: number,
    leverage: number,
    fees: number
  ): { pnlNet: number; pnlPercentage: number } {
    let pnlGross: number;

    if (side === TradeSide.LONG) {
      // Long: profit when price goes up
      pnlGross = (exitPrice - entryPrice) * quantity * leverage;
    } else {
      // Short: profit when price goes down
      pnlGross = (entryPrice - exitPrice) * quantity * leverage;
    }

    // Net PnL after fees
    const pnlNet = pnlGross - fees;

    // Calculate percentage return
    const totalInvestment = entryPrice * quantity;
    const pnlPercentage = (pnlNet / totalInvestment) * 100;

    return {
      pnlNet: Number(pnlNet.toFixed(8)),
      pnlPercentage: Number(pnlPercentage.toFixed(4)),
    };
  }

  /**
   * Convert Trade to TradeResponse
   */
  private toTradeResponse(trade: Trade): TradeResponse {
    return {
      id: trade.id,
      userId: trade.userId,
      symbol: trade.symbol,
      side: trade.side,
      entryPrice: trade.entryPrice.toString(),
      exitPrice: trade.exitPrice?.toString() || null,
      status: trade.status,
      quantity: trade.quantity.toString(),
      leverage: trade.leverage,
      fees: trade.fees.toString(),
      pnlNet: trade.pnlNet?.toString() || null,
      pnlPercentage: trade.pnlPercentage?.toString() || null,
      stopLoss: trade.stopLoss?.toString() || null,
      takeProfit: trade.takeProfit?.toString() || null,
      entryTimestamp: trade.entryTimestamp.toISOString(),
      exitTimestamp: trade.exitTimestamp?.toISOString() || null,
      strategyId: trade.strategyId,
      notes: trade.notes,
      tags: trade.tags,
      screenshotUrl: trade.screenshotUrl,
      tradeScore: trade.tradeScore,
      createdAt: trade.createdAt.toISOString(),
      updatedAt: trade.updatedAt.toISOString(),
    };
  }

  /**
   * Create a new trade
   */
  async createTrade(
    userId: string,
    data: CreateTradeRequest
  ): Promise<TradeResponse> {
    const strategyId =
      typeof data.strategyId === "string" &&
      data.strategyId.trim() !== "" &&
      data.strategyId !== "null"
        ? data.strategyId
        : null;

    // Validate strategy belongs to user if provided
    if (strategyId !== null) {
      const strategy = await prisma.strategy.findFirst({
        where: {
          id: strategyId,
          userId: userId,
        },
      });

      if (!strategy) {
        throw new AppError(
          404,
          "STRATEGY_NOT_FOUND",
          "Strategy not found or does not belong to you"
        );
      }
    }

    // Determine trade status
    const status = data.exitPrice ? TradeStatus.CLOSED : TradeStatus.OPEN;

    // Calculate PnL if trade is closed
    let pnlNet: Prisma.Decimal | null = null;
    let pnlPercentage: Prisma.Decimal | null = null;

    if (status === TradeStatus.CLOSED && data.exitPrice) {
      const pnl = this.calculatePnL(
        data.side,
        data.entryPrice,
        data.exitPrice,
        data.quantity,
        data.leverage || 1,
        data.fees || 0
      );
      pnlNet = new Prisma.Decimal(pnl.pnlNet);
      pnlPercentage = new Prisma.Decimal(pnl.pnlPercentage);
    }

    // Create trade
    const trade = await prisma.trade.create({
      data: {
        userId,
        symbol: data.symbol,
        side: data.side,
        entryPrice: new Prisma.Decimal(data.entryPrice),
        exitPrice: data.exitPrice ? new Prisma.Decimal(data.exitPrice) : null,
        status,
        quantity: new Prisma.Decimal(data.quantity),
        leverage: data.leverage || 1,
        fees: new Prisma.Decimal(data.fees || 0),
        pnlNet,
        pnlPercentage,
        stopLoss: data.stopLoss ? new Prisma.Decimal(data.stopLoss) : null,
        takeProfit: data.takeProfit
          ? new Prisma.Decimal(data.takeProfit)
          : null,
        entryTimestamp: new Date(data.entryTimestamp),
        exitTimestamp: data.exitTimestamp ? new Date(data.exitTimestamp) : null,
        strategyId: strategyId,
        notes: data.notes,
        tags: data.tags || [],
        screenshotUrl: data.screenshotUrl,
      },
    });

    return this.toTradeResponse(trade);
  }

  /**
   * Get all trades for a user
   */
  async getTrades(userId: string): Promise<TradeResponse[]> {
    const trades = await prisma.trade.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        entryTimestamp: "desc",
      },
    });

    return trades.map((trade) => this.toTradeResponse(trade));
  }

  /**
   * Get a single trade by ID
   */
  async getTradeById(userId: string, tradeId: string): Promise<TradeResponse> {
    const trade = await prisma.trade.findFirst({
      where: {
        id: tradeId,
        userId,
        deletedAt: null,
      },
    });

    if (!trade) {
      throw new AppError(404, "TRADE_NOT_FOUND", "Trade not found");
    }

    return this.toTradeResponse(trade);
  }

  /**
   * Get Trades by pagination
   */
  async getTradesPaginated(userId: string, params: GetTradeParams) {
    const {
      cursor,
      limit = 20,
      status,
      symbol,
      strategyId,
      side,
      startDate,
      endDate,
    } = params;

    const where: Prisma.TradeWhereInput = { userId, deletedAt: null };

    // Advanced filters
    if (status) {
      where.status = status;
    }
    if (symbol) {
      where.symbol = { contains: symbol, mode: "insensitive" };
    }
    if (side) {
      where.side = side;
    }
    if (strategyId !== undefined) {
      where.strategyId = strategyId;
    }
    if (startDate || endDate) {
      where.entryTimestamp = {};
      if (startDate) where.entryTimestamp.gte = new Date(startDate);
      if (endDate) where.entryTimestamp.lte = new Date(endDate);
    }

    const trades = await prisma.trade.findMany({
      where,
      take: limit + 1, // fetch one extra to detect next page
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: {
        entryTimestamp: "desc",
      },
    });

    const hasNextPage = trades.length > limit;
    const items = hasNextPage ? trades.slice(0, limit) : trades;

    return {
      items: items.map((trade) => this.toTradeResponse(trade)),
      pageInfo: {
        nextCursor: hasNextPage ? items[items.length - 1].id : null,
        hasNextPage,
      },
    };
  }

  /**
   * Update a trade
   */
  async updateTrade(
    userId: string,
    tradeId: string,
    data: UpdateTradeRequest
  ): Promise<TradeResponse> {
    const strategyId =
      data.strategyId === undefined
        ? undefined
        : typeof data.strategyId === "string" &&
            data.strategyId.trim() !== "" &&
            data.strategyId !== "null"
          ? data.strategyId
          : null;
    // Check if trade exists and belongs to user
    const existingTrade = await prisma.trade.findFirst({
      where: {
        id: tradeId,
        userId,
        deletedAt: null,
      },
    });

    if (!existingTrade) {
      throw new AppError(404, "TRADE_NOT_FOUND", "Trade not found");
    }

    // Validate strategy belongs to user if provided

    if (typeof strategyId === "string") {
      const strategy = await prisma.strategy.findFirst({
        where: {
          id: strategyId,
          userId,
        },
      });

      if (!strategy) {
        throw new AppError(
          404,
          "STRATEGY_NOT_FOUND",
          "Strategy not found or does not belong to you"
        );
      }
    }

    // Prepare update data
    const updateData: Prisma.TradeUpdateInput = {};

    if (data.symbol !== undefined) updateData.symbol = data.symbol;
    if (data.side !== undefined) updateData.side = data.side;
    if (data.entryPrice !== undefined)
      updateData.entryPrice = new Prisma.Decimal(data.entryPrice);
    if (data.exitPrice !== undefined) {
      updateData.exitPrice = data.exitPrice
        ? new Prisma.Decimal(data.exitPrice)
        : null;
    }
    if (data.quantity !== undefined)
      updateData.quantity = new Prisma.Decimal(data.quantity);
    if (data.leverage !== undefined) updateData.leverage = data.leverage;
    if (data.fees !== undefined)
      updateData.fees = new Prisma.Decimal(data.fees);
    if (data.stopLoss !== undefined) {
      updateData.stopLoss = data.stopLoss
        ? new Prisma.Decimal(data.stopLoss)
        : null;
    }
    if (data.takeProfit !== undefined) {
      updateData.takeProfit = data.takeProfit
        ? new Prisma.Decimal(data.takeProfit)
        : null;
    }
    if (data.entryTimestamp !== undefined) {
      updateData.entryTimestamp = new Date(data.entryTimestamp);
    }
    if (data.exitTimestamp !== undefined) {
      updateData.exitTimestamp = data.exitTimestamp
        ? new Date(data.exitTimestamp)
        : null;
    }

    // Handle strategy relation properly
    if (strategyId !== undefined) {
      if (strategyId === null) {
        updateData.strategy = {
          disconnect: true,
        };
      } else {
        updateData.strategy = {
          connect: {
            id: strategyId,
          },
        };
      }
    }

    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.screenshotUrl !== undefined)
      updateData.screenshotUrl = data.screenshotUrl;
    if (data.tradeScore !== undefined) updateData.tradeScore = data.tradeScore;

    // Determine new values for PnL calculation
    const side = (data.side || existingTrade.side) as TradeSide;
    const entryPrice =
      data.entryPrice !== undefined
        ? data.entryPrice
        : Number(existingTrade.entryPrice);
    const exitPrice =
      data.exitPrice !== undefined
        ? data.exitPrice
        : existingTrade.exitPrice
          ? Number(existingTrade.exitPrice)
          : null;
    const quantity =
      data.quantity !== undefined
        ? data.quantity
        : Number(existingTrade.quantity);
    const leverage =
      data.leverage !== undefined ? data.leverage : existingTrade.leverage;
    const fees =
      data.fees !== undefined ? data.fees : Number(existingTrade.fees);

    // Update status and PnL if exit price is provided
    if (exitPrice !== null) {
      updateData.status = TradeStatus.CLOSED;

      const pnl = this.calculatePnL(
        side,
        entryPrice,
        exitPrice,
        quantity,
        leverage,
        fees
      );
      updateData.pnlNet = new Prisma.Decimal(pnl.pnlNet);
      updateData.pnlPercentage = new Prisma.Decimal(pnl.pnlPercentage);
    } else {
      updateData.status = TradeStatus.OPEN;
      updateData.pnlNet = null;
      updateData.pnlPercentage = null;
    }

    // Update trade
    const trade = await prisma.trade.update({
      where: {
        id: tradeId,
        deletedAt: null,
      },
      data: updateData,
    });

    return this.toTradeResponse(trade);
  }

  /**
   * Soft Delete a trade
   */
  async softDeleteTrade(userId: string, tradeId: string): Promise<void> {
    // Check if trade exists and belongs to user
    const trade = await prisma.trade.findFirst({
      where: {
        id: tradeId,
        userId,
        deletedAt: null,
      },
    });

    if (!trade) {
      throw new AppError(404, "TRADE_NOT_FOUND", "trade not found");
    }

    // Delete trade
    await prisma.trade.update({
      where: { id: tradeId },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Restore Deleted trade (UNDO)
   */

  async restoreTrade(userId: string, tradeId: string): Promise<void> {
    const trade = await prisma.trade.findFirst({
      where: {
        id: tradeId,
        userId,
        deletedAt: { not: null },
      },
    });

    if (!trade) {
      throw new AppError(404, "TRADE_NOT_FOUND", "Deleted trade not found");
    }

    await prisma.trade.update({
      where: { id: tradeId },
      data: { deletedAt: null },
    });
  }

  /**
   * List Deleted trades(Trash)
   */
  async getDeletedTrades(userId: string) {
    return prisma.trade.findMany({
      where: {
        userId,
        deletedAt: { not: null },
      },
      orderBy: { deletedAt: "desc" },
    });
  }

  /**
   * Permanennt delete(System/Admin)
   */
  async permanentDeleteTrade(
    tradeId: string,
    role: "ADMIN" | "SUPER_ADMIN"
  ): Promise<void> {
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      throw new AppError(
        403,
        "FORBIDDEN",
        "You are not allowed to permanently delete trades"
      );
    }

    const trade = await prisma.trade.findFirst({
      where: {
        id: tradeId,
        deletedAt: { not: null },
      },
    });

    if (!trade) {
      throw new AppError(
        404,
        "TRADE_NOT_FOUND",
        "Trade must be soft-deleted before permanent deletion"
      );
    }

    await prisma.trade.delete({
      where: { id: tradeId },
    });
  }

  /**
   * Get trade statistics for a user
   */
  async getTradeStats(userId: string) {
    const trades = await prisma.trade.findMany({
      where: {
        userId,
        status: TradeStatus.CLOSED,
        deletedAt: null,
      },
    });

    const totalTrades = trades.length;
    const winningTrades = trades.filter(
      (t) => t.pnlNet && Number(t.pnlNet) > 0
    ).length;
    const losingTrades = trades.filter(
      (t) => t.pnlNet && Number(t.pnlNet) < 0
    ).length;

    const totalPnL = trades.reduce(
      (sum, t) => sum + (t.pnlNet ? Number(t.pnlNet) : 0),
      0
    );
    const avgPnL = totalTrades > 0 ? totalPnL / totalTrades : 0;

    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    return {
      totalTrades,
      winningTrades,
      losingTrades,
      winRate: Number(winRate.toFixed(2)),
      totalPnL: Number(totalPnL.toFixed(2)),
      avgPnL: Number(avgPnL.toFixed(2)),
    };
  }
}

export const tradeService = new TradeService();
