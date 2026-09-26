import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, MapPin, Utensils, Hotel, Compass, Train, TrendingUp, ArrowUpRight } from "lucide-react";
import { LocationCard } from "@/components/locations/LocationCard";
import { CATEGORY_STYLE, type CategoryFilterKey } from "@/lib/categories";
import { Kicker, Rule, PageWrap, Button } from "@/components/ui/editorial";
import { ScrollRow } from "@/components/ui/ScrollRow";
import { ServiceDetailModal } from "@/components/services/ServiceDetailModal";
import {
  RestaurantsTab, HotelsTab, GuidesTab, TransportTab, CurrencyTab,
} from "@/components/services/tabs";
import { LOCATIONS } from "@/data";
import { COUNTRIES } from "@/data/countries";
import { countryName } from "@/data/countries.i18n";
import { GLOBAL_PLACES_BY_COUNTRY } from "@/data/global-places";
import { GlobalPlaceGrid } from "@/components/country/GlobalPlaceGrid";
import { useTranslation } from "@/i18n";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Guide } from "@/types";

/**
 * Explore — places and services in one section.
 *
 * Places and services share one page and one tab bar: Places first (the atlas
 * catalogue), then the Uzbekistan-specific booking content beside it, the way
 * a guidebook puts "what to see" and "where to eat" in the same chapter.
 */

type Tab = "places" | "restoranlar" | "hotellar" | "gidlar" | "transport" | "valyuta";

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

const UZ_COUNTRY = "__uz__";
// Every country the global catalogue has places for, except Uzbekistan: the
// dataset carries 8 UZ entries, but the curated LOCATIONS catalogue (with
// reviews and booking) supersedes them, so Uzbekistan is pinned as its own
// first option instead of appearing twice.
const GLOBAL_COUNTRIES = COUNTRIES.filter((c) => c.code !== "UZ" && GLOBAL_PLACES_BY_COUNTRY.has(c.code));
const UZ_ENTRY = COUNTRIES.find((c) => c.code === "UZ");

