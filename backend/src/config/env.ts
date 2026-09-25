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
  BREVO_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().optional(),
  FRONTEND_URL: z
    .string({ required_error: "FRONTEND_URL is required" })
    .url("FRONTEND_URL must be a valid URL"),
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
