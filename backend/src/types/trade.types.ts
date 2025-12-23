// backend/src/types/trade.types.ts

import { TradeSide, TradeStatus, Prisma } from "../generated/prisma/client";

export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  side: TradeSide;
  status: TradeStatus;
  quantity: Prisma.Decimal;
  entryPrice: Prisma.Decimal;
  exitPrice: Prisma.Decimal | null;
  profitLoss: Prisma.Decimal | null;
  pnlPercentage: Prisma.Decimal | null;
  stopLoss: Prisma.Decimal | null;
  takeProfit: Prisma.Decimal | null;
  fees: Prisma.Decimal;
  entryDate: Date;
  exitDate: Date | null;
  notes: string | null;
  tags: string[];
  screenshotUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTradeRequest {
  symbol: string;
  side: TradeSide;
  quantity: number;
  entryPrice: number;
  entryDate: Date | string;
  stopLoss?: number;
  takeProfit?: number;
  fees?: number;
  notes?: string;
  tags?: string[];
  screenshotUrl?: string;
}

export interface UpdateTradeRequest {
  symbol?: string;
  quantity?: number;
  entryPrice?: number;
  exitPrice?: number;
  entryDate?: Date | string;
  exitDate?: Date | string;
  stopLoss?: number;
  takeProfit?: number;
  fees?: number;
  notes?: string;
  tags?: string[];
  screenshotUrl?: string;
  status?: TradeStatus;
}

export interface CloseTradeRequest {
  exitPrice: number;
  exitDate: Date | string;
  fees?: number;
  notes?: string;
}

export interface TradeFilters {
  status?: TradeStatus;
  side?: TradeSide;
  symbol?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  minPnl?: number;
  maxPnl?: number;
  tags?: string[];
}

export interface TradeListResponse {
  trades: Trade[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TradeStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnl: number;
  averagePnl: number;
  largestWin: number;
  largestLoss: number;
  totalFees: number;
}
