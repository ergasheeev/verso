import { useNavigate, useLocation } from "react-router-dom";
import { Bookmark, Sun, Moon, Search, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Wordmark, Mark } from "@/components/brand/Wordmark";
import { PremiumSeal } from "@/components/ui/editorial";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";
import { TOUR_IDS } from "@/components/ui/Tour";

/**
 * The masthead.
 *
 * Set as a printed masthead: the title over a rule, the contents beneath it. Two
 * thin rows rather than one tall one, because a magazine separates "who is
 * publishing this" from "what is in it". A vertical rail would cost ~250px of
 * every screen's width permanently — the worst place to spend it on a product
 * whose content is photography and long-form text.
 *
 * Below `lg` the nav row is dropped entirely — navigation lives in the bottom tab
 * bar there, which is where a thumb can reach it.
 */

const NAV = [
  { route: "/atlas",     key: "atlas",     tourId: TOUR_IDS.LOCATIONS },
  { route: "/locations", key: "locations", tourId: undefined },
  { route: "/community", key: "community", tourId: undefined },
  { route: "/saved",     key: "saved",     tourId: TOUR_IDS.SAVED },
] as const;

// 44px on touch, 36px from sm: up.
//
// These sit directly beside each other, so expanding their hit areas with a
// pseudo-element (like .tap-44) would make neighbours overlap and steal each
// other's taps; growing the boxes themselves is the honest fix. The masthead row
// is h-14 (56px), so 44 fits without changing its height.
const CTRL =
  "flex items-center justify-center w-11 h-11 sm:w-9 sm:h-9 rounded-sm border border-transparent " +
  "text-subtle hover:text-accent hover:border-[var(--gold-hairline)] " +
  "transition-colors duration-400";

