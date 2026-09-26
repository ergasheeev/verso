import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Minus } from "lucide-react";
import { Kicker, Rule, PageWrap, Button, PremiumSeal } from "@/components/ui/editorial";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { cn } from "@/lib/utils";

/**
 * Verso Pro.
 *
 * Set as a prospectus rather than a pricing page: the four things membership
 * actually buys, stated at length, and then the numbers. The comparison table
 * is a ruled index like everything else in the product — a grid of ticked
 * boxes with a highlighted "most popular" column is the exact SaaS idiom this
 * brand is trying not to be.
 */

// The tables below hold translation KEYS; the copy itself lives in the locale
// files, so the page follows the interface language.
const PILLAR_KEYS = [
  { k: "p1_k", t: "p1_t", b: "p1_b" },
  { k: "p2_k", t: "p2_t", b: "p2_b" },
  { k: "p3_k", t: "p3_t", b: "p3_b" },
  { k: "p4_k", t: "p4_t", b: "p4_b" },
] as const;

// `false` means "not included" (rendered as a dash), `true` means included
// (a tick). Anything else is a key looked up in the `pro` dictionary.
const COMPARISON: { label: string; free: string | false; pro: string | true }[] = [
  { label: "r_countries",    free: "v_all",         pro: "v_all" },
  { label: "r_ai_questions", free: "v_five_day",    pro: "v_unlimited" },
  { label: "r_ai_model",     free: "v_standard",    pro: "v_long_context" },
  { label: "r_itinerary",    free: "v_three_days",  pro: "v_unlimited" },
  { label: "r_export",       free: false, pro: true },
  { label: "r_offline",      free: false, pro: true },
  { label: "r_unlisted",     free: false, pro: true },
  { label: "r_routes",       free: false, pro: true },
  { label: "r_concierge",    free: false, pro: true },
  { label: "r_support",      free: false, pro: true },
];

type Cycle = "monthly" | "annual";

// $12/mo x 12 = $144 billed monthly across a year; $108 billed annually is
// exactly $36 less, i.e. three months free.
const PRICE: Record<Cycle, { amount: number; note: string; per: string }> = {
  monthly: { amount: 12, per: "per_month", note: "note_monthly" },
  annual: { amount: 108, per: "per_year", note: "note_annual" },
};

