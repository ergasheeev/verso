import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ArrowUpRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { COUNTRY_BY_SLUG, priceMark } from "@/data/countries";
import {
  Kicker,
  Rule,
  PageWrap,
  DataRow,
  Badge,
  Button,
  PremiumSeal,
  Surface,
} from "@/components/ui/editorial";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { FlagTile } from "@/components/shared/Flag";
import { LocalTime } from "@/components/country/LocalTime";
import { countryName, capitalName } from "@/data/countries.i18n";
import { useCountryProse } from "@/data/country-prose";
import { CountryMap } from "@/components/country/CountryMap";
import { GlobalPlaceGrid } from "@/components/country/GlobalPlaceGrid";
import { GLOBAL_PLACES_BY_COUNTRY } from "@/data/global-places";
import { COUNTRY_IMAGES } from "@/data/country-images";
import { ParallaxHero } from "@/components/ui/ScrollMotion";

/**
 * A country hub — the "country panel" the product is now organised around.
 *
 * The page is a dossier, not a landing page: masthead, a paragraph that says
 * something true about the place, then the facts a traveller actually needs
 * arranged so they can be read at a glance rather than scrolled for.
 *
 * The emergency block is given its own gold-ruled panel near the top of the
 * fold rather than buried in a footer. It is the one thing on this page
 * somebody may need to find in thirty seconds while their hands are shaking,
 * and the old product had these numbers three taps deep inside a profile
 * screen.
 */
