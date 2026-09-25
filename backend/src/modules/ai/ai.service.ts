import OpenAI from "openai";
import { env } from "@/config/env";
import type { Location } from "@prisma/client";
import { KNOWLEDGE_BASE, selectKnowledge } from "@/data/knowledge-base";
import { selectGlobalKnowledge } from "@/data/global-knowledge-base";
import { createError } from "@/middleware/error-handler";
import { createRateLimiter } from "@/lib/rate-limiter";

const client = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Powers the "deep" (Verso Pro) tier — only live when a key is configured.
// Google's Gemini API speaks the OpenAI chat-completions shape at this base
// URL, so it reuses the same client class rather than a second SDK.
//
// Free-tier note for whoever tunes this next: Google's free tier logs
// prompts and outputs to improve their products (unlike the paid tier).
const geminiClient = env.GEMINI_API_KEY
  ? new OpenAI({
      apiKey: env.GEMINI_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    })
  : null;

// Gemini serves the Pro tier. gemini-3.1-pro has a free-tier quota of 0 on this
// project (429 RESOURCE_EXHAUSTED) and needs billing on the Google Cloud project;
// gemini-2.5-flash is closed to new users. gemini-3.6-flash is the model reachable
// on the free tier. With billing enabled, this is the one line to change to move
// Pro onto a stronger Gemini model.
const GEMINI_MODEL = "gemini-3.6-flash";

// Gemini's free tier is metered per project, so every Pro reader draws from one
// shared daily pool (roughly 15-20 requests/day). This limiter is the circuit
// breaker; chatCompletion() falls back to Groq once it trips.
const geminiLimiter = createRateLimiter({
  perMinute: env.GEMINI_RPM_LIMIT,
  perDay: env.GEMINI_RPD_LIMIT,
});

// Every AI feature calls through this constant, so a retired Groq model
// takes all of them down with one clear 503, not a scattered one per call site.
// gpt-oss-120b: 131k context, solid Uzbek/Russian/Chinese output.
const MODEL = "openai/gpt-oss-120b";

/**
 * The Groq tiers the chat offers, and the ONLY ones a request may select.
 *
 * An allowlist, not a pass-through: the client sends a short tier name and
 * the real Groq id is resolved here. A client that could name any model
 * could point this account's key at anything Groq hosts — including the
 * far more expensive ones — and could probe which models exist.
 *
 * Both are the same family and both carry 131k context. "deep" itself is
 * only reached as the Groq fallback now — see chatCompletion() below, which
 * routes a "deep" request to Gemini first and falls back to this Groq id
 * only if Gemini is unconfigured, rate-limited this window, or errors.
 * Checked against GET /openai/v1/models before being pinned; see the note
 * above about what happens when a pinned model is retired.
 */
export const CHAT_MODELS = {
  // "Standard" — always Groq, never routed through Gemini. Verso Pro is the
  // tier meant to draw on Gemini's scarce free quota, not every visitor.
  fast: "openai/gpt-oss-20b",
  // "Pro" 's Groq fallback — see the comment above.
  deep: "openai/gpt-oss-120b",
} as const;

export type ChatModelTier = keyof typeof CHAT_MODELS;

export function resolveChatModel(tier?: string): string {
  if (tier && tier in CHAT_MODELS) return CHAT_MODELS[tier as ChatModelTier];
  return MODEL;
}

export interface ChatMessage  { role: "user" | "assistant"; content: string; }
export interface UserContext  {
  name?: string; country?: string; plan?: string; lang?: string;
  /** "fast" | "deep"; anything else falls back to the default model. */
  model?: string;
  /** Reader is on a phone — see the LENGTH rule in the system prompt. */
  compact?: boolean;
}
export interface TourData     { days: string; people: string; regions: string[]; budget: string; }

// Human-readable names the model can act on reliably — passing the raw
// locale code ("zh") alone was less consistent than naming the language.
const LANG_NAMES: Record<string, string> = {
  uz: "Uzbek", ru: "Russian", en: "English", zh: "Chinese", de: "German", fr: "French",
};

function getText(response: OpenAI.Chat.Completions.ChatCompletion): string {
  return response.choices[0]?.message?.content ?? "";
}

// KNOWLEDGE_BASE (the Uzbek catalogue) is ~3,100 tokens, most of a typical
// prompt against Groq's 8,000 tokens/minute free-tier ceiling — so it is
// only sent when the conversation can actually use it.
const UZ_TERMS = [
  "uzbek", "o'zbek", "o‘zbek", "ozbek", "узбек", "乌兹别克",
  "samarqand", "samarkand", "самарканд",
  "buxoro", "bukhara", "бухара",
  "xiva", "khiva", "хива",
  "toshkent", "tashkent", "ташкент",
  "chimgan", "чимган", "nurota", "termiz", "термез",
  "registon", "registan", "регистан",
  "guri amir", "gur-e amir", "гур-эмир",
  "chorsu", "чорсу", "ichan", "ичан", "ark ", "арк ",
  "bibi", "биби", "shoh-i", "shah-i", "шахи",
];

