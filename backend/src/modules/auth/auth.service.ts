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
  // crypto.randomInt, not Math.random — this is a credential. Math.random
  // is seeded predictably enough that codes could be guessed in bulk.
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

/*
 * Issues a fresh code for an email and sends it. Previous unused codes for that
 * address are deleted first, so only the newest one is ever valid.
 * 
 * Returns the plaintext code ONLY in development with no SMTP credentials (no mail
 * was sent, so the caller may show it to keep the flow testable), and null in
 * every other case. The guard below makes that safe: a production deployment can
 * never reach the branch that returns it.
 */
export async function issueVerificationCode(
  email: string,
  purpose: CodePurpose = "EMAIL_VERIFY"
): Promise<string | null> {
  const normalized = email.toLowerCase().trim();

  // Cooldown is per purpose: asking to reset a password shouldn't be
  // refused just because a verification code was sent a moment ago.
  const recent = await withRetry(() =>
    prisma.verificationCode.findFirst({
      where: { email: normalized, purpose },
      orderBy: { createdAt: "desc" },
    })
  );
  if (recent && Date.now() - recent.createdAt.getTime() < RESEND_COOLDOWN_MS) {
    const wait = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - recent.createdAt.getTime())) / 1000);
    // Tagged like EMAIL_NOT_VERIFIED so the client can tell this 429 apart
    // from the IP rate limiter's 429, which looks identical over the wire
    // but means something entirely different. This one says "a code is
    // already in your inbox" — the client should show the code screen with
    // a countdown. The rate limiter's says "you have made too many
    // requests", and the client must not pretend an account exists.
    // Reading the seconds out of the message text worked, but only while
    // every locale kept writing them as digits.
    const err = createError(`Iltimos, ${wait} soniyadan keyin qayta urinib ko'ring`, 429);
    err.code = "CODE_COOLDOWN";
    err.retryAfter = wait;
    throw err;
  }

  const code = generateCode();
  const codeHash = await bcrypt.hash(code, SALT_ROUNDS);

  // Opportunistic purge of every expired row, not just this address's, so abandoned
  // registrations cannot grow the table without bound. It costs one indexed delete
  // on a write already being made and needs no scheduler.
  await withRetry(() =>
    prisma.verificationCode.deleteMany({ where: { expiresAt: { lt: new Date() } } })
  );

  await withRetry(() => prisma.verificationCode.deleteMany({ where: { email: normalized, purpose } }));
  await withRetry(() =>
    prisma.verificationCode.create({
      data: { email: normalized, codeHash, purpose, expiresAt: new Date(Date.now() + CODE_TTL_MS) },
    })
  );

  // Deliberately NOT swallowed: if the mail fails to send, the caller must
  // know, otherwise the user sits waiting for a code that will never arrive.
  await sendVerificationCode(normalized, code, purpose);

  // Both conditions required. NODE_ENV is validated by zod as a strict enum,
  // so "development" can't be spoofed by a stray value, and a real
  // deployment sets it to "production" — the code is never returned there
  // even if someone forgets to configure SMTP.
  const isDevWithoutMail = env.NODE_ENV === "development" && !isMailConfigured;
  return isDevWithoutMail ? code : null;
}

/**
 * Validates a submitted code for one specific purpose and burns it.
 *
 * Shared by both flows so they can't drift apart — an expiry or attempt
 * rule enforced in one but not the other would be a silent hole. The
 * `purpose` filter is what stops a code emailed for one flow being
 * replayed against the other.
 *
 * Throws on every failure path; returns only when the code was valid.
 */
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

/**
 * Checks a submitted code and, on success, marks the account verified and
 * returns a normal session — verifying is the final step of registration,
 * so the user lands logged in rather than being bounced to a login form.
 */
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

/**
 * Completes a password reset: validates the emailed code, sets the new
 * password, and returns a fresh session.
 */
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
        // device. If the reset happened because someone else had access,
        // leaving their session alive would defeat the whole point.
        refreshToken: tokens.refreshToken,
        // Receiving the code proves control of the mailbox, which is
        // exactly what verification attests to — so an unverified account
        // that resets its password becomes verified rather than being
        // stuck needing a second, redundant round of confirmation.
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
// Creates the account UNVERIFIED and issues a code — it deliberately does
// not return tokens, because the session is only granted once the code is
// confirmed (see verifyEmailCode). The caller gets nothing to log in with.
export async function register(dto: RegisterDto): Promise<{ email: string; devCode: string | null }> {
  const email = dto.email.toLowerCase().trim();

  const exists = await withRetry(() => prisma.user.findUnique({ where: { email } }));
  if (exists) {
    // An account that was created but never verified is not a real
    // registration — the address might belong to someone who simply lost
    // the email. Let them start over with a fresh code instead of being
    // permanently blocked by their own abandoned attempt.
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

  // A Google-only account has no passwordHash — reject the email/password
  // attempt with the same generic message as a wrong password, rather
  // than a bcrypt.compare(x, null) crash or a message that reveals the
  // account exists and is Google-only (that's an account-enumeration leak).
  if (!user.passwordHash) throw createError("Email yoki parol noto'g'ri", 401);

  const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
  if (!isMatch) throw createError("Email yoki parol noto'g'ri", 401);

  // Credentials are correct but the address was never confirmed. Checked
  // AFTER the password so this can't be used to enumerate which addresses
  // have accounts. The 403 + code lets the frontend jump straight to the
  // code screen and resend, rather than dead-ending on an error toast.
  if (!user.emailVerified) {
    const err = createError("Email tasdiqlanmagan", 403) as Error & { code?: string };
    err.code = "EMAIL_NOT_VERIFIED";
    throw err;
  }

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
