import { useState, useRef, useEffect, useMemo, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Send, Loader2, RotateCcw, Copy, Check, RefreshCw, ChevronDown,
  ThumbsUp, ThumbsDown, Landmark, Hotel, Bus, Star as StarIcon,
  Lightbulb, AlertTriangle, Square, Mic, Languages,
} from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { isAxiosError } from "axios";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { useTranslation, LOCALE_TAGS } from "@/i18n";
import { MessageContent } from "@/components/chat/MessageContent";
import { VoiceTranslator } from "@/components/chat/VoiceTranslator";
import { Mark } from "@/components/brand/Wordmark";
import { Kicker, Rule, Button } from "@/components/ui/editorial";
import { plateHue } from "@/data/countries";

/**
 * The assistant.
 *
 * A reply is set as a text column with a small gold mark in the left margin, the
 * way a letter is set, not as a bubble: replies are often long and structured
 * (day-by-day itineraries, numbered lists, prices), and a bubble is the wrong
 * container for a page of prose. Only the visitor's own turns keep a contained
 * shape, since those are short and need to be told apart at a glance when
 * scanning back.
 */

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isError?: boolean;
  reaction?: "up" | "down" | null;
}

// Date.now() alone collides: a fast double-tap on a suggestion can fire both
// handlers before React commits the isLoading state that would block the
// second, producing two messages with the same key.
function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** A cold-booting backend reads very differently to a genuine server error. */
function extractChatError(err: unknown, fallback: string, wakingUp: string): string {
  // isAxiosError checks the shape rather than assuming the thrown value looks
  // like one, so an unrelated TypeError is not misreported as "waking up".
  if (!isAxiosError<{ message?: string }>(err)) return fallback;
  if (err.code === "ECONNABORTED" || !err.response) return wakingUp;
  // 503 is the upstream-AI-down case, which the server reports as a bare
  // code. Everything else may carry a genuinely specific message (validation,
  // rate limit) worth surfacing verbatim.
  const msg = err.response.data?.message;
  if (err.response.status === 503 || !msg || msg === "AI_UNAVAILABLE") return fallback;
  return msg;
}

// 36px rather than 28: these sit in a row, so an invisible expanded hit area
// would overlap its neighbours and the wrong action would fire. Sizing the
// buttons themselves keeps each target discrete.
const ACTION_BTN =
  "flex items-center justify-center w-9 h-9 rounded-sm transition-colors duration-400 " +
  "text-subtle hover:text-accent";

// A refresh keeps the conversation: a long itinerary refined over several turns
// is the most expensive thing in the app to lose.
const HISTORY_KEY = "verso-chat-v1";
const HISTORY_LIMIT = 40;

function loadHistory(): Message[] | null {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as (Omit<Message, "timestamp"> & { timestamp: string })[];
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    // JSON has no Date type, so timestamps come back as strings and every
    // `formatTime` call would throw on them.
    return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return null;
  }
}

function saveHistory(messages: Message[]) {
  try {
    // The welcome message is regenerated per language on mount, so persisting
    // it would pin the conversation to whatever locale it was started in.
    const keep = messages.filter((m) => m.id !== "welcome").slice(-HISTORY_LIMIT);
    if (keep.length === 0) localStorage.removeItem(HISTORY_KEY);
    else localStorage.setItem(HISTORY_KEY, JSON.stringify(keep));
  } catch {
    // Quota or private mode — losing history is not worth breaking the page.
  }
}

