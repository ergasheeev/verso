import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authenticate, optionalAuth } from "@/middleware/auth.middleware";
import { validateBody } from "@/middleware/validate";
import { sendSuccess } from "@/utils/response";

export const bookingRouter = Router();

// Hotels live only in the frontend's static catalog (data/index.ts) —
// there's no Hotel table to foreign-key against, so hotelId/hotelName/
// city are trusted as plain strings from the client and stored as-is.
// This is a booking *request*, not a confirmed reservation: no payment
// or availability system exists yet, so a real person follows up by
// phone using contactPhone.
const createSchema = z
  .object({
    hotelId:      z.string().min(1),
    hotelName:    z.string().min(1).max(200),
    city:         z.string().min(1).max(120),
    checkIn:      z.coerce.date(),
    checkOut:     z.coerce.date(),
    guests:       z.number().int().min(1).max(20),
    contactName:  z.string().min(2).max(120),
    contactPhone: z.string().min(5).max(30),
  })
  .refine((d) => d.checkOut > d.checkIn, {
    message: "Chiqish sanasi kirish sanasidan keyin bo'lishi kerak",
    path: ["checkOut"],
  })
  .refine((d) => d.checkIn >= new Date(new Date().toDateString()), {
    message: "Kirish sanasi o'tmishda bo'la olmaydi",
    path: ["checkIn"],
  });

// ── POST /api/bookings ─────────────────────────────────
// A guest (no session) can submit one too — booking a hotel isn't gated
// behind an account, the same way adding a location to your plan isn't.
bookingRouter.post(
  "/",
  optionalAuth,
  validateBody(createSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as z.infer<typeof createSchema>;
      const booking = await prisma.bookingRequest.create({
        data: { ...body, userId: req.user?.userId },
      });
      sendSuccess(res, booking, "Bron so'rovi qabul qilindi", 201);
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/bookings/me ───────────────────────────────
// Unlike the POST above, looking your own bookings back up requires an
// actual account — there's no anonymous retrieval path.
bookingRouter.get("/me", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await prisma.bookingRequest.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
    });
    sendSuccess(res, bookings);
  } catch (err) {
    next(err);
  }
});
