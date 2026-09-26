import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Columns3 } from "lucide-react";
import type { Country } from "@/data/countries";
import { priceMark } from "@/data/countries";
import { Flag } from "@/components/shared/Flag";
import { LocalTime } from "@/components/country/LocalTime";
import { Kicker, Rule, Button } from "@/components/ui/editorial";
import { Portal } from "@/components/ui/Portal";
import { ScrollRow } from "@/components/ui/ScrollRow";
import { useTranslation } from "@/i18n";
import { countryName, capitalName } from "@/data/countries.i18n";
import { cn } from "@/lib/utils";

/**
 * Country comparison.
 *
 * The question an atlas is actually asked — "which of these three?" — and
 * the one the index could not answer, because deciding meant opening three
 * dossiers in three tabs and remembering the numbers.
 *
 * Three is the cap. Four columns of prose stop being readable on a laptop
 * and the rows here carry sentences (visa terms, seasons), not just figures.
 */

export const COMPARE_MAX = 3;

/** The docked bar that appears once anything is selected. */
export function CompareTray({
  picked, onRemove, onClear, onOpen,
}: {
  picked: Country[];
  onRemove: (code: string) => void;
  onClear: () => void;
  onOpen: () => void;
}) {
  const { t, lang } = useTranslation();

  return (
    <Portal>
    <AnimatePresence>
      {picked.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          // Clears the mobile tab bar, which is 58px plus the safe area.
          className="fixed left-0 right-0 z-40 px-4 pointer-events-none"
          style={{ bottom: "calc(var(--tabbar-h) + 12px)" }}
        >
          <div
            className="pointer-events-auto mx-auto w-full max-w-[680px] flex items-center gap-3
                       rounded-sm border border-[var(--gold-hairline)] bg-elevated
                       shadow-[var(--shadow-modal)] px-3 py-2.5"
          >
            <ul className="flex items-center gap-1.5 min-w-0 flex-1">
              {picked.map((c) => (
                <li key={c.code}>
                  <button
                    onClick={() => onRemove(c.code)}
                    aria-label={`${t("country", "compare_remove")}: ${countryName(c, lang)}`}
                    className="group relative flex items-center gap-2 rounded-sm border border-[var(--border)]
                               pl-1.5 pr-2 py-1 hover:border-[var(--gold-hairline)]
                               transition-colors duration-300"
                  >
                    <Flag code={c.code} />
                    <span className="hidden sm:inline text-[12.5px] text-ink max-w-[10ch] truncate">
                      {countryName(c, lang)}
                    </span>
                    <X className="w-3 h-3 text-subtle group-hover:text-accent transition-colors duration-300" aria-hidden />
                  </button>
                </li>
              ))}
              {/* Empty slots, so the cap is visible before it is hit. */}
              {Array.from({ length: COMPARE_MAX - picked.length }).map((_, i) => (
                <li
                  key={`slot-${i}`}
                  aria-hidden
                  className="w-[30px] h-[26px] rounded-sm border border-dashed border-[var(--border)]"
                />
              ))}
            </ul>

            <button
              onClick={onClear}
              className="tap-44 shrink-0 text-[11px] uppercase tracking-[0.1em] text-subtle
                         hover:text-accent transition-colors duration-300 px-1"
            >
              {t("country", "compare_clear")}
            </button>
            <Button size="sm" onClick={onOpen} className="shrink-0">
              <Columns3 className="w-3.5 h-3.5" aria-hidden />
              {t("country", "compare_cta")}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </Portal>
  );
}

/** One row of the comparison grid. */
function Row({
  label, children, first,
}: { label: string; children: React.ReactNode; first?: boolean }) {
  return (
    <div className={cn("grid grid-cols-subgrid col-span-full", !first && "border-t border-[var(--border)]")}>
      <div className="py-4 pr-4">
        <Kicker>{label}</Kicker>
      </div>
      {children}
    </div>
  );
}

function Cell({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div className={cn("py-4 pr-4 text-[13px] leading-relaxed", accent ? "text-accent" : "text-ink")}>
      {children}
    </div>
  );
}

/** The full-screen comparison. */
export function ComparePanel({
  picked, onClose, continentLabel,
}: {
  picked: Country[];
  onClose: () => void;
  continentLabel: (c: Country) => string;
}) {
  const { t, lang } = useTranslation();

  // Escape closes, and the page behind must not scroll while this is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <Portal>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xl overflow-y-auto"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t("country", "compare_title")}
    >
      <motion.div
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } }}
        exit={{ y: 12, opacity: 0, transition: { duration: 0.18 } }}
        onMouseDown={(e) => e.stopPropagation()}
        className="mx-auto my-6 sm:my-10 w-[calc(100%-1.5rem)] max-w-[1080px] rounded-sm
                   bg-elevated border border-[var(--modal-border)] shadow-[var(--shadow-modal)]"
      >
        <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />

        <div className="flex items-start justify-between gap-4 px-5 sm:px-8 pt-6 pb-4">
          <div>
            <Kicker gold className="mb-2 block">{t("country", "compare")}</Kicker>
            <h2 className="font-display text-[26px] sm:text-[32px] leading-[1.05] text-ink">
              {t("country", "compare_title")}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label={t("locations", "search_close")}
            className="tap-44 shrink-0 text-subtle hover:text-accent transition-colors duration-300"
          >
            <X className="w-5 h-5" aria-hidden />
          </button>
        </div>

        <Rule />

        {/* subgrid keeps every row's columns on the same tracks without
            nesting a table, so each cell can hold a sentence and the row
            still lines up. The label column is fixed; the countries share
            what is left. */}
        {/* Three columns of prose cannot fit a phone, so the grid scrolls
            sideways — with the same edge fade the rest of the app uses, or
            the third country reads as clipped rather than swipeable. */}
        <ScrollRow className="px-5 sm:px-8 pb-8" surface="elevated">
          <div
            className="grid gap-x-6 min-w-[560px]"
            style={{
              gridTemplateColumns: `minmax(92px, 0.6fr) repeat(${picked.length}, minmax(0, 1fr))`,
            }}
          >
            {/* Header: the countries themselves. */}
            <div className="grid grid-cols-subgrid col-span-full sticky top-0 bg-elevated z-[1]">
              <div className="py-5" />
              {picked.map((c) => (
                <div key={c.code} className="py-5 pr-4">
                  <Flag code={c.code} size="lg" className="mb-3" />
                  <p className="font-display text-[19px] leading-tight text-ink">{countryName(c, lang)}</p>
                  <p className="text-[11.5px] text-subtle mt-1">{continentLabel(c)}</p>
                </div>
              ))}
            </div>

            <Row label={t("country", "local_time")} first>
              {picked.map((c) => (
                <div key={c.code} className="py-4 pr-4 [&_.font-display]:text-[22px]">
                  <LocalTime code={c.code} />
                </div>
              ))}
            </Row>

            <Row label={t("country", "capital")}>
              {picked.map((c) => <Cell key={c.code}>{capitalName(c, lang)}</Cell>)}
            </Row>

            <Row label={t("country", "currency")}>
              {picked.map((c) => (
                <Cell key={c.code}>
                  {c.currency}
                  <span className="text-subtle"> · {c.currencyName}</span>
                </Cell>
              ))}
            </Row>

            <Row label={t("country", "cost")}>
              {picked.map((c) => (
                <Cell key={c.code} accent>
                  <span className="tabular">{priceMark(c.priceLevel)}</span>
                </Cell>
              ))}
            </Row>

            <Row label={t("country", "when_to_go")}>
              {picked.map((c) => <Cell key={c.code}>{c.bestSeason}</Cell>)}
            </Row>

            <Row label={t("country", "entry")}>
              {picked.map((c) => <Cell key={c.code}>{c.visaNote}</Cell>)}
            </Row>

            <Row label={t("country", "languages")}>
              {picked.map((c) => <Cell key={c.code}>{c.languages.join(", ")}</Cell>)}
            </Row>

            <Row label={t("country", "dialling")}>
              {picked.map((c) => (
                <Cell key={c.code}><span className="tabular">{c.callingCode}</span></Cell>
              ))}
            </Row>

            <Row label={t("country", "emergency")}>
              {picked.map((c) => (
                <div key={c.code} className="py-4 pr-4">
                  <a
                    href={`tel:${c.emergency.primary}`}
                    className="font-display tabular text-[24px] text-accent hover:text-gold-300
                               transition-colors duration-300"
                  >
                    {c.emergency.primary}
                  </a>
                </div>
              ))}
            </Row>
          </div>
        </ScrollRow>
      </motion.div>
    </motion.div>
    </Portal>
  );
}
