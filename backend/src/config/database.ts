import { prisma } from "@/lib/prisma";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function connectDatabase(): Promise<void> {
  // Serverless Postgres (Neon) suspends its compute after idling and needs
  // a few seconds to wake back up — the very first connection attempt after
  // a cold start can fail with P1001 even though the DB is perfectly
  // healthy. Retry a few times with backoff before giving up for real.
  const MAX_ATTEMPTS = 5;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await prisma.$connect();
      console.log("✅  PostgreSQL (Neon) connected via Prisma");
      process.on("SIGINT",  () => gracefulShutdown("SIGINT"));
      process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
      return;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      if (attempt === MAX_ATTEMPTS) {
        console.error(`❌  Database connection failed after ${MAX_ATTEMPTS} attempts:`, msg);
        process.exit(1);
      }
      console.warn(`⏳  DB connect attempt ${attempt}/${MAX_ATTEMPTS} failed (${msg}) — retrying in ${attempt * 2}s...`);
      await sleep(attempt * 2000);
    }
  }
}

async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`\n🔔  ${signal} received — closing Prisma connection...`);
  await prisma.$disconnect();
  console.log("✅  Prisma disconnected.");
  process.exit(0);
}
