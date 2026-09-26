import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowUpRight, Check, Star, Loader2, BookmarkX } from "lucide-react";
import { LOCATIONS, LOCATIONS_BY_ID, INIT_REVIEWS } from "@/data";
import { COUNTRY_BY_CODE, plateHue } from "@/data/countries";
import { countryName } from "@/data/countries.i18n";
import { tipTitle, tipBody } from "@/data/tips.i18n";
import { TIPS, TIP_CATEGORY_META, type TipCategory } from "@/data/tips";
import { Kicker, Rule, PageWrap, Button } from "@/components/ui/editorial";
import { ScrollRow } from "@/components/ui/ScrollRow";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import { useTranslation } from "@/i18n";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";

/** Shape returned by GET /api/reviews/me — a review plus the place it's
 * about, since "my reviews" reads across every location at once. */
interface MyReview {
  id: string;
  locationId: string;
  text: string;
  stars: number;
  createdAt: string;
  location: { id: string; name: string; city: string; images: string[] } | null;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1 sm:gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          // p-1.5 on a 32px glyph clears 44px per star on a phone, and the
          // row still measures 252px so it never crowds a 375px screen.
          className="p-1.5 sm:p-0 transition-transform active:scale-90"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              "w-8 h-8 sm:w-6 sm:h-6 transition-colors duration-400",
              star <= (hovered || value) ? "fill-gold-400 text-accent" : "fill-transparent text-[var(--border)]",
            )}
          />
        </button>
      ))}
    </div>
  );
}

/**
 * Community.
 *
 * Two tabs, deliberately kept apart rather than merged into one feed:
 * Reviews are a record of one visit to one place, first-person and specific.
 * Tips are editorial — "here is what to know before you go" — and hold true
 * regardless of whether the reader has been anywhere yet. Mixing them would
 * have made the tips read as unverifiable claims by an anonymous "traveller"
 * and the reviews read as official advice, which neither is.
 *
 * Reviews are set as a feed (a photo-plate avatar, name, a line of prose,
 * the place it's about) rather than the card grid the rest of the product
 * uses — closer to how a short, personal note is actually read.
 */

type Tab = "reviews" | "mine" | "tips";

