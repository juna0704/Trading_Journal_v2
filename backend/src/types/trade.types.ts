import { Trade, TradeSide, TradeStatus } from "../generated/prisma";

export { TradeSide, TradeStatus };

// Base Trade type from Prisma
export type TradeType = Trade;

// Request types for API
export interface CreateTradeRequest {
  symbol: string;
  side: TradeSide;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  leverage?: number;
  fees?: number;
  stopLoss?: number;
  takeProfit?: number;
  entryTimestamp: string; // ISO 8601 date string
  exitTimestamp?: string; // ISO 8601 date string
  strategyId?: string;
  notes?: string;
  tags?: string[];
  screenshotUrl?: string;
}

export interface UpdateTradeRequest {
  symbol?: string;
  side?: TradeSide;
  entryPrice?: number;
  exitPrice?: number;
  quantity?: number;
  leverage?: number;
  fees?: number;
  stopLoss?: number;
  takeProfit?: number;
  entryTimestamp?: string;
  exitTimestamp?: string;
  strategyId?: string;
  notes?: string;
  tags?: string[];
  screenshotUrl?: string;
  tradeScore?: number;
}

// Response type
export interface TradeResponse {
  id: string;
  userId: string;
  symbol: string;
  side: TradeSide;
  entryPrice: string;
  exitPrice: string | null;
  status: TradeStatus;
  quantity: string;
  leverage: number;
  fees: string;
  pnlNet: string | null;
  pnlPercentage: string | null;
  stopLoss: string | null;
  takeProfit: string | null;
  entryTimestamp: string;
  exitTimestamp: string | null;
  strategyId: string | null;
  notes: string | null;
  tags: string[];
  screenshotUrl: string | null;
  tradeScore: number | null;
  createdAt: string;
  updatedAt: string;
}
