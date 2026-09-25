import OpenAI from "openai";
import { env } from "@/config/env";
import { KNOWLEDGE_BASE, selectKnowledge } from "@/data/knowledge-base";
import { selectGlobalKnowledge } from "@/data/global-knowledge-base";
import { createError } from "@/middleware/error-handler";

const client = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Every AI feature calls through this constant, so a retired Groq model
// takes all of them down with one clear 503, not a scattered one per call site.
// gpt-oss-120b: 131k context, solid Uzbek/Russian/Chinese output.
const MODEL = "openai/gpt-oss-120b";

/**
 * The Groq tiers the chat offers, and the ONLY ones a request may select.
 * An allowlist, not a pass-through — a client that could name any model
 * could point this account's key at anything Groq hosts.
 */
export const CHAT_MODELS = {
  fast: "openai/gpt-oss-20b",
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
}

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

async function chatCompletion(
  tier: string | undefined,
  body: Omit<OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming, "model">,
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
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

Noaniq, taxminiy javob berma — aniq bo'l. Emoji ishlatma.`;

  const response = await chatCompletion(ctx.model, {
    max_tokens: 1800,
    messages: [
      { role: "system", content: system },
      ...messages.slice(-14),
    ],
  });
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
