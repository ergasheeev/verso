import bcrypt from "bcryptjs";
import { type User } from "@prisma/client";
import { prisma, withRetry } from "@/lib/prisma";
import { generateTokens, type TokenPair } from "@/utils/jwt";
import { createError } from "@/middleware/error-handler";

const SALT_ROUNDS = 12;

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
export async function register(
  dto: RegisterDto
): Promise<{ user: SafeUser; tokens: TokenPair }> {
  const email = dto.email.toLowerCase().trim();

  const exists = await withRetry(() => prisma.user.findUnique({ where: { email } }));
  if (exists) throw createError("Bu email allaqachon ro'yxatdan o'tgan", 409);

  const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

  const user = await withRetry(() =>
    prisma.user.create({
      data: {
        name:         dto.name.trim(),
        surname:      dto.surname.trim(),
        email,
        passwordHash,
        country:      dto.country ?? "",
        lang:         dto.lang ?? "uz",
      },
    })
  );

  const tokens = buildTokens(user);
  await withRetry(() =>
    prisma.user.update({
      where: { id: user.id },
      data:  { refreshToken: tokens.refreshToken },
    })
  );

  return { user: sanitize(user), tokens };
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

  const tokens = buildTokens(user);

  await withRetry(() =>
    prisma.user.update({
      where: { id: user.id },
      data:  { refreshToken: tokens.refreshToken },
    })
  );

  return { user: sanitize(user), tokens };
}
