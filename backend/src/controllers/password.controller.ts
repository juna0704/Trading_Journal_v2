// backend/src/controllers/password.controller.ts
import { Request, Response, NextFunction } from "express";
import { passwordService } from "../services/password.service";
import { logger } from "../config";

class PasswordController {
  async requestReset(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const ipAddress = req.ip || req.socket.remoteAddress || "unknown";
      const userAgent = req.get("user-agent");

      const result = await passwordService.requestPasswordReset({
        email,
        ipAddress,
        userAgent,
      });

      logger.info("Password reset requested", { email, ipAddress });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;

      const result = await passwordService.resetPassword({
        token,
        newPassword,
      });

      logger.info("Password reset completed");

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async validateToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.query;

      if (!token || typeof token !== "string") {
        return res.status(400).json({
          success: false,
          error: {
            code: "INVALID_TOKEN",
            message: "Token is required",
          },
        });
      }

      const isValid = await passwordService.validateResetToken(token);

      res.json({
        success: true,
        data: { valid: isValid },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const passwordController = new PasswordController();
