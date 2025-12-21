// backend/src/services/password.service.ts
import argon2 from "argon2";
import crypto from "crypto";
import { AppError } from "../types";
import { emailService } from "./email.service";
import { logger, prisma } from "../config";

import { RequestResetInput, ResetPasswordInput } from "../types";

export class PasswordService {
  private readonly RESET_TOKEN_EXPIRY_HOURS = 1;
  private readonly MAX_RESET_ATTEMPTS_PER_HOUR = 3;
  private readonly MAX_RESET_ATTEMPTS_PER_DAY = 5;

  async requestPasswordReset({
    email,
    ipAddress,
    userAgent,
  }: RequestResetInput) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        passwordResetAttempt: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      logger.warn("Password reset requested for non-existent email", {
        email,
        ipAddress,
      });
      return {
        message:
          "If an account exists with this email, you will receive a password reset link.",
      };
    }

    // Check rate limiting
    await this.checkRateLimit(user.id, user.passwordResetAttempt);

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetExpiry = new Date(
      Date.now() + this.RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
    );

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetTokenHash,
        passwordResetExpires: resetExpiry,
      },
    });

    // Log attempt
    await prisma.passwordResetAttempt.create({
      data: {
        userId: user.id,
        ipAddress,
        userAgent,
      },
    });

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail(email, resetToken);
      logger.info("Password reset email sent", { userId: user.id, email });
    } catch (error) {
      logger.error("Failed to send password reset email", { error, email });
      // Don't throw error - we've stored the token, user can try again
    }

    return {
      message:
        "If an account exists with this email, you will receive a password reset link.",
    };
  }

  async resetPassword({ token, newPassword }: ResetPasswordInput) {
    // Hash the token to compare with stored hash
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with this token
    const user = await prisma.user.findFirst({
      where: { passwordResetToken: tokenHash },
    });

    if (!user) {
      throw new AppError(
        400,
        "Invalid or expired reset token",

        "INVALID_RESET_TOKEN"
      );
    }

    // Check if token is expired
    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new AppError(400, "Reset token has expired", "RESET_TOKEN_EXPIRED");
    }

    // Hash new password
    const passwordHash = await argon2.hash(newPassword);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    // Invalidate all refresh tokens for security
    await prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });

    logger.info("Password reset successful", { userId: user.id });

    return {
      message:
        "Password reset successful. Please login with your new password.",
    };
  }

  async validateResetToken(token: string): Promise<boolean> {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: { passwordResetToken: tokenHash },
      select: { passwordResetExpires: true },
    });

    if (!user || !user.passwordResetExpires) {
      return false;
    }

    return user.passwordResetExpires > new Date();
  }

  private async checkRateLimit(
    userId: string,
    attempts: Array<{ createdAt: Date }>
  ) {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    // Check hourly limit
    const attemptsLastHour = attempts.filter(
      (attempt) => attempt.createdAt.getTime() > oneHourAgo
    );

    if (attemptsLastHour.length >= this.MAX_RESET_ATTEMPTS_PER_HOUR) {
      logger.warn("Password reset rate limit exceeded (hourly)", { userId });
      throw new AppError(
        429,
        "Too many reset requests. Please try again later.",

        "RATE_LIMIT_EXCEEDED"
      );
    }

    // Check daily limit
    if (attempts.length >= this.MAX_RESET_ATTEMPTS_PER_DAY) {
      logger.warn("Password reset rate limit exceeded (daily)", { userId });
      throw new AppError(
        429,
        "Too many reset requests. Please try again tomorrow or contact support.",

        "RATE_LIMIT_EXCEEDED"
      );
    }
  }

  // Cleanup old reset attempts (run as background job)
  async cleanupOldAttempts() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await prisma.passwordResetAttempt.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    logger.info("Cleaned up old password reset attempts", {
      count: result.count,
    });
    return result;
  }
}

export const passwordService = new PasswordService();
