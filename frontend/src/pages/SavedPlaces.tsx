import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, BookmarkX, Utensils, Hotel as HotelIcon, Star } from "lucide-react";
import { useAppStore } from "@/store";
import { syncRemoveFromPlan } from "@/lib/plan-sync";
import { useTranslation } from "@/i18n";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { CATEGORY_STYLE } from "@/lib/categories";
import { Kicker, Rule, PageWrap, Button } from "@/components/ui/editorial";
import { RESTAURANTS, HOTELS } from "@/data";
import { cn } from "@/lib/utils";
import type { Location } from "@/types";

type TypeFilter = "all" | "places" | "restaurants" | "hotels";

/**
 * The plan.
 *
 * Saved places grouped by city, so a multi-city trip reads as an itinerary
 * rather than an undifferentiated list. Set as a ruled index for the same
 * reason the atlas is: this is a contents page for a trip.
 */
export default function SavedPlaces() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  useDocumentTitle(t("nav", "saved"));
  const plan = useAppStore((s) => s.plan);
  const removeFromPlan = useAppStore((s) => s.removeFromPlan);
  const savedRestaurantIds = useAppStore((s) => s.savedRestaurants);
  const savedHotelIds = useAppStore((s) => s.savedHotels);
  const toggleSavedRestaurant = useAppStore((s) => s.toggleSavedRestaurant);
  const toggleSavedHotel = useAppStore((s) => s.toggleSavedHotel);
  const user = useAppStore((s) => s.user);
  const openAuthModal = useAppStore((s) => s.openAuthModal);

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const savedRestaurants = useMemo(
    () => RESTAURANTS.filter((r) => savedRestaurantIds.includes(r.id)),
    [savedRestaurantIds],
  );
  const savedHotels = useMemo(
    () => HOTELS.filter((h) => savedHotelIds.includes(h.id)),
    [savedHotelIds],
  );

  const totalSaved = plan.length + savedRestaurants.length + savedHotels.length;

  const byCity = useMemo(() => {
    const groups = new Map<string, Location[]>();
    for (const loc of plan) {
      const list = groups.get(loc.city) ?? [];
      list.push(loc);
      groups.set(loc.city, list);
    }
    return [...groups.entries()];
  }, [plan]);

  const total = plan.reduce((sum, l) => sum + (l.priceUSD ?? 0), 0);

  function remove(id: string) {
    removeFromPlan(id);
    syncRemoveFromPlan(id);
  }

  const TYPE_FILTERS: { key: TypeFilter; label: string; count: number }[] = [
    { key: "all",         label: t("saved", "filter_all"),         count: totalSaved },
    { key: "places",      label: t("saved", "filter_places"),      count: plan.length },
    { key: "restaurants", label: t("saved", "filter_restaurants"), count: savedRestaurants.length },
    { key: "hotels",      label: t("saved", "filter_hotels"),      count: savedHotels.length },
  ];
  const showPlaces = typeFilter === "all" || typeFilter === "places";
  const showRestaurants = typeFilter === "all" || typeFilter === "restaurants";
  const showHotels = typeFilter === "all" || typeFilter === "hotels";

  /* ── Empty ────────────────────────────────────────────────
     A signed-out visitor and a signed-in one who has saved nothing get the
     same shape but not the same words: logging out clears the plan array
     with the session, and "start exploring" reads as though nothing was
     ever there rather than "sign back in to see it". */
  if (totalSaved === 0) {
    const guest = !user;
    return (
      <div className="grain-overlay pb-24">
        <PageWrap>
          <header className="pt-12 sm:pt-16 pb-8">
            <Kicker gold className="mb-5">{t("nav", "saved")}</Kicker>
            <h1 className="font-display text-display-sm sm:text-display text-ink break-words">
              {t("saved", "title")}
            </h1>
          </header>
          <Rule gold />

          {/* Centred, like the no-results states on Atlas, Locations and
              Community. Left-aligned it put a 46ch block against the left
              edge of an 1150px page under a full-width rule, with the rest of
              the screen empty — on this page, where the empty state IS the
              whole page, that read as content that had failed to load. */}
          <div className="py-24 mx-auto max-w-[46ch] text-center">
            <p className="font-display text-[24px] leading-[1.25] text-ink mb-4">
              {guest ? t("saved", "empty_title_guest") : t("saved", "empty_title")}
            </p>
            <p className="text-[14px] leading-relaxed text-subtle mb-8">
              {guest ? t("saved", "empty_desc_guest") : t("saved", "empty_desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
              {guest ? (
                <>
                  <Button onClick={() => openAuthModal()}>{t("auth", "login")}</Button>
                  <Button variant="secondary" onClick={() => navigate("/locations")}>
                    {t("saved", "explore_btn")}
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => navigate("/locations")}>
                    {t("saved", "explore_btn")}
                  </Button>
                  <Button variant="secondary" onClick={() => navigate("/chat")}>
                    {t("saved", "ai_btn")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </PageWrap>
      </div>
    );
  }

  return (
    <div className="grain-overlay pb-24">
      <PageWrap>
        {/* ── Masthead ─────────────────────────────────── */}
        <header className="pt-12 sm:pt-16 pb-8">
          <Kicker gold className="mb-5">{t("nav", "saved")}</Kicker>
          <div className="flex items-end justify-between gap-8">
            <div className="overflow-hidden">
              <h1 className="font-display text-display-sm sm:text-display text-ink animate-rise break-words">
                {t("saved", "title")}
              </h1>
            </div>
            <dl className="flex gap-8 shrink-0 text-right">
              <div>
                <dt className="kicker mb-1.5">{t("saved", "items_suffix")}</dt>
                <dd className="tabular font-display text-[26px] leading-none text-ink">
                  {totalSaved}
                </dd>
              </div>
              <div>
                <dt className="kicker mb-1.5">{t("detail", "price_label")}</dt>
                <dd className="tabular font-display text-[26px] leading-none text-accent">
                  {total === 0 ? t("detail", "free") : `$${total}`}
                </dd>
              </div>
            </dl>
          </div>
        </header>

        <Rule gold />

        {/* ── Type filter ──────────────────────────────── */}
        <div className="flex gap-1 py-6 -mx-1 px-1 overflow-x-auto">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setTypeFilter(f.key)}
              aria-pressed={typeFilter === f.key}
              disabled={f.key !== "all" && f.count === 0}
              className={cn(
                "tap-44 px-3 py-2 text-[11px] uppercase tracking-[0.12em] rounded-sm border shrink-0",
                "transition-colors duration-400 disabled:opacity-30 disabled:pointer-events-none",
                typeFilter === f.key ? "border-[var(--gold-hairline)] text-accent bg-[var(--gold-soft)]" : "border-transparent text-subtle hover:text-ink",
              )}
            >
              {f.label} · {f.count}
            </button>
          ))}
        </div>

        {/* ── Hand it to the assistant ─────────────────── */}
        <section className="py-10">
          <button
            onClick={() => navigate("/chat")}
            className="group w-full text-left border border-[var(--gold-hairline)] rounded-sm
                       bg-[var(--gold-soft)] p-6 sm:p-8
                       hover:border-gold-400 transition-colors duration-600"
          >
            <Kicker gold className="mb-3">Verso AI</Kicker>
            <p className="font-display text-[21px] sm:text-[24px] leading-snug text-ink max-w-[40ch] mb-4">
              {t("saved", "ai_banner")}
            </p>
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-accent">
              {t("saved", "ai_btn")}
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </span>
          </button>
        </section>

        {/* ── The itinerary ────────────────────────────── */}
        {showPlaces && byCity.map(([city, locs]) => (
          <section key={city} className="mb-12">
            <div className="flex items-baseline justify-between gap-6 mb-3">
              <h2 className="kicker kicker-gold">{city}</h2>
              <span className="tabular text-[11px] text-subtle">
                {String(locs.length).padStart(2, "0")}
              </span>
            </div>
            <Rule />

            <ul>
              <AnimatePresence initial={false}>
                {locs.map((loc) => {
                  const cat = CATEGORY_STYLE[loc.category];
                  return (
                    <motion.li
                      key={loc.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="hairline-b overflow-hidden"
                    >
                      <div className="group flex items-center gap-4 sm:gap-5 py-4">

                        <button
                          onClick={() => navigate(`/locations/${loc.id}`)}
                          className="shrink-0 w-14 h-14 rounded-sm overflow-hidden bg-[var(--muted)]
                                     flex items-center justify-center"
                          aria-hidden
                          tabIndex={-1}
                        >
                          {loc.img ? (
                            <img
                              src={loc.img}
                              alt=""
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <cat.Icon className="w-5 h-5 text-subtle/40" strokeWidth={1} />
                          )}
                        </button>

                        <button
                          onClick={() => navigate(`/locations/${loc.id}`)}
                          className="flex-1 min-w-0 text-left"
                        >
                          <span className="block font-display text-[18px] leading-tight text-ink truncate route-underline">
                            {loc.name}
                          </span>
                          <span className="block tabular text-[11px] text-subtle mt-1">
                            ★ {loc.rating} · {loc.priceUSD === 0 ? t("detail", "free") : `$${loc.priceUSD}`}
                          </span>
                        </button>

                        <button
                          onClick={() => remove(loc.id)}
                          aria-label={t("detail", "remove_plan")}
                          // Always visible on touch. Hiding it behind :hover
                          // meant saved places could not be removed on a
                          // phone at all, since no hover state exists there.
                          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-sm
                                     text-subtle hover:text-copper-400 transition-colors duration-400
                                     opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                        >
                          <BookmarkX className="w-4 h-4" aria-hidden />
                        </button>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </section>
        ))}

        {/* ── Restaurants ──────────────────────────────── */}
        {showRestaurants && savedRestaurants.length > 0 && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between gap-6 mb-3">
              <h2 className="kicker kicker-gold flex items-center gap-2">
                <Utensils className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden />
                {t("services", "tab_restaurants")}
              </h2>
              <span className="tabular text-[11px] text-subtle">
                {String(savedRestaurants.length).padStart(2, "0")}
              </span>
            </div>
            <Rule />
            <ul>
              <AnimatePresence initial={false}>
                {savedRestaurants.map((r) => (
                  <motion.li
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="hairline-b overflow-hidden"
                  >
                    <div className="group flex items-center gap-4 sm:gap-5 py-4">
                      <button
                        onClick={() => navigate(`/services/restaurants/${r.id}`)}
                        className="shrink-0 w-14 h-14 rounded-sm overflow-hidden bg-[var(--muted)] flex items-center justify-center"
                        aria-hidden
                        tabIndex={-1}
                      >
                        <img src={r.img} alt="" loading="lazy" className="w-full h-full object-cover" />
                      </button>
                      <button
                        onClick={() => navigate(`/services/restaurants/${r.id}`)}
                        className="flex-1 min-w-0 text-left"
                      >
                        <span className="block font-display text-[18px] leading-tight text-ink truncate route-underline">
                          {r.name}
                        </span>
                        <span className="block tabular text-[11px] text-subtle mt-1">
                          {r.city} · ★ {r.rating} · {r.priceRange}
                        </span>
                      </button>
                      <button
                        onClick={() => toggleSavedRestaurant(r.id)}
                        aria-label={t("detail", "remove_plan")}
                        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-sm
                                   text-subtle hover:text-copper-400 transition-colors duration-400
                                   opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                      >
                        <BookmarkX className="w-4 h-4" aria-hidden />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </section>
        )}

        {/* ── Hotels ───────────────────────────────────── */}
        {showHotels && savedHotels.length > 0 && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between gap-6 mb-3">
              <h2 className="kicker kicker-gold flex items-center gap-2">
                <HotelIcon className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden />
                {t("services", "tab_hotels")}
              </h2>
              <span className="tabular text-[11px] text-subtle">
                {String(savedHotels.length).padStart(2, "0")}
              </span>
            </div>
            <Rule />
            <ul>
              <AnimatePresence initial={false}>
                {savedHotels.map((h) => (
                  <motion.li
                    key={h.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="hairline-b overflow-hidden"
                  >
                    <div className="group flex items-center gap-4 sm:gap-5 py-4">
                      <button
                        onClick={() => navigate(`/services/hotels/${h.id}`)}
                        className="shrink-0 w-14 h-14 rounded-sm overflow-hidden bg-[var(--muted)] flex items-center justify-center"
                        aria-hidden
                        tabIndex={-1}
                      >
                        <img src={h.img} alt="" loading="lazy" className="w-full h-full object-cover" />
                      </button>
                      <button
                        onClick={() => navigate(`/services/hotels/${h.id}`)}
                        className="flex-1 min-w-0 text-left"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="block font-display text-[18px] leading-tight text-ink truncate route-underline">
                            {h.name}
                          </span>
                        </span>
                        <span className="block tabular text-[11px] text-subtle mt-1">
                          {h.city} · ★ {h.rating} · {h.pricePerNight.toLocaleString()} {t("services", "uzs_unit")}/{t("services", "per_night")}
                        </span>
                      </button>
                      <span className="hidden sm:flex shrink-0 items-center gap-0.5 text-subtle" aria-hidden>
                        {Array.from({ length: h.stars }, (_, i) => (
                          <Star key={i} className="w-3 h-3 text-gold-300 fill-gold-300" />
                        ))}
                      </span>
                      <button
                        onClick={() => toggleSavedHotel(h.id)}
                        aria-label={t("detail", "remove_plan")}
                        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-sm
                                   text-subtle hover:text-copper-400 transition-colors duration-400
                                   opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                      >
                        <BookmarkX className="w-4 h-4" aria-hidden />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </section>
        )}
      </PageWrap>
    </div>
  );
}
