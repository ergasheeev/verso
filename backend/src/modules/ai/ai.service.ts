import OpenAI from "openai";
import { env } from "@/config/env";
import type { Location } from "@prisma/client";
import { selectKnowledge } from "@/data/knowledge-base";
import { selectGlobalKnowledge, countryKnowledge } from "@/data/global-knowledge-base";
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

// Every AI feature (chat, review analysis, SmartReview insights) calls through
// this constant, so a retired Groq model takes all of them down with a 503
// (`model_not_found`). Pinned to a model confirmed against GET /openai/v1/models:
// gpt-oss-120b is the strongest available, with 131k context and solid
// Uzbek/Russian/Chinese - the assistant answers in whichever of six languages it
// is addressed in.
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

// Human-readable names the model can act on reliably — passing the raw
// locale code ("zh") alone was less consistent than naming the language.
const LANG_NAMES: Record<string, string> = {
  uz: "Uzbek",
  ru: "Russian",
  en: "English",
  zh: "Chinese",
  de: "German",
  fr: "French",
};
export interface TourData {
  days: string;
  people: string;
  /** Cities or regions inside the destination; may be empty ("you choose"). */
  regions: string[];
  budget: string;
  /** ISO 3166-1 alpha-2 of the destination. Absent means Uzbekistan, which
   *  is what every client sent before the builder went worldwide. */
  country?: string;
  /** Display name of the destination in the reader's language. */
  countryName?: string;
}
export interface ReviewForInsight { author: string; stars: number; text: string; trustScore: number; }
export interface AnalysisResult   { trustScore: number; aiTags: string[]; verified: boolean; }

function getText(response: OpenAI.Chat.Completions.ChatCompletion): string {
  return response.choices[0]?.message?.content ?? "";
}

/*
 * Is this conversation about Uzbekistan?
 * 
 * KNOWLEDGE_BASE is the catalogue of eight Uzbek locations with real prices and
 * opening hours (about 3,100 tokens, most of a typical prompt). Groq's free tier
 * allows 8,000 tokens per minute and rejects larger requests with a 413, so the
 * catalogue is sent only when the conversation can use it. An Uzbekistan question
 * still gets the full catalogue.
 */
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
  // A saved plan is built from this catalogue, so if the reader has one the
  // assistant may be asked about it at any turn.
  if (ctx.plan && ctx.plan.trim()) return true;
  // Only the recent turns: a question about Japan should not keep paying for
  // the catalogue because Samarkand came up ten messages ago.
  const recent = messages.slice(-4).map((m) => m.content).join(" ").toLowerCase();
  return UZ_TERMS.some((term) => recent.includes(term));
}

// A failed upstream call (invalid/expired API key, rate limit, network blip)
// would otherwise reach the error handler as an unknown exception and become a
// bare 500. Log the real cause here (visible in server logs regardless of
// NODE_ENV) and surface a clean, operational error instead.
async function callGroq<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("[ai.service] Groq API call failed:", err);
    // No user-facing copy here: the client has this message translated into all six
    // interface languages, and extractChatError prefers a server-supplied string over
    // the localised one.
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

// ── 1. chat ────────────────────────────────────────────
export async function chat(messages: ChatMessage[], ctx: UserContext = {}): Promise<string> {
  const hasPlan = ctx.plan && ctx.plan.trim().length > 0;
  const interfaceLang = LANG_NAMES[ctx.lang ?? ""] ?? "English";
  const useKnowledgeBase = mentionsUzbekistan(messages, ctx);
  const recentQuery = messages.slice(-3).map((m) => m.content).join(" ");
  // Same bounded selection as the Uzbekistan catalogue, over the 331-place /
  // 45-country dataset: empty for most questions and never more than a few hundred
  // tokens, so it cannot trigger the 413 described above.
  const globalHit = selectGlobalKnowledge(recentQuery);

  const system = `Sen Verso AI — Verso global sayohat platformasining sun'iy intellekt yordamchisisan. Dunyoning istalgan mamlakati va shahri bo'yicha professional sayohat maslahatchisisan — faqat O'zbekiston emas, balki 6 qit'a, 40 dan ortiq mamlakat bo'yicha tajribali.
Foydalanuvchi: ${ctx.name ?? "Mehmon"}${ctx.country ? `, ${ctx.country}` : ""}.
${hasPlan ? `Foydalanuvchi saqlagan joylar: ${ctx.plan}.` : ""}

LANGUAGE RULE (highest priority, overrides everything else in this
prompt including the language this prompt itself is written in):
Respond in ${interfaceLang} — that's the app's current interface
language — UNLESS the user's message is clearly written in a
different language, in which case respond in THAT language for this
reply instead (matching what they just typed always wins over the
interface default). Never default to Uzbek just because parts of
this instruction are in Uzbek.

GEOGRAPHIC SCOPE (equally high priority): You are a WORLDWIDE travel
assistant, not an Uzbekistan-only one. Never imply, apologize, or hedge
that you "only know Uzbekistan" or "specialize in Uzbekistan" — you
don't. For any country, city or region the user asks about, answer
confidently using your own general travel knowledge (sights, typical
costs, visa norms, best seasons, transport, etiquette), exactly as a
well-travelled professional guide would. The one exception is below.

${useKnowledgeBase ? `Quyida Verso platformasining O'ZBEKISTON bo'yicha TO'LIQ,
TEKSHIRILGAN MA'LUMOTLAR BAZASI berilgan — bu bizning eng aniq va
ishonchli manbamiz. Foydalanuvchi O'ZBEKISTON haqida (yoki shu bazadagi
aniq joy/narx/vaqt haqida) so'rasa, DOIM shu ma'lumotlardan foydalan,
o'zingdan taxmin qilma.

