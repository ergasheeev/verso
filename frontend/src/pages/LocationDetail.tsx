import { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Bookmark, BookmarkCheck, ExternalLink, Star, Share2, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LOCATIONS_BY_ID, INIT_REVIEWS } from "@/data";
import { CATEGORY_STYLE } from "@/lib/categories";
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
              </div>
              <Rule gold />

              {allReviews.length === 0 ? (
                <div className="py-14 text-center">
                  <p className="text-[14px] text-subtle mb-4">{t("detail", "no_reviews")}</p>
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
