import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight, BookOpen, Sparkles, ShieldCheck, Languages, Sun, Moon,
} from "lucide-react";
import { FEATURED_COUNTRIES, COUNTRIES, CONTINENTS, priceMark } from "@/data/countries";
import { LOCATIONS, RESTAURANTS, HOTELS, GUIDES, INIT_REVIEWS } from "@/data";
import { ParallaxHero, CountUp } from "@/components/ui/ScrollMotion";
import { HeroCarousel } from "@/components/shared/HeroCarousel";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { FlagTile } from "@/components/shared/Flag";
import { countryName } from "@/data/countries.i18n";
import { Wordmark, TAGLINE } from "@/components/brand/Wordmark";
import { Kicker, Rule, Button, PremiumSeal } from "@/components/ui/editorial";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";
import { HERO_IMAGES } from "@/data/hero-images";

/**
 * The cover.
 *
 * Read as the front of an issue rather than a SaaS landing page: one photograph,
 * one headline set large, then a ruled contents. No coloured icon chips, stat
 * tiles, numbered circles or gradient CTA slab — each is a separate attempt to
 * persuade, and together they take more room than anything the product offers.
 */

/**
 * Footer column. The heading is a kicker and the links sit on a hairline
 * rail, so the three columns read as one ruled block rather than three
 * floating lists.
 */
function FooterNav({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <nav aria-label={label}>
      {/* Two lines reserved: "Mentions légales" and "Правовая информация"
          wrap where "Explore" does not, which pushed that column's links
          a line lower than its neighbours'. */}
      <Kicker className="block mb-3 sm:min-h-[30px]">{label}</Kicker>
      <ul className="flex flex-col border-l border-[var(--gold-hairline)] pl-4">{children}</ul>
    </nav>
  );
}

/**
 * One footer link. Buttons and anchors look identical; the gold bar slides
 * in from the rail on hover so the whole column feels like one mechanism.
 */
function FooterLink({
  children, onClick, href,
}: { children: React.ReactNode; onClick?: () => void; href?: string }) {
  // py-2.5 rather than py-2: at 13px, py-2 rows are 36px tall, under the 44px touch
  // guideline, and a footer is exactly where a mis-tap sends someone to the wrong
  // legal page.
  const cls =
    "group relative block w-full text-left py-2.5 text-[13px] text-subtle " +
    "hover:text-accent transition-colors duration-300 tap-44";
  const bar = (
    <span
      aria-hidden
      className="absolute -left-4 top-1/2 -translate-y-1/2 h-4 w-px bg-[var(--gold)] scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-300"
    />
  );
  return (
    <li>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {bar}
          {children}
        </a>
      ) : (
        <button onClick={onClick} className={cls}>
          {bar}
          {children}
        </button>
      )}
    </li>
  );
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const } },
};
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

/**
 * Scroll reveal with a safety net.
 *
 * These sections start at opacity 0 and are made visible only by the viewport
 * animation firing; an observer that never fires would leave real marketing copy
 * permanently blank. If the reveal has not run shortly after mount, the content
 * is shown anyway. Worst case someone misses one fade; they never lose the text.
 */
function Reveal({
  children,
  className,
  stagger,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
}) {
  const [forced, setForced] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setForced(true), 1500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <motion.div
      className={className}
      variants={stagger ? container : item}
      initial="hidden"
      whileInView="show"
      // Once the fallback trips, `animate` pins the section to its shown
      // state; until then it stays undefined so whileInView drives it
      // normally and the staggered entrance still plays.
      animate={forced ? "show" : undefined}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}