export default function Locations() {
  const { t, lang } = useTranslation();
  useDocumentTitle(t("locations", "title"));
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const cityParam = searchParams.get("city");
  const categoryParam = searchParams.get("category");
  const tabParam = searchParams.get("tab");
  const initialCategory = isCategoryFilter(categoryParam) ? categoryParam : "all";
  const initialTab: Tab =
    tabParam && ["places", "restoranlar", "hotellar", "gidlar", "transport", "valyuta"].includes(tabParam)
      ? (tabParam as Tab)
      : "places";

  const [tab, setTab] = useState<Tab>(initialTab);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilterKey>(initialCategory);
  const [activeCity, setActiveCity] = useState(cityParam && CITIES.includes(cityParam) ? cityParam : ALL_CITIES);
  const [activeCountry, setActiveCountry] = useState(UZ_COUNTRY);
  const sortedGlobalCountries = useMemo(
    () => [...GLOBAL_COUNTRIES].sort((a, b) => countryName(a, lang).localeCompare(countryName(b, lang), lang)),
    [lang],
  );
  // "recommended" (a blend of rating and review count) is the default, not
  // "rating" alone: a single 5-star review should not outrank a place four
  // hundred people rated 4.7.
  const [sortBy, setSortBy] = useState("recommended");
  const [guideDetail, setGuideDetail] = useState<Guide | null>(null);

  useEffect(() => {
    setActiveCategory(initialCategory);
    if (cityParam && CITIES.includes(cityParam)) setActiveCity(cityParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityParam, initialCategory]);

  const debouncedSearch = useDebounce(search, 300);

  const TABS: { key: Tab; label: string; Icon: typeof MapPin }[] = [
    { key: "places",      label: t("nav", "locations"),            Icon: MapPin },
    { key: "restoranlar", label: t("services", "tab_restaurants"), Icon: Utensils },
    { key: "hotellar",    label: t("services", "tab_hotels"),      Icon: Hotel },
    { key: "gidlar",      label: t("services", "tab_guides"),      Icon: Compass },
    { key: "transport",   label: t("services", "tab_transport"),   Icon: Train },
    { key: "valyuta",     label: t("services", "tab_currency"),    Icon: TrendingUp },
  ];

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

  // The world catalogue for the selected country. Read-only (no booking or
  // reviews, see GlobalPlaceGrid), but it goes through the same filters as
  // Uzbekistan: a place matches a category when its dataset tags contain that
  // category's key (tarix, tabiat, madaniyat, arxeologiya); there is no
  // rating or review count in this data, so "recommended" keeps the dataset's
  // own order and price sorts use priceUSD.
  const countryPlaces = useMemo(
    () => (activeCountry === UZ_COUNTRY ? [] : GLOBAL_PLACES_BY_COUNTRY.get(activeCountry) ?? []),
    [activeCountry],
  );
  const globalCities = useMemo(
    () => Array.from(new Set(countryPlaces.map((p) => p.city))).sort((a, b) => a.localeCompare(b)),
    [countryPlaces],
  );
  const globalCategoryKeys = useMemo(
    () => new Set(countryPlaces.flatMap((p) => p.tags)),
    [countryPlaces],
  );
  const globalPlaces = useMemo(() => {
    if (activeCountry === UZ_COUNTRY) return null;
    let list = [...countryPlaces];
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q)) || p.description.toLowerCase().includes(q),
      );
    }
    if (activeCategory !== "all") list = list.filter((p) => p.tags.includes(activeCategory));
    if (activeCity !== ALL_CITIES) list = list.filter((p) => p.city === activeCity);
    const usd = (p: { priceUSD?: number }, missing: number) => p.priceUSD ?? missing;
    if (sortBy === "price-asc") list.sort((a, b) => usd(a, Infinity) - usd(b, Infinity));
    if (sortBy === "price-desc") list.sort((a, b) => usd(b, -1) - usd(a, -1));
    return list;
  }, [activeCountry, countryPlaces, debouncedSearch, activeCategory, activeCity, sortBy]);
  const activeCountryEntry = activeCountry === UZ_COUNTRY ? null : GLOBAL_COUNTRIES.find((c) => c.code === activeCountry);
  const placesCount = globalPlaces ? globalPlaces.length : results.length;
  const cityOptions = activeCountry === UZ_COUNTRY ? CITIES : globalCities;
  const visibleCategories =
    activeCountry === UZ_COUNTRY ? CATEGORIES : CATEGORIES.filter((c) => c.key === "all" || globalCategoryKeys.has(c.key));
  const visibleSortOptions =
    activeCountry === UZ_COUNTRY ? SORT_OPTIONS : SORT_OPTIONS.filter((o) => ["recommended", "price-asc", "price-desc"].includes(o.key));

  function changeCountry(code: string) {
    setActiveCountry(code);
    setActiveCity(ALL_CITIES);
    setActiveCategory("all");
    setSortBy("recommended");
  }

  const hasActiveFilters =
    activeCategory !== "all" || activeCity !== ALL_CITIES || activeCountry !== UZ_COUNTRY || sortBy !== "recommended" || !!search;

  function clearFilters() {
    setActiveCategory("all");
    setActiveCity(ALL_CITIES);
    setActiveCountry(UZ_COUNTRY);
    setSortBy("recommended");
    setSearch("");
  }

  const filterBtn = (active: boolean) =>
    cn(
      "tap-44 px-3 py-2 text-[11px] uppercase tracking-[0.12em] rounded-sm border",
      "transition-colors duration-400 shrink-0",
      active ? "border-[var(--gold-hairline)] text-accent bg-[var(--gold-soft)]" : "border-transparent text-subtle hover:text-ink",
    );

  const showCatalogueSearch = ["places", "restoranlar", "hotellar", "gidlar"].includes(tab);
  const TAB_META: Partial<Record<Tab, { title: string; desc: string }>> = {
    restoranlar: { title: t("services", "restaurants_title"), desc: t("services", "restaurants_desc") },
    hotellar:    { title: t("services", "hotels_title"),      desc: t("services", "hotels_desc") },
    gidlar:      { title: t("services", "guides_title"),      desc: t("services", "guides_desc") },
    transport:   { title: t("services", "transport_title"),   desc: t("services", "transport_desc") },
    valyuta:     { title: t("services", "currency_title"),    desc: t("services", "currency_desc") },
  };

  return (
    <div className="grain-overlay pb-24">
      <PageWrap>
        {/* ── Masthead ─────────────────────────────────── */}
        <header className="pt-12 sm:pt-16 pb-8">
          <Kicker gold className="mb-5">{t("nav", "locations")}</Kicker>
          <div className="flex items-end justify-between gap-8">
            <div className="overflow-hidden">
              <h1 className="font-display text-display-sm sm:text-display text-ink animate-rise break-words">
                {tab === "places" ? t("locations", "title") : TAB_META[tab]?.title}
              </h1>
            </div>
            {tab === "places" && (
              <motion.div
                key={placesCount}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="shrink-0 text-right"
              >
                <span className="kicker block mb-1.5">{t("locations", "found")}</span>
                <span className="tabular font-display text-[30px] leading-none text-accent">{placesCount}</span>
              </motion.div>
            )}
          </div>
          {tab !== "places" && (
            <p className="text-[13px] text-subtle mt-4 max-w-[60ch]">{TAB_META[tab]?.desc}</p>
          )}
        </header>

        <Rule gold />

        {/* ── Section tabs ─────────────────────────────── */}
        <ScrollRow className="flex gap-1 py-6 -mx-1 px-1">
          {TABS.map((tb) => (
            <button
              key={tb.key}
              onClick={() => { setTab(tb.key); setSearch(""); }}
              aria-pressed={tab === tb.key}
              className={cn(filterBtn(tab === tb.key), "flex items-center gap-2")}
            >
              <tb.Icon className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden />
              {tb.label}
            </button>
          ))}
        </ScrollRow>

        {/* ── Filters (Places tab only gets category/city/sort; the rest
            share a plain search bar where relevant) ──────── */}
        <section className="pb-7 space-y-5">
          {tab === "places" && (
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <ScrollRow className="flex gap-1 -mx-1 px-1">
                {visibleCategories.map((c) => (
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
              {showCatalogueSearch && (
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
              )}
            </div>
          )}

          {tab === "places" && (
            // Two compact selects instead of city chips + sort chips: chip rows wrap onto
            // several lines on a phone and push every place below the fold. A <select> is
            // one tap either way and never wraps.
            <div className="flex flex-wrap items-end gap-4">
              <label className="min-w-0">
                <Kicker className="mb-2">{t("locations", "country_filter")}</Kicker>
                <select
                  value={activeCountry}
                  onChange={(e) => changeCountry(e.target.value)}
                  className="h-11 sm:h-10 min-w-[9.5rem] bg-transparent border border-[var(--border)] rounded-sm px-3
                             text-[13px] text-ink outline-none focus:border-gold-400 transition-colors duration-400
                             hover:border-[var(--gold-hairline)]"
                >
                  <option value={UZ_COUNTRY} className="bg-elevated">{UZ_ENTRY ? countryName(UZ_ENTRY, lang) : "Uzbekistan"}</option>
                  {sortedGlobalCountries.map((c) => (
                    <option key={c.code} value={c.code} className="bg-elevated">{countryName(c, lang)}</option>
                  ))}
                </select>
              </label>
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
                  {cityOptions.map((city) => (
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
                  {visibleSortOptions.map((o) => (
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
          )}

          {(tab === "restoranlar" || tab === "hotellar" || tab === "gidlar") && (
            <label className="relative flex items-center sm:w-80">
              <Search className="absolute left-0 w-4 h-4 text-subtle pointer-events-none" aria-hidden />
              <span className="sr-only">{t("services", "search_placeholder")}</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`${TAB_META[tab]?.title} ${t("services", "search_placeholder")}`}
                className="w-full bg-transparent border-b border-[var(--input-border)] pl-6 py-2.5 text-[16px] sm:text-[13px] text-ink placeholder:text-subtle outline-none focus:border-gold-400 transition-colors duration-400"
              />
            </label>
          )}
        </section>

        <Rule />

        {/* ── Content ──────────────────────────────────── */}
        <section className="pt-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {tab === "places" && globalPlaces !== null ? (
                globalPlaces.length === 0 ? (
                  <div className="py-24 text-center">
                    <p className="font-display text-2xl text-ink mb-2">{t("locations", "no_results")}</p>
                    <p className="text-[13px] text-subtle mb-7">{t("locations", "no_results_hint")}</p>
                    <Button variant="secondary" size="sm" onClick={clearFilters}>{t("locations", "clear")}</Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                      <p className="text-[12.5px] text-subtle max-w-[60ch]">{t("locations", "global_note")}</p>
                      {activeCountryEntry && (
                        <Link
                          to={`/c/${activeCountryEntry.slug}`}
                          className="inline-flex items-center gap-1 text-[12px] uppercase tracking-[0.1em] text-accent hover:opacity-80 transition-opacity shrink-0"
                        >
                          {t("locations", "view_country_guide")}
                          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
                        </Link>
                      )}
                    </div>
                    <GlobalPlaceGrid places={globalPlaces} />
                  </div>
                )
              ) : tab === "places" && (
                results.length === 0 ? (
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
                )
              )}
              {tab === "restoranlar" && (
                <RestaurantsTab search={search} onSelect={(r) => navigate(`/services/restaurants/${r.id}`)} />
              )}
              {tab === "hotellar" && (
                <HotelsTab search={search} onSelect={(h) => navigate(`/services/hotels/${h.id}`)} />
              )}
              {tab === "gidlar" && <GuidesTab search={search} onSelect={setGuideDetail} />}
              {tab === "transport" && <TransportTab />}
              {tab === "valyuta" && <CurrencyTab />}
            </motion.div>
          </AnimatePresence>
        </section>
      </PageWrap>

      <ServiceDetailModal item={guideDetail} onClose={() => setGuideDetail(null)} />
    </div>
  );
}
