// backend/src/services/auth.service.ts
import argon2 from "argon2";
import { prisma } from "../config";
import { AppError, AuthTokens, User } from "../types";
import { RegisterInput, LoginInput } from "../validators/auth.validator";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
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

  async login(data: LoginInput): Promise<{ user: User; tokens: AuthTokens }> {
    // find user
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      throw new AppError(
        401,
        "INVALID_CREDENTIALS",
        "Invalid email or password"
      );
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError(403, "ACCOUNT_DISABLED", "Account has been desiabled");
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.password, data.password);

    if (!isPasswordValid) {
      throw new AppError(
        401,
        "INVALID_CREDENTIALS",
        "Invalid email or password"
      );
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate token
    const tokens = await this.generateTokens(user.id, user.email);

    logger.info("User logged in", { userId: user.id, email: user.email });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword as User, tokens };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    // verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Check if refresh token exists and is not revoked
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new AppError(
        401,
        "INVALID_REFRESH_TOKEN",
        "Refresh token not found"
      );
    }

    if (storedToken.isRevoked) {
      throw new AppError(
        401,
        "TOKEN_REVOKED",
        "Refresh token has been revoked"
      );
    }

    if (storedToken.expiresAt < new Date()) {
      throw new AppError(401, "TOKEN_EXPIRED", "Refresh token has expired");
    }

    if (storedToken.userId !== payload.userId) {
      throw new AppError(401, "INVALID_TOKEN", "Token user mismatch");
    }

    // Check if user is active
    if (!storedToken.user.isActive) {
      throw new AppError(403, "ACCOUNT_DISABLED", "Account has been disabled");
    }

    // Revoke old refresh token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    // Generate new tokens
    const tokens = await this.generateTokens(
      storedToken.userId,
      storedToken.user.email
    );

    logger.info("Tokens refreshed", { userId: storedToken.userId });

    return tokens;
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
