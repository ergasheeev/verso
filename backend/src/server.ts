import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { env } from "@/config/env";
import { errorHandler } from "@/middleware/error-handler";
import { sendError } from "@/utils/response";

const app = express();

// ── Security headers ─────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────
// FRONTEND_URL accepts a comma-separated list: the production origin plus Vercel
// preview deployments and any custom domain. Browsers compare Origin
// byte-for-byte, so each entry is trimmed and stripped of a trailing slash.
const allowedOrigins = env.FRONTEND_URL
  .split(",")
  .map((o) => o.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header at all = same-origin, curl, or a server-to-server
      // call. Those aren't subject to CORS, so don't reject them.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Log the rejection: a silent CORS failure surfaces to the user as a
      // generic network error with nothing in the server logs to explain it.
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

// ── Health check ──────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    env: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── 404 handler ───────────────────────────────────────
app.use((_req, res) => {
  sendError(res, "Route not found", 404);
});

// ── Global error handler (must be last) ──────────────
app.use(errorHandler);

// ── Bootstrap ─────────────────────────────────────────
async function bootstrap(): Promise<void> {
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
