import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  X, Mic, Square, Volume2, ArrowLeftRight, Loader2, AlertCircle,
  Copy, Check, Keyboard, CornerDownLeft, Trash2, Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { useTranslation, LANGUAGE_OPTIONS, LOCALE_TAGS } from "@/i18n";
import type { Lang } from "@/i18n";
import { useSpeechVoices, voiceFor } from "@/hooks/useSpeechVoices";
import { Kicker } from "@/components/ui/editorial";

/**
 * Speak in one language, hear it back in another.
 *
 * Built on the Web Speech API (SpeechRecognition for the microphone,
 * SpeechSynthesis for reading the result aloud), so there is no audio upload or
 * server-side speech pipeline — the browser does both ends of the audio work, and
 * the backend's only job is translating the text in between via POST
 * /ai/translate.
 *
 * Two things shape the design:
 *
 * 1. Recognition and synthesis do not cover the same languages, and neither
 *    covers all six of this app's. Some browsers have no uz-UZ voice at all, and
 *    no browser recognises spoken Uzbek. A translator that silently reads Uzbek
 *    aloud in an English voice, or reports "translation failed" when the real
 *    answer is "this browser doesn't speak that", is worse than one that says
 *    so. Every language is therefore checked for a voice before anything is
 *    offered, and typing is a first-class input rather than a consolation prize
 *    for unsupported browsers.
 *
 * 2. It is used by two people passing one phone, so there are two microphones,
 *    one per language, and whichever is tapped decides the direction of that
 *    exchange.
 */

// Not in TS's default DOM lib — only a minimal ambient shape for what this
// component actually reads, rather than pulling in a full @types package
// for an API this thin.
interface SpeechRecognitionResultLike {
  0: { transcript: string };
  isFinal: boolean;
}
interface SpeechRecognitionEventLike extends Event {
  results: ArrayLike<SpeechRecognitionResultLike>;
  resultIndex: number;
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: (() => void) | null;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: Event & { error?: string }) => void) | null;
  onend: (() => void) | null;
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

type Phase = "idle" | "listening" | "translating" | "error";

interface Exchange {
  id: number;
  from: Lang;
  to: Lang;
  source: string;
  target: string;
}

const labelOf = (code: Lang) => LANGUAGE_OPTIONS.find((l) => l.code === code)?.label ?? code;

/**
 * A short, ready-made phrasebook.
 *
 * The mic and the keyboard both assume the traveller already knows what
 * they want to say — true for most of a conversation, false for the very
 * first thing said to a stranger. These are the handful of lines that come
 * up on nearly every trip regardless of destination: a greeting, a price,
 * a bathroom, an admission of not understanding. Tapping one translates
 * and speaks it immediately, with no typing and no microphone permission
 * needed — the fastest path through the most common moment this feature
 * exists for.
 */
const PHRASE_KEYS = [
  "phrase_hello", "phrase_thanks", "phrase_price", "phrase_bathroom",
  "phrase_help", "phrase_taxi", "phrase_no_understand", "phrase_english",
] as const;