export default function Pro() {
  const navigate = useNavigate();
  const [cycle, setCycle] = useState<Cycle>("annual");
  const user = useAppStore((s) => s.user);
  const openAuthModal = useAppStore((s) => s.openAuthModal);
  const showToast = useAppStore((s) => s.showToast);
  const { t } = useTranslation();
  useDocumentTitle("Verso Pro");

  const price = PRICE[cycle];

  function subscribe() {
    if (!user) {
      openAuthModal();
      return;
    }
    // No payment processor is wired up yet — saying so is better than a
    // button that silently does nothing.
    showToast(t("pro", "checkout_toast"), undefined, "info");
  }

  return (
    <div className="grain-overlay pb-24">
      <PageWrap>
        {/* ── Masthead ─────────────────────────────────── */}
        <header className="pt-12 sm:pt-20 pb-10 max-w-[64ch]">
          <div className="flex items-center gap-3 mb-6">
            <PremiumSeal />
            <Kicker>{t("pro", "membership")}</Kicker>
          </div>

          <div className="overflow-hidden">
            <h1 className="font-display text-display-sm sm:text-display text-ink animate-rise break-words">
              Verso Pro
            </h1>
          </div>

          <p className="text-[16px] leading-relaxed text-subtle mt-7">
            {t("pro", "hero_body")}
          </p>
        </header>

        <Rule gold />

        {/* ── Pillars ────────────────────────────────────
            The section's vertical padding has to live on a wrapper, not on
            the grid itself: the grid paints `bg-[var(--border)]` so its own
            `gap-px` shows through as the hairlines between cells, which
            meant `py-12` on that same element rendered as a 48px band of
            bare hairline colour above and below the cards. */}
        <section className="py-12">
          <div className="grid gap-px bg-[var(--border)] sm:grid-cols-2 border border-[var(--border)] rounded-sm overflow-hidden">
            {PILLAR_KEYS.map((p) => (
              <article key={p.k} className="bg-surface p-7 sm:p-9">
                <Kicker gold className="mb-5">{t("pro", p.k)}</Kicker>
                <h2 className="font-display text-[23px] leading-[1.15] text-ink mb-3.5">
                  {t("pro", p.t)}
                </h2>
                <p className="text-[13.5px] leading-relaxed text-subtle">{t("pro", p.b)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Price ────────────────────────────────────── */}
        <section className="py-12">
          <Kicker className="mb-3">{t("pro", "membership")}</Kicker>
          <Rule />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] pt-10 items-start">
            <div>
              {/* Billing cycle — two ruled options, not a toggle switch. */}
              <div className="flex gap-1 mb-8">
                {(["annual", "monthly"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setCycle(k)}
                    aria-pressed={cycle === k}
                    className={cn(
                      "tap-44 px-3.5 py-2 text-[11px] uppercase tracking-[0.14em] rounded-sm border",
                      "transition-colors duration-400",
                      cycle === k
                        ? "border-[var(--gold-hairline)] text-accent bg-[var(--gold-soft)]"
                        : "border-transparent text-subtle hover:text-ink",
                    )}
                  >
                    {t("pro", k === "annual" ? "cycle_annual" : "cycle_monthly")}
                  </button>
                ))}
              </div>

              <div className="flex items-baseline gap-3">
                <span className="font-display text-display-sm sm:text-display text-accent tabular leading-none">
                  ${price.amount}
                </span>
                <span className="kicker">{t("pro", price.per)}</span>
              </div>
              <p className="text-[12.5px] text-subtle mt-4">{t("pro", price.note)}</p>

              <Button size="lg" className="mt-8" onClick={subscribe}>
                {t("pro", user ? "cta_member" : "cta_signin")}
              </Button>

              {/* 12.5px, not 11px: this is a real sentence carrying the one
                  caveat about payment, not a label — and it sat below the
                  comfortable reading floor on a phone. */}
              <p className="text-[12.5px] leading-relaxed text-subtle mt-5 max-w-[40ch]">
                {t("pro", "billing_note")}
              </p>
            </div>

            {/* ── Comparison ─────────────────────────── */}
            <div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-x-6 sm:gap-x-10">
                <span className="kicker pb-3">{t("pro", "cmp_included")}</span>
                <span className="kicker pb-3 text-right w-16">{t("pro", "cmp_free")}</span>
                <span className="kicker kicker-gold pb-3 text-right w-16">{t("pro", "cmp_pro")}</span>
              </div>
              <Rule />
              <dl>
                {COMPARISON.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-x-6 sm:gap-x-10
                               items-baseline py-3 hairline-b last:border-b-0"
                  >
                    <dt className="text-[13px] text-ink min-w-0">{t("pro", row.label)}</dt>
                    <dd className="text-right w-16 tabular text-[12px] text-subtle">
                      {row.free === false ? (
                        <>
                          <Minus className="w-3.5 h-3.5 inline text-subtle" aria-hidden />
                          <span className="sr-only">{t("pro", "cmp_no")}</span>
                        </>
                      ) : (
                        t("pro", row.free)
                      )}
                    </dd>
                    <dd className="text-right w-16 tabular text-[12px] text-accent">
                      {row.pro === true ? (
                        <>
                          <Check className="w-3.5 h-3.5 inline" aria-hidden />
                          <span className="sr-only">{t("pro", "cmp_yes")}</span>
                        </>
                      ) : (
                        t("pro", row.pro)
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <Rule />

        <section className="py-12 max-w-[56ch]">
          <Kicker className="mb-4">{t("pro", "outro_kicker")}</Kicker>
          <p className="font-display text-[22px] leading-[1.3] text-ink">
            {t("pro", "outro_body")}
          </p>
          <Button variant="ghost" size="sm" className="mt-6 -ml-1" onClick={() => navigate("/atlas")}>
            {t("pro", "back")}
          </Button>
        </section>
      </PageWrap>
    </div>
  );
}
