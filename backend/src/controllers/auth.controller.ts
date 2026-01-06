import { Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse, AuthRequest } from "../types/auth.types";
import { logger } from "../config";
import { sanitizeUser } from "../utils/sanitizeUser";
import { AppError } from "../utils/errors";

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
        user: sanitizeUser(user),
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
  async verifyEmail(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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
      next(error);
    }
  }

  /**
   * Resend email verification
   */
  async resendVerification(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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
      next(error);
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

  async changePassword(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    const { newPassword } = req.body;

    if (!userId) {
      throw new AppError(403, "USER_NOT_FOUND", "user not found");
    }

    await authService.changePassword(userId, newPassword);

    res.json({
      success: true,
      message: "Password updated successfully",
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
      data: { user: sanitizeUser(user) },
    };

    res.status(200).json(response);
  }
}
