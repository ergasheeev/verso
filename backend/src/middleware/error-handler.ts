import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ZodError } from "zod";
import { env } from "@/config/env";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  /**
   * Optional machine-readable discriminator, forwarded to the client
   * alongside the message. Lets the frontend branch on a specific
   * condition (e.g. EMAIL_NOT_VERIFIED → jump to the code screen) instead
   * of string-matching a translated message.
   */
  code?: string;
  /**
   * Seconds the caller should wait before retrying, for the 429s that know
   * the answer. Sent both as a field and as the standard `Retry-After`
   * header so a client can drive an accurate countdown instead of guessing
   * a fresh interval.
   */
  retryAfter?: number;
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

  // ── Prisma: unique constraint violation (P2002) ──────
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    const fields = (err.meta?.target as string[] | undefined)?.join(", ") ?? "field";
    res.status(409).json({
      success: false,
      // Column names are internal schema details — only surface them in dev.
      message: isDev ? `${fields} already exists` : "This record already exists",
      error: isDev ? err.message : undefined,
    });
    return;
  }

  // ── Prisma: record not found (P2025) ─────────────────
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    res.status(404).json({
      success: false,
      message: "Record not found",
      error: isDev ? err.message : undefined,
    });
    return;
  }

  // ── Prisma: validation error ──────────────────────────
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(422).json({
      success: false,
      message: "Invalid data provided",
      error: isDev ? err.message : undefined,
    });
    return;
  }

  // ── JWT: expired ─────────────────────────────────────
  if (err instanceof TokenExpiredError) {
    res.status(401).json({
      success: false,
      message: "Token expired. Please log in again.",
    });
    return;
  }

  // ── JWT: invalid ─────────────────────────────────────
  if (err instanceof JsonWebTokenError) {
    res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
    return;
  }

  // ── Zod: validation ──────────────────────────────────
  if (err instanceof ZodError) {
    const details = err.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
    }));
    res.status(422).json({
      success: false,
      message: "Validation failed",
      error: isDev ? details : details.map((d) => d.message).join(", "),
    });
    return;
  }

  // ── Operational errors ───────────────────────────────
  const appErr = err as AppError;
  if (appErr.isOperational) {
    if (typeof appErr.retryAfter === "number") {
      res.setHeader("Retry-After", String(appErr.retryAfter));
    }
    res.status(appErr.statusCode ?? 400).json({
      success: false,
      message: err.message,
      ...(appErr.code && { code: appErr.code }),
      ...(typeof appErr.retryAfter === "number" && { retryAfter: appErr.retryAfter }),
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
