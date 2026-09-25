import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import * as aiService from "./ai.service";
import { prisma } from "@/lib/prisma";
import { optionalAuth, authenticate } from "@/middleware/auth.middleware";
import { validateBody } from "@/middleware/validate";
import { sendSuccess } from "@/utils/response";

export const aiRouter = Router();

const chatSchema = z.object({
  messages: z.array(z.object({
    role:    z.enum(["user", "assistant"]),
    content: z.string().min(1).max(4000),
  })).min(1).max(10),
  userContext: z.object({
    name:    z.string().optional(),
    country: z.string().optional(),
    plan:    z.string().optional(),
    lang:    z.string().optional(),
    // A tier name, never a Groq model id — the enum is the allowlist.
    model:   z.enum(["fast", "deep"]).optional(),
    /**
     * The reader is on a phone. Not a device string — just the one bit the
     * answer's shape depends on, so nothing identifying is sent and the
     * value cannot carry anything but true/false.
     */
    compact: z.boolean().optional(),
  }).optional(),
});

const tourPlanSchema = z.object({
  tourData: z.object({
    days:    z.string().min(1),
    people:  z.string().min(1),
    regions: z.array(z.string()).min(1),
    budget:  z.string().min(1),
  }),
  locationIds: z.array(z.string()).optional(),
});

const analyzeSchema  = z.object({ text: z.string().min(5).max(1000), stars: z.number().int().min(1).max(5) });

const translateSchema = z.object({
  text: z.string().min(1).max(2000),
  from: z.string().min(2).max(8),
  to:   z.string().min(2).max(8),
});

// ── POST /api/ai/chat ─────────────────────────────────
aiRouter.post("/chat", optionalAuth, validateBody(chatSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { messages, userContext } = req.body as z.infer<typeof chatSchema>;
      // "deep" is the Verso Pro benefit. userContext.model is client-supplied,
      // unauthenticated input, so it decides nothing on its own — clamped
      // against req.user.isPremium, which comes from the signed JWT.
      const isPremium = Boolean(req.user?.isPremium);
      const requestedModel = userContext?.model;
      const model = requestedModel === "deep" && !isPremium ? "fast" : requestedModel;

      const reply = await aiService.chat(messages, {
        name:    req.user?.email?.split("@")[0] ?? userContext?.name,
        country: userContext?.country,
        plan:    userContext?.plan,
        lang:    userContext?.lang,
        model,
        compact: userContext?.compact,
      });
      sendSuccess(res, { reply });
    } catch (err) { next(err); }
  }
);

// ── POST /api/ai/analyze-review ───────────────────────
aiRouter.post("/analyze-review", optionalAuth, validateBody(analyzeSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text, stars } = req.body as z.infer<typeof analyzeSchema>;
      const result = await aiService.analyzeReview(text, stars);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  }
);

// ── POST /api/ai/translate ────────────────────────────
aiRouter.post("/translate", optionalAuth, validateBody(translateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text, from, to } = req.body as z.infer<typeof translateSchema>;
      const translation = await aiService.translate(text, from, to);
      sendSuccess(res, { translation });
    } catch (err) { next(err); }
  }
);

// ── POST /api/ai/tour-plan (auth required) ────────────
aiRouter.post("/tour-plan", authenticate, validateBody(tourPlanSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tourData, locationIds } = req.body as z.infer<typeof tourPlanSchema>;

      let locations;
      if (locationIds?.length) {
        locations = await prisma.location.findMany({ where: { id: { in: locationIds } } });
      } else {
        const regionFilters = tourData.regions.map((r) => ({
          OR: [
            { region: { contains: r, mode: "insensitive" as const } },
            { city:   { contains: r, mode: "insensitive" as const } },
          ],
        }));
        locations = await prisma.location.findMany({
          where:   { OR: regionFilters },
          orderBy: { rating: "desc" },
          take:    15,
        });
      }

      const plan = await aiService.generateTourPlan(tourData, locations);
      sendSuccess(res, { plan });
    } catch (err) { next(err); }
  }
);