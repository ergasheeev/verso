import { useNavigate } from "react-router-dom";
import { Wordmark } from "@/components/brand/Wordmark";
import { Kicker, Rule, Button } from "@/components/ui/editorial";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useTranslation } from "@/i18n";

/**
 * Shared shell for /privacy and /terms.
 *
 * Deliberately outside MainLayout: these need to work for guests, signed-in
 * visitors and OAuth-verification crawlers alike, none of which should have
 * to get past an app shell to read them.
 *
 * Set as long-form: a single measured column, generous leading and ruled
 * headings. Legal text is the one place in the product where the typography
 * should get out of the way entirely.
 */
export function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // Both legal pages share this shell, so one call covers /privacy and
  // /terms — and these are the two pages most likely to be linked to
  // directly, where the tab title is all the context a reader gets.
  useDocumentTitle(title);

  return (
    <div className="app-bg grain-overlay min-h-dvh">
      <header className="flex items-center justify-between px-5 sm:px-8 lg:px-12 py-6 border-b border-[var(--border)]">
        <button onClick={() => navigate("/")} className="tap-44 active:opacity-60 transition-opacity">
          <Wordmark size="md" />
        </button>
        <Button size="sm" onClick={() => navigate("/atlas")}>
          {t("landing", "open_app")}
        </Button>
      </header>

      <main className="mx-auto w-full max-w-[72ch] px-5 sm:px-8 py-16">
        <Kicker gold className="mb-5">{t("landing", "footer_legal")}</Kicker>
        <h1 className="font-display text-display-sm sm:text-display text-ink mb-5 break-words">{title}</h1>
        <p className="tabular text-[11px] tracking-[0.12em] text-subtle mb-10">
          {t("landing", "last_updated")} — {lastUpdated.toUpperCase()}
        </p>

        <Rule gold />

        {/* Headings are Fraunces and sit on their own rule; body copy runs at
            a readable measure with the leading legal text needs. */}
        <div
          className="mt-12 space-y-10 text-[15px] leading-[1.75] text-ink
                     [&_h2]:font-display [&_h2]:text-[22px] [&_h2]:leading-tight [&_h2]:text-ink
                     [&_h2]:mb-4 [&_h2]:pb-3 [&_h2]:border-b [&_h2]:border-[var(--border)]
                     [&_p]:mb-4 [&_p]:text-subtle
                     [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-none
                     [&_li]:relative [&_li]:text-subtle
                     [&_li]:before:content-['—'] [&_li]:before:absolute [&_li]:before:-left-5
                     [&_li]:before:text-accent
                     [&_strong]:text-ink [&_strong]:font-semibold
                     [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-[3px]"
        >
          {children}
        </div>
      </main>

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto w-full max-w-[72ch] px-5 sm:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <nav className="flex items-center gap-6">
              <button
                onClick={() => navigate("/privacy")}
                className="tap-44 text-[11px] uppercase tracking-[0.12em] text-subtle hover:text-accent transition-colors duration-400"
              >
                {t("landing", "footer_privacy")}
              </button>
              <button
                onClick={() => navigate("/terms")}
                className="tap-44 text-[11px] uppercase tracking-[0.12em] text-subtle hover:text-accent transition-colors duration-400"
              >
                {t("landing", "footer_terms")}
              </button>
            </nav>
            {/* Deliberately not a mailto: no support inbox exists behind one
                yet, and a dead link that looks functional is worse than a
                visible gap. */}
            <span className="text-[11px] text-subtle italic">
              [PLACEHOLDER: support email]
            </span>
          </div>
          <Rule className="my-6" />
          <p className="tabular text-[11px] sm:text-[10px] tracking-[0.1em] text-subtle">
            © {new Date().getFullYear()} VERSO
          </p>
        </div>
      </footer>
    </div>
  );
}
