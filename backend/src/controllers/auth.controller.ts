import { Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse, AuthRequest } from "../types";
import { logger } from "../config";

const authService = new AuthService();

export class AuthController {
  /**
   * Public registration - requires admin approval
   */
  async register(req: AuthRequest, res: Response): Promise<void> {
    const { user, message } = await authService.register(req.body);

    const response: ApiResponse = {
      success: true,
      message,
      data: {
        user,
      },
    };

    res.status(201).json(response);
  }

  /**
   * User login
   */
  async login(req: AuthRequest, res: Response): Promise<void> {
    const { user, tokens } = await authService.login(req.body);

    const response: ApiResponse = {
      success: true,
      data: {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
    res.status(200).json(response);
  }

  /**
   * Refresh access token
   */
  async refresh(req: AuthRequest, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshTokens(refreshToken);

    const response: ApiResponse = {
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };

    res.status(200).json(response);
  }

  /**
   * Verify email address
   */
  async verifyEmail(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { token } = req.query as { token: string };
      const result = await authService.verifyEmail(token);

      logger.info("Email verified", { token: token.substring(0, 10) + "..." });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Error during verifieng email");
    }
  }

  /**
   * Resend email verification
   */
  async resendVerification(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const result = await authService.resendVerfification(email);

      logger.info("Verification email resent", { email });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Error during sending varification email");
    }
  }

  /**
   * Logout user
   */
  async logout(req: AuthRequest, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);

    logger.info("User logged out");

    res.status(200).json({
      success: true,
      data: { message: "Logged out successfully" },
    });
  }

  /**
   * Get current user profile
   */
  async getMe(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw new Error("User not authenticated");
    }

    const user = await authService.getCurrentUser(req.user.userId);

    const response: ApiResponse = {
      success: true,
      data: { user },
    };

    res.status(200).json(response);
  }

  // ============================================
  // ADMIN CONTROLLERS
  // ============================================

  /**
   * Admin creates a new user
   */
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
