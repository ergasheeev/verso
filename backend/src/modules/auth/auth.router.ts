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
// It matches what the client's passwordStrength() meter nudges toward, and is
// enforced at both registration and reset.
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
    // Frontend (Vercel) and backend (Render) live on different domains in
    // production, so the cookie is cross-site — "strict"/"lax" would never
    // be sent on those requests. "none" (requires secure:true) is mandatory
    // here; "lax" is fine for local dev where both run on localhost.
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

const verifySchema = z.object({
  email: z.string().email(),
  // Exactly 6 digits — reject malformed input before it costs a bcrypt
  // compare and an attempts increment against the user's real code.
  code:  z.string().regex(/^\d{6}$/, "Kod 6 xonali bo'lishi kerak"),
});

const resendSchema = z.object({
  email: z.string().email(),
});

const forgotSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z.object({
  email:       z.string().email(),
  code:        z.string().regex(/^\d{6}$/, "Kod 6 xonali bo'lishi kerak"),
  // Same rule as registration — a reset must not become a way to set a
  // weaker password than signup would have allowed.
  newPassword: PASSWORD_RULE,
});

// ── POST /api/auth/register ────────────────────────────
// Returns NO session — the account is created unverified and a code is
// emailed. The client then calls /verify-email, which is what actually
// issues tokens.
authRouter.post(
  "/register",
  validateBody(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.register(req.body as z.infer<typeof registerSchema>);
      // devCode is non-null only in development with no SMTP configured
      // (see issueVerificationCode) — the key is simply absent otherwise,
      // so nothing leaks in production.
      sendSuccess(
        res,
        { email: result.email, verificationRequired: true, ...(result.devCode && { devCode: result.devCode }) },
        "Tasdiqlash kodi yuborildi",
        201
      );
    } catch (err) { next(err); }
  }
);

// ── POST /api/auth/verify-email ────────────────────────
authRouter.post(
  "/verify-email",
  validateBody(verifySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, code } = req.body as z.infer<typeof verifySchema>;
      const result = await authService.verifyEmailCode(email, code);
      setRefreshCookie(res, result.tokens.refreshToken);
      sendSuccess(res, { user: result.user, accessToken: result.tokens.accessToken }, "Xush kelibsiz!");
    } catch (err) { next(err); }
  }
);

// ── POST /api/auth/resend-code ─────────────────────────
authRouter.post(
  "/resend-code",
  validateBody(resendSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body as z.infer<typeof resendSchema>;
      const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      // Always answer the same way regardless of whether the account exists
      // or is already verified — a differing response here would turn this
      // endpoint into a free "is this address registered?" oracle.
      let devCode: string | null = null;
      if (user && !user.emailVerified) {
        devCode = await authService.issueVerificationCode(email);
      }
      sendSuccess(res, devCode ? { devCode } : null, "Tasdiqlash kodi yuborildi");
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

// ── POST /api/auth/forgot-password ─────────────────────
authRouter.post(
  "/forgot-password",
  validateBody(forgotSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body as z.infer<typeof forgotSchema>;
      const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

      let devCode: string | null = null;
      // A password-less account (legacy Google sign-in) has nothing to reset, so it
      // is skipped — but the response below stays identical either way, since
      // revealing "no account here" would let anyone probe which addresses are
      // registered.
      if (user?.passwordHash) {
        devCode = await authService.issueVerificationCode(email, "PASSWORD_RESET");
      }
      sendSuccess(res, devCode ? { devCode } : null, "Agar bunday akkaunt mavjud bo'lsa, kod yuborildi");
    } catch (err) { next(err); }
  }
);

// ── POST /api/auth/reset-password ──────────────────────
authRouter.post(
  "/reset-password",
  validateBody(resetSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, code, newPassword } = req.body as z.infer<typeof resetSchema>;
      const result = await authService.resetPassword(email, code, newPassword);
      setRefreshCookie(res, result.tokens.refreshToken);
      sendSuccess(res, { user: result.user, accessToken: result.tokens.accessToken }, "Parol yangilandi");
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
      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        include: {
          plan: { include: { location: true }, orderBy: { createdAt: "desc" } },
        },
      });
      if (!user) { sendError(res, "Foydalanuvchi topilmadi", 404); return; }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, refreshToken, ...safe } = user;
      sendSuccess(res, safe);
    } catch (err) { next(err); }
  }
);
