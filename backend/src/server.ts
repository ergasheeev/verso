import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { env } from "@/config/env";
import { connectDatabase } from "@/config/database";
import { errorHandler } from "@/middleware/error-handler";
import { sendError } from "@/utils/response";

const app = express();

// Render (and most PaaS hosts) sit behind a reverse proxy — without this,
// express-rate-limit refuses to trust the X-Forwarded-For header it needs
// to identify clients, throwing ERR_ERL_UNEXPECTED_X_FORWARDED_FOR on every
// request. `1` trusts exactly one hop (the platform's own proxy).
app.set("trust proxy", 1);

// ── Security headers ─────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────
const allowedOrigins = env.FRONTEND_URL
  .split(",")
  .map((o) => o.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`[cors] blocked origin: ${origin} (allowed: ${allowedOrigins.join(", ")})`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Body parsing ─────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ── Request logging ───────────────────────────────────
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Global rate limit: 100 req / 15 min ──────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) =>
    sendError(res, "Too many requests. Please try again later.", 429),
});
app.use("/api", globalLimiter);

// ── Strict rate limit for code-sending: 5 req / 15 min ─
// The per-email cooldown in issueVerificationCode already stops one
// address being bombarded, but nothing stops a caller cycling through
// many different addresses — each one a real email sent from our quota.
// This caps it per client IP.
const mailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) =>
    sendError(res, "Juda ko'p so'rov — keyinroq urinib ko'ring.", 429),
});
app.use("/api/auth/register", mailLimiter);
app.use("/api/auth/resend-code", mailLimiter);

// ── Health check ──────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    env: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────
import { authRouter } from "@/modules/auth/auth.router";

app.use("/api/auth",      authRouter);

// ── 404 handler ───────────────────────────────────────
app.use((_req, res) => {
  sendError(res, "Route not found", 404);
});

// ── Global error handler (must be last) ──────────────
app.use(errorHandler);

// ── Bootstrap ─────────────────────────────────────────
async function bootstrap(): Promise<void> {
  await connectDatabase();

  const port = Number(env.PORT);
  app.listen(port, () => {
    console.log(`🚀  Server running on http://localhost:${port}`);
    console.log(`🌍  Environment: ${env.NODE_ENV}`);
    console.log(`🔗  Frontend:    ${env.FRONTEND_URL}`);
  });
}

bootstrap().catch((err) => {
  console.error("💀  Bootstrap failed:", err);
  process.exit(1);
});

export { app };
