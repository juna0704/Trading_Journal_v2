import { Strategy } from "../generated/prisma";
import prisma from "../config/database";
import { AppError } from "../utils/errors";
import {
  CreateStrategyRequest,
  UpdateStrategyRequest,
  StrategyResponse,
} from "../types/strategy.types";

export class StrategyService {
  /**
   * Convert Strategy model to API response
   */
  private toStrategyResponse(strategy: Strategy): StrategyResponse {
    return {
      id: strategy.id,
      name: strategy.name,
      userId: strategy.userId,
      createdAt: strategy.createdAt.toISOString(),
      updatedAt: strategy.updatedAt.toISOString(),
    };
  }

  /**
   * Create a new strategy
   */
  async createStrategy(
    userId: string,
    data: CreateStrategyRequest
  ): Promise<StrategyResponse> {
    // Enforce uniqueness per user
    const existing = await prisma.strategy.findFirst({
      where: {
        userId,
        name: data.name,
      },
    });

    if (existing) {
      throw new AppError(
        409,
        "STRATEGY_ALREADY_EXISTS",
        "A strategy with this name already exists"
      );
    }

    const strategy = await prisma.strategy.create({
      data: {
        userId,
        name: data.name,
      },
    });

    return this.toStrategyResponse(strategy);
  }

  /**
   * Get all strategies for a user
   */
  async getStrategies(userId: string): Promise<StrategyResponse[]> {
    const strategies = await prisma.strategy.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return strategies.map((s) => this.toStrategyResponse(s));
  }

  /**
   * Get a single strategy by ID
   */
  async getStrategyById(
    userId: string,
    strategyId: string
  ): Promise<StrategyResponse> {
    const strategy = await prisma.strategy.findFirst({
      where: {
        id: strategyId,
        userId,
      },
    });

    if (!strategy) {
      throw new AppError(404, "STRATEGY_NOT_FOUND", "Strategy not found");
    }

    return this.toStrategyResponse(strategy);
  }

  /**
   * Update a strategy
   */
  async updateStrategy(
    userId: string,
    strategyId: string,
    data: UpdateStrategyRequest
  ): Promise<StrategyResponse> {
    const strategy = await prisma.strategy.findFirst({
      where: {
        id: strategyId,
        userId,
      },
    });

    if (!strategy) {
      throw new AppError(404, "STRATEGY_NOT_FOUND", "Strategy not found");
    }

    // If name is changing, check uniqueness
    if (data.name && data.name !== strategy.name) {
      const duplicate = await prisma.strategy.findFirst({
        where: {
          userId,
          name: data.name,
        },
      });

      if (duplicate) {
        throw new AppError(
          409,
          "STRATEGY_ALREADY_EXISTS",
          "A strategy with this name already exists"
        );
      }
    }

    const updated = await prisma.strategy.update({
      where: { id: strategyId },
      data: {
        name: data.name,
      },
    });

    return this.toStrategyResponse(updated);
  }

  /**
   * Delete a strategy
   */
  async deleteStrategy(userId: string, strategyId: string): Promise<void> {
    const strategy = await prisma.strategy.findFirst({
      where: {
        id: strategyId,
        userId,
      },
    });

    if (!strategy) {
      throw new AppError(404, "STRATEGY_NOT_FOUND", "Strategy not found");
    }

    await prisma.strategy.delete({
      where: { id: strategyId },
    });
  }
}

export const strategyService = new StrategyService();
