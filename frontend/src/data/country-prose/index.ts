import { useEffect, useState } from "react";
import type { Lang } from "@/i18n";
import type { Country } from "../countries";
import type { CountryProse } from "./types";

export type { CountryProse } from "./types";

/**
 * Translated country prose, loaded on demand.
 *
 * Only the country hub renders any of this, and only ever in one language,
 * so shipping all five tables in the entry chunk would have cost every
 * visitor roughly 350 KB to read at most one of them — the same trap
 * src/i18n/index.ts documents for the UI dictionaries.
 *
 * English is absent by design: `Country` already holds the English prose,
 * and a country the dataset does not cover falls back to it automatically.
 */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: Record<string, CountryProse> }>>> = {
  ru: () => import("./ru"),
  uz: () => import("./uz"),
  zh: () => import("./zh"),
  de: () => import("./de"),
  fr: () => import("./fr"),
};

const loaded: Partial<Record<Lang, Record<string, CountryProse>>> = {};
const inFlight: Partial<Record<Lang, Promise<void>>> = {};

function load(lang: Lang): Promise<void> {
  const loader = LOADERS[lang];
  if (!loader || loaded[lang]) return Promise.resolve();
  if (inFlight[lang]) return inFlight[lang]!;
  const p = loader()
    .then((m) => { loaded[lang] = m.default; })
    // A failed chunk must not blank the page: the English prose on Country
    // is already a complete, correct fallback.
    .catch(() => { loaded[lang] = {}; })
    .finally(() => { delete inFlight[lang]; });
  inFlight[lang] = p;
  return p;
}

/**
 * Resolved prose for one country, falling back field by field to the
 * English text the dataset never replaced.
 *
 * Takes `undefined` on purpose: the country hub resolves its country from a
 * URL slug that may not match anything, and a hook cannot sit behind that
 * early return without breaking the rules of hooks.
 */
export function useCountryProse(c: Country | undefined, lang: Lang) {
  const [, force] = useState(0);

  useEffect(() => {
    if (lang === "en" || loaded[lang]) return;
    let alive = true;
    load(lang).then(() => { if (alive) force((n) => n + 1); });
    return () => { alive = false; };
  }, [lang]);

  const p: CountryProse = (lang === "en" || !c ? undefined : loaded[lang]?.[c.code]) ?? {};
  return {
    summary: p.summary ?? c?.summary ?? "",
    tagline: p.tagline ?? c?.tagline ?? "",
    bestSeason: p.bestSeason ?? c?.bestSeason ?? "",
    visaNote: p.visaNote ?? c?.visaNote ?? "",
    topCities: p.topCities ?? c?.topCities,
    cuisine: p.cuisine ?? c?.cuisine,
  };
}
