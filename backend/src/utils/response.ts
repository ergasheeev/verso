import type { Response } from "express";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationMeta;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): Response {
  const body: ApiResponse<T> = { success: true, data };
  if (message) body.message = message;
  return res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  error?: string
): Response {
  const body: ApiResponse<never> = { success: false, message };
  if (error) body.error = error;
  return res.status(statusCode).json(body);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  message?: string
): Response {
  const body: ApiResponse<T[]> = { success: true, data, pagination };
  if (message) body.message = message;
  return res.status(200).json(body);
}

export function buildPagination(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  return { page, limit, total, pages: Math.ceil(total / limit) };
}
