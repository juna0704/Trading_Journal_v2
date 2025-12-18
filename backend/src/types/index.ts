// backend/src/types/index.ts
import { Request } from "express";

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
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
  };
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
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
