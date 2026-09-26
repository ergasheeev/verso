import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/middleware/auth.middleware";
import { validateBody, validateParams } from "@/middleware/validate";
import { sendSuccess } from "@/utils/response";
import { createError } from "@/middleware/error-handler";

export const userRouter = Router();

userRouter.use(authenticate);

const updateMeSchema = z.object({
  name:        z.string().min(2).max(50).trim().optional(),
  surname:     z.string().min(2).max(50).trim().optional(),
  country:     z.string().max(60).optional(),
  // Must match the frontend's Lang type (i18n/translations.ts); a value missing
  // here is rejected with a 400 and the language choice is never saved.
  lang:        z.enum(["uz", "ru", "en", "zh", "de", "fr"]).optional(),
  preferences: z.array(z.string()).max(20).optional(),
  // Client resizes to ~256px JPEG before sending — this cap is a server-
  // side backstop against a modified client shipping something huge into
  // the database, not the actual size-control mechanism. null clears the
  // photo back to the initial-letter avatar.
  avatarUrl:   z.string().max(400_000).startsWith("data:image/").nullable().optional(),
});

const planBodySchema  = z.object({ locationId: z.string().min(1) });
const planParamSchema = z.object({ locationId: z.string().min(1) });

// ── PATCH /api/users/me ────────────────────────────────
userRouter.patch(
  "/me",
  validateBody(updateMeSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.update({
        where: { id: req.user!.userId },
        data:  req.body as z.infer<typeof updateMeSchema>,
        include: { plan: { include: { location: true } } },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, refreshToken, ...safe } = user;
      sendSuccess(res, safe, "Profil yangilandi");
    } catch (err) { next(err); }
  }
);

// ── GET /api/users/me/plan ────────────────────────────
userRouter.get(
  "/me/plan",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await prisma.userPlan.findMany({
        where:   { userId: req.user!.userId },
        include: { location: true },
        orderBy: { createdAt: "desc" },
      });
      sendSuccess(res, { plan: items.map((i) => i.location) });
    } catch (err) { next(err); }
  }
);

// ── POST /api/users/me/plan ───────────────────────────
userRouter.post(
  "/me/plan",
  validateBody(planBodySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { locationId } = req.body as z.infer<typeof planBodySchema>;

      const location = await prisma.location.findUnique({ where: { id: locationId } });
      if (!location) throw createError("Joy topilmadi", 404);

      await prisma.userPlan.upsert({
        where:  { userId_locationId: { userId: req.user!.userId, locationId } },
        create: { userId: req.user!.userId, locationId },
        update: {},
      });

      const items = await prisma.userPlan.findMany({
        where:   { userId: req.user!.userId },
        include: { location: true },
      });
      sendSuccess(res, { plan: items.map((i) => i.location) }, "Rejaga qo'shildi", 201);
    } catch (err) { next(err); }
  }
);

// ── DELETE /api/users/me/plan/:locationId ─────────────
userRouter.delete(
  "/me/plan/:locationId",
  validateParams(planParamSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.userPlan.deleteMany({
        where: { userId: req.user!.userId, locationId: req.params.locationId },
      });
      const items = await prisma.userPlan.findMany({
        where:   { userId: req.user!.userId },
        include: { location: true },
      });
      sendSuccess(res, { plan: items.map((i) => i.location) }, "Rejadan o'chirildi");
    } catch (err) { next(err); }
  }
);
