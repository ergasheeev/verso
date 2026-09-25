import { useEffect, useState } from "react";
import { LOCALE_TAGS } from "@/i18n";
import type { Lang } from "@/i18n";

/**
 * The browser's speech-synthesis voices, and the right one for a language.
 *
 * `speechSynthesis.getVoices()` is empty on first call in Chrome — the list
 * arrives asynchronously and announces itself with a `voiceschanged` event.
 * Measured on this machine: 0 voices immediately after load, 19 once the
 * event fires. Any code that calls getVoices() once, at speak() time,
 * therefore gets nothing on the first utterance after a cold load and lets
 * the engine fall back to the system default — which is a voice in the
 * wrong language reading the translation.
 *
 * It is also not true that every language has a voice. Same machine, same
 * browser: ru, en, zh, de and fr each have one, and uz-UZ has none at all.
 * Setting `utterance.lang = "uz-UZ"` with no Uzbek voice installed does not
 * fail — it reads Uzbek text aloud in an English voice. Callers need to be
 * able to ask whether a language can be spoken *before* offering to speak
 * it, which is what `voiceFor` returning null is for.
 */
export function useSpeechVoices(): SpeechSynthesisVoice[] {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const read = () => setVoices(window.speechSynthesis.getVoices());
    read();
    window.speechSynthesis.addEventListener("voiceschanged", read);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", read);
  }, []);

  return voices;
}

/**
 * Best voice for a language, or null when the browser has none.
 *
 * Exact locale tag first (zh-CN over zh-TW: they are not interchangeable to
 * a listener), then any voice for the same base language, then nothing. A
 * local voice is preferred over a remote one where both exist — remote
 * voices need a round trip and go silent offline, which on a translator
 * used abroad is the case that matters.
 */
export function voiceFor(voices: SpeechSynthesisVoice[], lang: Lang): SpeechSynthesisVoice | null {
  const tag = LOCALE_TAGS[lang].toLowerCase();
  const base = tag.split("-")[0];

  const rank = (v: SpeechSynthesisVoice) => {
    const vl = v.lang.toLowerCase().replace("_", "-");
    if (vl === tag) return v.localService ? 0 : 1;
    if (vl.split("-")[0] === base) return v.localService ? 2 : 3;
    return 99;
  };

  const best = voices
    .map((v) => ({ v, r: rank(v) }))
    .filter((x) => x.r < 99)
    .sort((a, b) => a.r - b.r)[0];

  return best ? best.v : null;
}
