import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import * as service from "./location.service";
import { validateQuery, validateParams } from "@/middleware/validate";
import {
  sendSuccess,
  sendPaginated,
  buildPagination,
} from "@/utils/response";

export const locationRouter = Router();

// ── Validation schemas ────────────────────────────────
const listQuerySchema = z.object({
  category: z
    .enum(["tarix", "tabiat", "madaniyat", "din", "arxeologiya"])
    .optional(),
  region:   z.string().optional(),
  search:   z.string().optional(),
  featured: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  sort: z
    .enum(["rating", "reviewCount", "price"])
    .default("rating"),
  page:  z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

const idParamSchema = z.object({
  id: z.string().min(1, "Location id is required"),
});

// ── GET /api/locations/featured ───────────────────────
locationRouter.get(
  "/featured",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const locations = await service.getFeatured();
      sendSuccess(res, locations, `${locations.length} featured locations`);
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/locations ────────────────────────────────
locationRouter.get(
  "/",
  validateQuery(listQuerySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, sort, category, region, search, featured } =
        req.query as unknown as z.infer<typeof listQuerySchema>;

      const result = await service.getAll(
        { category, region, search, featured },
        { page, limit },
        sort
      );

      sendPaginated(
        res,
        result.locations,
        buildPagination(result.page, result.limit, result.total)
      );
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/locations/:id ────────────────────────────
locationRouter.get(
  "/:id",
  validateParams(idParamSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const location = await service.getById(req.params.id);
      sendSuccess(res, location);
    } catch (err) {
      next(err);
    }
  }
);
