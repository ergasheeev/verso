import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import * as authService from "./auth.service";
import { validateBody } from "@/middleware/validate";
import { sendSuccess } from "@/utils/response";
import { REFRESH_TOKEN_MS } from "@/utils/jwt";
import { env } from "@/config/env";

// Password rule: at least one letter and one digit on top of the length floor.
const PASSWORD_RULE = z.string().min(8).max(100)
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/\d/, "Password must contain at least one number");

export const authRouter = Router();

function setRefreshCookie(res: Response, token: string): void {
  const isProd = env.NODE_ENV === "production";
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure:   isProd,
    // Frontend (Vercel) and backend (Render) live on different domains in
    // production, so the cookie is cross-site — "strict"/"lax" would never
    // be sent on those requests. "none" (requires secure:true) is mandatory
    // here; "lax" is fine for local dev where both run on localhost.
    sameSite: isProd ? "none" : "lax",
    maxAge:   REFRESH_TOKEN_MS,
    path:     "/api/auth",
  });
}

const registerSchema = z.object({
  name:     z.string().min(2).max(50).trim(),
  surname:  z.string().min(2).max(50).trim(),
  email:    z.string().email().toLowerCase(),
  password: PASSWORD_RULE,
  country:  z.string().max(60).optional(),
  lang:     z.string().max(5).default("uz"),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

// ── POST /api/auth/register ────────────────────────────
authRouter.post(
  "/register",
  validateBody(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.register(req.body as z.infer<typeof registerSchema>);
      setRefreshCookie(res, result.tokens.refreshToken);
      sendSuccess(res, { user: result.user, accessToken: result.tokens.accessToken }, "Ro'yxatdan o'tish muvaffaqiyatli", 201);
    } catch (err) { next(err); }
  }
);

// ── POST /api/auth/login ───────────────────────────────
authRouter.post(
  "/login",
  validateBody(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body as z.infer<typeof loginSchema>);
      setRefreshCookie(res, result.tokens.refreshToken);
      sendSuccess(res, { user: result.user, accessToken: result.tokens.accessToken }, "Xush kelibsiz!");
    } catch (err) { next(err); }
  }
);
