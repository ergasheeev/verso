import jwt from "jsonwebtoken";
import { env } from "@/config/env";

export interface JwtPayload {
  userId:    string;
  email:     string;
  isPremium: boolean;
}

interface RefreshPayload {
  userId: string;
}

export interface TokenPair {
  accessToken:  string;
  refreshToken: string;
}

export function generateTokens(payload: JwtPayload): TokenPair {
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

  const refreshToken = jwt.sign(
    { userId: payload.userId } satisfies RefreshPayload,
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
  );

  return { accessToken, refreshToken };
}

export function verifyRefreshToken(token: string): RefreshPayload | null {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshPayload;
  } catch {
    return null;
  }
}

// Milliseconds — used for cookie maxAge
export const REFRESH_TOKEN_MS = 7 * 24 * 60 * 60 * 1000;