${selectKnowledge(recentQuery)}` : ""}

${globalHit ? `Quyida Verso'ning O'ZBEKISTONDAN TASHQARI joylar katalogidan
so'ralgan joy/mamlakatga mos yozuvlar berilgan — narx, ish vaqti va
transport shu yerdan olingan bo'lsa, aniqroq bo'ladi. Bu ro'yxat to'liq
emas (faqat 45 mamlakat, mamlakat boshiga bir nechta joy); agar
so'ralgan narsa bu yerda yo'q bo'lsa, o'z bilimingdan foydalanib javob
ber — hech qachon "bu joy haqida ma'lumotim yo'q" deb javobni rad etma.

${globalHit}` : ""}

## TUR REJA TUZISH

Foydalanuvchi tur reja yoki marshrut so'rasa — DARHOL foydali reja ber.
Hech qachon 4 ta savolni ketma-ket berib, foydalanuvchini so'roq qilma:
bu 4 marta yozishmani talab qiladi va hech qanday foyda bermaydi.

Qoida:
- Yetarli ma'lumot bor bo'lsa (kamida yo'nalish) — REJANI HOZIROQ tuz.
- Aytilmagan narsalarni oqilona TAXMIN qil (masalan: 3 kun, 2 kishi,
  o'rtacha byudjet, eng yaxshi mavsum) va rejani shu taxminlar bilan ber.
- Taxminlaringni reja BOSHIDA bitta qisqa qatorda ko'rsat, masalan:
  "Taxminlar: 3 kun · 2 kishi · o'rtacha byudjet — boshqacha bo'lsa ayting."
- Rejadan KEYIN (oldin emas) bitta qisqa qator bilan aniqlashtirishni taklif qil.
- Agar yo'nalish umuman aytilmagan bo'lsa — faqat shuni so'ra, boshqa hech narsani.

Shu tarzda foydalanuvchi birinchi javobdayoq to'liq reja oladi, keyin esa
uni o'zi uchun moslashtiradi.

Rejani MA'LUMOTLAR BAZASIDAGI HAQIQIY narx va vaqtlarni
ishlatib **markdown formatida** (quyidagi kabi, boshqacha emas) tur rejasi tuz.
EMOJI HECH QACHON ishlatma — birortasi ham, hech qanday holatda. Bu jumladan
xarita, taom, yulduz va boshqa "oddiy" emojilarni ham o'z ichiga oladi.
Ovoz professional va sokin bo'lishi kerak — faqat toza markdown (**bold**,
## sarlavhalar, - ro'yxatlar) ishlat. Bayroq-emoji va rasm chizuvchi
belgilarni (═ ║ ╔ ╚ ━) HAM HECH QACHON ishlatma — ular ko'p qurilmada
noto'g'ri yoki singan holda ko'rinadi.

**Namuna format** (bu faqat STRUKTURA namunasi — shahar va joy nomlarini
har doim foydalanuvchi so'ragan haqiqiy manzilga moslashtir, O'zbekiston
bo'lsin yoki boshqa istalgan mamlakat):

## [N]-kunlik tur rejasi — [Shahar/Mamlakat]

### 1-kun — [Shahar]

**Ertalab (09:00–13:00)**
- [Joy nomi] — qisqa tavsif — davomiylik — narx (O'zbekiston bo'lsa bazadan, aks holda taxminiy narx)

**Tushlik (13:00–14:30)**
- [Restoran/hudud] — taxminiy narx

**Tushdan keyin (15:00–18:00)**
- [Joy nomi] — davomiylik — narx

**Kechqurun (19:00–21:00)**
- Erkin sayr yoki kechki tadbir

**Tunash:** [Mehmonxona — O'zbekiston bo'lsa bazadan, aks holda tipik narx darajasi] — narx/kecha

**Kunlik jami:** ~X (mahalliy valyuta va ~$Y)

... (har kun uchun shu formatda davom et)

### Umumiy xulosa

- Kishilar: [N] | Muddat: [N] kun
- Kirish biletlari: ~$[X]
- Turar joy ([N] kecha): ~$[X]
- Ovqat ([N] kun): ~$[X]
- Transport: ~$[X]
- **Jami: ~$[X]–$[Y]**

### Maslahatlar

- [Mavsumga oid maslahat — ma'lumotlar bazasidan]
- [Kiyim/tayyorgarlik]
- [Pul/viza]
- [Tejash usuli]

BOSHQA QOIDALAR:
- Saqlangan joylarni ALBATTA rejaga qo'sh (agar bo'lsa), boshqa joylar ham qo'sh
- O'zbekiston haqida bo'lsa — FAQAT ma'lumotlar bazasidagi HAQIQIY narx va
  vaqtlarni ishlatgin. Boshqa mamlakat haqida bo'lsa — o'zingning umumiy
  bilimingdan real darajadagi (aniq, ishonarli) narx va vaqtlarni ber
- Til bo'yicha yuqoridagi LANGUAGE RULE'ga qat'iy amal qil
- Geografik qamrov bo'yicha yuqoridagi GEOGRAPHIC SCOPE qoidasiga qat'iy amal qil
- Noaniq, taxminiy, "qarang interneta" kabi javoblar berma — aniq bo'l

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

  // Only the conversational endpoint is tier-selectable. Review analysis,
  // insights and translation stay pinned to the default: those are graded
  // against one model's output and a reader never chose a tier for them.
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

  // Only the conversational endpoint is tier-selectable. Review analysis,
  // insights and translation stay pinned to the default: those are graded
  // against one model's output and a reader never chose a tier for them.
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

// ── 2. analyzeReview ───────────────────────────────────
export async function analyzeReview(text: string, stars: number): Promise<AnalysisResult> {
  const response = await callGroq(() => client.chat.completions.create({
    model: MODEL,
    max_tokens: 200,
    messages: [
      {
        role: "system",
        content: `Return ONLY valid JSON, no markdown:
{"trustScore":number,"aiTags":string[]}
trustScore: 70-100=genuine detail, 40-69=generic/short, 0-39=spam/bot
aiTags: 2-4 short lowercase topic keywords, in the same language the review is written in`,
      },
      { role: "user", content: `Review (${stars} stars): "${text}"` },
    ],
  }));

  const raw = getText(response).trim();
  try {
    const cleaned = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned) as { trustScore: number; aiTags: string[] };
    return {
      trustScore: Math.max(0, Math.min(100, Math.round(parsed.trustScore))),
      aiTags:     Array.isArray(parsed.aiTags) ? parsed.aiTags.slice(0, 4) : [],
      verified:   parsed.trustScore >= 70,
    };
  } catch {
    const len = text.trim().length;
    const trustScore = len > 120 ? 72 : len > 50 ? 55 : 28;
    return { trustScore, aiTags: [], verified: trustScore >= 70 };
  }
}

// ── 3. generateTourPlan ────────────────────────────────
/**
 * Structured itinerary from the tour builder.
 *
 * Used to be Uzbekistan-only in three ways at once: it always sent the whole
 * Uzbek catalogue as the source of truth, asked for prices "in so'm", and
 * had no language instruction — so a German reader planning Japan got an
 * Uzbek-language plan priced against Samarkand. Now the destination picks
 * the reference data (the curated Uzbek catalogue for UZ, that country's
 * slice of the global catalogue otherwise, general knowledge beyond it),
 * prices are in the destination's own currency plus USD, and the reply is
 * in the reader's interface language.
 */
export async function generateTourPlan(
  tourData: TourData,
  locations: Location[],
  lang?: string,
): Promise<string> {
  const interfaceLang = LANG_NAMES[lang ?? ""] ?? "English";
  const country = tourData.country?.toUpperCase();
  const isUzbekistan = !country || country === "UZ";
  const destination = [tourData.regions.join(", "), tourData.countryName].filter(Boolean).join(" — ");

  const list = locations
    .map((l) => `- ${l.name} (${l.city}): ${l.shortDesc ?? ""} — ~$${l.priceUSD}`)
    .join("\n");

  // Bounded either way: the full Uzbek catalogue alone is ~3,100 tokens, and
  // Groq's free tier caps a minute at 8,000 including this reply's budget.
  const reference = isUzbekistan
    ? selectKnowledge([...tourData.regions, ...locations.map((l) => l.name)].join(" "))
    : countryKnowledge(country!, tourData.regions);

  const response = await callGroq(() => client.chat.completions.create({
    model: MODEL,
    max_tokens: 3000,
    messages: [
      {
        role: "system",
        content: `You are Verso's professional itinerary planner — a worldwide travel expert.

