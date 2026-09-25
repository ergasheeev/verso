import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowUpRight, X } from "lucide-react";
import {
  COUNTRIES,
  CONTINENTS,
  FEATURED_COUNTRIES,
  priceMark,
  plateHue,
  type Continent,
  type Country,
} from "@/data/countries";
import { Kicker, Rule, PageWrap } from "@/components/ui/editorial";
import { ParallaxHero, CountUp, Reveal } from "@/components/ui/ScrollMotion";
import { ScrollRow } from "@/components/ui/ScrollRow";
import { Flag, FlagTile } from "@/components/shared/Flag";
import { COUNTRY_IMAGES } from "@/data/country-images";
import registanImg from "@/data/registan.jpg";
import { countryName, capitalName } from "@/data/countries.i18n";
import { useTranslation, LOCALE_TAGS } from "@/i18n";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { cn } from "@/lib/utils";
import { HeroCarousel } from "@/components/shared/HeroCarousel";
import { HERO_IMAGES } from "@/data/hero-images";

/**
 * The Atlas — the app's root, set as the front of an issue.
 *
 * One real photograph leads, the featured countries are covers rather than rows,
 * and the full index is dense but free of monospace and numbering. Countries we
 * hold no photograph for get a `plate` — a warm, grained, per-country wash —
 * rather than a grey box with an icon, which is what a broken image looks like.
 */

/**
 * A labelled select on the filter bar.
 *
 * A native `select` on purpose: it is two short lists on an already dense
 * bar, and a custom popover would cover the very results being filtered.
 * The label sits inline as a kicker so the control reads as part of the
 * ruled bar rather than a form field dropped onto it.
 */
function FilterSelect({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="kicker hidden md:inline">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="bg-transparent border-b border-[var(--input-border)] py-2.5 sm:py-2 pr-5 text-[13px]
                   text-ink outline-none cursor-pointer appearance-none
                   focus:border-gold-400 transition-colors duration-300
                   bg-[right_0_center] bg-no-repeat"
        style={{
          // Inline chevron rather than an absolutely-positioned icon: the
          // select's own box is the click target, so an overlaid icon would
          // need pointer-events juggling to stay clickable.
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-elevated">{o.label}</option>
        ))}
      </select>
    </label>
  );
}

