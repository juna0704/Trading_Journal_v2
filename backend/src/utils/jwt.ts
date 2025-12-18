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
export const generateAccessToken = (userId: string, email: string): string => {
  return signToken(
    { userId, email, type: "access" },
    env.JWT_SECRET,
    env.JWT_EXPIRES_IN
  );
};

// Generate Refresh token
export const generateRefreshToken = (userId: string, email: string): string => {
  return signToken(
    { userId, email, type: "refresh" },
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN
  );
};
