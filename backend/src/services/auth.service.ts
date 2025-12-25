// backend/src/services/auth.service.ts
import argon2 from "argon2";
import crypto from "crypto";
import { prisma } from "../config";
import { AppError, AuthTokens, User } from "../types/auth.types";
import {
  RegisterInput,
  LoginInput,
  AdminRegisterInput,
} from "../validators/auth.validator";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { logger } from "../config";
import { emailService } from "./email.service";

export class AuthService {
  async register(
    data: RegisterInput
  ): Promise<{ user: User; message: string }> {
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

    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "USER",
        isActive: false,
        emailVerificationToken,
        emailVerificationExpires,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Send verification email
    await emailService.sendVerificationEmail(
      user.email,
      emailVerificationToken
    );

    // Send pending approval notification
    await emailService.sendRegistrationPendingEmail(user.email);

    // Notify admins about new registration
    const userName = [user.firstName, user.lastName].filter(Boolean).join(" ");
    await emailService.notifyAdminNewRegistration(
      user.email,
      userName,
      user.id
    );

    logger.info("User registered pending approval", {
      userId: user.id,
      email: user.email,
    });

    return {
      user,
      message:
        "Registration submitted. Your account will be activated after admin approval.",
    };
  }

  /**
   * Admin creates a new user directly
   */
  async registerByAdmin(
    data: AdminRegisterInput,
    adminId: string
  ): Promise<{ user: User }> {
    // Verify the requesting user is an admin
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!admin || (admin.role !== "ADMIN" && admin.role !== "SUPER_ADMIN")) {
      throw new AppError(403, "FORBIDDEN", "Only admins can create users");
    }

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

    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create user with specified role (default USER)
    // Account is active immediately when created by admin
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || "USER",
        isActive: true, // Active immediately
        isEmailVerified: false, // Still needs to verify email
        emailVerificationToken,
        emailVerificationExpires,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Send verification email
    await emailService.sendVerificationEmail(
      user.email,
      emailVerificationToken
    );

    // Send account approved email since admin created it
    await emailService.sendAccountApprovedEmail(user.email);

    logger.info("User created by admin", {
      userId: user.id,
      email: user.email,
      role: user.role,
      adminId,
    });

    return { user };
  }

  /**
   * Admin approves a pending user registration
   */
  async approveUser(userId: string, adminId: string): Promise<{ user: User }> {
    // Verify the requesting user is an admin
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!admin || (admin.role !== "ADMIN" && admin.role !== "SUPER_ADMIN")) {
      throw new AppError(403, "FORBIDDEN", "Only admins can approve users");
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isActive: true, email: true },
    });

    if (!targetUser) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found");
    }

    if (targetUser.isActive) {
      throw new AppError(400, "ALREADY_ACTIVE", "User is already active");
    }

    // Activate the user
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Send approval email
    await emailService.sendAccountApprovedEmail(user.email);

    logger.info("User approved", { userId, approvedBy: adminId });

    return { user };
  }

  /**
   * Get all users pending approval (inactive users)
   */
  async getPendingUsers(): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: {
        isActive: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    logger.info("Pending users retrieved", { count: users.length });

    return users;
  }

  /**
   * Admin deactivates a user account
   */
  async deactivateUser(
    userId: string,
    adminId: string
  ): Promise<{ user: User }> {
    // Verify the requesting user is an admin
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!admin || (admin.role !== "ADMIN" && admin.role !== "SUPER_ADMIN")) {
      throw new AppError(403, "FORBIDDEN", "Only admins can deactivate users");
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, isActive: true },
    });

    if (!targetUser) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found");
    }

    // Prevent deactivating super admins
    if (targetUser.role === "SUPER_ADMIN") {
      throw new AppError(
        403,
        "FORBIDDEN",
        "Cannot deactivate a super admin account"
      );
    }

    // Prevent self-deactivation
    if (userId === adminId) {
      throw new AppError(
        400,
        "INVALID_OPERATION",
        "Cannot deactivate your own account"
      );
    }

    if (!targetUser.isActive) {
      throw new AppError(400, "ALREADY_INACTIVE", "User is already inactive");
    }

    // Deactivate the user
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Revoke all refresh tokens for this user
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });

    // Send deactivation email
    await emailService.sendAccountDeactivatedEmail(user.email);

    logger.info("User deactivated", { userId, deactivatedBy: adminId });

    return { user };
  }

  /**
   * User login
   */
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
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    logger.info("User logged in", {
      userId: user.id,
      email: user.email,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword as User, tokens };
  }

  /**
   * Refresh access token
   */
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
      storedToken.user.email,
      storedToken.user.role
    );

    logger.info("Tokens refreshed", { userId: storedToken.userId });

    return tokens;
  }

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        isEmailVerified: false,
      },
    });

    if (!user) {
      throw new AppError(400, "INVALID_TOKEN", "Invalid verification token");
    }

    if (user.isEmailVerified) {
      throw new AppError(400, "ALREADY_VERIFIED", "Email already vefified");
    }

    if (
      user.emailVerificationExpires &&
      user.emailVerificationExpires < new Date()
    ) {
      throw new AppError(400, "TOKEN_EXPIRED", "Verification token expired");
    }

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    logger.info("Email verified", { userId: user.id, email: user.email });

    return { message: "Email verified successfully" };
  }

  /**
   * Resend verification email
   */
  async resendVerfification(email: string): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found");
    }

    if (user.isEmailVerified) {
      throw new AppError(400, "ALREADY_VERIFIED", "Email already verified");
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken,
        emailVerificationExpires,
      },
    });

    // Send verification email
    await emailService.sendVerificationEmail(
      user.email,
      emailVerificationToken
    );

    logger.info("Verification email resent", {
      userId: user.id,
      email: user.email,
    });

    return { message: "Varification email sent" };
  }

  /**
   * Logout user
   */
  async logout(refreshToken: string): Promise<void> {
    // Revoke refresh token
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { isRevoked: true },
    });

    logger.info("User logged out");
  }

  /**
   * ChangePassword
   */
  async changePassword(userId: string, newPassword: string) {
    const passwordHash = await argon2.hash(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash },
    });

    // Optional but recommended
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(userId: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found");
    }

    if (!user.isActive) {
      throw new AppError(403, "ACCOUNT_DISABLED", "Account has been disabled");
    }

    return user;
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(
    userId: string,
    email: string,
    role: string
  ): Promise<AuthTokens> {
    const accessToken = generateAccessToken(userId, email, role);
    const refreshToken = generateRefreshToken(userId, email, role);

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.$transaction([
      // Delete all existing token for same user
      prisma.refreshToken.deleteMany({ where: { userId } }),

      // Create the new one
      prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId,
          expiresAt,
        },
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
