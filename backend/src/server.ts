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

// ── Strict rate limit for AI: 20 req / min ───────────
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) =>
    sendError(res, "AI request limit reached. Please wait a moment.", 429),
});
app.use("/api/ai", aiLimiter);

// ── Strict rate limit for code-sending: 5 req / 15 min ─
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
app.use("/api/auth/forgot-password", mailLimiter);

// ── Health check ──────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    env: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────
import { authRouter }     from "@/modules/auth/auth.router";
import { locationRouter } from "@/modules/locations/location.router";
import { reviewRouter }   from "@/modules/reviews/review.router";
import { aiRouter }       from "@/modules/ai/ai.router";

app.use("/api/auth",      authRouter);
app.use("/api/locations", locationRouter);
app.use("/api/reviews",   reviewRouter);
app.use("/api/ai",        aiRouter);

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