export default function CountryHub() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const { t, lang } = useTranslation();
  const country = slug ? COUNTRY_BY_SLUG[slug] : undefined;
  // After `country` is resolved, not before: referencing it above its own
  // declaration is a temporal-dead-zone crash, not just bad ordering.
  useDocumentTitle(country ? countryName(country, lang) : undefined);
  // Above the early return — this is a hook, and an unknown slug must not
  // change how many run. It tolerates `undefined` for exactly that reason.
  const prose = useCountryProse(country, lang);
  const globalPlaces = country ? GLOBAL_PLACES_BY_COUNTRY.get(country.code) : undefined;

  if (!country) return <Navigate to="/atlas" replace />;

  const c = country;
  const isPremium = Boolean(user?.isPremium);

  // Signed, north/south and east/west — the mono coordinate line under the
  // masthead is a data mark, so it should read like one.
  const coords = `${Math.abs(c.lat).toFixed(2)}°${c.lat >= 0 ? "N" : "S"} ${Math.abs(c.lng).toFixed(2)}°${c.lng >= 0 ? "E" : "W"}`;

  // Same lookup the Atlas uses: the dataset's continent is an identifier,
  // and the display label has to come from the active locale.
  const continentLabel = t(
    "atlas",
    `continent_${c.continent.toLowerCase().replace(/\s+/g, "_")}`,
  );

  // Proper nouns in the reader's language. The dataset holds the English
  // form and these fall back to it, so an unfilled locale still renders.
  const name = countryName(c, lang);
  const capital = capitalName(c, lang);
  const heroImg = COUNTRY_IMAGES[c.code];

  return (
    <div className="grain-overlay pb-24">
      {/* ── Photograph ───────────────────────────────────
          Every country in the dataset has one; if a code ever lacks it the
          masthead below carries the page on its own. */}
      {heroImg && (
        <section className="relative">
          {/* Not `.figure`: that class's own ::after paints a caption
              scrim up to 90% opaque black at the bottom, fading fully clear
              only above 78% of the frame — built for photos with a title
              overlaid on them (Atlas, LocationDetail). Nothing sits on this
              one; the name and tagline are below it, so that scrim just
              stacked on top of the fade below and left the photo looking
              almost entirely dark. */}
          <div className="relative h-[34vh] min-h-[220px] max-h-[380px] overflow-hidden bg-[var(--muted)]">
            <ParallaxHero className="absolute inset-0 scale-110">
              <img
                src={heroImg}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover"
              />
            </ParallaxHero>
            {/* A short fade at the very bottom edge only, so the photo
                meets the page background without a hard seam — the photo
                itself stays clear everywhere above that. */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--background)] to-transparent" />
          </div>
        </section>
      )}
      <PageWrap>
        {/* ── Masthead ─────────────────────────────────── */}
        <header className={cn("pb-10", heroImg ? "pt-8" : "pt-12 sm:pt-20")}>
          <button
            onClick={() => navigate("/atlas")}
            className="tap-44 kicker hover:text-accent transition-colors duration-400 mb-6 inline-block"
          >
            ← {t("nav", "atlas")}
          </button>

          <div className="flex items-start gap-5 sm:gap-7">
            {/* A warm plate carrying the country's own hue, rather than the
                flag emoji (which has no glyph at all on Windows). The first
                version set the ISO code in monospace inside a hairline box,
                which read as a licence plate. */}
            <FlagTile code={c.code} size="lg" className="rounded-lg w-[72px] h-12 sm:w-[88px] sm:h-[58px]" />
            <div className="min-w-0 flex-1">
              <div className="overflow-hidden">
                {/* break-words: a single long country name ("O‘zbekiston",
                    "Liechtenstein") is one unbreakable word at display size
                    and overran its column on a 320px screen. */}
                <h1 className="font-display text-display-sm sm:text-display text-ink animate-rise break-words">
                  {name}
                </h1>
              </div>
              <p className="text-[13px] text-subtle mt-3">
                {/* c.continent is an English dataset key ("North America"),
                    not a label. It was being printed raw, so a Russian
                    reader got "Asia" under a page of Russian headings. */}
                {continentLabel} · <span className="mono text-[11px]">{coords}</span>
              </p>
            </div>
          </div>

          <p className="pull-quote text-[24px] sm:text-[30px] mt-8 max-w-[24ch]">
            {prose.tagline}
          </p>
        </header>

        <Rule gold />

        {/* ── Dossier ──────────────────────────────────── */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] py-12">
          {/* Left: the read */}
          <div>
            <p className="drop-cap text-[16px] leading-[1.75] text-ink max-w-[62ch]">
              {prose.summary}
            </p>

            <div className="mt-10">
              <h2 className="subhead mb-3">{t("country", "when_to_go")}</h2>
              <Rule />
              <p className="text-[15px] text-ink mt-4">{prose.bestSeason}</p>
            </div>

            <div className="mt-10">
              <h2 className="subhead mb-3">{t("country", "entry")}</h2>
              <Rule />
              <p className="text-[15px] text-ink mt-4 max-w-[58ch] leading-relaxed">{prose.visaNote}</p>
              <p className="text-[12.5px] text-subtle mt-3 max-w-[58ch] leading-relaxed">
                {t("country", "entry_disclaimer")}
              </p>
            </div>

            {/* The assistant, pointed at this country. */}
            <div className="mt-12 border border-[var(--gold-hairline)] rounded-sm p-7 bg-[var(--gold-soft)]">
              <Kicker gold className="mb-3">Verso AI</Kicker>
              <h2 className="font-display text-[24px] leading-tight text-ink mb-2.5">
                {t("country", "ai_title", { country: name })}
              </h2>
              <p className="text-[13px] leading-relaxed text-subtle mb-6 max-w-[48ch]">
                {t("country", "ai_body", { currency: c.currency })}
              </p>
              <Button onClick={() => navigate(`/chat?country=${c.slug}`)}>
                {t("country", "ai_cta")}
                <ArrowUpRight className="w-4 h-4" aria-hidden />
              </Button>
            </div>
          </div>

          {/* Right: the facts */}
          <aside className="lg:sticky lg:top-6 lg:self-start space-y-10">
            {/* Above Essentials on purpose: it is the only fact on this page
                that changes while you are reading it. */}
            <section>
              <Kicker className="mb-3">{t("country", "local_time")}</Kicker>
              <Rule />
              <div className="pt-4">
                <LocalTime code={c.code} />
              </div>
            </section>

            <section>
              <Kicker className="mb-3">{t("country", "essentials")}</Kicker>
              <Rule />
              <dl className="mt-1">
                <DataRow label={t("country", "capital")} value={capital} />
                <DataRow
                  label={t("country", "currency")}
                  value={
                    <span className="flex items-baseline gap-2 justify-end">
                      <span>{c.currency}</span>
                      <span className="text-subtle text-[11.5px]">{c.currencyName}</span>
                    </span>
                  }
                />
                <DataRow label={t("country", "cost")} value={<span className="text-accent">{priceMark(c.priceLevel)}</span>} />
                <DataRow label={t("country", "dialling")} value={c.callingCode} />
                <DataRow
                  label={t("country", "languages")}
                  value={<span className="font-sans">{c.languages.join(", ")}</span>}
                />
              </dl>
            </section>

            {/* ── Emergency ────────────────────────────────
                Gold-ruled and high on the page on purpose — see the note at
                the top of this file. */}
            <section className="border border-[var(--gold-hairline)] rounded-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="w-3.5 h-3.5 text-accent" aria-hidden />
                <Kicker gold>{t("country", "emergency")}</Kicker>
              </div>
              <a
                href={`tel:${c.emergency.primary}`}
                className="tap-44 block font-display text-[40px] leading-none text-accent tabular
                           hover:text-gold-300 transition-colors duration-400"
              >
                {c.emergency.primary}
              </a>
              <p className="text-[12.5px] text-subtle mt-2 mb-4">
                {t("country", "emergency_note", { country: name })}
              </p>
              <Rule />
              <dl className="mt-1">
                {c.emergency.police && <DataRow label={t("country", "police")} value={c.emergency.police} />}
                {c.emergency.ambulance && <DataRow label={t("country", "ambulance")} value={c.emergency.ambulance} />}
                {c.emergency.fire && <DataRow label={t("country", "fire")} value={c.emergency.fire} />}
                {c.emergency.tourist && <DataRow label={t("country", "tourist_police")} value={c.emergency.tourist} />}
              </dl>
            </section>

            {/* ── Pro ──────────────────────────────────── */}
            {!isPremium && (
              <Surface gold className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <PremiumSeal />
                  <Kicker>{t("country", "members_only")}</Kicker>
                </div>
                <h3 className="font-display text-[19px] leading-tight text-ink mb-2">
                  {t("country", "pro_title", { country: name })}
                </h3>
                <p className="text-[12px] leading-relaxed text-subtle mb-5">
                  {t("country", "pro_body")}
                </p>
                <Button variant="secondary" size="sm" fullWidth onClick={() => navigate("/pro")}>
                  {t("country", "pro_cta")}
                </Button>
              </Surface>
            )}
          </aside>
        </div>

        <Rule />

        {/* ── Where it is ──────────────────────────────── */}
        <section className="py-12">
          <div className="flex items-end justify-between gap-6 mb-3.5">
            <div>
              <Kicker className="mb-2.5">{t("country", "map")}</Kicker>
              <h2 className="font-display text-2xl sm:text-3xl text-ink leading-[1.08]">
                {name}
              </h2>
            </div>
            <span className="tabular text-[12px] text-subtle shrink-0 pb-1">{coords}</span>
          </div>
          <Rule />
          <CountryMap c={c} className="mt-7" />
          <p className="text-[12.5px] text-subtle mt-3">{t("country", "map_caption")}</p>
        </section>

        <Rule />

        {/* ── Places ───────────────────────────────────── */}
        <section className="py-12">
          <div className="flex items-end justify-between gap-6 mb-3.5">
            <div>
              <Kicker className="mb-2.5">{t("country", "places")}</Kicker>
              <h2 className="font-display text-2xl sm:text-3xl text-ink leading-[1.08]">
                {t("country", "places_title", { country: name })}
              </h2>
            </div>
            <Badge>{c.code}</Badge>
          </div>
          <Rule />

          {/* Uzbekistan keeps its own fully-booked catalogue (reviews, plan,
              backend rows) at /locations. The other 45 the dataset covers
              get a lighter, read-only grid — real places, but not wired
              into the booking/review system Uzbekistan has. The remaining
              6 the dataset doesn't reach yet fall back to the AI. */}
          {c.code === "UZ" ? (
            <div className="pt-8">
              <Button variant="secondary" onClick={() => navigate("/locations")}>
                {t("country", "browse_all")}
                <ArrowUpRight className="w-4 h-4" aria-hidden />
              </Button>
            </div>
          ) : globalPlaces?.length ? (
            <div className="pt-8">
              <p className="text-[12px] text-subtle mb-6">{t("country", "places_uz_note")}</p>
              <GlobalPlaceGrid places={globalPlaces} />
            </div>
          ) : (
            <div className="pt-8 max-w-[52ch]">
              <p className="text-[14px] leading-relaxed text-subtle">
                {t("country", "country_level_note", { country: name })}
              </p>
              <Button variant="ghost" size="sm" className="mt-4 -ml-1" onClick={() => navigate("/chat")}>
                {t("country", "ask_ai")}
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
              </Button>
            </div>
          )}
        </section>
      </PageWrap>
    </div>
  );
}