function initials(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

/** A stable per-author plate hue, echoing the atlas's per-country plates so
 *  the feed and the atlas feel like the same system rather than two apps. */
function authorHue(seed: string): number {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return 10 + (h % 7) * 3;
}

export default function Community() {
  const { t, lang } = useTranslation();
  useDocumentTitle(t("community", "title"));
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("reviews");
  const user = useAppStore((s) => s.user);
  const openAuthModal = useAppStore((s) => s.openAuthModal);
  const showToast = useAppStore((s) => s.showToast);

  /* ── My reviews + composer ────────────────────────────── */
  const [myReviews, setMyReviews] = useState<MyReview[]>([]);
  const [myReviewsLoading, setMyReviewsLoading] = useState(false);
  const [myReviewsError, setMyReviewsError] = useState(false);

  useEffect(() => {
    if (tab !== "mine" || !user) return;
    let cancelled = false;
    setMyReviewsLoading(true);
    setMyReviewsError(false);
    apiClient
      .get<MyReview[]>("/reviews/me")
      .then((rows) => { if (!cancelled) setMyReviews(rows); })
      .catch(() => { if (!cancelled) setMyReviewsError(true); })
      .finally(() => { if (!cancelled) setMyReviewsLoading(false); });
    return () => { cancelled = true; };
  }, [tab, user]);

  const [composerLocationId, setComposerLocationId] = useState("");
  const [composerStars, setComposerStars] = useState(0);
  const [composerText, setComposerText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitMyReview() {
    if (!composerLocationId || !composerStars || !composerText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const saved = await apiClient.post<{ id: string; text: string; stars: number; createdAt: string }>(
        "/reviews",
        {
          locationId: composerLocationId,
          text: composerText.trim(),
          stars: composerStars,
          author: user ? `${user.name} ${user.surname}`.trim() : undefined,
        },
      );
      const loc = LOCATIONS_BY_ID.get(composerLocationId);
      setMyReviews((prev) => [
        {
          id: saved.id,
          locationId: composerLocationId,
          text: saved.text,
          stars: saved.stars,
          createdAt: saved.createdAt,
          location: loc ? { id: loc.id, name: loc.name, city: loc.city, images: loc.img ? [loc.img] : [] } : null,
        },
        ...prev,
      ]);
      setComposerLocationId("");
      setComposerStars(0);
      setComposerText("");
      showToast(t("community", "post_success"));
    } catch {
      showToast(t("community", "post_error"), undefined, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteMyReview(id: string) {
    const prev = myReviews;
    setMyReviews((rows) => rows.filter((r) => r.id !== id));
    try {
      await apiClient.delete(`/reviews/${id}`);
    } catch {
      setMyReviews(prev);
      showToast(t("community", "delete_error"), undefined, "error");
    }
  }

  /* ── Reviews feed ─────────────────────────────────────── */
  const allReviews = useMemo(() => {
    const rows: (Review & { locationName: string; locationCity: string; locationImg?: string })[] = [];
    for (const [locationId, reviews] of Object.entries(INIT_REVIEWS)) {
      const loc = LOCATIONS_BY_ID.get(locationId);
      if (!loc) continue;
      for (const r of reviews) {
        rows.push({ ...r, locationName: loc.name, locationCity: loc.city, locationImg: loc.img });
      }
    }
    return rows.sort((a, b) => b.time.localeCompare(a.time));
  }, []);

  /* ── Tips ─────────────────────────────────────────────── */
  const [countryFilter, setCountryFilter] = useState<string | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<TipCategory | "all">("all");

  const tipCountries = useMemo(() => {
    const codes = new Set(TIPS.map((tip) => tip.countryCode).filter((c): c is string => !!c));
    // Sorted on the localised name, so the filter reads alphabetically in
    // the language it is printed in.
    const label = (code: string) => {
      const c = COUNTRY_BY_CODE[code];
      return c ? countryName(c, lang) : code;
    };
    return [...codes].sort((a, b) => label(a).localeCompare(label(b)));
  }, [lang]);

  const filteredTips = useMemo(() => {
    return TIPS.filter((tip) => {
      if (countryFilter !== "all" && tip.countryCode !== countryFilter) return false;
      if (categoryFilter !== "all" && tip.category !== categoryFilter) return false;
      return true;
    });
  }, [countryFilter, categoryFilter]);

  const tabBtn = (active: boolean) =>
    cn(
      "tap-44 shrink-0 whitespace-nowrap px-3.5 py-2.5 text-[12px] uppercase tracking-[0.12em] rounded-sm border transition-colors duration-400",
      active ? "border-[var(--gold-hairline)] text-accent bg-[var(--gold-soft)]" : "border-transparent text-subtle hover:text-ink",
    );

  const chipBtn = (active: boolean) =>
    cn(
      "tap-44 px-3 py-2 text-[11px] uppercase tracking-[0.12em] rounded-sm border transition-colors duration-400 shrink-0",
      active ? "border-[var(--gold-hairline)] text-accent bg-[var(--gold-soft)]" : "border-transparent text-subtle hover:text-ink",
    );

  return (
    <div className="grain-overlay pb-24">
      <PageWrap>
        {/* ── Masthead ─────────────────────────────────── */}
        <header className="pt-12 sm:pt-16 pb-8">
          <Kicker gold className="mb-5">{t("nav", "community")}</Kicker>
          <div className="overflow-hidden">
            <h1 className="font-display text-display-sm sm:text-display text-ink animate-rise break-words">
              {t("community", "title")}
            </h1>
          </div>
          <p className="text-[15px] leading-relaxed text-subtle mt-5 max-w-[56ch]">
            {t("community", "subtitle")}
          </p>
        </header>

        <Rule gold />

        {/* ── Tabs ─────────────────────────────────────── */}
        {/* Scrollable, not wrapping: "MENING SHARHLARIM" is long enough in
            Uzbek to wrap onto two lines at a phone width while its siblings
            stayed single-line, which threw the whole row's height off and
            read as broken rather than just busy. */}
        <ScrollRow className="flex gap-1 py-6 -mx-1 px-1">
          <button onClick={() => setTab("reviews")} aria-pressed={tab === "reviews"} className={tabBtn(tab === "reviews")}>
            {t("community", "tab_reviews")}
          </button>
          <button onClick={() => setTab("mine")} aria-pressed={tab === "mine"} className={tabBtn(tab === "mine")}>
            {t("community", "tab_mine")}
          </button>
          <button onClick={() => setTab("tips")} aria-pressed={tab === "tips"} className={tabBtn(tab === "tips")}>
            {t("community", "tab_tips")}
          </button>
        </ScrollRow>

        {tab === "mine" ? (
          <>
            {!user ? (
              <div className="py-20 mx-auto max-w-[44ch] text-center">
                <p className="font-display text-[22px] leading-[1.3] text-ink mb-3">{t("community", "mine_login_title")}</p>
                <p className="text-[13px] leading-relaxed text-subtle mb-7">{t("community", "mine_login_desc")}</p>
                <Button onClick={() => openAuthModal()}>{t("auth", "login")}</Button>
              </div>
            ) : (
              <>
                {/* ── Composer ──────────────────────────────── */}
                <div className="border border-[var(--gold-hairline)] rounded-sm bg-[var(--gold-soft)] p-6 sm:p-7 mb-10">
                  <Kicker gold className="mb-4">{t("community", "composer_title")}</Kicker>
                  <div className="flex flex-col gap-4">
                    <select
                      value={composerLocationId}
                      onChange={(e) => setComposerLocationId(e.target.value)}
                      className="h-11 bg-transparent border border-[var(--border)] rounded-sm px-3
                                 text-[13px] text-ink outline-none focus:border-gold-400 transition-colors duration-400"
                    >
                      <option value="" className="bg-elevated">{t("community", "composer_location_placeholder")}</option>
                      {LOCATIONS.map((loc) => (
                        <option key={loc.id} value={loc.id} className="bg-elevated">{loc.name} · {loc.city}</option>
                      ))}
                    </select>
                    <StarPicker value={composerStars} onChange={setComposerStars} />
                    <textarea
                      value={composerText}
                      onChange={(e) => setComposerText(e.target.value)}
                      placeholder={t("community", "composer_placeholder")}
                      rows={3}
                      className="w-full bg-transparent border border-[var(--border)] rounded-sm p-3
                                 text-[16px] sm:text-[13px] leading-relaxed text-ink placeholder:text-subtle outline-none
                                 focus:border-gold-400 transition-colors duration-400 resize-none"
                    />
                    <Button
                      onClick={submitMyReview}
                      disabled={!composerLocationId || !composerStars || !composerText.trim() || submitting}
                      className="self-start"
                    >
                      {submitting ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden />
                          {t("community", "composer_posting")}
                        </span>
                      ) : (
                        t("community", "composer_submit")
                      )}
                    </Button>
                  </div>
                </div>

                <Rule />

                {/* ── My own reviews ────────────────────────── */}
                {myReviewsLoading ? (
                  <div className="py-16 flex justify-center">
                    <Loader2 className="w-5 h-5 text-subtle animate-spin" aria-hidden />
                  </div>
                ) : myReviewsError ? (
                  <p className="py-20 text-center text-[14px] text-subtle">{t("community", "post_error")}</p>
                ) : myReviews.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="font-display text-[19px] text-ink mb-2">{t("community", "mine_empty_title")}</p>
                    <p className="text-[13px] text-subtle">{t("community", "mine_empty_desc")}</p>
                  </div>
                ) : (
                  <ul className="max-w-[68ch] mt-2">
                    <AnimatePresence initial={false}>
                      {myReviews.map((r) => (
                        <motion.li
                          key={r.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="hairline-b py-6 overflow-hidden"
                        >
                          <div className="flex items-start gap-4 sm:gap-5">
                            <button
                              onClick={() => r.location && navigate(`/locations/${r.location.id}`)}
                              className="shrink-0 w-11 h-11 rounded-sm overflow-hidden bg-[var(--muted)] flex items-center justify-center"
                              aria-hidden
                              tabIndex={-1}
                            >
                              {r.location?.images?.[0] ? (
                                <img src={r.location.images[0]} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <MapPin className="w-4 h-4 text-subtle/40" aria-hidden />
                              )}
                            </button>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <button
                                  onClick={() => r.location && navigate(`/locations/${r.location.id}`)}
                                  className="text-[14px] text-ink font-medium route-underline"
                                >
                                  {r.location?.name ?? "—"}
                                </button>
                                <span className="tabular text-[11px] text-accent">{"★".repeat(r.stars)}</span>
                                <span className="tabular text-[11px] text-subtle ml-auto shrink-0">
                                  {new Date(r.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-[14px] leading-relaxed text-ink mt-2 max-w-[60ch]">{r.text}</p>
                            </div>
                            <button
                              onClick={() => deleteMyReview(r.id)}
                              aria-label={t("community", "remove_review")}
                              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-sm
                                         text-subtle hover:text-copper-400 transition-colors duration-400"
                            >
                              <BookmarkX className="w-4 h-4" aria-hidden />
                            </button>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </>
            )}
          </>
        ) : tab === "reviews" ? (
          <>
            <p className="text-[13px] text-subtle mb-8 max-w-[56ch]">{t("community", "reviews_desc")}</p>
            <Rule />

            {allReviews.length === 0 ? (
              <p className="py-20 text-center text-[14px] text-subtle">{t("community", "no_reviews")}</p>
            ) : (
              <ul className="max-w-[68ch] mt-2">
                {allReviews.map((r, i) => (
                  <motion.li
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.03, ease: [0.22, 1, 0.36, 1] }}
                    className="hairline-b py-6"
                  >
                    {/* The avatar hangs beside the whole card from sm: up —
                        an editorial hanging indent. Below sm it only sits
                        beside the name, and the review itself runs full
                        width: a 44px plate plus a 16px gutter was taking
                        60px out of a 390px screen, which left the body
                        wrapping at about four words a line. */}
                    <div className="flex items-center gap-3 sm:gap-4 sm:items-start">
                      {/* Author plate — an initial on a warm, per-author wash,
                          the same visual family as the atlas's country plates. */}
                      <span
                        className="plate shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                        style={{ "--plate-h": authorHue(r.author) } as React.CSSProperties}
                        aria-hidden
                      >
                        {/* text-ink, not a fixed cream — this plate has no
                            dark scrim behind it (it's a small avatar, not a
                            photo card), so it goes light-on-dark in dark
                            theme and dark-on-light in light theme, matching
                            whichever plate background actually renders. */}
                        <span className="font-display text-[17px] text-ink">{initials(r.author)}</span>
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-[14px] text-ink font-medium">{r.author}</span>
                          <span className="text-[12px] text-subtle">· {r.country}</span>
                          {r.verified && (
                            <span className="inline-flex items-center gap-1 text-[11px] sm:text-[10px] uppercase tracking-[0.1em] text-accent">
                              <Check className="w-3 h-3" aria-hidden />
                            </span>
                          )}
                          <span className="tabular text-[11px] text-subtle ml-auto shrink-0">{r.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Body, tags and the link back to the place. Pulled out
                        of the avatar column below sm so it uses the whole
                        width; from sm: up the left padding restores the
                        hanging indent the plate sits in. */}
                    <div className="mt-3 sm:mt-0 sm:pl-[60px]">
                      <div>
                        <p className="text-[14px] leading-relaxed text-ink sm:mt-2 max-w-[60ch]">{r.text}</p>

                        <div className="flex items-center gap-2 flex-wrap mt-3">
                          <span className="tabular text-[11px] text-accent">{"★".repeat(r.stars)}</span>
                          {r.aiTags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[11px] sm:text-[10px] uppercase tracking-[0.1em] text-subtle">#{tag}</span>
                          ))}
                        </div>

                        <button
                          onClick={() => navigate(`/locations/${r.locationId}`)}
                          // py-1.5 made this a 38px target. It is the only
                          // way from a review to the place it is about, so
                          // it gets the full 44px on touch.
                          className="group mt-4 inline-flex items-center gap-2.5 border border-[var(--border)] rounded-sm pl-1.5 pr-3 py-1.5 min-h-[44px] sm:min-h-0 hover:border-[var(--gold-hairline)] transition-colors duration-400"
                        >
                          <span className="w-6 h-6 rounded-sm overflow-hidden bg-[var(--muted)] shrink-0 flex items-center justify-center">
                            {r.locationImg ? (
                              <img src={r.locationImg} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <MapPin className="w-3 h-3 text-subtle" aria-hidden />
                            )}
                          </span>
                          <span className="text-[11px] text-ink route-underline">{r.locationName}</span>
                          <ArrowUpRight className="w-3 h-3 text-subtle group-hover:text-accent transition-colors duration-400" aria-hidden />
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <>
            <p className="text-[13px] text-subtle mb-8 max-w-[56ch]">{t("community", "tips_desc")}</p>
            <Rule />

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-10 py-6">
              <div className="min-w-0">
                <Kicker className="mb-2.5">{t("community", "filter_all_countries")}</Kicker>
                <div className="flex flex-wrap gap-1">
                  <button onClick={() => setCountryFilter("all")} aria-pressed={countryFilter === "all"} className={chipBtn(countryFilter === "all")}>
                    {t("community", "filter_all_countries")}
                  </button>
                  {tipCountries.map((code) => (
                    <button key={code} onClick={() => setCountryFilter(code)} aria-pressed={countryFilter === code} className={chipBtn(countryFilter === code)}>
                      {(() => { const c = COUNTRY_BY_CODE[code]; return c ? countryName(c, lang) : code; })()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="min-w-0">
                <Kicker className="mb-2.5">{t("community", "filter_category")}</Kicker>
                <div className="flex flex-wrap gap-1">
                  <button onClick={() => setCategoryFilter("all")} aria-pressed={categoryFilter === "all"} className={chipBtn(categoryFilter === "all")}>
                    {t("community", "filter_all_categories")}
                  </button>
                  {(Object.keys(TIP_CATEGORY_META) as TipCategory[]).map((key) => {
                    const meta = TIP_CATEGORY_META[key];
                    return (
                      <button key={key} onClick={() => setCategoryFilter(key)} aria-pressed={categoryFilter === key} className={cn(chipBtn(categoryFilter === key), "flex items-center gap-1.5")}>
                        <meta.Icon className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden />
                        {t("community", meta.labelKey)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <Rule />

            {filteredTips.length === 0 ? (
              <p className="py-20 text-center text-[14px] text-subtle">{t("community", "no_tips")}</p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 mt-8">
                {filteredTips.map((tip, i) => {
                  const country = tip.countryCode ? COUNTRY_BY_CODE[tip.countryCode] : undefined;
                  const meta = TIP_CATEGORY_META[tip.category];
                  return (
                    <motion.article
                      key={tip.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.03, ease: [0.22, 1, 0.36, 1] }}
                      className="border border-[var(--border)] rounded-sm p-6 hover:border-[var(--gold-hairline)] transition-colors duration-600"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {country ? (
                          <button
                            onClick={() => navigate(`/c/${country.slug}`)}
                            className="tap-44 plate w-8 h-8 rounded-md shrink-0 flex items-center justify-center hover:opacity-90 transition-opacity"
                            style={{ "--plate-h": plateHue(country.code) } as React.CSSProperties}
                          >
                            <span className="mono text-[11px] sm:text-[10px] text-ink/85">{country.code}</span>
                          </button>
                        ) : (
                          <span className="w-8 h-8 rounded-md shrink-0 flex items-center justify-center border border-[var(--border)]">
                            <meta.Icon className="w-3.5 h-3.5 text-subtle" strokeWidth={1.5} aria-hidden />
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="text-[11px] text-subtle truncate">{country ? countryName(country, lang) : t("community", "filter_all_countries")}</p>
                          <p className="flex items-center gap-1.5 text-[11px] sm:text-[10px] uppercase tracking-[0.12em] text-accent">
                            <meta.Icon className="w-3 h-3" strokeWidth={2} aria-hidden />
                            {t("community", meta.labelKey)}
                          </p>
                        </div>
                      </div>
                      <h3 className="font-display text-[18px] leading-snug text-ink mb-2">{tipTitle(tip, lang)}</h3>
                      <p className="text-[13px] leading-relaxed text-subtle">{tipBody(tip, lang)}</p>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </PageWrap>
    </div>
  );
}
