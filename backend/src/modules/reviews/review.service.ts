import { type Review } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createError } from "@/middleware/error-handler";
import { buildPagination } from "@/utils/response";

export interface CreateReviewDto {
  locationId: string;
  text:       string;
  stars:      number;
  author?:    string;
  country?:   string;
  userId?:    string;
}

// ── Helper: recalculate location rating ───────────────
async function recalcRating(locationId: string): Promise<void> {
  const agg = await prisma.review.aggregate({
    where:  { locationId },
    _avg:   { stars: true },
    _count: { id: true },
  });
  await prisma.location.update({
    where: { id: locationId },
    data: {
      rating:      Math.round((agg._avg.stars ?? 0) * 10) / 10,
      reviewCount: agg._count.id,
    },
  });
}

// ── getByLocation ──────────────────────────────────────
export async function getByLocation(locationId: string, page = 1, limit = 10) {
  const safeLimit = Math.min(50, Math.max(1, limit));
  const safePage  = Math.max(1, page);
  const skip      = (safePage - 1) * safeLimit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where:   { locationId },
      orderBy: { createdAt: "desc" },
      skip,
      take: safeLimit,
      include: { user: { select: { name: true } } },
    }),
    prisma.review.count({ where: { locationId } }),
  ]);

  return { reviews, total, pagination: buildPagination(safePage, safeLimit, total) };
}

// ── create ─────────────────────────────────────────────
export async function create(dto: CreateReviewDto): Promise<Review> {
  // Fail with a clean 404 instead of letting a stale/unknown locationId
  // hit Prisma's foreign-key constraint and surface as a generic 500.
  const location = await prisma.location.findUnique({ where: { id: dto.locationId } });
  if (!location) throw createError("Joy topilmadi", 404);

  // Step 1: persist immediately
  const review = await prisma.review.create({
    data: {
      locationId: dto.locationId,
      text:       dto.text,
      stars:      dto.stars,
      author:     dto.author?.trim() || "Anonim",
      country:    dto.country || "🌍",
      ...(dto.userId && { userId: dto.userId }),
    },
  });

  // Step 2: update location rating
  await recalcRating(dto.locationId);

  return review;
}

// ── deleteById ─────────────────────────────────────────
export async function deleteById(id: string, userId: string): Promise<void> {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw createError("Review not found", 404);
  if (review.userId !== userId) throw createError("Forbidden", 403);

  await prisma.review.delete({ where: { id } });
  await recalcRating(review.locationId);
}