LANGUAGE: write the entire plan in ${interfaceLang}. The reference notes below
may be in Uzbek; that never changes the language of your answer.

REFERENCE DATA: ${reference
  ? `when a place below is in the plan, use its real prices, opening hours and
transport exactly as given. For anything not covered, use accurate, realistic
figures from your own knowledge — never refuse or say you lack data.

${reference}`
  : "none for this destination — use accurate, realistic figures from your own knowledge."}

STYLE: markdown only (## / ### headings, **bold**, - lists). Never use emoji,
flag emoji, or box-drawing characters (═ ║ ╔ ╚ ━). Calm, professional voice.`,
      },
      {
        role: "user",
        content: `Build a day-by-day itinerary.
Destination: ${destination || "the most rewarding region of the country"}
Duration: ${tourData.days}
Travellers: ${tourData.people}
Budget: ${tourData.budget}
${list ? `\nMust include these saved places:\n${list}\n` : ""}${
  tourData.regions.length ? "" : "\nNo cities were specified — choose the best route for the duration yourself and say why in one line.\n"}
Use this shape for every day:

### Day N — City
**Morning (09:00–13:00):** place — time needed — price
**Lunch (13:00–14:30):** restaurant or area — dish — price
**Afternoon (15:00–18:00):** place — time needed — price
**Evening (19:00–21:00):** activity
**Stay:** hotel or area — price per night
**Day total:** ~X ${isUzbekistan ? "UZS" : "(local currency)"} (~$Y)

Translate these headings into ${interfaceLang}. Quote prices in the local
currency with a USD equivalent. Finish with a "Summary" section (entry
tickets / accommodation / food / transport / total) and a "Tips" section
(season, what to pack, money and visa, how to save).`,
      },
    ],
  }));
  return getText(response);
}

// ── 4. generateInsight ─────────────────────────────────
const NO_REVIEWS_YET: Record<string, (place: string) => string> = {
  en: (p) => `There aren't enough reviews of ${p} yet.\nBe the first to leave one!`,
  uz: (p) => `${p} haqida hali yetarli sharhlar yo'q.\nBirinchi bo'lib sharh qoldiring!`,
  ru: (p) => `О месте «${p}» пока мало отзывов.\nОставьте первый!`,
  de: (p) => `Zu ${p} gibt es noch nicht genug Bewertungen.\nSchreiben Sie die erste!`,
  fr: (p) => `Il n'y a pas encore assez d'avis sur ${p}.\nSoyez le premier à en laisser un !`,
  zh: (p) => `${p} 的评价还不够多。\n来写第一条评价吧！`,
};

export async function generateInsight(locationName: string, reviews: ReviewForInsight[], lang?: string): Promise<string> {
  if (!reviews.length) {
    // In the reader's language like the model's own answer below — this
    // branch used to answer every reader in Uzbek.
    return (NO_REVIEWS_YET[lang ?? ""] ?? NO_REVIEWS_YET.en)(locationName);
  }

  const avg = (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1);
  const summary = reviews
    .slice(0, 15)
    .map((r) => `[${r.stars}★, ishonch:${r.trustScore}%] "${r.text.slice(0, 120)}"`)
    .join("\n");
  const interfaceLang = LANG_NAMES[lang ?? ""] ?? "English";

  const response = await callGroq(() => client.chat.completions.create({
    model: MODEL,
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: `"${locationName}" joyi haqida ${reviews.length} ta sharh (o'rtacha: ${avg}★) asosida 4-5 ta insight yozing. Har birini "- " bilan boshlang (markdown ro'yxat), emoji ishlatma. Javobni albatta ${interfaceLang} tilida yoz:\n\n${summary}`,
      },
    ],
  }));
  return getText(response);
}

// ── 5. translate ────────────────────────────────────────
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
