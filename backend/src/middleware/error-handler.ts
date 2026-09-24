import type { Request, Response, NextFunction } from "express";
import { env } from "@/config/env";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function createError(
  message: string,
  statusCode = 500,
  isOperational = true
): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = isOperational;
  return error;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: AppError | Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isDev = env.NODE_ENV === "development";

  // ── Log every error ──────────────────────────────────
  console.error(
    `[${new Date().toISOString()}] ${req.method} ${req.path} →`,
    isDev ? err : err.message
  );

  // ── Operational errors ───────────────────────────────
  const appErr = err as AppError;
  if (appErr.isOperational) {
    res.status(appErr.statusCode ?? 400).json({
      success: false,
      message: err.message,
      ...(isDev && { stack: err.stack }),
    });
    return;
  }

  // ── Unknown / programmer errors ──────────────────────
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(isDev && { error: err.message, stack: err.stack }),
  });
}