function mentionsUzbekistan(messages: ChatMessage[], ctx: UserContext): boolean {
  if (ctx.plan && ctx.plan.trim()) return true;
  const recent = messages.slice(-4).map((m) => m.content).join(" ").toLowerCase();
  return UZ_TERMS.some((term) => recent.includes(term));
}

// A failed upstream call (invalid/expired API key, rate limit, network blip)
// would otherwise reach the error handler as an unknown exception and become
// a bare 500 — log the real cause and surface a clean, operational error.
async function callGroq<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("[ai.service] Groq API call failed:", err);
    throw createError("AI_UNAVAILABLE", 503);
  }
}

/**
 * Resolves a request's model tier to an actual completion.
 *
 * "deep" (Verso Pro) tries Gemini first and falls back to Groq's own
 * gpt-oss-120b — silently, on three different grounds: no Gemini key
 * configured, this window's shared rate limit already spent, or the Gemini
 * call itself failing (network blip, Google's own outage, an account-level
 * quota Google changed without notice). A Pro subscriber is paying for this
 * tier; the whole point of Gemini's free quota running out on a busy day is
 * that it must not look like their benefit broke — it quietly becomes the
 * same strong Groq model Pro always used before Gemini existed.
 *
 * "fast" (Standard) never touches Gemini — it stays on Groq unconditionally,
 * so the free tier's shared quota is spent on Pro traffic only.
 */
async function chatCompletion(
  tier: string | undefined,
  body: Omit<OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming, "model">,
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  if (tier === "deep") {
    if (geminiClient && geminiLimiter.tryAcquire()) {
      try {
        return await geminiClient.chat.completions.create({ model: GEMINI_MODEL, ...body });
      } catch (err) {
        console.error("[ai.service] Gemini call failed, falling back to Groq deep:", err);
      }
    } else {
      console.info("[ai.service] Gemini unavailable this window (no key or rate-limited) — falling back to Groq deep");
    }
    return callGroq(() => client.chat.completions.create({ model: CHAT_MODELS.deep, ...body }));
  }
  return callGroq(() => client.chat.completions.create({ model: resolveChatModel(tier), ...body }));
}

// ── chat ────────────────────────────────────────────────
export async function chat(messages: ChatMessage[], ctx: UserContext = {}): Promise<string> {
  const hasPlan = ctx.plan && ctx.plan.trim().length > 0;
  const interfaceLang = LANG_NAMES[ctx.lang ?? ""] ?? "English";
  const useKnowledgeBase = mentionsUzbekistan(messages, ctx);
  const recentQuery = messages.slice(-3).map((m) => m.content).join(" ");
  const globalHit = selectGlobalKnowledge(recentQuery);

  const system = `Sen Verso AI — Verso global sayohat platformasining sun'iy intellekt yordamchisisan. Dunyoning istalgan mamlakati va shahri bo'yicha professional sayohat maslahatchisisan.
Foydalanuvchi: ${ctx.name ?? "Mehmon"}${ctx.country ? `, ${ctx.country}` : ""}.
${hasPlan ? `Foydalanuvchi saqlagan joylar: ${ctx.plan}.` : ""}

Javobni ${interfaceLang} tilida ber, agar foydalanuvchi boshqa tilda yozgan bo'lsa — o'sha tilda javob ber.

${useKnowledgeBase ? `Quyida Verso platformasining O'ZBEKISTON bo'yicha TO'LIQ,
TEKSHIRILGAN MA'LUMOTLAR BAZASI berilgan. Foydalanuvchi O'ZBEKISTON haqida
so'rasa, DOIM shu ma'lumotlardan foydalan, o'zingdan taxmin qilma.

${selectKnowledge(recentQuery)}` : ""}

${globalHit ? `Quyida Verso'ning O'ZBEKISTONDAN TASHQARI joylar katalogidan
so'ralgan joy/mamlakatga mos yozuvlar berilgan. Bu ro'yxat to'liq emas;
agar so'ralgan narsa bu yerda yo'q bo'lsa, o'z bilimingdan foydalanib javob
ber — hech qachon "bu joy haqida ma'lumotim yo'q" deb javobni rad etma.

${globalHit}` : ""}

Noaniq, taxminiy javob berma — aniq bo'l. Emoji ishlatma.

LENGTH AND SHAPE (applies to every reply except a full tour plan):
${ctx.compact ? `The reader is on a PHONE. A 390px screen fits about 40
characters a line, so 150 words is a screen and a half of scrolling for
one answer — which is what this rule exists to prevent.
- HARD LIMIT: 90 words. Count them. Going over is a failure, not a
  thoroughness bonus
- Lead with the answer in the first sentence. No preamble, no restating
  the question, no "great question"
- NEVER use a markdown table. Three columns at 390px is unreadable.
  Use at most 3 short bullets instead, or plain sentences
- At most 2 short paragraphs
- No headings — the answer is too short to need them
- If the honest answer needs more room, give the 90-word version and end
  with one line offering to go deeper` : `The reader is on a wide screen.
- Simple questions: 100–150 words. Markdown optional
- Tables are fine when the data really is tabular (3+ rows being compared)
- Lead with the answer; never open with a restatement of the question`}`;

  // Only the conversational endpoint is tier-selectable. Translation stays
  // pinned to the default: it is graded against one model's output and a
  // reader never chose a tier for it.
  // The phone rule goes in its own system turn AFTER the conversation, not
  // inside the main prompt.
  //
  // It was at the end of the ~120-line system message first, and measurement
  // said the fast tier simply did not apply it: same questions with and
  // without `compact` came back 171 vs 169 words, both with markdown tables.
  // A small model weights the end of the context far more heavily than a
  // clause buried behind a knowledge base, so the constraint is repeated
  // here, last, where it is the freshest thing in the window.
  const compactRule = ctx.compact
    ? [{
        role: "system" as const,
        content:
          "REMINDER, overrides anything above: the reader is on a phone. " +
          "Answer in 90 words or fewer. No markdown tables. No headings. " +
          "At most 3 short bullets. Lead with the answer. If more detail " +
          "would help, end with one short line offering it.",
      }]
    : [];

  // Only the conversational endpoint is tier-selectable. Translation stays
  // pinned to the default: it is graded against one model's output and a
  // reader never chose a tier for it.
  const response = await chatCompletion(ctx.model, {
    // Not lowered for the phone. gpt-oss is a reasoning model whose reasoning tokens
    // come out of this same budget: at max_tokens 700 the visible answer was truncated
    // (finish_reason "length"); 1200 and 1800 finish cleanly. Answer length is
    // controlled by the prompt, not the token budget.
    max_tokens: 1800,
    messages: [
      { role: "system", content: system },
      ...messages.slice(-14),
      ...compactRule,
    ],
  });
  return getText(response);
}