export default function Chat() {
  const plan = useAppStore((s) => s.plan);
  const showToast = useAppStore((s) => s.showToast);
  const { t, lang } = useTranslation();
  useDocumentTitle(t("chat", "title"));

  function makeWelcomeMessage(): Message {
    return { id: "welcome", role: "assistant", content: t("chat", "welcome"), timestamp: new Date() };
  }

  // lucide icons rather than emoji: several emoji render as boxes on Windows
  // without a full colour-emoji font, while an SVG looks identical everywhere.
  const QUICK_ACTIONS = [
    { Icon: Landmark,  label: t("chat", "quick_samarqand"), text: t("chat", "quick_samarqand_prompt"), seed: "samarqand" },
    { Icon: Hotel,     label: t("chat", "quick_hotel"),     text: t("chat", "quick_hotel_prompt"),     seed: "hotel" },
    { Icon: Bus,       label: t("chat", "quick_transport"), text: t("chat", "quick_transport_prompt"), seed: "transport" },
    { Icon: StarIcon,  label: t("chat", "quick_top"),       text: t("chat", "quick_top_prompt"),       seed: "top" },
    { Icon: Lightbulb, label: t("chat", "quick_tips"),      text: t("chat", "quick_tips_prompt"),      seed: "tips" },
  ];

  const [messages, setMessages] = useState<Message[]>(() => {
    const restored = loadHistory();
    return restored ?? [makeWelcomeMessage()];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const lastUserTextRef = useRef("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const wasNearBottomRef = useRef(true);
  const abortRef = useRef<AbortController | null>(null);

  // Only follow new messages if the reader was already at the bottom; yanking the
  // view while someone is rereading an earlier reply reads as unfinished.
  useEffect(() => {
    // Not on the empty state: the opening screen is taller than a phone viewport once
    // the suggestion cards are in, so scrolling to the end on mount would land
    // mid-page with the greeting off-screen.
    if (messages.length <= 1) return;
    if (wasNearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function handleScroll() {
    const el = scrollAreaRef.current;
    if (!el) return;
    const hasOverflow = el.scrollHeight > el.clientHeight + 40;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    wasNearBottomRef.current = nearBottom;
    // Never over the empty state: there is nothing to jump back to yet.
    setShowScrollButton(hasOverflow && !nearBottom && messages.length > 1);
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function buildPlanContext(): string | undefined {
    if (!plan.length) return undefined;
    return plan.map((loc) => `${loc.name} (${loc.city})`).join(", ");
  }

  async function sendMessage(text: string, base?: Message[]) {
    if (!text.trim() || isLoading) return;
    lastUserTextRef.current = text.trim();

    const userMsg: Message = {
      id: makeId(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    wasNearBottomRef.current = true;

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // `base` lets a caller that just truncated the thread (regenerate)
      // pass the trimmed history explicitly — a state update queued in the
      // same tick is not visible through this closure, so reading `messages`
      // here would resend the very reply the caller meant to discard.
      const history = (base ?? messages)
        .filter((m) => m.id !== "welcome" && !m.isError)
        .map((m) => ({ role: m.role, content: m.content }));

      // The backend caps chat history at 10 messages (ai.router.ts), so keep
      // only the most recent turns or a long conversation 422s.
      const apiMessages = [...history, { role: "user" as const, content: text.trim() }].slice(-10);

      // A cold-started backend plus real generation time can run well past
      // the default timeout.
      const res = await apiClient.post<{ reply: string }>(
        "/ai/chat",
        // `lang` is the interface locale — the model answers in it by default, but still
        // switches to whatever language this particular message was typed in.
        {
          messages: apiMessages,
          userContext: { plan: buildPlanContext(), lang },
        },
        { timeout: 45_000, signal: controller.signal },
      );

      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "assistant", content: res.reply ?? t("chat", "error"), timestamp: new Date() },
      ]);
    } catch (err) {
      // A cancel the reader asked for is not an error worth a message.
      if (controller.signal.aborted) return;
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: extractChatError(err, t("chat", "error"), t("chat", "waking_up")),
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      abortRef.current = null;
      inputRef.current?.focus();
    }
  }

  function cancelRequest() {
    abortRef.current?.abort();
  }

  function retryLastMessage() {
    if (!lastUserTextRef.current) return;
    setMessages((prev) => prev.filter((m) => !m.isError));
    sendMessage(lastUserTextRef.current);
  }

  /**
   * Re-ask the question that produced a given reply. Drops that reply and
   * everything after it so the model re-answers from the same point rather
   * than treating its own previous attempt as context.
   */
  function regenerateFrom(assistantId: string) {
    if (isLoading) return;
    const idx = messages.findIndex((m) => m.id === assistantId);
    if (idx < 1) return;
    // Find the question that produced this reply, then cut from the question
    // itself — sendMessage re-appends it, so slicing after it would leave the
    // same prompt in the thread twice.
    let userIdx = -1;
    for (let i = idx - 1; i >= 0; i--) {
      if (messages[i].role === "user") { userIdx = i; break; }
    }
    if (userIdx === -1) return;
    const text = messages[userIdx].content;
    const trimmed = messages.slice(0, userIdx);
    setMessages(trimmed);
    sendMessage(text, trimmed);
  }

  async function copyMessage(msg: Message) {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId((id) => (id === msg.id ? null : id)), 1800);
    } catch {
      // clipboard permission denied — nothing to recover
    }
  }

  function setMessageReaction(id: string, reaction: "up" | "down") {
    let didSet = false;
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const cleared = m.reaction === reaction;
        didSet = !cleared;
        return { ...m, reaction: cleared ? null : reaction };
      }),
    );
    // Only acknowledge an actual new reaction: re-clicking the same button clears
    // it, and toasting there would spam.
    if (didSet) showToast(t("chat", "reaction_thanks"), undefined, "info");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Skipped while an IME composition is active, or Enter-to-confirm-candidate
    // would send the message mid-composition in Chinese/Japanese input.
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function resetChat() {
    setMessages([makeWelcomeMessage()]);
    setInput("");
    lastUserTextRef.current = "";
    saveHistory([]);
  }

  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  useEffect(() => {
    setMessages((prev) =>
      prev.length === 1 && prev[0].id === "welcome" ? [makeWelcomeMessage()] : prev,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString(LOCALE_TAGS[lang], { hour: "2-digit", minute: "2-digit" });

  // Keyed off real turns rather than array length: a restored conversation
  // has no welcome message, so a length check would show the opening screen
  // on top of someone's existing thread.
  const hasConversation = messages.some((m) => m.id !== "welcome");
  const showQuickActions = !hasConversation;

  return (
    // Fills <main> (MainLayout stops it scrolling on this route) instead of
    // computing `100dvh - masthead - tabbar`, which can drift by a pixel and make
    // <main> itself scrollable. Column: toolbar / messages (the only scroller) /
    // input.
    <div className="relative flex flex-col overflow-hidden w-full h-full grain-overlay">
      {/* ── Running head ───────────────────────────────── */}
      <div className="shrink-0 relative z-20 w-full border-b border-[var(--border)] bg-[var(--header-bg)] glass">
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 max-w-[880px] mx-auto">
          <div className="flex items-center gap-3 min-w-0">
            <span className="relative shrink-0">
              <Mark className="w-5 h-5 text-accent" />
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-1 w-1.5 h-1.5 rounded-full transition-colors duration-400",
                  isLoading ? "bg-gold-400 animate-pulse" : "bg-transparent",
                )}
              />
            </span>
            {/* The page's first-level heading. It sits outside the block below because that
                block is `display: none` on the narrowest phones, which would take the h1 out
                of the accessibility tree. Visually hidden, always present. */}
            <h1 className="sr-only">{t("chat", "title")}</h1>
            <div className="min-w-0 hidden min-[380px]:block">
              <p className="text-[13px] text-ink truncate">{t("chat", "title")}</p>
              {/* The status line is dropped below `sm` rather than truncated: with the model
                  switch in this row, roughly 90px is left for the title block on a phone and
                  "Onlayn · Doimo tayyor" needs about 130, so it would clip mid-phrase at 320 and
                  390. It is reassurance rather than information (the live dot on the mark
                  already carries it); the saved-places count does say something, so it keeps its
                  place. */}
              <p
                className={cn(
                  "tabular text-[11px] tracking-[0.1em] text-subtle truncate",
                  plan.length > 0 ? "" : "hidden sm:block",
                )}
              >
                {plan.length > 0
                  ? `${plan.length} ${t("chat", "places")}`
                  : t("chat", "subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* A gold-tinted, labelled pill matching "New chat" in shape, so the voice
                translator carries the same visual weight as its neighbours. It has a matching
                entry in the empty-screen quick actions for a first-time visitor who has not
                found the header. */}
            <button
              onClick={() => setVoiceOpen(true)}
              aria-label={t("voice", "title")}
              title={t("voice", "title")}
              className="tap-44 flex items-center gap-2 h-8 px-3 rounded-sm border border-[var(--gold-hairline)]
                         bg-[var(--gold-soft)] text-accent text-[11px] uppercase tracking-[0.12em]
                         hover:border-gold-400 transition-colors duration-400"
            >
              <Languages className="w-3.5 h-3.5" aria-hidden />
              <span className="hidden sm:inline">{t("voice", "title")}</span>
            </button>
            <button
              onClick={resetChat}
              aria-label={t("chat", "reset")}
              className="tap-44 flex items-center gap-2 h-8 px-3 rounded-sm border border-[var(--border)]
                         text-subtle text-[11px] uppercase tracking-[0.12em]
                         hover:border-[var(--gold-hairline)] hover:text-accent
                         transition-colors duration-400"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden />
              <span className="hidden sm:inline">{t("chat", "reset")}</span>
            </button>
          </div>
        </div>
      </div>

      <VoiceTranslator open={voiceOpen} onClose={() => setVoiceOpen(false)} />
      {/* ── The conversation ───────────────────────────── */}
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={scrollAreaRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto px-4 sm:px-6 pt-8 pb-6"
        >
          <div className="max-w-[880px] mx-auto">
            {showQuickActions && !isLoading && (
              <div className="relative pb-8 animate-fade-up">
                {/* A warm plate wash behind the opening, the same photographic language the rest
                    of the app uses instead of flat chrome. */}
                <div
                  aria-hidden
                  className="plate absolute -inset-x-4 sm:-inset-x-6 -top-8 bottom-0 opacity-[0.14] -z-10"
                  style={{
                    "--plate-h": plateHue("verso-ai"),
                    maskImage: "linear-gradient(to bottom, black, transparent)",
                    WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
                  } as React.CSSProperties}
                />
                <Kicker gold className="mb-5">Verso AI</Kicker>
                <h2 className="font-display text-display-sm text-ink max-w-[16ch] mb-4 break-words">
                  {t("chat", "empty_heading")}
                </h2>
                <Rule gold />
              </div>
            )}

            <AnimatePresence initial={false}>
              {messages
                .filter((m) => m.id !== "welcome" || !showQuickActions)
                .map((msg) =>
                  msg.role === "user" ? (
                    /* ── The visitor's turn ───────────────
                       Contained and right-aligned: these are short, and need
                       to be findable when scanning back through a long thread. */
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="flex justify-end mb-8"
                    >
                      <div className="max-w-[80%]">
                        <div className="rounded-sm border border-[var(--gold-hairline)] bg-[var(--gold-soft)] px-4 py-3">
                          <p className="text-[14px] leading-relaxed text-ink whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                        </div>
                        <p className="tabular text-[11px] text-subtle text-right mt-1.5">
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    /* ── The assistant's turn ─────────────
                       A text column with a mark in the left margin, not a
                       bubble. See the note at the top of this file. */
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="group flex gap-4 sm:gap-5 mb-10"
                    >
                      <span className="shrink-0 pt-1">
                        {msg.isError ? (
                          <AlertTriangle className="w-4 h-4 text-copper-400" aria-hidden />
                        ) : (
                          <Mark className="w-4 h-4 text-accent" />
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div
                          className={cn(
                            "text-[15px] leading-[1.7] break-words",
                            msg.isError ? "text-copper-400" : "text-ink",
                          )}
                        >
                          <MessageContent text={msg.content} />
                        </div>

                        {msg.isError && (
                          <Button
                            variant="danger"
                            size="sm"
                            className="mt-4"
                            onClick={retryLastMessage}
                          >
                            <RefreshCw className="w-3 h-3" aria-hidden />
                            {t("chat", "retry")}
                          </Button>
                        )}

                        <div className="flex items-center gap-1 mt-3 -ml-1.5">
                          <span className="tabular text-[11px] text-subtle px-1.5">
                            {formatTime(msg.timestamp)}
                          </span>
                          {!msg.isError && msg.id !== "welcome" && (
                            <>
                              <button
                                onClick={() => copyMessage(msg)}
                                className={ACTION_BTN}
                                aria-label="Copy"
                              >
                                <AnimatePresence mode="wait" initial={false}>
                                  {copiedId === msg.id ? (
                                    <motion.span
                                      key="check"
                                      initial={{ scale: 0.5, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0.5, opacity: 0 }}
                                    >
                                      <Check className="w-4 h-4 text-accent" />
                                    </motion.span>
                                  ) : (
                                    <motion.span
                                      key="copy"
                                      initial={{ scale: 0.5, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0.5, opacity: 0 }}
                                    >
                                      <Copy className="w-4 h-4" />
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </button>
                              <button
                                onClick={() => setMessageReaction(msg.id, "up")}
                                aria-label="Good reply"
                                className={cn(ACTION_BTN, msg.reaction === "up" && "text-accent")}
                              >
                                <ThumbsUp className={cn("w-4 h-4", msg.reaction === "up" && "fill-gold-400")} />
                              </button>
                              <button
                                onClick={() => setMessageReaction(msg.id, "down")}
                                aria-label="Bad reply"
                                className={cn(ACTION_BTN, msg.reaction === "down" && "text-copper-400")}
                              >
                                <ThumbsDown className={cn("w-4 h-4", msg.reaction === "down" && "fill-copper-400")} />
                              </button>
                              {/* Regenerate is available on every reply, so one that merely missed the point
                                  does not force retyping the question. */}
                              <button
                                onClick={() => regenerateFrom(msg.id)}
                                disabled={isLoading}
                                aria-label={t("chat", "retry")}
                                title={t("chat", "retry")}
                                className={cn(ACTION_BTN, "disabled:opacity-40")}
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ),
                )}

              {/* ── Openings ───────────────────────────── */}
              {showQuickActions && !isLoading && (
                <div className="animate-fade-up delay-200">
                  <Kicker className="mb-3">{t("chat", "start_with")}</Kicker>
                  <Rule />
                  <div className="grid sm:grid-cols-2 gap-3 mt-5">
                    {QUICK_ACTIONS.map((a, i) => (
                      <button
                        key={a.label}
                        onClick={() => sendMessage(a.text)}
                        className="group relative flex items-start gap-3.5 text-left p-4
                                   border border-[var(--border)] rounded-sm overflow-hidden
                                   hover:border-[var(--gold-hairline)] transition-colors duration-400
                                   animate-fade-up"
                        style={{ animationDelay: `${250 + i * 60}ms` }}
                      >
                        <span
                          aria-hidden
                          className="plate absolute inset-0 opacity-[0.1] group-hover:opacity-[0.16] transition-opacity duration-400 -z-10"
                          style={{ "--plate-h": plateHue(a.seed) } as React.CSSProperties}
                        />
                        <span className="shrink-0 w-9 h-9 rounded-sm border border-[var(--gold-hairline)]
                                          bg-[var(--gold-soft)] flex items-center justify-center">
                          <a.Icon className="w-4 h-4 text-accent" strokeWidth={1.75} aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1 pt-1">
                          <span className="block text-[14px] text-ink route-underline">{a.label}</span>
                          <span className="block text-[12px] leading-snug text-subtle mt-1 line-clamp-2">
                            {a.text}
                          </span>
                        </span>
                        <Send className="w-3.5 h-3.5 shrink-0 mt-1 text-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-400" aria-hidden />
                      </button>
                    ))}
                    {/* A sixth card, styled to stand apart from the five text prompts (gold border,
                        no plate wash) since it opens a different surface — the voice translator
                        dialog — rather than sending a message. A first-time visitor's eye is on this
                        grid, not the masthead row above it. */}
                    <button
                      onClick={() => setVoiceOpen(true)}
                      className="relative flex items-start gap-3.5 text-left p-4
                                 border border-[var(--gold-hairline)] bg-[var(--gold-soft)] rounded-sm
                                 hover:border-gold-400 transition-colors duration-400
                                 animate-fade-up"
                      style={{ animationDelay: `${250 + QUICK_ACTIONS.length * 60}ms` }}
                    >
                      <span className="shrink-0 w-9 h-9 rounded-sm border border-[var(--gold-hairline)]
                                        bg-[var(--modal)] flex items-center justify-center">
                        <Mic className="w-4 h-4 text-accent" strokeWidth={1.75} aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1 pt-1">
                        <span className="block text-[14px] text-ink route-underline">{t("voice", "title")}</span>
                        <span className="block text-[12px] leading-snug text-subtle mt-1 line-clamp-2">
                          {t("voice", "subtitle")}
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-4 sm:gap-5 mb-10"
                >
                  <Mark className="w-4 h-4 text-accent shrink-0 mt-1" />
                  <div className="flex items-center gap-1.5 pt-1.5">
                    <span className="typing-dot w-1 h-1 rounded-full bg-gold-400" />
                    <span className="typing-dot w-1 h-1 rounded-full bg-gold-400" />
                    <span className="typing-dot w-1 h-1 rounded-full bg-gold-400" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Anchored to this outer container — a sibling of the scroll area,
            not a child of the message stack — so it can only ever sit above
            the composer and never on top of mid-conversation text. */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              onClick={scrollToBottom}
              aria-label="Jump to latest"
              className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20
                         w-9 h-9 rounded-sm flex items-center justify-center
                         bg-surface border border-[var(--border)] text-subtle
                         hover:border-[var(--gold-hairline)] hover:text-accent
                         transition-colors duration-400"
            >
              <ChevronDown className="w-4 h-4" aria-hidden />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Composer ───────────────────────────────────── */}
      <div className="shrink-0 border-t border-[var(--border)] bg-[var(--header-bg)] glass px-4 sm:px-6 pt-3 pb-3 sm:pb-4">
        <div className="max-w-[880px] mx-auto">
          {/* A ruled field rather than a pill: the composer should read as a
              line you write on, and the send control should be the only lit
              thing in the bar. */}
          <div className="flex items-end gap-3 border-b border-[var(--input-border)] focus-within:border-gold-400 transition-colors duration-400 pb-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("chat", "input_placeholder")}
              aria-label={t("chat", "input_placeholder")}
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent resize-none outline-none
                         px-0 py-2 text-[16px] sm:text-[15px] text-ink placeholder:text-subtle
                         max-h-32 overflow-y-auto"
              style={{ height: "auto", minHeight: "44px" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
              }}
            />
            <button
              onClick={() => (isLoading ? cancelRequest() : sendMessage(input))}
              disabled={!isLoading && !input.trim()}
              aria-label={isLoading ? t("chat", "cancel_label") : t("chat", "send_label")}
              className={cn(
                "tap-44 shrink-0 mb-1 w-10 h-10 rounded-sm flex items-center justify-center",
                "transition-colors duration-400",
                isLoading || input.trim()
                  ? "bg-gold-400 text-[#0C0A09] hover:bg-gold-300"
                  : "border border-[var(--border)] text-subtle cursor-not-allowed",
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isLoading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative flex items-center justify-center w-4 h-4"
                  >
                    <Loader2 className="absolute inset-0 w-4 h-4 animate-spin opacity-40" />
                    <Square className="w-2 h-2 fill-current" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="send"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* 11.5px rather than 10px: it is fine print, but it is also the
              line telling people the assistant can be wrong, and 10px is
              below what is comfortably readable on a phone. */}
          <p className="text-[11.5px] leading-snug text-subtle text-center mt-3">
            <span className="hidden sm:inline">{t("chat", "hint")} · </span>
            {t("chat", "disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}
