import { Response, NextFunction } from "express";
import { strategyService } from "../services/strategy.service";
import {
  CreateStrategyRequest,
  UpdateStrategyRequest,
} from "../types/strategy.types";
import { AuthRequest } from "../types/auth.types";

export class StrategyController {
  /**
   * Create a new strategy
   * POST /api/strategies
   */
  async createStrategy(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const data: CreateStrategyRequest = req.body;

      const strategy = await strategyService.createStrategy(userId, data);

      res.status(201).json({
        success: true,
        data: strategy,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all strategies for user
   * GET /api/strategies
   */
  async getStrategies(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;

      const strategies = await strategyService.getStrategies(userId);

      res.status(200).json({
        success: true,
        data: strategies,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single strategy
   * GET /api/strategies/:id
   */
  async getStrategyById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const strategyId = req.params.id;

      const strategy = await strategyService.getStrategyById(
        userId,
        strategyId
      );

      res.status(200).json({
        success: true,
        data: strategy,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a strategy
   * PUT /api/strategies/:id
   */
  async updateStrategy(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const strategyId = req.params.id;
      const data: UpdateStrategyRequest = req.body;

      const strategy = await strategyService.updateStrategy(
        userId,
        strategyId,
        data
      );

      res.status(200).json({
        success: true,
        data: strategy,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a strategy
   * DELETE /api/strategies/:id
   */
  async deleteStrategy(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const strategyId = req.params.id;

      await strategyService.deleteStrategy(userId, strategyId);

      res.status(200).json({
        success: true,
        message: "Strategy deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const strategyController = new StrategyController();
