import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { LocationCard } from "@/components/locations/LocationCard";
import { CATEGORY_STYLE, type CategoryFilterKey } from "@/lib/categories";
import { Kicker, Rule, PageWrap, Button } from "@/components/ui/editorial";
import { ScrollRow } from "@/components/ui/ScrollRow";
import { LOCATIONS } from "@/data";
import { useTranslation } from "@/i18n";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Explore — the Uzbekistan catalogue.
 *
 * Search, category, city and sort over the same LOCATIONS the cards are built
 * from. Filtering happens on the client: the catalogue ships with the bundle,
 * so a request per keystroke would buy nothing.
 */

const ALL_CITIES = "__all_cities__";
const CITIES = Array.from(new Set(LOCATIONS.map((l) => l.city))).sort();

const CATEGORY_FILTERS: CategoryFilterKey[] = ["all", "tarix", "tabiat", "madaniyat", "din", "arxeologiya"];

function isCategoryFilter(value: string | null): value is CategoryFilterKey {
  return !!value && CATEGORY_FILTERS.includes(value as CategoryFilterKey);
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function Locations() {
  const { t } = useTranslation();
  useDocumentTitle(t("locations", "title"));
  const [searchParams] = useSearchParams();

  const cityParam = searchParams.get("city");
  const categoryParam = searchParams.get("category");
  const initialCategory = isCategoryFilter(categoryParam) ? categoryParam : "all";

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilterKey>(initialCategory);
  const [activeCity, setActiveCity] = useState(cityParam && CITIES.includes(cityParam) ? cityParam : ALL_CITIES);
  // "recommended" (a blend of rating and review count) is the default, not
  // "rating" alone: a single 5-star review should not outrank a place four
  // hundred people rated 4.7.
  const [sortBy, setSortBy] = useState("recommended");

  useEffect(() => {
    setActiveCategory(initialCategory);
    if (cityParam && CITIES.includes(cityParam)) setActiveCity(cityParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityParam, initialCategory]);

  const debouncedSearch = useDebounce(search, 300);

  const CATEGORIES = CATEGORY_FILTERS.map((key) => ({
    key,
    label: key === "all" ? t("locations", "filter_all") : t("home", CATEGORY_STYLE[key].tKey as "cat_tarix"),
    Icon: CATEGORY_STYLE[key].Icon,
  }));

  const SORT_OPTIONS = [
    { key: "recommended", label: t("locations", "sort_recommended") },
    { key: "rating", label: t("locations", "sort_rating") },
    { key: "price-asc", label: t("locations", "sort_price_asc") },
    { key: "price-desc", label: t("locations", "sort_price_desc") },
    { key: "reviews", label: t("locations", "sort_reviews") },
  ];

  const results = useMemo(() => {
    let result = [...LOCATIONS];
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (l) => l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) ||
          l.tags.some((tag) => tag.toLowerCase().includes(q)) || l.shortDesc.toLowerCase().includes(q),
      );
    }
    if (activeCategory !== "all") result = result.filter((l) => l.category === activeCategory);
    if (activeCity !== ALL_CITIES) result = result.filter((l) => l.city === activeCity);
    switch (sortBy) {
      // rating * log(reviewCount + 1): rewards a genuinely well-reviewed
      // place over a merely well-rated one with almost no reviews behind
      // it, without letting review count alone dominate (log, not linear).
      case "recommended":
        result.sort((a, b) =>
          b.rating * Math.log(b.reviewCount + 1) - a.rating * Math.log(a.reviewCount + 1));
        break;
      case "rating":     result.sort((a, b) => b.rating - a.rating); break;
      case "price-asc":  result.sort((a, b) => a.priceUSD - b.priceUSD); break;
      case "price-desc": result.sort((a, b) => b.priceUSD - a.priceUSD); break;
      case "reviews":    result.sort((a, b) => b.reviewCount - a.reviewCount); break;
    }
    return result;
  }, [debouncedSearch, activeCategory, activeCity, sortBy]);

  const hasActiveFilters =
    activeCategory !== "all" || activeCity !== ALL_CITIES || sortBy !== "recommended" || !!search;

  function clearFilters() {
    setActiveCategory("all");
    setActiveCity(ALL_CITIES);
    setSortBy("recommended");
    setSearch("");
  }

  const filterBtn = (active: boolean) =>
    cn(
      "tap-44 px-3 py-2 text-[11px] uppercase tracking-[0.12em] rounded-sm border",
      "transition-colors duration-400 shrink-0",
      active ? "border-[var(--gold-hairline)] text-accent bg-[var(--gold-soft)]" : "border-transparent text-subtle hover:text-ink",
    );

  return (
    <div className="grain-overlay pb-24">
      <PageWrap>
        {/* ── Masthead ─────────────────────────────────── */}
        <header className="pt-12 sm:pt-16 pb-8">
          <Kicker gold className="mb-5">{t("nav", "locations")}</Kicker>
          <div className="flex items-end justify-between gap-8">
            <div className="overflow-hidden">
              <h1 className="font-display text-display-sm sm:text-display text-ink animate-rise break-words">
                {t("locations", "title")}
              </h1>
            </div>
            <motion.div
              key={results.length}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="shrink-0 text-right"
            >
              <span className="kicker block mb-1.5">{t("locations", "found")}</span>
              <span className="tabular font-display text-[30px] leading-none text-accent">{results.length}</span>
            </motion.div>
          </div>
        </header>

        <Rule gold />

        {/* ── Filters ──────────────────────────────────── */}
        <section className="py-7 space-y-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <ScrollRow className="flex gap-1 -mx-1 px-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setActiveCategory(c.key)}
                  aria-pressed={activeCategory === c.key}
                  className={cn(filterBtn(activeCategory === c.key), "flex items-center gap-2")}
                >
                  <c.Icon className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden />
                  {c.label}
                </button>
              ))}
            </ScrollRow>
            <label className="relative flex items-center lg:w-72 shrink-0">
              <Search className="absolute left-0 w-4 h-4 text-subtle pointer-events-none" aria-hidden />
              <span className="sr-only">{t("locations", "search_placeholder")}</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("locations", "search_placeholder")}
                className="w-full bg-transparent border-b border-[var(--input-border)] pl-6 pr-6 py-2.5 text-[16px] sm:text-[13px] text-ink placeholder:text-subtle outline-none focus:border-gold-400 transition-colors duration-400"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-0 text-subtle hover:text-ink transition-colors" aria-label={t("locations", "clear")}>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </label>
          </div>

          {/* Two compact selects instead of city chips + sort chips: chip rows wrap onto
              several lines on a phone and push every place below the fold. A <select> is
              one tap either way and never wraps. */}
          <div className="flex flex-wrap items-end gap-4">
            <label className="min-w-0">
              <Kicker className="mb-2">{t("locations", "city_filter")}</Kicker>
              <select
                value={activeCity}
                onChange={(e) => setActiveCity(e.target.value)}
                className="h-11 sm:h-10 min-w-[9.5rem] bg-transparent border border-[var(--border)] rounded-sm px-3
                           text-[13px] text-ink outline-none focus:border-gold-400 transition-colors duration-400
                           hover:border-[var(--gold-hairline)]"
              >
                <option value={ALL_CITIES} className="bg-elevated">{t("locations", "all_cities")}</option>
                {CITIES.map((city) => (
                  <option key={city} value={city} className="bg-elevated">{city}</option>
                ))}
              </select>
            </label>
            <label className="min-w-0">
              <Kicker className="mb-2">{t("locations", "sort_label")}</Kicker>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11 sm:h-10 min-w-[9.5rem] bg-transparent border border-[var(--border)] rounded-sm px-3
                           text-[13px] text-ink outline-none focus:border-gold-400 transition-colors duration-400
                           hover:border-[var(--gold-hairline)]"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key} className="bg-elevated">{o.label}</option>
                ))}
              </select>
            </label>
            <AnimatePresence initial={false}>
              {hasActiveFilters && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="ml-auto shrink-0">
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="-ml-1">
                    {t("locations", "clear_filters")}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <Rule />

        {/* ── Results ──────────────────────────────────── */}
        <section className="pt-10">
          {results.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-2xl text-ink mb-2">{t("locations", "no_results")}</p>
              <p className="text-[13px] text-subtle mb-7">{t("locations", "no_results_hint")}</p>
              <Button variant="secondary" size="sm" onClick={clearFilters}>{t("locations", "clear")}</Button>
            </div>
          ) : (
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((loc) => (
                <motion.div key={loc.id} layout variants={staggerItem} className="flex">
                  <LocationCard location={loc} variant="default" className="w-full" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </PageWrap>
    </div>
  );
}