// ── generateTourPlan ────────────────────────────────────
export async function generateTourPlan(tourData: TourData, locations: Location[]): Promise<string> {
  const list = locations
    .map((l) => `• ${l.name} (${l.city}): ${l.shortDesc ?? ""} — ~$${l.priceUSD}`)
    .join("\n");

  const response = await callGroq(() => client.chat.completions.create({
    model: MODEL,
    max_tokens: 3000,
    messages: [
      {
        role: "system",
        content: `Sen Verso platformasining professional tur rejasi generatorisan. Quyidagi ma'lumotlar bazasidagi HAQIQIY narx va vaqtlarni ishlat:\n${KNOWLEDGE_BASE}`,
      },
      {
        role: "user",
        content: `Quyidagi parametrlar asosida PROFESSIONAL tur rejasi tuz:
Davomiylik: ${tourData.days} kun
Kishilar: ${tourData.people}
Viloyatlar: ${tourData.regions.join(", ")}
Byudjet: ${tourData.budget}

Borilishi kerak bo'lgan joylar:
${list || "Barcha mashhur joylar (ma'lumotlar bazasidan tanlang)"}

Markdown formatida yoz. EMOJI HECH QACHON ishlatma, bayroq-emoji va
═ ║ ╔ ╚ ━ kabi chizuvchi belgilarni ham ishlatma — ovoz professional
va sokin bo'lishi kerak:

### N-kun — Shahar
**Ertalab (09:00–13:00):** joy — vaqt — narx so'mda/$da
**Tushlik (13:00–14:30):** restoran — taom — narx
**Tushdan keyin (15:00–18:00):** joy — vaqt — narx
**Kechqurun (19:00–21:00):** faoliyat
**Tunash:** mehmonxona — narx/kecha
**Kunlik jami:** ~X so'm (~$Y)

Oxirida "### Umumiy xulosa" (kirish biletlari / turar joy / ovqat / transport / jami) va "### Maslahatlar" bo'limlari.`,
      },
    ],
  }));
  return getText(response);
}


// ── translate ───────────────────────────────────────────
// Backs the voice translator: someone speaks in one language, this returns
// the other. Deliberately a separate call from `chat` rather than the same
// endpoint with a "please translate" instruction stitched onto the
// conversational system prompt above — that prompt is 100+ lines of
// itinerary-building rules the model has no reason to load for a
// single-sentence translation, and it measurably slows the response on a
// feature where latency is the whole experience (spoken → heard).
export async function translate(text: string, from: string, to: string): Promise<string> {
  const fromName = LANG_NAMES[from] ?? from;
  const toName = LANG_NAMES[to] ?? to;

  const response = await callGroq(() => client.chat.completions.create({
    model: MODEL,
    max_tokens: 400,
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: `You are a professional interpreter. Translate the user's message from ${fromName} to ${toName}.
Output ONLY the translation — no quotes, no notes, no "here is the translation", nothing else.
Preserve the register and tone (casual stays casual, formal stays formal).
If the text is already in ${toName}, output it unchanged.`,
      },
      { role: "user", content: text },
    ],
  }));
  return getText(response).trim();
}
