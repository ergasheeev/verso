import { useSyncExternalStore } from "react";
import { useAppStore } from "@/store";
import EN from "./locales/en";
import type { Lang, TranslationSchema } from "./translations";

export type { Lang, TranslationSchema } from "./translations";
export { LOCALE_TAGS } from "./translations";

// The language options, defined once: Profile, AuthForms and Landing all read
// them, so a language added to the app is added here.
export const LANGUAGE_OPTIONS: { code: Lang; label: string }[] = [
  { code: "uz", label: "O'zbek" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
];

/**
 * Lazily-loaded locale dictionaries.
 *
 * English is the one dictionary bundled eagerly: it is the store's default
 * language, and it doubles as the synchronous fallback below, so `t()` never has
 * to return a raw key while another locale is in flight. Every other locale
 * arrives as its own ~4 KB gzipped chunk, so a visitor reading in Uzbek never
 * downloads the other five.
 */
const LOADERS: Record<Lang, () => Promise<{ default: TranslationSchema }>> = {
  en: () => Promise.resolve({ default: EN }),
  uz: () => import("./locales/uz"),
  ru: () => import("./locales/ru"),
  zh: () => import("./locales/zh"),
  de: () => import("./locales/de"),
  fr: () => import("./locales/fr"),
};

const loaded: Partial<Record<Lang, TranslationSchema>> = { en: EN };
const inFlight: Partial<Record<Lang, Promise<void>>> = {};

/**
 * The dictionary most recently rendered with.
 *
 * Switching to a locale that is not resident yet holds the previous dictionary
 * rather than falling back to English for the ~100ms the chunk takes to arrive,
 * so the switch reads as instant-or-nothing: the page stays in the language it
 * was in until the new one can replace it wholesale, with no flash through a
 * third language.
 */
let lastGood: TranslationSchema = EN;

// A plain subscription set rather than another zustand slice: this is
// module-local state that only useTranslation cares about, and routing it
// through the app store would re-render every store consumer whenever a
// dictionary finished loading.
const listeners = new Set<() => void>();
let version = 0;

function emit() {
  version += 1;
  listeners.forEach((l) => l());
}

/**
 * Fetches a locale if it isn't already resident. Safe to call repeatedly
 * and concurrently — the in-flight promise is shared, so a language
 * toggled twice in quick succession still only fetches once.
 *
 * A failed chunk fetch (offline, a deploy that rotated hashes mid-session)
 * resolves rather than rejects: `t()` falls back to English, which is a
 * usable app, where an unhandled rejection here would not be.
 */
export function loadLocale(lang: Lang): Promise<void> {
  if (loaded[lang]) return Promise.resolve();
  const existing = inFlight[lang];
  if (existing) return existing;

  const p = LOADERS[lang]()
    .then((mod) => {
      loaded[lang] = mod.default;
      emit();
    })
    .catch(() => {
      /* stay on the English fallback */
    })
    .finally(() => {
      delete inFlight[lang];
    });

  inFlight[lang] = p;
  return p;
}

/**
 * The language the app will start in, read straight from the persisted
 * zustand blob. main.tsx uses this to await the right dictionary BEFORE
 * the first render, so a Russian-speaking returning visitor never sees a
 * frame of English before their locale arrives.
 */
export function initialLang(): Lang {
  try {
    const raw = localStorage.getItem("trova-v1");
    if (!raw) return "en";
    const parsed = JSON.parse(raw) as { state?: { lang?: Lang } };
    const lang = parsed?.state?.lang;
    return lang && lang in LOADERS ? lang : "en";
  } catch {
    return "en";
  }
}

// Start fetching the moment the language changes, from wherever it was changed —
// the Profile page, the language switcher, the command palette, or `login()`
// adopting the language stored on a user's account. Doing it here rather than at
// each call site means a new language switcher cannot forget to trigger the load,
// and keeps `store` free of any dependency on the i18n module (which imports the
// store itself).
useAppStore.subscribe((state, prev) => {
  if (state.lang !== prev.lang) void loadLocale(state.lang);
});

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useTranslation() {
  const lang = useAppStore((s) => s.lang);

  // Re-render this component when a dictionary lands. Without it, a
  // language switched to a not-yet-loaded locale would render English and
  // then never update, because nothing in React's tree changed.
  useSyncExternalStore(subscribe, () => version);

  const dict = loaded[lang];
  if (!dict) void loadLocale(lang);
  // Not `dict ?? EN`: see `lastGood` above — falling back to English here
  // flashed the whole interface through a third language mid-switch.
  const active = dict ?? lastGood;
  if (dict) lastGood = dict;

  /**
   * `vars` fills `{name}`-style placeholders. Pages like the country hub
   * need sentences with the country or currency inside them, and splitting
   * those into fragments concatenated in JSX produces word order that is
   * wrong in most of these languages — the placeholder has to move, which
   * only the translator of each string can decide.
   *
   * An unmatched placeholder is left verbatim rather than blanked, so a
   * missing variable shows up as `{name}` in review instead of silently
   * producing a sentence with a hole in it.
   */
  function t(
    section: keyof TranslationSchema,
    key: string,
    vars?: Record<string, string | number>,
  ): string {
    const sec = active[section] as Record<string, string> | undefined;
    // English is the last resort for a key a translator hasn't filled in
    // yet — showing the raw key ("nav.saved") to a user is never right.
    const raw = sec?.[key] ?? (EN[section] as Record<string, string>)?.[key] ?? key;
    if (!vars) return raw;
    return raw.replace(/\{(\w+)\}/g, (m, name: string) =>
      name in vars ? String(vars[name]) : m,
    );
  }

  return { t, lang };
}
