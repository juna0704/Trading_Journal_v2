// backend/src/services/auth.service.ts
import argon2 from "argon2";
import { prisma } from "../config";
import { AppError, AuthTokens, User } from "../types";
import { RegisterInput, LoginInput } from "../validators/auth.validator";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { logger } from "../config";

export class AuthService {
  async register(
    data: RegisterInput
  ): Promise<{ user: User; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError(400, "EMAIL_EXISTS", "Email already registered");
    }

    // Hash password
    const hashedPassword = await argon2.hash(data.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isEmailVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    logger.info("User registered", { userId: user.id, email: user.email });

    return { user, tokens };
  }

  private async generateTokens(
    userId: string,
    email: string
  ): Promise<AuthTokens> {
    const accessToken = generateAccessToken(userId, email);
    const refreshToken = generateRefreshToken(userId, email);

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    await prisma.refreshToken.deleteMany({
      where: {
        userId,
        expiresAt: { lt: new Date() },
      },
    });

    return { accessToken, refreshToken };
  }
}
