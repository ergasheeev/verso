import { Router, type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import * as authService from "./auth.service";
import { prisma } from "@/lib/prisma";
import { authenticate, type JwtPayload } from "@/middleware/auth.middleware";
import { validateBody } from "@/middleware/validate";
import { sendSuccess, sendError } from "@/utils/response";
import { REFRESH_TOKEN_MS } from "@/utils/jwt";
import { env } from "@/config/env";

// Password rule: at least one letter and one digit on top of the length floor.
const PASSWORD_RULE = z.string().min(8).max(100)
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/\d/, "Password must contain at least one number");

function decodeExpiredToken(token: string): JwtPayload | null {
  try {
    // ignoreExpiration: still verifies the signature, just tolerates an
    // expired `exp` claim — safe because we only use this to look up whose
    // session to clear, never to authorize an action.
    return jwt.verify(token, env.JWT_SECRET, { ignoreExpiration: true }) as JwtPayload;
  } catch {
    return null;
  }
}

export const authRouter = Router();

function setRefreshCookie(res: Response, token: string): void {
  const isProd = env.NODE_ENV === "production";
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure:   isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge:   REFRESH_TOKEN_MS,
    path:     "/api/auth",
  });
}

function clearRefreshCookie(res: Response): void {
  const isProd = env.NODE_ENV === "production";
  res.clearCookie("refreshToken", {
    path: "/api/auth",
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
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

// ── POST /api/auth/refresh ─────────────────────────────
authRouter.post(
  "/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token: string | undefined = req.cookies?.refreshToken;
      if (!token) { sendError(res, "Refresh token topilmadi", 401); return; }
      const result = await authService.refresh(token);
      setRefreshCookie(res, result.tokens.refreshToken);
      sendSuccess(res, { accessToken: result.tokens.accessToken });
    } catch (err) { next(err); }
  }
);

// ── DELETE /api/auth/logout ─────────────────────────────
// Logout must succeed even if the access token already expired — otherwise
// the refresh-token cookie and DB session are never cleared and the
// "logged out" user can still mint new access tokens until it naturally expires.
authRouter.delete(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auth = req.headers.authorization;
      const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
      const payload = token ? decodeExpiredToken(token) : null;

      if (payload?.userId) {
        await authService.logout(payload.userId);
      }
      clearRefreshCookie(res);
      sendSuccess(res, null, "Chiqib ketdingiz");
    } catch (err) { next(err); }
  }
);

// ── GET /api/auth/me ───────────────────────────────────
authRouter.get(
  "/me",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
      if (!user) { sendError(res, "Foydalanuvchi topilmadi", 404); return; }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, refreshToken, ...safe } = user;
      sendSuccess(res, safe);
    } catch (err) { next(err); }
  }
);
