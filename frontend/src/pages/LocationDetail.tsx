import { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Bookmark, BookmarkCheck, ExternalLink, Star, Send, Loader2,
  ChevronDown, ChevronUp, Share2, Check, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LOCATIONS_BY_ID, INIT_REVIEWS } from "@/data";
import { CATEGORY_STYLE } from "@/lib/categories";
import { MessageContent } from "@/components/chat/MessageContent";
import { Kicker, Rule, PageWrap, DataRow, Button } from "@/components/ui/editorial";
import { ParallaxHero } from "@/components/ui/ScrollMotion";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { apiClient } from "@/lib/api-client";
import type { Review } from "@/types";

type TFn = ReturnType<typeof useTranslation>["t"];

/** A row of star glyphs. Gold when filled, hairline when not. */
function StarRow({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5", className)} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          aria-hidden
          className={cn(
            "w-3 h-3",
            s <= Math.round(value) ? "fill-gold-400 text-accent" : "fill-transparent text-[var(--border)]",
          )}
        />
      ))}
    </span>
  );
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
              star <= (hovered || value)
                ? "fill-gold-400 text-accent"
                : "fill-transparent text-[var(--border)]",
            )}
          />
        </button>
      ))}
    </div>
  );
}

/** A review, set as a ruled entry rather than a floating card. */
function ReviewEntry({ review, t }: { review: Review; t: TFn }) {
  return (
    <article className="py-6 hairline-b last:border-b-0">
      <div className="flex items-start justify-between gap-5 mb-3">
        <div className="min-w-0">
          <p className="text-[13px] text-ink">{review.author}</p>
          {/* Author meta reads as a sentence fragment, not a label — 10px
              put it under the phone-readable floor. */}
          <p className="tabular text-[11.5px] tracking-[0.06em] text-subtle mt-1">
            {review.country} · {review.time}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StarRow value={review.stars} />
          {review.verified && (
            <span className="inline-flex items-center gap-1 text-[11px] sm:text-[10px] uppercase tracking-[0.14em] text-accent">
              <Check className="w-2.5 h-2.5" strokeWidth={3} aria-hidden />
              {t("detail", "verified")}
            </span>
          )}
        </div>
      </div>
      <p className="text-[13.5px] leading-relaxed text-subtle max-w-[64ch]">{review.text}</p>
      {review.aiTags.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
          {review.aiTags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-[11px] sm:text-[10px] uppercase tracking-[0.12em] text-subtle">
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

/** The AI reading of this place's reviews. */
function SmartReview({
  reviews, locationId, lang, t,
}: { reviews: Review[]; locationId: string; lang: string; t: TFn }) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);

  const avgRating = useMemo(
    () => (reviews.length ? reviews.reduce((s, r) => s + r.stars, 0) / reviews.length : 0),
    [reviews],
  );

  async function analyze() {
    if (insight) { setOpen((o) => !o); return; }
    setLoading(true);
    setError(false);
    try {
      // The backend endpoint reads the real review rows for this location and
      // prompts the model in the interface language.
      const res = await apiClient.post<{ insight: string }>(
        "/ai/analyze-reviews",
        { locationId, lang },
        { timeout: 45_000 },
      );
      setInsight(res.insight ?? t("detail", "insight_error"));
      setOpen(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-[var(--gold-hairline)] rounded-sm bg-[var(--gold-soft)]">
      <button
        onClick={analyze}
        disabled={loading || !reviews.length}
        className="w-full flex items-center justify-between gap-5 px-5 py-4 text-left disabled:opacity-50"
      >
        <div className="min-w-0">
          <Kicker gold className="mb-1.5">{t("detail", "smart_review_label")}</Kicker>
          <p className="tabular text-[11px] text-subtle">
            {reviews.length} {t("detail", "total_reviews")} · ★ {avgRating.toFixed(1)}
          </p>
        </div>
        <span className="shrink-0 text-accent">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
          ) : error ? (
            <span className="text-[11px] sm:text-[10px] uppercase tracking-[0.12em] text-copper-400">
              {t("detail", "insight_error")}
            </span>
          ) : insight ? (
            open ? <ChevronUp className="w-4 h-4" aria-hidden /> : <ChevronDown className="w-4 h-4" aria-hidden />
          ) : (
            <span className="text-[11px] sm:text-[10px] uppercase tracking-[0.14em]">{t("detail", "ai_insight")}</span>
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && insight && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-[var(--gold-hairline)]">
              <Kicker className="mb-2.5 mt-4">{t("detail", "insight_title")}</Kicker>
              <div className="text-[13px] leading-relaxed text-ink max-w-[64ch]">
                <MessageContent text={insight} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Shape returned by GET/POST /api/reviews. It differs from the frontend's own
 * Review only in `createdAt` (a real timestamp) vs `time` (a display string).
 */
interface BackendReview {
  id: string;
  locationId: string;
  author: string;
  country: string;
  stars: number;
  text: string;
  trustScore: number;
  aiTags: string[];
  verified: boolean;
  createdAt: string;
}

function adaptBackendReview(r: BackendReview): Review {
  return {
    id: r.id,
    locationId: r.locationId,
    author: r.author,
    country: r.country,
    stars: r.stars,
    text: r.text,
    trustScore: r.trustScore,
    aiTags: r.aiTags,
    verified: r.verified,
    time: new Date(r.createdAt).toLocaleDateString(),
  };
}

const CHROME_BTN =
  "tap-44 w-10 h-10 rounded-sm border border-white/25 bg-black/45 backdrop-blur-sm text-[#F5EFE3] " +
  "flex items-center justify-center hover:border-gold-400 hover:text-accent transition-colors duration-400";

export default function LocationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addToPlan = useAppStore((s) => s.addToPlan);
  const removeFromPlan = useAppStore((s) => s.removeFromPlan);
  const showToast = useAppStore((s) => s.showToast);
  const user = useAppStore((s) => s.user);
  // Selecting the array (not calling the store's isInPlan(), which reads
  // through get() and therefore subscribes to nothing) is what makes the
  // saved state genuinely reactive here.
  const plan = useAppStore((s) => s.plan);
  const { t, lang } = useTranslation();

  const location = id ? LOCATIONS_BY_ID.get(id) : undefined;
  // After the lookup: referencing `location` above its own `const` is a
  // temporal-dead-zone crash.
  useDocumentTitle(location?.name);
  const initReviews = id ? (INIT_REVIEWS[id] ?? []) : [];

  // Reviews are stored in the database, so a refresh keeps them and Smart Review
  // (which reads the database directly) sees them.
  const [backendReviews, setBackendReviews] = useState<Review[]>([]);
  const [reviewsLoadError, setReviewsLoadError] = useState(false);
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setReviewsLoadError(false);
    apiClient
      .get<BackendReview[]>(`/reviews/${id}`)
      .then((rows) => { if (!cancelled) setBackendReviews(rows.map(adaptBackendReview)); })
      .catch(() => { if (!cancelled) setReviewsLoadError(true); });
    return () => { cancelled = true; };
  }, [id]);

  const allReviews = useMemo(
    () => [...backendReviews, ...initReviews],
    [backendReviews, initReviews],
  );
  const REVIEWS_PAGE_SIZE = 8;
  const [reviewsVisible, setReviewsVisible] = useState(REVIEWS_PAGE_SIZE);

  const [reviewOpen, setReviewOpen] = useState(false);
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // The sticky save bar appears once the inline actions scroll out of view.
  const actionRef = useRef<HTMLDivElement>(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  useEffect(() => {
    const el = actionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setStickyVisible(!entry.isIntersecting), {
      threshold: 0,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const reviewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (reviewTimerRef.current) clearTimeout(reviewTimerRef.current); }, []);

  if (!location) {
    return (
      <PageWrap>
        <div className="py-32 text-center">
          <Kicker className="mb-4">404</Kicker>
          <h1 className="font-display text-display-sm text-ink mb-3 break-words">
            {t("detail", "not_found_title")}
          </h1>
          <p className="text-[14px] text-subtle mb-8">{t("detail", "not_found_desc")}</p>
          <Button variant="secondary" onClick={() => navigate("/locations")}>
            {t("detail", "back_to_list")}
          </Button>
        </div>
      </PageWrap>
    );
  }

  const loc = location;
  const cat = CATEGORY_STYLE[loc.category];
  const inPlan = plan.some((l) => l.id === loc.id);
  const reviewCount = loc.reviewCount + backendReviews.length;

  function togglePlan() {
    if (inPlan) {
      removeFromPlan(loc.id);
      showToast(`${loc.name} ${t("card", "removed_toast")}`, undefined, "info");
    } else {
      addToPlan(loc);
      showToast(`${loc.name} ${t("card", "added_toast")}`, undefined, "success");
    }
  }

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      showToast(t("detail", "link_copied"), undefined, "success");
    } catch {
      // Clipboard blocked (insecure origin, denied permission). Nothing useful is
      // left to try, but showing the URL keeps the button from failing silently.
      showToast(url, undefined, "info");
    }
  }

  async function shareLocation() {
    const url = window.location.href;
    // `navigator.share` EXISTS on desktop Chrome/Edge but rejects when there is no
    // share target. Only a genuine AbortError means the person dismissed the sheet;
    // any other rejection falls back to copying the link, so Share always does
    // something visible.
    if (!navigator.share) {
      await copyLink(url);
      return;
    }
    try {
      await navigator.share({ title: `${loc.name} — Verso`, text: loc.shortDesc ?? loc.name, url });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      await copyLink(url);
    }
  }

  async function submitReview() {
    if (!stars || !text.trim() || submitting) return;
    setSubmitting(true);
    try {
      const saved = await apiClient.post<BackendReview>("/reviews", {
        locationId: loc.id,
        text: text.trim(),
        stars,
        author: user?.name ?? t("profile", "guest"),
        country: user?.country,
      });
      setBackendReviews((prev) => [adaptBackendReview(saved), ...prev]);
      setStars(0);
      setText("");
      setSubmitted(true);
      reviewTimerRef.current = setTimeout(() => { setSubmitted(false); setReviewOpen(false); }, 2500);
    } catch {
      showToast(t("detail", "review_submit_error"), undefined, "error");
    } finally {
      setSubmitting(false);
    }
  }

  const saveLabel = inPlan ? t("detail", "remove_plan") : t("detail", "add_plan");

  return (
    <div className="grain-overlay pb-32">
      {/* ── Plate ───────────────────────────────────────────
          A photograph earns a tall plate; a place we have no verified image
          for gets a short one. Reserving 58vh for a single centred icon read
          as a page that had failed to load rather than one being honest. */}
      <div
        className={cn(
          "figure relative",
          loc.img ? "h-[58vh] min-h-[380px] max-h-[620px]" : "h-[30vh] min-h-[200px] max-h-[280px]",
        )}
      >
        {loc.img ? (
          <ParallaxHero className="absolute inset-0 scale-110">
            <img src={loc.img} alt={loc.name} className="absolute inset-0 w-full h-full object-cover" />
          </ParallaxHero>
        ) : (
          // No verified photograph for this place — a typographic plate
          // rather than a stand-in image of somewhere else. See types/index.ts.
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--muted)]">
            <cat.Icon className="w-12 h-12 text-subtle/30" strokeWidth={0.75} aria-hidden />
          </div>
        )}

        <div className="absolute top-5 left-5 right-5 z-[3] flex items-center justify-between">
          <button onClick={() => navigate(-1)} className={CHROME_BTN} aria-label={t("detail", "back")}>
            <ArrowLeft className="w-4 h-4" aria-hidden />
          </button>
          <div className="flex gap-2">
            <button onClick={shareLocation} className={CHROME_BTN} aria-label="Share">
              <Share2 className="w-4 h-4" aria-hidden />
            </button>
            <button
              onClick={togglePlan}
              aria-label={saveLabel}
              className={cn(
                CHROME_BTN,
                inPlan && "bg-gold-400 text-[#0C0A09] border-gold-400 hover:text-[#0C0A09]",
              )}
            >
              {inPlan ? <BookmarkCheck className="w-4 h-4" aria-hidden /> : <Bookmark className="w-4 h-4" aria-hidden />}
            </button>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-[2]">
          <PageWrap className="pb-8">
            <Kicker className="text-[#F5EFE3]/70 mb-4">
              {t("home", cat.tKey as "cat_tarix")}
            </Kicker>
            <h1 className="font-display text-display-sm sm:text-display text-[#F5EFE3] max-w-[16ch] mb-4 break-words">
              {loc.name}
            </h1>
            {/* Stacked below sm. Side by side, "Samarqand, Samarqand
                viloyati" fills a phone row on its own, so the rating wrapped
                to the next line and left the divider dangling at the end of
                the first — a separator with nothing after it. */}
            <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 tabular text-[12px] text-[#F5EFE3]/75">
              <span>{loc.city}, {loc.region}</span>
              <span aria-hidden className="hidden sm:block w-px h-3 bg-white/25" />
              <span className="flex items-center gap-1.5">
                <StarRow value={loc.rating} />
                <span className="text-gold-300">{loc.rating}</span>
                <span>({reviewCount})</span>
              </span>
            </div>
          </PageWrap>
        </div>
      </div>

      <PageWrap>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] py-12">
          {/* ── The read ─────────────────────────────── */}
          <div>
            <p className="drop-cap text-[16px] leading-[1.75] text-ink max-w-[62ch]">
              {loc.fullDesc}
            </p>

            {loc.tags.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-8">
                {loc.tags.map((tag) => (
                  <span key={tag} className="text-[11px] sm:text-[10px] uppercase tracking-[0.14em] text-subtle">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* ── Reviews ────────────────────────────── */}
            <section className="mt-14">
              <div className="flex items-end justify-between gap-6 mb-3.5">
                <div>
                  <Kicker className="mb-2.5">{t("detail", "reviews")}</Kicker>
                  <h2 className="font-display text-2xl text-ink leading-[1.08]">
                    {allReviews.length} {t("detail", "total_reviews")}
                  </h2>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="shrink-0"
                  onClick={() => setReviewOpen((o) => !o)}
                >
                  {t("detail", "write_review")}
                </Button>
              </div>
              <Rule gold />

              <div className="mt-6">
                <SmartReview reviews={allReviews} locationId={loc.id} lang={lang} t={t} />
              </div>

              <AnimatePresence initial={false}>
                {reviewOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 border border-[var(--border)] rounded-sm p-6">
                      {submitted ? (
                        <p className="py-6 text-center font-display text-[19px] text-accent">
                          {t("detail", "review_success")}
                        </p>
                      ) : (
                        <>
                          <Kicker className="mb-3">{t("detail", "your_rating")}</Kicker>
                          <StarPicker value={stars} onChange={setStars} />
                          <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={t("detail", "review_placeholder")}
                            rows={4}
                            className="mt-6 w-full bg-transparent border-b border-[var(--input-border)]
                                       px-0 py-2.5 text-[16px] sm:text-[14px] text-ink resize-none
                                       placeholder:text-subtle outline-none
                                       focus:border-gold-400 transition-colors duration-400"
                          />
                          <div className="flex gap-2 mt-6">
                            <Button
                              onClick={submitReview}
                              disabled={!stars || !text.trim() || submitting}
                              size="sm"
                            >
                              {submitting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden />
                              ) : (
                                <Send className="w-3.5 h-3.5" aria-hidden />
                              )}
                              {t("detail", "submit_review")}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setReviewOpen(false)}
                              aria-label="Cancel"
                            >
                              <X className="w-4 h-4" aria-hidden />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {allReviews.length === 0 ? (
                <div className="py-14 text-center">
                  <p className="text-[14px] text-subtle mb-4">{t("detail", "no_reviews")}</p>
                  <Button variant="ghost" size="sm" onClick={() => setReviewOpen(true)}>
                    {t("detail", "add_first_review")}
                  </Button>
                </div>
              ) : (
                <div className="mt-8">
                  {allReviews.slice(0, reviewsVisible).map((review) => (
                    <ReviewEntry key={review.id} review={review} t={t} />
                  ))}
                  {reviewsVisible < allReviews.length && (
                    <Button
                      variant="secondary"
                      size="sm"
                      fullWidth
                      className="mt-6"
                      onClick={() => setReviewsVisible((v) => v + REVIEWS_PAGE_SIZE)}
                    >
                      {t("detail", "load_more_reviews")}
                    </Button>
                  )}
                </div>
              )}

              {reviewsLoadError && (
                <p className="mt-5 text-[11px] text-subtle text-center">
                  {t("detail", "reviews_load_error")}
                </p>
              )}
            </section>
          </div>

          {/* ── The facts ────────────────────────────── */}
          <aside className="lg:sticky lg:top-6 lg:self-start space-y-8">
            <section>
              <Kicker className="mb-3">{t("detail", "practical_info")}</Kicker>
              <Rule />
              <dl className="mt-1">
                <DataRow
                  label={t("detail", "price_label")}
                  value={loc.priceUSD === 0 ? t("detail", "free") : loc.price}
                />
                <DataRow label={t("detail", "duration_label")} value={loc.duration} />
                <DataRow label={t("detail", "hours")} value={loc.hours} />
                <DataRow
                  label={t("detail", "best_season")}
                  value={<span className="font-sans">{loc.bestSeason}</span>}
                />
                <DataRow
                  label={t("detail", "how_to_get")}
                  value={<span className="font-sans">{loc.transport}</span>}
                />
              </dl>
            </section>

            <div ref={actionRef} className="flex flex-col gap-2">
              <Button
                variant={inPlan ? "secondary" : "primary"}
                fullWidth
                onClick={togglePlan}
              >
                {inPlan ? <BookmarkCheck className="w-4 h-4" aria-hidden /> : <Bookmark className="w-4 h-4" aria-hidden />}
                {saveLabel}
              </Button>
              <a
                href={loc.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-5 rounded-sm border border-[var(--border)] text-ink
                           text-[13px] uppercase tracking-[0.1em]
                           inline-flex items-center justify-center gap-2
                           hover:border-[var(--gold-hairline)] hover:text-accent
                           transition-colors duration-400"
              >
                <ExternalLink className="w-4 h-4" aria-hidden />
                {t("detail", "map")}
              </a>
            </div>
          </aside>
        </div>
      </PageWrap>

      {/* ── Sticky save bar ─────────────────────────────
          The bar is fixed, so pb-32 on the page reserves real room for it
          rather than letting it sit on top of the last section. */}
      <div
        className={cn(
          "fixed left-0 right-0 z-40 transition-all duration-600 ease-spring",
          "bottom-[58px] md:bottom-0",
          stickyVisible
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-full opacity-0 pointer-events-none",
        )}
      >
        <div className="mx-auto max-w-2xl px-4 pb-3 pt-6 bg-gradient-to-t from-canvas via-canvas to-transparent">
          <Button variant={inPlan ? "secondary" : "primary"} fullWidth onClick={togglePlan}>
            {inPlan ? <BookmarkCheck className="w-4 h-4" aria-hidden /> : <Bookmark className="w-4 h-4" aria-hidden />}
            {saveLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