export default function Landing() {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  // "/" stays reachable regardless of session state — typing it, following a
  // shared link, clicking the wordmark. It adapts its calls to action for an
  // already-signed-in visitor instead of redirecting them away.
  const enterApp = () => navigate("/atlas");

  const FEATURES = [
    { title: t("landing", "feature1_title"), desc: t("landing", "feature1_desc"), Icon: BookOpen },
    { title: t("landing", "feature2_title"), desc: t("landing", "feature2_desc"), Icon: Sparkles },
    { title: t("landing", "feature3_title"), desc: t("landing", "feature3_desc"), Icon: ShieldCheck },
    { title: t("landing", "feature4_title"), desc: t("landing", "feature4_desc"), Icon: Languages },
  ];

  // Real numbers, not marketing copy — computed from the same data the app
  // itself runs on, so this strip can never drift out of sync with what a
  // visitor actually finds once they sign up.
  const reviewCount = Object.values(INIT_REVIEWS).reduce((sum, list) => sum + list.length, 0);
  const avgTrust = Math.round(
    Object.values(INIT_REVIEWS)
      .flat()
      .reduce((sum, r, _i, arr) => sum + r.trustScore / arr.length, 0),
  );

  return (
    <div className="app-bg grain-overlay min-h-dvh overflow-x-hidden">
      {/* ── Masthead ───────────────────────────────────────────── */}
      <header className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-5 sm:px-8 lg:px-12 py-6">
        {/* A short scrim: both the wordmark and the sign-in control sit on a
            photograph whose top edge is a pale sky, so their contrast cannot
            be left to whichever image happens to be loaded. */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent pointer-events-none" />
        {/* Forced to the bone wordmark rather than the theme-switched pair:
            every other placement sits on the app canvas, where the theme is
            the background. Here the background is always a dark photograph. */}
        <div className="relative text-[#F5EFE3]">
          <Wordmark size="md" />
        </div>
        <div className="relative flex items-center gap-2.5">
          <LanguageSwitcher onImage />
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? t("profile", "theme_light") : t("profile", "theme_dark")}
            className="tap-44 flex items-center justify-center w-9 h-9 rounded-sm border border-white/25 bg-white/5 backdrop-blur-sm
                       text-[#F5EFE3] hover:bg-white/12 hover:border-white/40
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]
                       transition-colors duration-400"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" aria-hidden /> : <Moon className="w-4 h-4" aria-hidden />}
          </button>
          <button
            onClick={isLoggedIn ? enterApp : () => navigate("/login")}
            className="tap-44 h-9 px-4 rounded-sm border border-white/25 bg-white/5 backdrop-blur-sm
                       text-[#F5EFE3] text-[11px] uppercase tracking-[0.14em]
                       hover:bg-white/12 hover:border-white/40 transition-colors duration-400"
          >
            {isLoggedIn ? t("landing", "open_app") : t("landing", "sign_in")}
          </button>
        </div>
      </header>

      {/* ── Cover ──────────────────────────────────────────────── */}
      {/* min-h-dvh: the masthead is absolutely positioned over the photograph, so
          nothing else takes height from the first screen and the cover fills exactly
          one viewport. dvh (not vh) so mobile browser chrome doesn't push it past. */}
      <section id="cover" className="relative min-h-dvh flex items-end overflow-hidden">
        {/* scale-110 on the parallax wrapper, not just the load-in
            animation: once the image drifts on scroll it needs real
            overscan or the drift exposes bare canvas at the bottom edge. */}
        <ParallaxHero className="absolute inset-0 scale-110" speed={0.18}>
          <HeroCarousel images={HERO_IMAGES} imgClassName="object-[center_32%]" />
        </ParallaxHero>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09] from-[2%] via-[#0C0A09]/62 via-[52%] to-transparent" />

        <div className="relative w-full px-5 sm:px-8 lg:px-12 pb-16 sm:pb-20">
          <div className="max-w-[1280px] mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Kicker gold className="mb-6">
                <CountUp to={COUNTRIES.length} /> {t("landing", "countries_word")} ·{" "}
                <CountUp to={CONTINENTS.length} /> {t("landing", "continents_word")}
              </Kicker>
            </motion.div>

            {/* The headline wipes up from behind its own rule. */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, y: "110%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-display-sm sm:text-display lg:text-display-lg
                           text-[#F5EFE3] max-w-[18ch]"
              >
                {t("landing", "hero_title")}
              </motion.h1>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-px bg-[var(--gold-hairline)] origin-left my-8 max-w-[34rem]"
            />

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              // Full cream. At 75% opacity the text composites to 3.49:1 over the hero scrim,
              // and 17px is not "large text" by WCAG; at 100% it measures 4.80:1.
              className="text-[#F5EFE3] text-[15px] sm:text-[17px] leading-relaxed max-w-[52ch] mb-10"
            >
              {t("landing", "hero_subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.68, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              {isLoggedIn ? (
                <Button size="lg" onClick={enterApp}>
                  {t("landing", "open_app")}
                  <ArrowUpRight className="w-4 h-4" aria-hidden />
                </Button>
              ) : (
                <>
                  <Button size="lg" onClick={() => navigate("/signup")}>
                    {t("landing", "cta_signup")}
                    <ArrowUpRight className="w-4 h-4" aria-hidden />
                  </Button>
                  <button
                    onClick={enterApp}
                    className="h-[3.25rem] px-7 rounded-sm border border-white/25 bg-white/5 backdrop-blur-sm
                               text-[#F5EFE3] text-[13px] uppercase tracking-[0.14em]
                               hover:bg-white/12 hover:border-white/40 transition-colors duration-400"
                  >
                    {t("landing", "cta_guest")}
                  </button>
                </>
              )}
            </motion.div>
          </div>
        </div>

        {/* A moving target, not a static chevron: the line itself travels
            up and down, echoing the wipe the headline just did rather than
            sitting there as one more inert icon. */}
        <motion.button
          onClick={() => document.getElementById("contents")?.scrollIntoView({ behavior: "smooth" })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          aria-label={t("landing", "scroll_cue")}
          className="tap-44 hidden sm:flex absolute bottom-8 right-8 lg:right-12 flex-col items-center gap-3 text-[#F5EFE3]/60 hover:text-[#F5EFE3] transition-colors duration-400"
        >
          <motion.span
            aria-hidden
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-current"
          />
          <span className="kicker text-inherit">{t("landing", "scroll_cue")}</span>
        </motion.button>
      </section>

      <div id="contents" className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12">
        {/* ── Contents ─────────────────────────────────────────── */}
        <section className="py-20">
          <Reveal>
            <Kicker className="mb-3">{t("landing", "features_title")}</Kicker>
            <Rule gold />
          </Reveal>

          <Reveal stagger className="grid gap-px bg-[var(--border)] sm:grid-cols-2 mt-10 border border-[var(--border)] rounded-sm overflow-hidden">
            {FEATURES.map(({ title, desc, Icon }, i) => (
              <motion.article
                key={title}
                variants={item}
                // A slight lift toward the reader on hover, the same
                // restrained physicality as the app's card-lift elsewhere —
                // not a tilt or a shadow bloom, just "this one is close".
                whileHover={{ y: -3 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-surface p-7 sm:p-9"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <span className="flex items-center justify-center w-10 h-10 rounded-sm border border-[var(--gold-hairline)] bg-[var(--gold-soft)]
                                    text-accent shrink-0 group-hover:bg-gold-400 group-hover:text-[#0C0A09] transition-colors duration-400">
                    <Icon className="w-4 h-4" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="mono text-[11px] text-subtle/60 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                {/* h2, not h3: the section's own heading is a Kicker (a
                    styled span), so an h3 here jumped the document straight
                    from h1 to h3 with no h2 in between. */}
                <h2 className="font-display text-[22px] leading-[1.15] text-ink mb-3">{title}</h2>
                <p className="text-[13.5px] leading-relaxed text-subtle max-w-[46ch]">{desc}</p>
              </motion.article>
            ))}
          </Reveal>
        </section>

        {/* ── Proof ───────────────────────────────────────────────
            Live numbers, not testimonial quotes with no way to verify them
            — every figure here is `.length` on the same data the app itself
            runs on, so it can't drift out of sync with what signing up
            actually gets you. */}
        <Reveal className="pb-20">
          <Kicker className="mb-3">{t("landing", "proof_title")}</Kicker>
          <Rule />
          <div className="grid grid-cols-3 gap-6 sm:gap-10 mt-8">
            {[
              { value: reviewCount, suffix: "+", label: t("landing", "proof_reviews") },
              { value: avgTrust, suffix: "%", label: t("landing", "proof_rating") },
              {
                // Sights plus the restaurants, hotels and guides the app
                // actually lists — not just the sightseeing catalogue —
                // since all four are "places" a visitor can open and act on.
                value: LOCATIONS.length + RESTAURANTS.length + HOTELS.length + GUIDES.length,
                suffix: "+",
                label: t("landing", "proof_places"),
              },
            ].map((s) => (
              <div key={s.label}>
                <p className="tabular font-display text-[32px] sm:text-[44px] leading-none text-ink">
                  <CountUp to={s.value} />
                  <span className="text-accent">{s.suffix}</span>
                </p>
                {/* hyphens-auto + break-words: three columns of a 320px screen leave 77px each,
                    and German sets these labels as single compounds — "Reisebewertungen" needs
                    101px, so it has to break mid-word rather than be cut with no ellipsis. */}
                <p className="text-[11.5px] sm:text-[12.5px] leading-snug text-subtle mt-2.5 max-w-[16ch] hyphens-auto break-words">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── Start somewhere ──────────────────────────────────── */}
        <section className="pb-20">
          <Reveal>
            {/* Stacked below sm. Side by side at 390px the kicker wraps to three lines and
                the heading fights the "open the full atlas" link for what is left of the row. */}
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6 mb-3.5">
              <div>
                <Kicker className="mb-2.5">{t("landing", "destinations_subtitle")}</Kicker>
                <h2 className="font-display text-2xl sm:text-3xl text-ink leading-[1.08]">
                  {t("landing", "destinations_title")}
                </h2>
              </div>
              <button
                onClick={enterApp}
                // Real padding, not the .tap-44 overlay: a sibling in this
                // row paints over the expander, so the enlarged area never
                // received the tap. py-3.5 clears 44px at this font size.
                className="shrink-0 py-3.5 text-[11px] uppercase tracking-[0.14em] text-subtle
                           hover:text-accent transition-colors duration-400 route-underline"
              >
                {t("landing", "see_all")}
              </button>
            </div>
            <Rule />
          </Reveal>

          <Reveal stagger>
            {/* max-w-4xl: at full container width the name, tagline and price
                landed in three widely separated islands per row. */}
            <ul className="max-w-4xl">
              {FEATURED_COUNTRIES.map((c) => (
                <motion.li key={c.code} variants={item}>
                  <button
                    onClick={() => navigate(`/c/${c.slug}`)}
                    className="group w-full text-left hairline-b py-4
                               grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-4
                               lg:grid-cols-[auto_12.5rem_minmax(0,1fr)_auto_auto] lg:gap-x-6
                               transition-transform duration-400 hover:translate-x-1.5"
                  >
                    {/* The flag is the plate: 3:2 like the flag itself, so it
                        fills the box edge to edge — no padding, no beige
                        margin, nothing cropped or stretched. */}
                    <FlagTile
                      code={c.code}
                      className="transition-transform duration-400 group-hover:scale-[1.08]"
                    />
                    <span className="min-w-0">
                      {/* sm:truncate, not truncate: on a phone this column has the row to itself, so a
                          name like "United Arab Emirates" wraps instead of being cut mid-word. It only
                          truncates from sm up, where it shares the row with the tagline and the price. */}
                      <span className="block font-display text-[19px] min-[400px]:text-[21px] leading-tight text-ink break-words sm:truncate route-underline">
                        {countryName(c, lang)}
                      </span>
                      {/* Two lines, ending on a word. A one-line truncate
                          cut these sentences at an arbitrary character —
                          "Petra is the headline. Wadi Rum is t…" */}
                      <span className="block text-[12.5px] leading-snug text-subtle line-clamp-2 mt-1 lg:hidden">
                        {c.tagline}
                      </span>
                    </span>
                    {/* lg:, not sm: — see the matching note in Atlas.tsx. At 640px
                        (a 200% zoom) this sentence truncated mid-word. */}
                    <span className="hidden lg:block min-w-0 text-[13px] text-subtle truncate">
                      {c.tagline}
                    </span>
                    <span className="tabular text-[12px] text-accent justify-self-end">
                      {priceMark(c.priceLevel)}
                    </span>
                    <ArrowUpRight
                      className="hidden sm:block w-4 h-4 text-subtle opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400"
                      aria-hidden
                    />
                  </button>
                </motion.li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* ── Closing ──────────────────────────────────────────── */}
        <Reveal className="pb-20">
          <div className="border border-[var(--gold-hairline)] rounded-sm p-8 sm:p-14 bg-[var(--gold-soft)]">
            <div className="flex items-center gap-3 mb-6">
              <PremiumSeal />
              <Kicker>{t("landing", "membership_kicker")}</Kicker>
            </div>
            {/* break-words: German sets this headline as two very long
                compounds ("Einhundertdreiundfünfzig…") that overran the
                panel by 111px on a 320px screen. */}
            <h2 className="font-display text-[26px] sm:text-display-sm leading-[1.1] text-ink max-w-[20ch] mb-5 break-words hyphens-auto">
              {t("landing", "final_cta_title")}
            </h2>
            <p className="text-[14px] leading-relaxed text-subtle max-w-[52ch] mb-8">
              {t("landing", "final_cta_desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {isLoggedIn ? (
                <Button onClick={enterApp}>{t("landing", "open_app")}</Button>
              ) : (
                <Button onClick={() => navigate("/signup")}>{t("landing", "cta_signup")}</Button>
              )}
              <Button variant="secondary" onClick={() => navigate("/pro")}>
                Verso Pro
              </Button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Colophon ───────────────────────────────────────────── */}
      <footer className="hairline-t bg-[var(--gold-soft)]">
        <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-8">
          {/* Two zones on a 12-column grid: the brand takes 5, the three link columns share
              the other 7 equally, so the row is full width with no orphaned gap. A hairline
              divides the zones from lg up. */}
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-0 mb-14">
            <div className="lg:col-span-5 lg:pr-12 lg:border-r lg:border-[var(--gold-hairline)]">
              <Wordmark size="md" className="mb-6" />
              <p className="font-display text-[22px] sm:text-[26px] leading-[1.25] text-ink max-w-[22ch]">
                {TAGLINE}
              </p>
              <p className="text-[13px] leading-relaxed text-subtle mt-4 max-w-[40ch]">
                {t("landing", "footer_tagline")}
              </p>
              <p className="tabular text-[11px] tracking-[0.12em] uppercase text-accent mt-8">
                {COUNTRIES.length} {t("landing", "countries_word")} · {CONTINENTS.length}{" "}
                {t("landing", "continents_word")}
              </p>
            </div>

            <div className="lg:col-span-7 lg:pl-12 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-10">
              <FooterNav label={t("landing", "footer_explore")}>
                <FooterLink onClick={enterApp}>{t("nav", "atlas")}</FooterLink>
                <FooterLink onClick={() => navigate("/chat")}>{t("chat", "title")}</FooterLink>
                <FooterLink onClick={() => navigate("/pro")}>{t("nav", "pro")}</FooterLink>
              </FooterNav>

              <FooterNav label={t("landing", "footer_legal")}>
                <FooterLink onClick={() => navigate("/privacy")}>
                  {t("landing", "footer_privacy")}
                </FooterLink>
                <FooterLink onClick={() => navigate("/terms")}>
                  {t("landing", "footer_terms")}
                </FooterLink>
              </FooterNav>

              {/* Language sits in the third column, where a reader looks for
                  it in a colophon; full row on a phone. */}
              <div className="col-span-2 sm:col-span-1">
                <Kicker className="mb-3 block sm:min-h-[30px]">
                  {t("landing", "language_label")}
                </Kicker>
                <LanguageSwitcher />
              </div>
            </div>
          </div>

          <Rule />

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-5 pt-7">
            <p className="tabular text-[11px] tracking-[0.12em] text-subtle">
              © {new Date().getFullYear()} VERSO · {t("landing", "footer_built")}
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="tap-44 self-start sm:self-auto inline-flex items-center gap-2 h-9 px-4 rounded-sm border border-[var(--border)]
                         text-[11px] tracking-[0.12em] uppercase text-subtle
                         hover:text-accent hover:border-[var(--gold-hairline)] transition-colors duration-400"
            >
              {t("landing", "footer_top")}
              <ArrowUpRight size={13} className="-rotate-45" aria-hidden />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
