import { Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse, AuthRequest } from "../types/auth.types";
import { logger } from "../config";

// ============================================
// ADMIN CONTROLLERS
// ============================================

/**
 * Admin creates a new user
 */

const authService = new AuthService();

export class AdminController {
  async adminRegister(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw new Error("User not authenticated");
    }

    const { user } = await authService.registerByAdmin(
      req.body,
      req.user.userId
    );

    const response: ApiResponse = {
      success: true,
      message: "User created successfully",
      data: { user },
    };

    res.status(201).json(response);
  }

  /**
   * Admin approves a pending user
   */
  async approveUser(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw new Error("User not authenticated");
    }

    const { userId } = req.params;
    const { user } = await authService.approveUser(userId, req.user.userId);

    logger.info("User approved", {
      userId,
      approvedBy: req.user.userId,
    });

    const response: ApiResponse = {
      success: true,
      message: "User approved successfully",
      data: { user },
    };

    res.status(200).json(response);
  }

  /**
   * Get all pending users
   */
  async getPendingUsers(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw new Error("User not authenticated");
    }

    const users = await authService.getPendingUsers();

    const response: ApiResponse = {
      success: true,
      data: { users, count: users.length },
    };

    res.status(200).json(response);
  }

  /**
   * Admin deactivates a user
   */
  async deactivateUser(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw new Error("User not authenticated");
    }

    const { userId } = req.params;
    const { user } = await authService.deactivateUser(userId, req.user.userId);

    logger.info("User deactivated", {
      userId,
      deactivatedBy: req.user.userId,
    });

    const response: ApiResponse = {
      success: true,
      message: "User deactivated successfully",
      data: { user },
    };

    res.status(200).json(response);
  }

  /**
   * Admin activates a user
   */
  async activateUser(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw new Error("User not authenticated");
    }

    const { userId } = req.params;
    const { user } = await authService.approveUser(userId, req.user.userId);

    logger.info("User activated", {
      userId,
      activatedBy: req.user.userId,
    });

    const response: ApiResponse = {
      success: true,
      message: "User activated successfully",
      data: { user },
    };

    res.status(200).json(response);
  }
}
