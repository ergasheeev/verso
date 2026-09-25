import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import * as reviewService from "./review.service";
import { prisma } from "@/lib/prisma";
import { optionalAuth, authenticate } from "@/middleware/auth.middleware";
import { validateBody, validateQuery, validateParams } from "@/middleware/validate";
import { sendSuccess, sendPaginated, sendError } from "@/utils/response";

export const reviewRouter = Router();

// ── Schemas ───────────────────────────────────────────
const listQuerySchema = z.object({
  page:  z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

const idParamSchema = z.object({
  locationId: z.string().min(1, "locationId is required"),
});

const createSchema = z.object({
  locationId: z.string().min(1),
  text:       z.string().min(5, "Sharh kamida 5 belgidan iborat bo'lishi kerak").max(1000),
  stars:      z.number().int().min(1).max(5),
  author:     z.string().max(100).optional(),
  country:    z.string().max(10).optional(),
});

const deleteParamSchema = z.object({
  id: z.string().min(1),
});

// ── GET /api/reviews/:locationId ──────────────────────
reviewRouter.get(
  "/:locationId",
  validateParams(idParamSchema),
  validateQuery(listQuerySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { locationId } = req.params;
      const { page, limit } = req.query as unknown as z.infer<typeof listQuerySchema>;

      const result = await reviewService.getByLocation(locationId, page, limit);

      sendPaginated(res, result.reviews, result.pagination);
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/reviews/:locationId/stats ────────────────
reviewRouter.get(
  "/:locationId/stats",
  validateParams(idParamSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await reviewService.getStats(req.params.locationId);
      sendSuccess(res, stats);
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/reviews ─────────────────────────────────
reviewRouter.post(
  "/",
  optionalAuth,
  validateBody(createSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as z.infer<typeof createSchema>;

      // Authenticated users can't spoof their displayed author name —
      // always resolve it from their real account, never from client input.
      let author = body.author;
      if (req.user) {
        const account = await prisma.user.findUnique({
          where: { id: req.user.userId },
          select: { name: true, surname: true },
        });
        author = account ? `${account.name} ${account.surname}`.trim() : req.user.email.split("@")[0];
      }

      const review = await reviewService.create({
        ...body,
        ...(req.user && { userId: req.user.userId }),
        author,
      });

      sendSuccess(res, review, "Sharh qabul qilindi", 201);
    } catch (err) {
      next(err);
    }
  }
);

// ── DELETE /api/reviews/:id ───────────────────────────
reviewRouter.delete(
  "/:id",
  authenticate,
  validateParams(deleteParamSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        sendError(res, "Unauthorized", 401);
        return;
      }
      await reviewService.deleteById(req.params.id, req.user.userId);
      sendSuccess(res, null, "Sharh o'chirildi");
    } catch (err) {
      next(err);
    }
  }
);