/** A featured country, set as a cover. */
function CountryCover({
  c, image, tall, continentLabel, name, capital,
}: {
  c: Country;
  image?: string;
  tall?: boolean;
  /** Localised continent name — `c.continent` is an English dataset key. */
  continentLabel: string;
  /** Localised proper nouns; the dataset holds only the English forms. */
  name: string;
  capital: string;
}) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/c/${c.slug}`)}
      className={cn(
        "group relative text-left rounded-xl overflow-hidden w-full",
        "border border-[var(--border)] hover:border-[var(--gold-hairline)]",
        "transition-colors duration-600 card-lift",
        // The lead fills the two rows it spans; aspect-ratio would fight the
        // row span and collapse it.
        tall ? "h-full min-h-[420px]" : "aspect-[4/5]",
      )}
    >
      {/* `.figure` sets `position: relative`, and it is declared after
          Tailwind's utilities, so it overrides an `absolute` class on the
          same element — which collapsed this container to zero height and
          made both the plate and the photograph invisible. It fills the
          button in normal flow instead. */}
      <div
        className={cn("figure w-full h-full", !image && "plate")}
        style={!image ? ({ "--plate-h": plateHue(c.code) } as React.CSSProperties) : undefined}
      >
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            // One crop for every card so the set shares a geometry; a little
            // below centre keeps the landmark, not the sky, in a portrait frame.
            className={cn(
              "absolute inset-0 w-full h-full object-cover",
              // The lead is a tall column, so a landscape photo loses most of its width.
              // Overscan the frame upward (anchored to the bottom) so the crop drops the empty
              // sky instead of just recentring it: on a frame this narrow, vertical
              // object-position cannot move a photo that already fills the full height.
              tall ? "top-auto bottom-0 h-[138%] object-[center_70%]" : "object-[center_60%]",
              "transition-transform duration-900 ease-spring group-hover:scale-[1.05]",
            )}
          />
        ) : (
          // A country without photography gets a quiet flag mark in the corner: something
          // that belongs to this country specifically, without competing with the name set
          // over it. One small flag, tucked into the corner the title text never reaches.
          <span
            aria-hidden
            className="absolute top-5 right-5 opacity-[0.22] pointer-events-none"
          >
            <Flag
              code={c.code}
              size="lg"
              className="w-11 h-auto aspect-[3/2] border-0 rounded-[3px] saturate-[0.75]"
            />
          </span>
        )}
      </div>

      <div className="absolute inset-0 z-[2] flex flex-col justify-end p-6">
        <span className="flex items-center gap-2.5 mb-2.5">
          <Flag code={c.code} size="sm" className="border-white/25" />
          <span className="kicker text-[#F2EADC]/85">{continentLabel}</span>
        </span>
        <h3 className="font-display text-[28px] leading-[1.02] text-[#F2EADC] mb-2.5">
          {name}
        </h3>
        {/* `!`: .pull-quote sets the theme gold, which on paper is a dark
            #8A6224 — unreadable over a photograph. On-photo text is always
            the light gold. */}
        <p className="pull-quote text-[15px] !text-gold-300 max-w-[22ch] mb-4">
          {c.tagline}
        </p>
        <div className="flex items-center gap-2.5 text-[12px] text-[#F2EADC]/70">
          <span>{capital}</span>
          <span aria-hidden className="w-1 h-1 rounded-full bg-white/35" />
          <span>{c.currency}</span>
          <span aria-hidden className="w-1 h-1 rounded-full bg-white/35" />
          <span className="tabular text-gold-300">{priceMark(c.priceLevel)}</span>
        </div>
      </div>
    </button>
  );
}

export default function Atlas() {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  useDocumentTitle(t("nav", "atlas"));
  const [continent, setContinent] = useState<Continent | "All">("All");
  const [query, setQuery] = useState("");
  // Budget is the filter people reach for first on an atlas, and the dataset
  // already carries priceLevel.
  const [budget, setBudget] = useState<0 | 1 | 2 | 3>(0);
  const [sort, setSort] = useState<"name" | "price_asc" | "price_desc">("name");

  // Continents arrive from the dataset as English keys ("North America"): fine as
  // identifiers, but translated for display.
  const continentLabel = (k: Continent | "All") =>
    k === "All" ? t("atlas", "filter_all") : t("atlas", `continent_${k.toLowerCase().replace(/\s+/g, "_")}`);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COUNTRIES.filter((c) => {
      if (continent !== "All" && c.continent !== continent) return false;
      if (budget !== 0 && c.priceLevel !== budget) return false;
      if (!q) return true;
      // Both forms: a reader may know the country by its English name or
      // by the one printed in front of them, and either should find it.
      return (
        c.name.toLowerCase().includes(q) ||
        countryName(c, lang).toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q) ||
        capitalName(c, lang).toLowerCase().includes(q) ||
        c.currency.toLowerCase().includes(q) ||
        c.continent.toLowerCase().includes(q)
      );
    });
  }, [continent, query, budget, lang]);

  const filtered = continent !== "All" || budget !== 0 || query.trim().length > 0;
  const clearAll = () => { setContinent("All"); setBudget(0); setQuery(""); };

  // Sorting inside each continent, not across them — the index is grouped
  // geographically, so a global sort would have nowhere to show itself.
  // Sorted on the localised name under the reader's own collation: an
  // index headed "A-Z" that orders Cyrillic names by their English spelling
  // is not alphabetical by any rule the reader knows.
  const byName = (a: Country, b: Country) =>
    countryName(a, lang).localeCompare(countryName(b, lang), LOCALE_TAGS[lang]);

  const sortRows = (a: Country, b: Country) => {
    if (sort === "price_asc") return a.priceLevel - b.priceLevel || byName(a, b);
    if (sort === "price_desc") return b.priceLevel - a.priceLevel || byName(a, b);
    return byName(a, b);
  };

  const byContinent = useMemo(() => {
    const groups = new Map<Continent, Country[]>();
    for (const c of results) {
      const list = groups.get(c.continent) ?? [];
      list.push(c);
      groups.set(c.continent, list);
    }
    for (const list of groups.values()) list.sort(sortRows);
    return CONTINENTS.filter((k) => groups.has(k)).map((k) => [k, groups.get(k)!] as const);
  }, [results, sort, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // The one country we actually hold photography for leads the page.
  const lead = FEATURED_COUNTRIES.find((c) => c.code === "UZ") ?? FEATURED_COUNTRIES[0];
  const rest = FEATURED_COUNTRIES.filter((c) => c.code !== lead.code).slice(0, 6);

  return (
    <div className="grain-overlay pb-24">
      {/* ── Lead ───────────────────────────────────────── */}
      <section className="relative">
        {/* Height follows the width on wide screens: a flat 60vh would make a 1920px hero
            only ~650px tall, a 3:1 strip that photographs (all roughly 3:2) would have to
            be cropped hard to fill. The clamp keeps it near 2.2:1 there and unchanged on
            laptops and phones. */}
        <div className="figure relative h-[68vh] min-h-[420px] lg:min-h-[clamp(520px,42vw,820px)] max-h-[860px]">
          {/* Scaled slightly past full bleed so the parallax drift never
              exposes an edge as the image lags behind the scroll. */}
          <ParallaxHero className="absolute inset-0 scale-110">
            <HeroCarousel images={HERO_IMAGES} imgClassName="object-[center_35%]" />
          </ParallaxHero>
          <div className="absolute inset-0 z-[2] flex flex-col justify-end">
            <PageWrap className="pb-10">
              {/* Cream, not gold. This label sits high in the hero where the scrim has faded to
                  almost nothing, and gold at 11px measures 3.54:1 there against the photograph
                  — under the 4.5:1 floor for small text, in both themes. Gold stays where it
                  carries meaning (the CTA, the rules). */}
              <Kicker className="mb-5 text-[#F2EADC]">{t("atlas", "kicker")}</Kicker>
              <h1 className="font-display text-display-sm sm:text-display lg:text-display-lg text-[#F2EADC] max-w-[12ch] mb-5 break-words">
                {t("atlas", "hero_title")}
              </h1>
              {/* Full cream, no opacity modifier. Over the hero scrim the
                  background measures 0.133 luminance, where cream at 75%
                  composites to 3.49:1 — and at 17px this is not "large text"
                  by WCAG (that starts at 18.66px bold / 24px regular), so it
                  needs the full 4.5:1. At 100% it measures 4.80:1. */}
              <p className="text-[15px] sm:text-[17px] leading-relaxed text-[#F2EADC] max-w-[46ch]">
                <CountUp to={COUNTRIES.length} /> {t("atlas", "hero_subtitle")}
              </p>
            </PageWrap>
          </div>
        </div>
      </section>

      <PageWrap>
        {/* ── Leading with ─────────────────────────────── */}
        <section className="py-14">
          <div className="flex items-end justify-between gap-6 mb-7">
            <div>
              <Kicker className="mb-2.5">{t("atlas", "leading_with")}</Kicker>
              <h2 className="font-display text-2xl sm:text-3xl text-ink leading-[1.08]">
                {t("atlas", "leading_title")}
              </h2>
            </div>
            <span className="tabular text-[12px] text-subtle shrink-0 pb-1">
              {FEATURED_COUNTRIES.length}
            </span>
          </div>

          {/* Deliberately uneven: the lead runs tall beside a pair, the rest fall into a
              looser grid. A uniform grid of identical tiles feels machine-set. */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-fr">
            {/* h-full on both the Reveal and the cover: Reveal's motion.div is the actual
                grid item, so without it the row-span-2 track stretches but the card inside
                stays at its content height, and the lead ends up shorter than the tiles it is
                meant to tower over. */}
            <Reveal className="sm:col-span-2 lg:col-span-1 lg:row-span-2 h-full">
              <CountryCover
                c={lead}
                // The tall column shows a narrow vertical slice of a landscape
                // photograph, so it takes the daylight Registan frame (also the
                // hero's lead image) rather than the dusk one, which is mostly
                // empty navy sky at this crop.
                image={registanImg}
                tall
                continentLabel={continentLabel(lead.continent)}
                name={countryName(lead, lang)}
                capital={capitalName(lead, lang)}
              />
            </Reveal>
            {rest.map((c, i) => (
              // Capped so the last tile in a long row never waits noticeably
              // longer than the first.
              <Reveal key={c.code} delay={Math.min(i, 4) * 0.06}>
                <CountryCover
                  c={c}
                  image={COUNTRY_IMAGES[c.code]}
                  continentLabel={continentLabel(c.continent)}
                  name={countryName(c, lang)}
                  capital={capitalName(c, lang)}
                />
              </Reveal>
            ))}
          </div>
        </section>

        <Rule gold />
      </PageWrap>

      {/* ── Filters ──────────────────────────────────────
          Sticky: the index below runs to six screens, so the bar stays reachable.
          
          It sits OUTSIDE PageWrap with its own inner PageWrap: negative margins only
          reach PageWrap's own padding, so on a wide screen the panel would stop short of
          the viewport and country rows would slide past in the gap at either end. The
          bar is full-bleed; only its contents are measured.
          
          Fully opaque, not a translucent glass panel: at 92% the rows underneath stay
          legible straight through it, so the controls would sit on a moving page of
          text. It also keeps one more backdrop-filter off the scroll path.
          
          top-0, not the masthead height: MainLayout is a flex column and the masthead
          is a sibling of this scroll container, so the scrollport already begins below
          it. */}
      <section className="sticky top-0 z-30 bg-[var(--background)] hairline-b">
        <PageWrap className="pt-5 pb-3">
          {/* Continents. A wrapping flex ran to three ragged lines on a
              phone; one swipeable row with edge fades reads as a deliberate
              control instead. */}
          <ScrollRow className="-mx-1 px-1">
            <div className="flex items-center gap-1 w-max">
              {(["All", ...CONTINENTS] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setContinent(k)}
                  aria-pressed={continent === k}
                  className={cn(
                    "tap-44 shrink-0 whitespace-nowrap px-3.5 py-2 text-[12.5px] rounded-sm border",
                    "transition-colors duration-300",
                    continent === k
                      ? "border-[var(--gold-hairline)] text-accent bg-[var(--gold-soft)]"
                      : "border-transparent text-subtle hover:text-ink hover:bg-[var(--muted)]",
                  )}
                >
                  {continentLabel(k)}
                </button>
              ))}
            </div>
          </ScrollRow>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 mt-3">
            <label className="relative flex items-center flex-1 min-w-0">
              <Search
                className="absolute left-0 w-4 h-4 text-subtle pointer-events-none"
                strokeWidth={1.75}
                aria-hidden
              />
              <span className="sr-only">{t("atlas", "search_label")}</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("atlas", "search_placeholder")}
                className="w-full bg-transparent border-b border-[var(--input-border)]
                           pl-6 pr-7 py-2.5 sm:py-2 text-[16px] sm:text-[14px] text-ink
                           placeholder:text-subtle outline-none
                           focus:border-gold-400 transition-colors duration-300"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label={t("atlas", "clear")}
                  className="absolute right-0 text-subtle hover:text-accent transition-colors duration-300"
                >
                  <X className="w-3.5 h-3.5" aria-hidden />
                </button>
              )}
            </label>

            <div className="flex items-center gap-4 shrink-0">
              {/* Budget. Native selects because these are two short lists on
                  a bar that is already dense — a custom popover here would
                  cover the results the reader is filtering. */}
              <FilterSelect
                label={t("atlas", "budget_label")}
                value={String(budget)}
                onChange={(v) => setBudget(Number(v) as 0 | 1 | 2 | 3)}
                options={[
                  { value: "0", label: t("atlas", "budget_any") },
                  { value: "1", label: priceMark(1) },
                  { value: "2", label: priceMark(2) },
                  { value: "3", label: priceMark(3) },
                ]}
              />
              <FilterSelect
                label={t("atlas", "sort_label")}
                value={sort}
                onChange={(v) => setSort(v as typeof sort)}
                options={[
                  { value: "name", label: t("atlas", "sort_name") },
                  { value: "price_asc", label: t("atlas", "sort_price_asc") },
                  { value: "price_desc", label: t("atlas", "sort_price_desc") },
                ]}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2.5 min-h-[20px]">
            <span className="tabular text-[11px] tracking-[0.1em] uppercase text-subtle">
              {results.length} / {COUNTRIES.length} · {t("atlas", "showing")}
            </span>
            {filtered && (
              <button
                onClick={clearAll}
                className="text-[11px] uppercase tracking-[0.1em] text-accent hover:underline underline-offset-4"
              >
                {t("atlas", "clear")}
              </button>
            )}
          </div>
        </PageWrap>
      </section>

      <PageWrap>
        {/* ── The index ────────────────────────────────── */}
        <section className="pt-12">
          {byContinent.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-2xl text-ink mb-2">{t("atlas", "no_results")}</p>
              <p className="text-[14px] text-subtle max-w-[40ch] mx-auto">
                {t("atlas", "no_results_hint")}
              </p>
              <button
                onClick={clearAll}
                className="mt-6 text-[12px] uppercase tracking-[0.12em] text-accent hover:underline underline-offset-4"
              >
                {t("atlas", "clear")}
              </button>
            </div>
          ) : (
            byContinent.map(([name, list]) => (
              <div key={name} className="mb-14">
                <div className="flex items-baseline justify-between gap-6 mb-3">
                  <h2 className="subhead">{continentLabel(name)}</h2>
                  <span className="tabular text-[12px] text-subtle">{list.length}</span>
                </div>
                <Rule />

                <ul>
                  {list.map((c) => {
                    return (
                    <li key={c.code} className="group relative hairline-b">
                      <button
                        onClick={() => navigate(`/c/${c.slug}`)}
                        className="w-full text-left py-5 pr-11
                                   grid grid-cols-[1fr_auto] items-center gap-x-6
                                   sm:grid-cols-[minmax(0,1fr)_auto_auto]
                                   lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)_auto_auto]
                                   transition-colors duration-400"
                      >
                        <span className="min-w-0 flex items-center gap-4">
                          {/* A flag is the one mark a reader recognises before finishing the name, and it
                              sits on the plate so a blocked CDN still leaves a warm square rather than a
                              gap. */}
                          <FlagTile
                            code={c.code}
                            className="w-12 h-8 sm:w-14 sm:h-[38px] group-hover:scale-105 transition-transform duration-500 ease-spring"
                          />
                          <span className="min-w-0">
                            {/* sm:truncate, not truncate: at 390px this
                                column owns the row, and the longest names
                                ("United Arab Emirates") lost their last word
                                to the ellipsis. The name of the row is the
                                one thing that must never be cut. */}
                            <span className="block font-display text-[19px] min-[400px]:text-[21px] leading-tight text-ink break-words sm:truncate route-underline">
                              {countryName(c, lang)}
                            </span>
                            <span className="block text-[12.5px] text-subtle truncate mt-0.5 sm:hidden">
                              {capitalName(c, lang)} · {c.currency}
                            </span>
                          </span>
                        </span>

                        {/* lg:, not sm:. The tagline column appears from lg: at 640px (a 200% zoom) a
                            full sentence in ~250px would truncate mid-word, so it only earns a column
                            once there is room for one; the middle band keeps the two-column layout. */}
                        <span className="hidden lg:block min-w-0 text-[13px] leading-snug text-subtle truncate">
                          {c.tagline}
                        </span>

                        <span className="hidden sm:block text-[12.5px] text-subtle whitespace-nowrap">
                          {capitalName(c, lang)}
                        </span>

                        <span className="flex items-center gap-3 justify-end shrink-0">
                          <span className="tabular text-[12px] text-accent">
                            {priceMark(c.priceLevel)}
                          </span>
                          <ArrowUpRight
                            className="w-4 h-4 text-subtle opacity-0 group-hover:opacity-100
                                       transition-opacity duration-400"
                            aria-hidden
                          />
                        </span>
                      </button>
                    </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </section>
      </PageWrap>
    </div>
  );
}
