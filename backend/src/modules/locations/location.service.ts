import type { Location } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createError } from "@/middleware/error-handler";

export interface PaginationInput {
  page?: number;
  limit?: number;
}

interface GetAllResult {
  locations: Location[];
  total: number;
  pages: number;
  page: number;
  limit: number;
}

// ── getAll ─────────────────────────────────────────────
export async function getAll(
  pagination: PaginationInput = {}
): Promise<GetAllResult> {
  const page  = Math.max(1, pagination.page  ?? 1);
  const limit = Math.min(50, Math.max(1, pagination.limit ?? 12));
  const skip  = (page - 1) * limit;

  const [locations, total] = await Promise.all([
    prisma.location.findMany({ orderBy: { rating: "desc" }, skip, take: limit }),
    prisma.location.count(),
  ]);

  return { locations, total, pages: Math.ceil(total / limit), page, limit };
}

// ── getById ────────────────────────────────────────────
export async function getById(id: string): Promise<Location> {
  const location = await prisma.location.findUnique({ where: { id } });
  if (!location) throw createError(`Location '${id}' not found`, 404);
  return location;
}

// ── getFeatured ────────────────────────────────────────
export async function getFeatured(): Promise<Location[]> {
  return prisma.location.findMany({
    where:   { featured: true },
    orderBy: { rating: "desc" },
    take:    6,
  });
}
