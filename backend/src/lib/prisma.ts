import { PrismaClient, Prisma } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Neon free tier auto-pauses; retry on "can't reach" errors (P1001)
const NEON_WAKE_ERRORS = ["P1001", "P1002", "P1008", "P1017"];

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 2000
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const isNeonWake =
        err instanceof Prisma.PrismaClientKnownRequestError &&
        NEON_WAKE_ERRORS.includes(err.code);
      const isNetErr =
        err instanceof Error &&
        (err.message.includes("Can't reach database") ||
          err.message.includes("connection refused") ||
          err.message.includes("ECONNREFUSED") ||
          err.message.includes("ETIMEDOUT"));

      if ((isNeonWake || isNetErr) && attempt < retries - 1) {
        await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}
