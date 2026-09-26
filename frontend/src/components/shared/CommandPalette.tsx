import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Shuffle, Sun, Moon, CornerDownLeft, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LOCATIONS } from "@/data";
import { COUNTRIES, priceMark } from "@/data/countries";
import { CATEGORY_STYLE } from "@/lib/categories";
import { Flag } from "@/components/shared/Flag";
import { countryName, capitalName } from "@/data/countries.i18n";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";

/**
 * Recently opened rows, so the palette is useful the instant it opens instead of
 * showing the same featured countries every time. Stored as keys, resolved
 * against the live catalogues on read — a stale key simply drops out.
 */
const RECENT_KEY = "verso-palette-recent";
const RECENT_MAX = 5;

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function pushRecent(key: string) {
  try {
    const next = [key, ...readRecent().filter((k) => k !== key)].slice(0, RECENT_MAX);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* private mode / blocked storage — recents are a convenience, not state */
  }
}

/**
 * Ctrl/Cmd+K.
 *
 * Searches the atlas (all fifty-one countries) as well as the place catalogue.
 *
 * Results are a ruled index, like every other list in the app: the current row
 * is marked by a gold left rule, not a filled highlight.
 */

/** One shortcut in the palette's bottom legend: the key, then what it does. */
function Legend({ keys, label, className }: { keys: string; label: string; className?: string }) {
  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      <kbd className="tabular text-[11px] sm:text-[10px] text-subtle border border-[var(--border)] rounded-sm px-1.5 py-0.5">
        {keys}
      </kbd>
      <span className="text-[11.5px] sm:text-[10.5px] text-subtle">{label}</span>
    </span>
  );
}

interface Row {
  key: string;
  kind: "country" | "place" | "action";
  title: string;
  meta: string;
  mark: React.ReactNode;
  run: () => void;
}

