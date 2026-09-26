import type { Lang } from "@/i18n";
import type { GlobalPlace } from "@/data/global-places";
import { GLOBAL_PLACES_EN } from "@/data/global-places.en";

/**
 * The global catalogue's prose, in the reader's language where we have it.
 *
 * The dataset authored these 331 places in Uzbek only, so every reader —
 * English, German, Chinese — was shown Uzbek descriptions for Italy or
 * Japan. There is now an English edition (global-places.en.ts): Uzbek
 * readers keep the original, everyone else gets English, which is the
 * closest shared language until per-locale editions exist. `translated`
 * tells the UI whether a note about the fallback is needed.
 */
export interface LocalizedPlace {
  name: string;
  city: string;
  description: string;
  price: string;
  hours: string;
  transport: string;
  /** True when the text is in the reader's own language. */
  translated: boolean;
}

export function localizePlace(p: GlobalPlace, lang: Lang): LocalizedPlace {
  const base = {
    name: p.name,
    city: p.city,
    description: p.description,
    price: p.price,
    hours: p.hours,
    transport: p.transport,
  };
  if (lang === "uz") return { ...base, translated: true };
  const en = GLOBAL_PLACES_EN[p.id];
  if (!en) return { ...base, translated: false };
  return {
    ...base,
    description: en.description,
    price: en.price ?? p.price,
    hours: en.hours ?? p.hours,
    transport: en.transport ?? p.transport,
    translated: lang === "en",
  };
}
