import { useEffect, useState } from "react";
import { COUNTRIES } from "@/data/countries";

/**
 * Exchange rates, quoted as units per 1 USD.
 *
 * The converter used to know six currencies and one direction — everything
 * into Uzbek so'm — which is a tool for exactly one of the 51 countries in the
 * atlas. It now converts between any two currencies the atlas uses.
 *
 * The table below is an indicative fallback so the tool works offline and on
 * first paint; useRates() swaps in live rates when the public endpoint
 * answers. The UI says which of the two it is showing — a traveller about to
 * hand over cash deserves to know whether the number is today's.
 */
export const INDICATIVE_USD_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92, GBP: 0.78, CHF: 0.88, SEK: 10.4, NOK: 10.6, ISK: 137,
  CZK: 23, HUF: 365, PLN: 3.95,
  GEL: 2.7, AMD: 390, AZN: 1.7, TRY: 41, RUB: 90,
  UZS: 12800, KZT: 510, KGS: 87.5,
  AED: 3.67, JOD: 0.709, EGP: 49, MAD: 9.6,
  INR: 85, LKR: 300, CNY: 7.2, JPY: 150, KRW: 1380,
  THB: 34, VND: 25500, IDR: 16300, MYR: 4.4, SGD: 1.32,
  KES: 129, TZS: 2600, ZAR: 18.2,
  MXN: 18.8, PEN: 3.6, ARS: 1200, CLP: 940, BRL: 5.5, COP: 4100,
  AUD: 1.53, NZD: 1.68,
};

/** The currencies a Verso reader can actually need: the atlas's own, plus
 *  the handful travellers commonly carry. Sorted by code. */
export const ATLAS_CURRENCIES: string[] = Array.from(
  new Set(["USD", "EUR", "GBP", "RUB", "CNY", ...COUNTRIES.map((c) => c.currency)]),
)
  .filter((code) => code in INDICATIVE_USD_RATES)
  .sort();

export interface RatesState {
  rates: Record<string, number>;
  /** ISO date of the live quote, or null while showing the fallback table. */
  updated: string | null;
}

const CACHE_KEY = "verso.fx.v1";
const CACHE_MS = 12 * 60 * 60 * 1000;

function readCache(): RatesState | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RatesState & { at: number };
    return Date.now() - parsed.at < CACHE_MS ? { rates: parsed.rates, updated: parsed.updated } : null;
  } catch {
    return null;
  }
}

/**
 * Live rates from open.er-api.com (free, keyless, CORS-enabled), cached for
 * twelve hours. Any failure — offline, blocked, a changed response shape —
 * leaves the indicative table in place rather than breaking the converter.
 */
export function useRates(): RatesState {
  const [state, setState] = useState<RatesState>(
    () => readCache() ?? { rates: INDICATIVE_USD_RATES, updated: null },
  );

  useEffect(() => {
    if (state.updated) return;
    const ctrl = new AbortController();
    fetch("https://open.er-api.com/v6/latest/USD", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: { result?: string; rates?: Record<string, number>; time_last_update_utc?: string }) => {
        if (data.result !== "success" || !data.rates) return;
        // Only keep codes the fallback table knows, so the picker's list
        // never changes shape under the reader mid-conversion.
        const rates: Record<string, number> = { ...INDICATIVE_USD_RATES };
        for (const code of Object.keys(rates)) {
          const live = data.rates[code];
          if (typeof live === "number" && live > 0) rates[code] = live;
        }
        const when = data.time_last_update_utc ? new Date(data.time_last_update_utc) : new Date();
        const next = { rates, updated: when.toISOString() };
        setState(next);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ ...next, at: Date.now() }));
        } catch { /* storage full or blocked: live rates still apply this visit */ }
      })
      .catch(() => { /* keep the indicative table */ });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}

/** Converts `amount` of `from` into `to` through USD. */
export function convert(amount: number, from: string, to: string, rates: Record<string, number>): number {
  const f = rates[from];
  const t = rates[to];
  if (!f || !t) return 0;
  return (amount / f) * t;
}

/**
 * Rough USD equivalent of a so'm price, for the Uzbekistan catalogue's
 * hotels, guides and dishes. Those are priced in UZS because that is what
 * the reader pays at the desk, but "1 200 000" means nothing to someone who
 * has never held a so'm — the USD figure beside it is the one they can judge.
 */
export function approxUsdFromUzs(uzs: number): string {
  const usd = uzs / INDICATIVE_USD_RATES.UZS;
  return `≈ $${usd >= 100 ? Math.round(usd).toLocaleString("en-US") : usd.toFixed(usd >= 10 ? 0 : 1)}`;
}

/** Locale-aware amount with its code, e.g. "1 234,50 EUR" in fr. Zero-decimal
 *  currencies (JPY, KRW, UZS…) get no decimals. */
export function formatMoney(amount: number, code: string, localeTag: string): string {
  try {
    return new Intl.NumberFormat(localeTag, {
      style: "currency",
      currency: code,
      currencyDisplay: "code",
      maximumFractionDigits: amount >= 1000 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${Math.round(amount).toLocaleString(localeTag)} ${code}`;
  }
}