export function VoiceTranslator({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang } = useTranslation();
  const [fromLang, setFromLang] = useState<Lang>(lang);
  const [toLang, setToLang] = useState<Lang>(lang === "en" ? "ru" : "en");
  const [phase, setPhase] = useState<Phase>("idle");
  /** Which language the current utterance is being spoken IN. */
  const [sourceLang, setSourceLang] = useState<Lang>(lang);
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [typing, setTyping] = useState(false);
  const [typed, setTyped] = useState("");
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [history, setHistory] = useState<Exchange[]>([]);
  // Persisted across exchanges deliberately: someone who wants a phrase
  // read slowly usually wants the next one slow too, especially mid
  // conversation with someone who is themselves speaking slowly back.
  const [slow, setSlow] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const nextId = useRef(1);
  // The recognition callbacks are registered once per start(), so they read the
  // pair through a ref rather than closing over whatever it was at that moment;
  // otherwise changing a picker mid-utterance would translate into the previous
  // language.
  const pairRef = useRef({ from: fromLang, to: toLang });
  pairRef.current = { from: fromLang, to: toLang };

  const voices = useSpeechVoices();
  const recognitionSupported = useMemo(() => getSpeechRecognitionCtor() !== null, []);
  const targetLang: Lang = sourceLang === fromLang ? toLang : fromLang;
  const targetVoice = voiceFor(voices, targetLang);

  /* ── Speech out ─────────────────────────────────────── */

  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback((text: string, voiceLang: Lang, rate?: number) => {
    if (!("speechSynthesis" in window) || !text.trim()) return;
    const voice = voiceFor(voices, voiceLang);
    // No voice for this language: say nothing rather than read the text in
    // whatever the system default is. The caller surfaces `no_voice`.
    if (!voice) return;

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = voice;
    utter.lang = voice.lang || LOCALE_TAGS[voiceLang];
    // Explicit rate wins; otherwise follow the slow toggle. 0.7 rather than
    // the more common 0.5: at 0.5 a synthesised voice stretches into
    // something closer to a different sound than the same word said
    // carefully, which defeats the point of asking for it slower.
    utter.rate = rate ?? (slow ? 0.7 : 1);
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  }, [voices, slow]);

  /* ── Lifecycle ──────────────────────────────────────── */

  // The two pickers must never land on the same language: a translator that
  // translates a language into itself is a bug someone hits the moment they open
  // it.
  useEffect(() => {
    if (toLang === fromLang) {
      const next = LANGUAGE_OPTIONS.find((l) => l.code !== fromLang);
      if (next) setToLang(next.code);
    }
  }, [fromLang, toLang]);

  // Keep the active direction pointing at a language that is still in the pair, so
  // the mic never records in a language neither select is showing.
  useEffect(() => {
    setSourceLang((s) => (s === fromLang || s === toLang ? s : fromLang));
  }, [fromLang, toLang]);

  // Closing mid-listen must stop the microphone AND the speech: hiding the sheet
  // while a translation is still being read aloud would let the voice carry on over
  // whatever the user opens next.
  useEffect(() => {
    if (!open) {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
      stopSpeaking();
      setPhase("idle");
      setTranscript("");
      setTranslation("");
      setErrorMsg("");
      setTyping(false);
      setTyped("");
      setHistory([]);
    }
  }, [open, stopSpeaking]);

  useEffect(() => () => {
    recognitionRef.current?.abort();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  /* ── Translate ──────────────────────────────────────── */

  const runTranslation = useCallback(async (text: string, from: Lang, to: Lang) => {
    const clean = text.trim();
    if (!clean) return;
    setPhase("translating");
    setErrorMsg("");
    try {
      const res = await apiClient.post<{ translation: string }>("/ai/translate", {
        text: clean, from, to,
      });
      setTranslation(res.translation);
      setPhase("idle");
      setHistory((h) => [
        ...h,
        { id: nextId.current++, from, to, source: clean, target: res.translation },
      ]);
      speak(res.translation, to);
    } catch {
      setErrorMsg(t("voice", "error"));
      setPhase("error");
    }
  }, [t, speak]);

  /* ── Speech in ──────────────────────────────────────── */

  const startListening = useCallback((spokenIn: Lang) => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setErrorMsg(t("voice", "unsupported"));
      setPhase("error");
      setTyping(true);
      return;
    }

    recognitionRef.current?.abort();
    stopSpeaking();
    setSourceLang(spokenIn);
    setTranscript("");
    setTranslation("");
    setErrorMsg("");

    const rec = new Ctor();
    rec.lang = LOCALE_TAGS[spokenIn];
    rec.continuous = false;
    rec.interimResults = true;

    let got = false;

    rec.onstart = () => setPhase("listening");

    rec.onresult = (ev) => {
      let finalText = "";
      let interim = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const r = ev.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      if (finalText) {
        got = true;
        setTranscript(finalText);
        const { from, to } = pairRef.current;
        runTranslation(finalText, spokenIn, spokenIn === from ? to : from);
      } else {
        setTranscript(interim);
      }
    };

    // Each failure gets its own message rather than a generic "translation failed"
    // (nothing has been translated yet at this point): a denied microphone, an
    // unsupported language and a dropped connection each need something different
    // from the reader.
    rec.onerror = (ev) => {
      const err = (ev as Event & { error?: string }).error;
      if (err === "aborted") return;
      const msg =
        err === "not-allowed" || err === "service-not-allowed" ? t("voice", "mic_denied")
        : err === "language-not-supported" || err === "bad-grammar"
          ? t("voice", "lang_unsupported", { lang: labelOf(spokenIn) })
        : err === "no-speech" ? t("voice", "no_speech")
        : err === "audio-capture" ? t("voice", "mic_busy")
        : err === "network" ? t("voice", "network_error")
        : t("voice", "error");
      setErrorMsg(msg);
      setPhase("error");
      if (err === "language-not-supported" || err === "bad-grammar") setTyping(true);
    };

    // Reads the setter's own previous value rather than a captured `phase`:
    // this callback is registered once per start(), so a closed-over phase
    // would still read whatever it was at that moment.
    rec.onend = () => {
      if (!got) setPhase((p) => (p === "listening" ? "idle" : p));
      recognitionRef.current = null;
    };

    recognitionRef.current = rec;
    // Not setPhase("listening") here: that happens in onstart, once the browser has
    // actually opened the microphone. Setting it optimistically would show
    // "Listening…" while the permission prompt is still up, so the user would speak
    // into a microphone that is not recording yet.
    try {
      rec.start();
    } catch {
      setErrorMsg(t("voice", "error"));
      setPhase("error");
    }
  }, [t, runTranslation, stopSpeaking]);

  // A phrasebook tap sets the direction the same way the mic does — the
  // interface language is what the traveller speaks, the other picker is
  // who they are talking to — then runs the same translate+speak path the
  // typed box uses.
  function runPhrase(text: string) {
    recognitionRef.current?.abort();
    setTranscript(text);
    setSourceLang(fromLang);
    runTranslation(text, fromLang, toLang);
  }

  function stopListening() {
    // stop(), not abort(): stop lets the engine finalise what it already
    // heard and deliver it through onresult, where abort throws it away.
    recognitionRef.current?.stop();
  }

  function swapLanguages() {
    recognitionRef.current?.abort();
    stopSpeaking();
    setFromLang(toLang);
    setToLang(fromLang);
    setSourceLang(toLang);
    setTranscript("");
    setTranslation("");
    setErrorMsg("");
    setPhase("idle");
  }

  async function copyTranslation() {
    try {
      await navigator.clipboard.writeText(translation);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* Clipboard is permission-gated and refuses outside a secure context;
         a failed copy is not worth an error banner over the translation. */
    }
  }

  const busy = phase === "translating";
  const currentText = transcript || typed;

  /* ── Mic button, one per language ───────────────────── */

  // A function that returns elements, not a component declared in the body: a
  // nested component is a new type on every render, so React would unmount and
  // remount its whole subtree each time, restarting the listening ripple and
  // dropping keyboard focus mid-press. Inlined elements reconcile by position
  // instead.
  function micButton(code: Lang) {
    const active = phase === "listening" && sourceLang === code;
    return (
      <button
        onClick={() => (active ? stopListening() : startListening(code))}
        disabled={busy}
        aria-label={t("voice", "speak_in", { lang: labelOf(code) })}
        aria-pressed={active}
        className={cn(
          "relative flex-1 flex flex-col items-center gap-2.5 py-4 rounded-sm border transition-colors duration-400",
          active
            ? "border-copper-500/60 bg-copper-500/10"
            : "border-[var(--border)] hover:border-[var(--gold-hairline)]",
          busy && "opacity-50 pointer-events-none",
        )}
      >
        <span
          className={cn(
            "relative w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-400",
            active ? "bg-copper-500 text-[#0C0A09]" : "bg-gold-400 text-[#0C0A09]",
          )}
        >
          {active && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full border-2 border-copper-400"
              animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          {busy && sourceLang === code ? (
            <Loader2 className="w-6 h-6 animate-spin" aria-hidden />
          ) : active ? (
            <Square className="w-5 h-5 fill-current" aria-hidden />
          ) : (
            <Mic className="w-6 h-6" aria-hidden />
          )}
        </span>
        <span className="kicker text-[11px] sm:text-[10px]">{labelOf(code)}</span>
      </button>
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xl"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center outline-none">
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ opacity: 0, y: 40, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
                  className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-sm border border-[var(--modal-border)]
                             bg-[var(--modal)] shadow-[var(--shadow-modal)] p-5
                             pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:m-4
                             max-h-[88dvh] overflow-y-auto"
                >
                  <div className="sm:hidden w-9 h-1 rounded-full bg-[var(--border)] mx-auto mb-4" />

                  <div className="flex items-center justify-between mb-1">
                    <Dialog.Title className="font-display text-[20px] leading-tight text-ink">
                      {t("voice", "title")}
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        className="tap-44 flex items-center justify-center text-subtle hover:text-ink transition-colors duration-400"
                        aria-label="Close"
                      >
                        <X className="w-4 h-4" aria-hidden />
                      </button>
                    </Dialog.Close>
                  </div>
                  <Dialog.Description className="text-[13px] text-subtle mb-6">
                    {t("voice", "subtitle")}
                  </Dialog.Description>

                  {/* ── Language pair ─────────────────────── */}
                  <div className="flex items-center gap-2 mb-5">
                    <select
                      value={fromLang}
                      onChange={(e) => setFromLang(e.target.value as Lang)}
                      aria-label={t("voice", "from_label")}
                      className="flex-1 h-11 sm:h-10 px-3 rounded-sm border border-[var(--input-border)] bg-transparent
                                 text-[13px] text-ink outline-none focus:border-gold-400 transition-colors duration-400"
                    >
                      {LANGUAGE_OPTIONS.map((l) => (
                        <option key={l.code} value={l.code} className="bg-elevated">{l.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={swapLanguages}
                      aria-label={t("voice", "swap")}
                      className="tap-44 flex items-center justify-center w-9 h-9 rounded-sm shrink-0
                                 text-subtle hover:text-accent transition-colors duration-400"
                    >
                      <ArrowLeftRight className="w-4 h-4" aria-hidden />
                    </button>
                    <select
                      value={toLang}
                      onChange={(e) => setToLang(e.target.value as Lang)}
                      aria-label={t("voice", "to_label")}
                      className="flex-1 h-11 sm:h-10 px-3 rounded-sm border border-[var(--input-border)] bg-transparent
                                 text-[13px] text-ink outline-none focus:border-gold-400 transition-colors duration-400"
                    >
                      {LANGUAGE_OPTIONS.filter((l) => l.code !== fromLang).map((l) => (
                        <option key={l.code} value={l.code} className="bg-elevated">{l.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* ── Two microphones, one per side ─────── */}
                  {recognitionSupported && !typing && (
                    <>
                      <div className="flex items-stretch gap-2.5">
                        {micButton(fromLang)}
                        {micButton(toLang)}
                      </div>
                      <p className="kicker mt-3 text-center">
                        {phase === "listening" ? t("voice", "listening")
                          : busy ? t("voice", "translating")
                          : t("voice", "tap_to_speak")}
                      </p>
                    </>
                  )}

                  {/* ── Typing, always available ──────────── */}
                  {(typing || !recognitionSupported) && (
                    <div className="space-y-2.5">
                      <label className="sr-only" htmlFor="voice-typed">
                        {t("voice", "placeholder")}
                      </label>
                      <textarea
                        id="voice-typed"
                        value={typed}
                        onChange={(e) => setTyped(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            runTranslation(typed, sourceLang, targetLang);
                          }
                        }}
                        rows={3}
                        placeholder={t("voice", "placeholder")}
                        className="w-full px-3 py-2.5 rounded-sm border border-[var(--input-border)] bg-transparent
                                   text-[14px] text-ink placeholder:text-subtle resize-y outline-none
                                   focus:border-gold-400 transition-colors duration-400"
                      />
                      <button
                        onClick={() => runTranslation(typed, sourceLang, targetLang)}
                        disabled={busy || !typed.trim()}
                        className="w-full h-10 rounded-sm bg-gold-400 text-[#0C0A09] text-[12px] uppercase
                                   tracking-[0.12em] disabled:opacity-40 disabled:pointer-events-none
                                   hover:bg-gold-300 transition-colors duration-400
                                   flex items-center justify-center gap-2"
                      >
                        {busy
                          ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                          : <CornerDownLeft className="w-3.5 h-3.5" aria-hidden />}
                        {t("voice", "retranslate")}
                      </button>
                    </div>
                  )}

                  {recognitionSupported && (
                    <button
                      onClick={() => { setTyping((v) => !v); setErrorMsg(""); }}
                      className="tap-44 mt-3 mx-auto flex items-center gap-1.5 text-[11px] uppercase
                                 tracking-[0.12em] text-subtle hover:text-accent transition-colors duration-400"
                    >
                      {typing
                        ? <Mic className="w-3.5 h-3.5" aria-hidden />
                        : <Keyboard className="w-3.5 h-3.5" aria-hidden />}
                      {typing ? t("voice", "tap_to_speak") : t("voice", "type_instead")}
                    </button>
                  )}

                  {/* ── Phrasebook ─────────────────────────── */}
                  {/* Hidden once a result is on screen — it is a fast start,
                      not a permanent fixture competing with the answer for
                      space. busy is included in the guard so a second tap
                      cannot queue a translation behind one still running. */}
                  {!currentText && !translation && !errorMsg && (
                    <div className="mt-5">
                      <Kicker className="mb-2.5">{t("voice", "phrasebook")}</Kicker>
                      <div className="flex flex-wrap gap-1.5">
                        {PHRASE_KEYS.map((key) => (
                          <button
                            key={key}
                            onClick={() => runPhrase(t("voice", key))}
                            disabled={busy}
                            className="tap-44 px-2.5 py-1.5 rounded-sm border border-[var(--border)]
                                       text-[12px] text-subtle hover:text-ink hover:border-[var(--gold-hairline)]
                                       transition-colors duration-400 disabled:opacity-40 disabled:pointer-events-none"
                          >
                            {t("voice", key)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Result ─────────────────────────────── */}
                  <div aria-live="polite" aria-atomic="false">
                    {(currentText || translation || errorMsg) && (
                      <div className="mt-5 space-y-4">
                        {currentText && !typing && (
                          <div className="hairline-b pb-3">
                            <Kicker className="mb-1.5">{labelOf(sourceLang)}</Kicker>
                            <p className="text-[14px] text-subtle leading-relaxed">{currentText}</p>
                          </div>
                        )}

                        {translation && (
                          <div>
                            <div className="flex items-center justify-between gap-3 mb-1.5">
                              <Kicker gold>{labelOf(targetLang)}</Kicker>
                              <div className="flex items-center gap-1">
                                {targetVoice && (
                                  <>
                                    {/* Toggles the rate for every replay from here on — see the
                                        comment on the slow state for why it persists rather than
                                        resetting per utterance. Placed before play, not after: a
                                        reader deciding "I want this slower" sets that first, then
                                        presses play, the same order they would say it out loud. */}
                                    <button
                                      onClick={() => setSlow((v) => !v)}
                                      aria-pressed={slow}
                                      aria-label={t("voice", "slow")}
                                      title={t("voice", "slow")}
                                      className={cn(
                                        "tap-44 flex items-center justify-center transition-colors duration-400",
                                        slow ? "text-accent" : "text-subtle hover:text-accent",
                                      )}
                                    >
                                      <Gauge className="w-3.5 h-3.5" aria-hidden />
                                    </button>
                                    <button
                                      onClick={() => (speaking ? stopSpeaking() : speak(translation, targetLang))}
                                      aria-label={speaking ? t("voice", "stop") : t("voice", "play")}
                                      className="tap-44 flex items-center justify-center text-subtle hover:text-accent transition-colors duration-400"
                                    >
                                      {speaking
                                        ? <Square className="w-3.5 h-3.5 fill-current" aria-hidden />
                                        : <Volume2 className="w-4 h-4" aria-hidden />}
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={copyTranslation}
                                  aria-label={copied ? t("voice", "copied") : t("voice", "copy")}
                                  className="tap-44 flex items-center justify-center text-subtle hover:text-accent transition-colors duration-400"
                                >
                                  {copied
                                    ? <Check className="w-4 h-4 text-accent" aria-hidden />
                                    : <Copy className="w-3.5 h-3.5" aria-hidden />}
                                </button>
                              </div>
                            </div>
                            <p className="font-display text-[19px] leading-snug text-ink">{translation}</p>
                            {!targetVoice && (
                              <p className="mt-2 text-[11px] text-subtle">
                                {t("voice", "no_voice", { lang: labelOf(targetLang) })}
                              </p>
                            )}
                          </div>
                        )}

                        {errorMsg && (
                          <p
                            role="alert"
                            className="flex items-start gap-2 text-[12px] text-copper-400 border border-copper-500/35 rounded-sm px-3 py-2.5"
                          >
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden />
                            {errorMsg}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ── Session history ────────────────────── */}
                  {history.length > 1 && (
                    <div className="mt-7">
                      <div className="flex items-center justify-between mb-2">
                        <Kicker>{t("voice", "history")}</Kicker>
                        <button
                          onClick={() => setHistory([])}
                          aria-label={t("voice", "clear")}
                          className="tap-44 flex items-center justify-center text-subtle hover:text-accent transition-colors duration-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden />
                        </button>
                      </div>
                      <ul className="space-y-3">
                        {history.slice(0, -1).reverse().map((x) => (
                          <li key={x.id} className="hairline-t pt-3">
                            <p className="text-[12px] text-subtle leading-relaxed">{x.source}</p>
                            <div className="flex items-start justify-between gap-2 mt-1">
                              <p className="text-[13px] text-ink leading-relaxed">{x.target}</p>
                              {voiceFor(voices, x.to) && (
                                <button
                                  onClick={() => speak(x.target, x.to)}
                                  aria-label={t("voice", "play")}
                                  className="tap-44 flex items-center justify-center shrink-0 text-subtle hover:text-accent transition-colors duration-400"
                                >
                                  <Volume2 className="w-3.5 h-3.5" aria-hidden />
                                </button>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
