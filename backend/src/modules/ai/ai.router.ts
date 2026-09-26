import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import * as aiService from "./ai.service";
import { prisma } from "@/lib/prisma";
import { optionalAuth, authenticate } from "@/middleware/auth.middleware";
import { validateBody } from "@/middleware/validate";
import { sendSuccess, sendError } from "@/utils/response";

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
    // A tier name, never a Groq model id. The enum is the allowlist: an
    // unknown value is rejected at validation rather than reaching the
    // upstream call, so this endpoint can't be used to select — or probe
    // for — any other model on the account.
    model:   z.enum(["fast", "deep"]).optional(),
    /**
     * The reader is on a phone. Not a device string — just the one bit the
     * answer's shape depends on, so nothing identifying is sent and the
     * value cannot carry anything but true/false.
     */
    compact: z.boolean().optional(),
  }).optional(),
});

const analyzeSchema  = z.object({ text: z.string().min(5).max(1000), stars: z.number().int().min(1).max(5) });
const translateSchema = z.object({
  text: z.string().min(1).max(2000),
  from: z.string().min(2).max(8),
  to:   z.string().min(2).max(8),
});
const insightSchema  = z.object({ locationId: z.string().min(1), lang: z.string().optional() });
const tourPlanSchema = z.object({
  tourData: z.object({
    days:    z.string().min(1),
    people:  z.string().min(1),
    regions: z.array(z.string()).min(1),
    budget:  z.string().min(1),
  }),
  locationIds: z.array(z.string()).optional(),
});

// ── POST /api/ai/chat ─────────────────────────────────
aiRouter.post("/chat", optionalAuth, validateBody(chatSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { messages, userContext } = req.body as z.infer<typeof chatSchema>;
      // The "deep" tier is the Verso Pro benefit advertised on /pro (the
      // long-context model). userContext.model is client-supplied and
      // unauthenticated input, so it decides nothing on its own — it is
      // clamped against req.user.isPremium, which comes from the signed JWT
      // and cannot be forged. A non-premium client asking for "deep" is
      // silently served "fast" rather than rejected: the honest client (this
      // app) never sends "deep" unless the signed-in user is premium, so this
      // branch only ever fires against a direct API call trying to bypass
      // the paywall, and a silent downgrade is the right answer to that, not
      // an error a legitimate caller could hit.
      //
      // "deep" now calls Gemini under the hood (falling back to Groq's own
      // deep model if Gemini is unavailable) — see ai.service.ts's
      // chatCompletion(). That routing is invisible here on purpose: the
      // account-tier gate stays the only thing this endpoint decides.
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

// ── POST /api/ai/analyze-reviews (insight) ────────────
aiRouter.post("/analyze-reviews", optionalAuth, validateBody(insightSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { locationId, lang } = req.body as z.infer<typeof insightSchema>;

      const location = await prisma.location.findUnique({ where: { id: locationId } });
      if (!location) { sendError(res, "Location not found", 404); return; }

      const reviews = await prisma.review.findMany({
        where:   { locationId },
        orderBy: { createdAt: "desc" },
        take:    20,
      });

      const insight = await aiService.generateInsight(location.name, reviews, lang);
      sendSuccess(res, { insight });
    } catch (err) { next(err); }
  }
);
