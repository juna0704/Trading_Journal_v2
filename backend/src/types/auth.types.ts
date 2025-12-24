// backend/src/types/index.ts
import { Request } from "express";

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  isEmailVerified: boolean;
  role: string;
  isActive: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  role: string;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: string;
  type: "access" | "refresh";
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role?: string;
  };
}

export interface RequestResetInput {
  email: string;
  ipAddress: string;
  userAgent?: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}