export function CommandPalette() {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  // The palette is mounted app-wide for the whole session, so it selects only the
  // store slices it needs; a whole-store subscription would re-run its filtering on
  // every toast and plan change even while it is closed.
  const searchOpen = useAppStore((s) => s.searchOpen);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const showToast = useAppStore((s) => s.showToast);

  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(!useAppStore.getState().searchOpen);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      setActive(0);
      setRecent(readRecent());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const close = () => setSearchOpen(false);

  /** Close, remember, go. Every navigating row funnels through this. */
  const go = (key: string, to: string) => {
    pushRecent(key);
    close();
    navigate(to);
  };

  // One row factory per catalogue, so the recents group can rebuild the
  // exact same row from a stored key instead of duplicating the markup.
  const countryRow = (c: (typeof COUNTRIES)[number]): Row => ({
    key: `country-${c.code}`,
    kind: "country",
    title: countryName(c, lang),
    meta: `${capitalName(c, lang)} · ${c.currency} · ${priceMark(c.priceLevel)}`,
    mark: <Flag code={c.code} size="md" />,
    run: () => go(`country-${c.code}`, `/c/${c.slug}`),
  });

  const placeRow = (l: (typeof LOCATIONS)[number]): Row => {
    const cat = CATEGORY_STYLE[l.category];
    return {
      key: `place-${l.id}`,
      kind: "place",
      title: l.name,
      meta: `${l.city} · ★ ${l.rating}`,
      mark: <cat.Icon className="w-4 h-4 text-subtle" strokeWidth={1.75} aria-hidden />,
      run: () => go(`place-${l.id}`, `/locations/${l.id}`),
    };
  };

  const hasQuery = query.trim().length > 0;

  const recentRows: Row[] = useMemo(() => {
    if (hasQuery) return [];
    return recent
      .map((key) => {
        if (key.startsWith("country-")) {
          const c = COUNTRIES.find((x) => `country-${x.code}` === key);
          return c ? countryRow(c) : null;
        }
        const l = LOCATIONS.find((x) => `place-${x.id}` === key);
        return l ? placeRow(l) : null;
      })
      .filter((r): r is Row => r !== null);
  }, [recent, hasQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const countryRows: Row[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? COUNTRIES.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            countryName(c, lang).toLowerCase().includes(q) ||
            c.capital.toLowerCase().includes(q) ||
            capitalName(c, lang).toLowerCase().includes(q) ||
            c.code.toLowerCase() === q ||
            c.currency.toLowerCase() === q ||
            c.continent.toLowerCase().includes(q),
        ).slice(0, 6)
      : COUNTRIES.filter((c) => c.featured)
          // Featured countries already shown under Recent would otherwise
          // appear twice in the same panel.
          .filter((c) => !recent.includes(`country-${c.code}`))
          .slice(0, 4);
    return list.map(countryRow);
  }, [query, recent]); // eslint-disable-line react-hooks/exhaustive-deps

  const placeRows: Row[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? LOCATIONS.filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            l.city.toLowerCase().includes(q) ||
            l.tags.some((tag) => tag.toLowerCase().includes(q)) ||
            (l.shortDesc ?? "").toLowerCase().includes(q),
        ).slice(0, 6)
      : LOCATIONS.filter((l) => l.featured)
          .filter((l) => !recent.includes(`place-${l.id}`))
          .slice(0, 3);
    return list.map(placeRow);
  }, [query, recent]); // eslint-disable-line react-hooks/exhaustive-deps

  const actionRows: Row[] = useMemo(
    () => [
      {
        key: "action-ai",
        kind: "action" as const,
        title: t("chat", "title"),
        meta: t("nav", "ai_subtitle"),
        mark: <Sparkles className="w-4 h-4 text-accent" strokeWidth={1.75} aria-hidden />,
        run: () => { close(); navigate("/chat"); },
      },
      {
        key: "action-atlas",
        kind: "action" as const,
        title: t("nav", "atlas"),
        meta: `${COUNTRIES.length}`,
        mark: <Search className="w-4 h-4 text-subtle" strokeWidth={1.75} aria-hidden />,
        run: () => { close(); navigate("/atlas"); },
      },
      {
        key: "action-random",
        kind: "action" as const,
        title: t("home", "explore_btn"),
        meta: "",
        mark: <Shuffle className="w-4 h-4 text-subtle" strokeWidth={1.75} aria-hidden />,
        run: () => {
          const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
          close();
          showToast(loc.name, undefined, "info");
          navigate(`/locations/${loc.id}`);
        },
      },
      {
        key: "action-theme",
        kind: "action" as const,
        title: theme === "dark" ? t("profile", "theme_light") : t("profile", "theme_dark"),
        meta: "",
        mark:
          theme === "dark" ? (
            <Sun className="w-4 h-4 text-subtle" strokeWidth={1.75} aria-hidden />
          ) : (
            <Moon className="w-4 h-4 text-subtle" strokeWidth={1.75} aria-hidden />
          ),
        run: () => toggleTheme(),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, t],
  );

  // One flat list drives keyboard navigation; the groups below index into it.
  const rows = useMemo(
    () => [...recentRows, ...countryRows, ...placeRows, ...actionRows],
    [recentRows, countryRows, placeRows, actionRows],
  );

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, rows.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && rows[active]) {
      e.preventDefault();
      rows[active].run();
    } else if (e.key === "Tab") {
      // The input is the only focusable control here — results are
      // click/Enter only. Without this, Tab escapes to whatever sits behind
      // the overlay while it is still open.
      e.preventDefault();
    }
  }

  const clearRecent = () => {
    try { localStorage.removeItem(RECENT_KEY); } catch { /* ignore */ }
    setRecent([]);
  };

  const groups: { label: string; rows: Row[]; onClear?: () => void }[] = [
    { label: t("locations", "search_recent"), rows: recentRows, onClear: clearRecent },
    { label: t("nav", "atlas"), rows: countryRows },
    { label: t("nav", "locations"), rows: placeRows },
    { label: t("nav", "actions"), rows: actionRows },
  ];

  let cursor = 0;

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-start justify-center px-4 pt-[8vh] sm:pt-[12vh]"
          onMouseDown={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("locations", "search_everything")}
            initial={{ opacity: 0, y: -12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, y: -10, scale: 0.99, transition: { duration: 0.18 } }}
            className="w-full max-w-xl rounded-sm bg-elevated border border-[var(--modal-border)] shadow-[var(--shadow-modal)] overflow-hidden"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* A gold hairline across the top, the same mark the masthead and the
                reading-progress rule use. It gives the panel a masthead of its own instead of
                a plain grey box edge. */}
            <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />

            {/* Padding sits on the input rather than the row, so the whole row height is the
                tap target instead of a 24px-tall field. */}
            <div className="flex items-center gap-3 px-5 py-1.5 sm:py-2.5 border-b border-[var(--border)]">
              <Search className="w-[18px] h-[18px] text-accent shrink-0" strokeWidth={1.75} aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder={t("locations", "search_everything")}
                className="flex-1 min-w-0 bg-transparent py-2.5 text-[16px] sm:text-[17px] font-display text-ink placeholder:text-subtle placeholder:font-sans placeholder:text-[14px] outline-none"
              />
              {hasQuery ? (
                <button
                  onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                  aria-label={t("locations", "clear")}
                  className="tap-44 shrink-0 text-subtle hover:text-accent transition-colors duration-300"
                >
                  <X className="w-4 h-4" aria-hidden />
                </button>
              ) : (
                <kbd className="hidden sm:block tabular text-[11px] sm:text-[10px] text-subtle border border-[var(--border)] rounded-sm px-1.5 py-0.5">
                  ESC
                </kbd>
              )}
            </div>

            <div ref={listRef} className="max-h-[56vh] overflow-y-auto px-5 py-3">
              {rows.length === 0 && (
                <div className="py-12 text-center">
                  <Search className="w-5 h-5 mx-auto mb-3 text-subtle opacity-50" strokeWidth={1.5} aria-hidden />
                  <p className="text-[14px] text-ink">{t("locations", "no_results")}</p>
                  <p className="text-[12.5px] text-subtle mt-1.5">
                    {t("locations", "search_empty_hint")}
                  </p>
                </div>
              )}

              {groups.map((group) => {
                if (!group.rows.length) return null;
                return (
                  <section key={group.label} className="mb-4 last:mb-1">
                    <div className="flex items-baseline gap-3 mb-1.5">
                      <p className="kicker flex items-center gap-1.5">
                        {group.onClear && (
                          <Clock className="w-3 h-3 -mt-px" strokeWidth={2} aria-hidden />
                        )}
                        {group.label}
                      </p>
                      {/* The heading hangs off a rule, so the groups read as
                          one ruled index rather than three stacked lists. */}
                      <span aria-hidden className="flex-1 h-px bg-[var(--border)]" />
                      {group.onClear && (
                        <button
                          onClick={group.onClear}
                          className="text-[11px] sm:text-[10px] uppercase tracking-[0.12em] text-subtle hover:text-accent transition-colors duration-300"
                        >
                          {t("locations", "search_clear_recent")}
                        </button>
                      )}
                    </div>
                    <ul>
                      {group.rows.map((row) => {
                        const idx = cursor++;
                        const isActive = active === idx;
                        return (
                          <li key={row.key}>
                            <button
                              data-idx={idx}
                              onClick={row.run}
                              onMouseEnter={() => setActive(idx)}
                              className={cn(
                                "group relative w-full flex items-center gap-4 py-3 sm:py-2.5 pl-3 pr-2 text-left hairline-b",
                                // The rule alone is too quiet to find at a glance while typing; the wash
                                // carries it.
                                "transition-colors duration-200",
                                isActive && "bg-[var(--gold-soft)]",
                              )}
                            >
                              {/* The margin rule, same as the sidebar's. */}
                              <span
                                aria-hidden
                                className={cn(
                                  "absolute left-0 top-0 bottom-0 w-px transition-colors duration-200",
                                  isActive ? "bg-gold-400" : "bg-transparent",
                                )}
                              />
                              <span className="shrink-0 w-7 flex items-center justify-center">
                                {row.mark}
                              </span>
                              <span className="flex-1 min-w-0">
                                <span
                                  className={cn(
                                    "block text-[14px] truncate transition-colors duration-400",
                                    isActive ? "text-ink" : "text-subtle group-hover:text-ink",
                                  )}
                                >
                                  {row.title}
                                </span>
                                {row.meta && (
                                  <span className="block tabular text-[11.5px] sm:text-[10.5px] text-subtle truncate mt-0.5">
                                    {row.meta}
                                  </span>
                                )}
                              </span>
                              {isActive && (
                                <CornerDownLeft className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })}
            </div>

            <div className="flex items-center gap-4 px-5 py-2.5 border-t border-[var(--border)] bg-[var(--muted)]/40">
              {/* Labelled, not bare glyphs — an arrow key on its own only
                  tells you the shortcut exists, not what it does. */}
              <Legend keys="↑↓" label={t("locations", "search_nav")} />
              <Legend keys="↵" label={t("locations", "search_open")} />
              <Legend keys="ESC" label={t("locations", "search_close")} className="hidden sm:flex" />
              <span className="ml-auto text-[11px] sm:text-[10px] uppercase tracking-[0.2em] text-subtle">VERSO</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
