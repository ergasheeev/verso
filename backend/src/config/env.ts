import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("5000"),
  DATABASE_URL:  z.string({ required_error: "DATABASE_URL is required" }),
  DIRECT_URL:    z.string().optional(),
  JWT_SECRET: z
    .string({ required_error: "JWT_SECRET is required" })
    .min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z
    .string({ required_error: "JWT_REFRESH_SECRET is required" })
    .min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  GROQ_API_KEY: z.string({ required_error: "GROQ_API_KEY is required" }),
  // Optional third chat tier via Google's OpenAI-compatible endpoint. Unset
  // by default — the chat works on Groq alone — so this never blocks a boot.
  GEMINI_API_KEY: z.string().optional(),
  // Gemini's free tier is metered per PROJECT, not per visitor, so every
  // reader of this app draws from one shared quota — these are the local
  // circuit breaker that keeps the app from burning through it and getting
  // 429s for everyone. Deliberately tight, since Google's own free-tier
  // ceiling for this project measures well under 20 requests/day — verify
  // the live number at aistudio.google.com/rate-limit before raising these;
  // Google changes it without warning.
  GEMINI_RPM_LIMIT: z.coerce.number().int().positive().default(5),
  GEMINI_RPD_LIMIT: z.coerce.number().int().positive().default(15),
  // SMTP for the email verification code. Optional so the server still
  // boots without it (useful locally) — when unset, mail.service.ts falls
  // back to logging the code to the console instead of sending, and says
  // so loudly at startup. Registration therefore still works end-to-end
  // in development without real credentials.
  // Preferred over SMTP when set. Many PaaS hosts (Render among them)
  // block or blackhole outbound SMTP ports, which shows up as a request
  // that hangs for minutes rather than a clean error. The HTTP API rides
  // on 443 and can't be blocked that way.
  BREVO_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  // What recipients see in the From: field. Defaults to SMTP_USER.
  MAIL_FROM: z.string().optional(),
  FRONTEND_URL: z
    .string({ required_error: "FRONTEND_URL is required" })
    .url("FRONTEND_URL must be a valid URL"),
  CLOUDINARY_URL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const formatted = result.error.issues.map(
    (issue) => `  • ${issue.path.join(".")}: ${issue.message}`
  );
  console.error("\n❌  Invalid environment variables:\n" + formatted.join("\n") + "\n");
  process.exit(1);
}

export const env: Env = result.data;