export function Masthead() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useAppStore((s) => s.user);
  const planCount = useAppStore((s) => s.plan.length);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const openAuthModal = useAppStore((s) => s.openAuthModal);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const { t } = useTranslation();

  // The atlas owns the country hubs that hang off it, so /c/japan keeps the
  // first entry marked rather than leaving no item current.
  const isActive = (route: string) =>
    pathname === route ||
    pathname.startsWith(route) ||
    (route === "/atlas" && pathname.startsWith("/c/"));

  return (
    <header className="sticky top-0 z-50 glass bg-[var(--header-bg)] border-b border-[var(--border)]">
      {/* ── Row 1 — the title ────────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-8 lg:px-12 h-14">
        <button
          // The wordmark is the one control in the masthead that means "take me back to
          // the start", the way it does on nearly every site with a logo in the corner.
          // Landing adapts its header and CTAs for an already-signed-in visitor rather than
          // redirecting away, so "/" is safe to land on regardless of session state.
          onClick={() => navigate("/")}
          aria-label={t("nav", "home")}
          className="tap-44 shrink-0 active:opacity-60 transition-opacity"
        >
          <Wordmark size="md" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setSearchOpen(true)}
            className={cn(CTRL, "border-[var(--border)]")}
            aria-label={t("locations", "search_placeholder")}
            title="Ctrl K"
          >
            <Search className="w-4 h-4" aria-hidden />
          </button>

          {/* Language lives here too, not only on the landing page: someone reading the
              atlas in the wrong language should not have to dig through Profile settings.
              
              Both variants render; CSS picks one. The full trigger would not fit a 320px
              row, but a phone must still have a language control — the person who most
              needs it is the one who opened the app in a language they cannot read. The
              compact trigger is the same 36px as the search and bookmark buttons beside it. */}
          <div className="sm:hidden">
            <LanguageSwitcher compact />
          </div>
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Dropped below `sm`: on a 320px phone the row cannot hold the
              wordmark, four controls and a sign-in button, and the theme
              switch is the one of them that also lives in Profile settings. */}
          <button
            onClick={toggleTheme}
            className={cn(CTRL, "hidden sm:flex")}
            aria-label={theme === "dark" ? t("profile", "theme_light") : t("profile", "theme_dark")}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" aria-hidden /> : <Moon className="w-4 h-4" aria-hidden />}
          </button>

          <button
            onClick={() => navigate("/saved")}
            className={cn(CTRL, "relative", planCount > 0 && "text-accent")}
            aria-label={`${planCount} ${t("profile", "plan_count_suffix")}`}
          >
            <Bookmark className="w-4 h-4" aria-hidden />
            {planCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 tabular text-[9px] leading-none
                               bg-gold-400 text-[#0C0A09] rounded-full min-w-[15px] h-[15px]
                               flex items-center justify-center px-1">
                {planCount > 9 ? "9+" : planCount}
              </span>
            )}
          </button>

          {!user?.isPremium && (
            <button
              onClick={() => navigate("/pro")}
              // The seal is a 40x16 chip, so the button around it would be a 16px-tall target
              // between two 36px ones. tap-44 expands the hit area without changing how the
              // seal looks.
              className="tap-44 hidden sm:inline-flex items-center justify-center ml-1 h-9"
              aria-label={t("nav", "pro")}
            >
              <PremiumSeal />
            </button>
          )}

          {user ? (
            <button
              id={TOUR_IDS.PROFILE}
              onClick={() => navigate("/profile")}
              className="tap-44 ml-1.5 shrink-0 active:opacity-70 transition-opacity"
              aria-label={t("nav", "profile")}
            >
              <Avatar name={user.name} avatarUrl={user.avatarUrl} size={32} />
            </button>
          ) : (
            // A square icon button below `sm`, the text button from there up. As text it is
            // 74px wide, which pushes the control cluster past the right edge of a 320px
            // screen (worse in German "Anmelden" or French "Connexion"). An icon is the same
            // 44px in every language, and it mirrors the avatar that occupies this slot once
            // somebody is signed in.
            <button
              id={TOUR_IDS.PROFILE}
              onClick={() => openAuthModal()}
              aria-label={t("auth", "login")}
              className="ml-1 sm:ml-1.5 shrink-0 w-11 sm:w-auto h-11 sm:h-9 sm:px-4 rounded-sm
                         flex items-center justify-center bg-gold-400 text-[#0C0A09]
                         text-[11px] font-medium uppercase tracking-[0.1em]
                         hover:bg-gold-300 transition-colors duration-400"
            >
              <LogIn className="w-4 h-4 sm:hidden" aria-hidden />
              <span className="hidden sm:inline">{t("auth", "login")}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Row 2 — the contents ─────────────────────────
          Desktop only. On a phone this would be a second row of small
          targets above the fold, duplicating the tab bar a thumb can
          actually reach. */}
      <nav
        aria-label={t("nav", "primary")}
        className="hidden lg:flex items-center gap-8 px-12 h-11 border-t border-[var(--border)]"
      >
        {NAV.map(({ route, key, tourId }) => {
          const active = isActive(route);
          return (
            <button
              key={route}
              id={tourId}
              onClick={() => navigate(route)}
              aria-current={active ? "page" : undefined}
              className="relative h-full flex items-center group"
            >
              <span
                className={cn(
                  "font-display text-[15px] transition-colors duration-400",
                  active ? "text-ink" : "text-subtle group-hover:text-ink",
                )}
              >
                {t("nav", key)}
              </span>
              {key === "saved" && planCount > 0 && (
                <span className="ml-1.5 tabular text-[11px] text-subtle">{planCount}</span>
              )}
              {/* The current section is underscored by a gold rule sitting on
                  the masthead's own bottom border. */}
              <span
                aria-hidden
                className={cn(
                  "absolute left-0 right-0 -bottom-px h-px transition-colors duration-400",
                  active ? "bg-gold-400" : "bg-transparent",
                )}
              />
            </button>
          );
        })}

        <div className="flex-1" />

        <button
          id={TOUR_IDS.AI}
          onClick={() => navigate("/chat")}
          aria-current={isActive("/chat") ? "page" : undefined}
          className={cn(
            "relative h-full flex items-center gap-2 group",
            isActive("/chat") ? "text-accent" : "text-subtle hover:text-accent",
            "transition-colors duration-400",
          )}
        >
          <Mark className="w-4 h-4" />
          <span className="font-display text-[15px]">{t("chat", "title")}</span>
          <span
            aria-hidden
            className={cn(
              "absolute left-0 right-0 -bottom-px h-px transition-colors duration-400",
              isActive("/chat") ? "bg-gold-400" : "bg-transparent",
            )}
          />
        </button>
      </nav>
    </header>
  );
}
