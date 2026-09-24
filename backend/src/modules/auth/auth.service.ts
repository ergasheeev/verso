import bcrypt from "bcryptjs";
import crypto from "crypto";
import { type User, type CodePurpose } from "@prisma/client";
import { prisma, withRetry } from "@/lib/prisma";
import { generateTokens, verifyRefreshToken, type TokenPair } from "@/utils/jwt";
import { createError } from "@/middleware/error-handler";
import { sendVerificationCode, isMailConfigured } from "@/lib/mail";
import { env } from "@/config/env";

const SALT_ROUNDS = 12;

// ── Email verification ───────────────────────────────
const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;             // per issued code, then it's burned
const RESEND_COOLDOWN_MS = 60 * 1000;

function generateCode(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export async function issueVerificationCode(
  email: string,
  purpose: CodePurpose = "EMAIL_VERIFY"
): Promise<string | null> {
  const normalized = email.toLowerCase().trim();

  const recent = await withRetry(() =>
    prisma.verificationCode.findFirst({
      where: { email: normalized, purpose },
      orderBy: { createdAt: "desc" },
    })
  );
  if (recent && Date.now() - recent.createdAt.getTime() < RESEND_COOLDOWN_MS) {
    const wait = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - recent.createdAt.getTime())) / 1000);
    const err = createError(`Iltimos, ${wait} soniyadan keyin qayta urinib ko'ring`, 429);
    err.code = "CODE_COOLDOWN";
    err.retryAfter = wait;
    throw err;
  }

  const code = generateCode();
  const codeHash = await bcrypt.hash(code, SALT_ROUNDS);

  await withRetry(() =>
    prisma.verificationCode.deleteMany({ where: { expiresAt: { lt: new Date() } } })
  );
  await withRetry(() => prisma.verificationCode.deleteMany({ where: { email: normalized, purpose } }));
  await withRetry(() =>
    prisma.verificationCode.create({
      data: { email: normalized, codeHash, purpose, expiresAt: new Date(Date.now() + CODE_TTL_MS) },
    })
  );

  await sendVerificationCode(normalized, code, purpose);

  const isDevWithoutMail = env.NODE_ENV === "development" && !isMailConfigured;
  return isDevWithoutMail ? code : null;
}

async function consumeCode(email: string, code: string, purpose: CodePurpose): Promise<void> {
  const record = await withRetry(() =>
    prisma.verificationCode.findFirst({
      where: { email, purpose },
      orderBy: { createdAt: "desc" },
    })
  );
  if (!record) throw createError("Kod topilmadi — yangi kod so'rang", 400);

  if (record.expiresAt.getTime() < Date.now()) {
    await withRetry(() => prisma.verificationCode.delete({ where: { id: record.id } }));
    throw createError("Kod muddati tugagan — yangi kod so'rang", 400);
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    await withRetry(() => prisma.verificationCode.delete({ where: { id: record.id } }));
    throw createError("Juda ko'p urinish — yangi kod so'rang", 429);
  }

  const ok = await bcrypt.compare(code, record.codeHash);
  if (!ok) {
    await withRetry(() =>
      prisma.verificationCode.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      })
    );
    throw createError("Kod noto'g'ri", 400);
  }

  await withRetry(() => prisma.verificationCode.delete({ where: { id: record.id } }));
}

export async function verifyEmailCode(
  email: string,
  code: string
): Promise<{ user: SafeUser; tokens: TokenPair }> {
  const normalized = email.toLowerCase().trim();

  await consumeCode(normalized, code, "EMAIL_VERIFY");

  const user = await withRetry(() => prisma.user.findUnique({ where: { email: normalized } }));
  if (!user) throw createError("Foydalanuvchi topilmadi", 404);

  const tokens = buildTokens(user);
  const verified = await withRetry(() =>
    prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, refreshToken: tokens.refreshToken },
    })
  );

  return { user: sanitize(verified), tokens };
}

