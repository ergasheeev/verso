import { Prisma, type Category, type Location } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createError } from "@/middleware/error-handler";

export type SortField = "rating" | "reviewCount" | "price";

export interface LocationFilters {
  category?: Category;
  region?: string;
  search?: string;
  featured?: boolean;
}

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
  filters: LocationFilters = {},
  pagination: PaginationInput = {},
  sort: SortField = "rating"
): Promise<GetAllResult> {
  const page  = Math.max(1, pagination.page  ?? 1);
  const limit = Math.min(50, Math.max(1, pagination.limit ?? 12));
  const skip  = (page - 1) * limit;

  const where: Prisma.LocationWhereInput = {};

  if (filters.category) where.category = filters.category;
  if (filters.region)   where.region = { contains: filters.region, mode: "insensitive" };
  if (typeof filters.featured === "boolean") where.featured = filters.featured;

  if (filters.search?.trim()) {
    const q = filters.search.trim();
    where.OR = [
      { name:      { contains: q, mode: "insensitive" } },
      { city:      { contains: q, mode: "insensitive" } },
      { shortDesc: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.LocationOrderByWithRelationInput =
    sort === "reviewCount" ? { reviewCount: "desc" } :
    sort === "price"       ? { priceUSD:    "asc"  } :
                             { rating:      "desc" };

  const [locations, total] = await Promise.all([
    prisma.location.findMany({ where, orderBy, skip, take: limit }),
    prisma.location.count({ where }),
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
