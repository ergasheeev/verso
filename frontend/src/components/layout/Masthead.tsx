import { useNavigate, useLocation } from "react-router-dom";
import { Bookmark, Sun, Moon, Search, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Wordmark, Mark } from "@/components/brand/Wordmark";
import { PremiumSeal } from "@/components/ui/editorial";
import { useAppStore } from "@/store";

/**
 * The masthead.
 *
 * Set as a printed masthead: the title over a rule, the contents beneath it. Two
 * thin rows rather than one tall one, because a magazine separates "who is
 * publishing this" from "what is in it".
 *
 * Below `lg` the nav row is dropped entirely — navigation lives in the bottom tab
 * bar there, which is where a thumb can reach it.
 */

const NAV = [
  { route: "/atlas",     label: "Atlas" },
  { route: "/locations", label: "Joylar" },
  { route: "/community", label: "Hamjamiyat" },
  { route: "/saved",     label: "Saqlangan" },
] as const;

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

  const isActive = (route: string) =>
    pathname === route ||
    pathname.startsWith(route) ||
    (route === "/atlas" && pathname.startsWith("/c/"));

  return (
    <header className="sticky top-0 z-50 glass bg-[var(--header-bg)] border-b border-[var(--border)]">
      <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-8 lg:px-12 h-14">
        <button
          onClick={() => navigate("/")}
          aria-label="Bosh sahifa"
          className="tap-44 shrink-0 active:opacity-60 transition-opacity"
        >
          <Wordmark size="md" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setSearchOpen(true)}
            className={cn(CTRL, "border-[var(--border)]")}
            aria-label="Qidirish"
            title="Ctrl K"
          >
            <Search className="w-4 h-4" aria-hidden />
          </button>

          <button
            onClick={toggleTheme}
            className={cn(CTRL, "hidden sm:flex")}
            aria-label={theme === "dark" ? "Kunduzgi mavzu" : "Tungi mavzu"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" aria-hidden /> : <Moon className="w-4 h-4" aria-hidden />}
          </button>

          <button
            onClick={() => navigate("/saved")}
            className={cn(CTRL, "relative", planCount > 0 && "text-accent")}
            aria-label={`${planCount} saqlangan joy`}
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
              className="tap-44 hidden sm:inline-flex items-center justify-center ml-1 h-9"
              aria-label="Pro"
            >
              <PremiumSeal />
            </button>
          )}

          {user ? (
            <button
              onClick={() => navigate("/profile")}
              className="tap-44 ml-1.5 shrink-0 active:opacity-70 transition-opacity"
              aria-label="Profil"
            >
              <Avatar name={user.name} avatarUrl={user.avatarUrl} size={32} />
            </button>
          ) : (
            <button
              onClick={() => openAuthModal()}
              aria-label="Kirish"
              className="ml-1 sm:ml-1.5 shrink-0 w-11 sm:w-auto h-11 sm:h-9 sm:px-4 rounded-sm
                         flex items-center justify-center bg-gold-400 text-[#0C0A09]
                         text-[11px] font-medium uppercase tracking-[0.1em]
                         hover:bg-gold-300 transition-colors duration-400"
            >
              <LogIn className="w-4 h-4 sm:hidden" aria-hidden />
              <span className="hidden sm:inline">Kirish</span>
            </button>
          )}
        </div>
      </div>

      <nav
        aria-label="Asosiy navigatsiya"
        className="hidden lg:flex items-center gap-8 px-12 h-11 border-t border-[var(--border)]"
      >
        {NAV.map(({ route, label }) => {
          const active = isActive(route);
          return (
            <button
              key={route}
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
                {label}
              </span>
              {route === "/saved" && planCount > 0 && (
                <span className="ml-1.5 tabular text-[11px] text-subtle">{planCount}</span>
              )}
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
          onClick={() => navigate("/chat")}
          aria-current={isActive("/chat") ? "page" : undefined}
          className={cn(
            "relative h-full flex items-center gap-2 group",
            isActive("/chat") ? "text-accent" : "text-subtle hover:text-accent",
            "transition-colors duration-400",
          )}
        >
          <Mark className="w-4 h-4" />
          <span className="font-display text-[15px]">Verso AI</span>
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