// Completes a password reset: validates the emailed code, sets the new
// password, and returns a fresh session.
export async function resetPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<{ user: SafeUser; tokens: TokenPair }> {
  const normalized = email.toLowerCase().trim();

  await consumeCode(normalized, code, "PASSWORD_RESET");

  const user = await withRetry(() => prisma.user.findUnique({ where: { email: normalized } }));
  if (!user) throw createError("Foydalanuvchi topilmadi", 404);

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  const tokens = buildTokens(user);

  const updated = await withRetry(() =>
    prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        // Overwriting refreshToken invalidates every other signed-in
        // device — if the reset happened because someone else had
        // access, leaving their session alive would defeat the point.
        refreshToken: tokens.refreshToken,
        // Receiving the code proves control of the mailbox, which is
        // exactly what verification attests to.
        emailVerified: true,
      },
    })
  );

  return { user: sanitize(updated), tokens };
}

export interface RegisterDto {
  name:     string;
  surname:  string;
  email:    string;
  password: string;
  country?: string;
  lang?:    string;
}

export interface LoginDto {
  email:    string;
  password: string;
}

type SafeUser = Omit<User, "passwordHash" | "refreshToken">;

// ── Helpers ───────────────────────────────────────────
function sanitize(user: User): SafeUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, refreshToken, ...safe } = user;
  return safe;
}

function buildTokens(user: User): TokenPair {
  return generateTokens({
    userId:    user.id,
    email:     user.email,
    isPremium: user.isPremium,
  });
}

// ── register ──────────────────────────────────────────
export async function register(dto: RegisterDto): Promise<{ email: string; devCode: string | null }> {
  const email = dto.email.toLowerCase().trim();

  const exists = await withRetry(() => prisma.user.findUnique({ where: { email } }));
  if (exists) {
    if (!exists.emailVerified) {
      const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
      await withRetry(() =>
        prisma.user.update({
          where: { id: exists.id },
          data: {
            name:    dto.name.trim(),
            surname: dto.surname.trim(),
            passwordHash,
            country: dto.country ?? "",
            lang:    dto.lang ?? "uz",
          },
        })
      );
      const devCode = await issueVerificationCode(email);
      return { email, devCode };
    }
    throw createError("Bu email allaqachon ro'yxatdan o'tgan", 409);
  }

  const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

  await withRetry(() =>
    prisma.user.create({
      data: {
        name:         dto.name.trim(),
        surname:      dto.surname.trim(),
        email,
        passwordHash,
        country:      dto.country ?? "",
        lang:         dto.lang ?? "uz",
        emailVerified: false,
      },
    })
  );

  const devCode = await issueVerificationCode(email);
  return { email, devCode };
}

// ── login ─────────────────────────────────────────────
export async function login(
  dto: LoginDto
): Promise<{ user: SafeUser; tokens: TokenPair }> {
  const user = await withRetry(() =>
    prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } })
  );
  if (!user) throw createError("Email yoki parol noto'g'ri", 401);

  if (!user.passwordHash) throw createError("Email yoki parol noto'g'ri", 401);

  const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
  if (!isMatch) throw createError("Email yoki parol noto'g'ri", 401);

  const tokens = buildTokens(user);

  await withRetry(() =>
    prisma.user.update({
      where: { id: user.id },
      data:  { refreshToken: tokens.refreshToken },
    })
  );

  return { user: sanitize(user), tokens };
}

// ── refresh ───────────────────────────────────────────
export async function refresh(
  incomingToken: string
): Promise<{ tokens: TokenPair }> {
  const payload = verifyRefreshToken(incomingToken);
  if (!payload) throw createError("Token yaroqsiz yoki muddati o'tgan", 401);

  const user = await withRetry(() =>
    prisma.user.findFirst({
      where: { id: payload.userId, refreshToken: incomingToken },
    })
  );
  if (!user) throw createError("Token topilmadi — iltimos qayta kiring", 401);

  const tokens = buildTokens(user);

  await withRetry(() =>
    prisma.user.update({
      where: { id: user.id },
      data:  { refreshToken: tokens.refreshToken },
    })
  );

  return { tokens };
}

// ── logout ────────────────────────────────────────────
export async function logout(userId: string): Promise<void> {
  await withRetry(() =>
    prisma.user.update({
      where: { id: userId },
      data:  { refreshToken: null },
    })
  );
}
