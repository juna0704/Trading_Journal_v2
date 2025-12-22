import jwt from "jsonwebtoken";
import { AuthTokenPayload, AppError } from "../types";
import { env } from "../config";

const ISSUER = "Trading-journal-api";
const AUDIENCE = "Trading-journal-client";

const signToken = (
  payload: AuthTokenPayload,
  secret: string,
  expiresIn: string | number
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as any,
    issuer: ISSUER,
    audience: AUDIENCE,
  });
};

// Generate access token
export const generateAccessToken = (
  userId: string,
  email: string,
  role: string
): string => {
  return signToken(
    { userId, email, role, type: "access" },
    env.JWT_SECRET,
    env.JWT_EXPIRES_IN
  );
};

// Generate Refresh token
export const generateRefreshToken = (
  userId: string,
  email: string,
  role: string
): string => {
  return signToken(
    { userId, email, role, type: "refresh" },
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN
  );
};

const verifyToken = (
  token: string,
  secret: string,
  expectedType: "access" | "refresh"
): AuthTokenPayload => {
  try {
    const payload = jwt.verify(token, secret, {
      issuer: ISSUER,
      audience: AUDIENCE,
    }) as AuthTokenPayload;

    if (payload.type !== expectedType) {
      throw new AppError(401, "INVALID_TOKEN_TYPE", "Invalid token type");
    }

    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(401, "TOKEN_EXPIRED", `${expectedType} token expired`);
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(401, "INVALID_TOKEN", `Invalid ${expectedType} token`);
    }

    throw error;
  }
};

export const verifyAccessToken = (token: string) =>
  verifyToken(token, env.JWT_SECRET, "access");

export const verifyRefreshToken = (token: string) =>
  verifyToken(token, env.JWT_REFRESH_SECRET, "refresh");
