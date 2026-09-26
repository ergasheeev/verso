import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, MapPin, Sparkles, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";

const SPRING = { type: "spring" as const, stiffness: 320, damping: 36 };

/**
 * The mobile tab bar.
 *
 * Marked by a gold rule above the active tab rather than a filled chip behind
 * its icon — same reasoning as the sidebar: a filled pill is the piece of
 * chrome that most makes a page read as an app. The rule slides between tabs
 * as a shared layout element, which is the one place motion earns its keep
 * down here.
 */
export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  function isActive(route: string) {
    if (route === "/atlas") return pathname === "/atlas" || pathname.startsWith("/c/");
    if (route === "/locations") return pathname === "/locations" || pathname.startsWith("/locations/");
    return pathname === route || pathname.startsWith(route + "/");
  }

  // Saved isn't in this bar — it's reachable from the header's bookmark icon
  // on every breakpoint, so a sixth tab isn't needed to keep it reachable on
  // a phone.
  const TABS = [
    { route: "/atlas",     Icon: Globe,    label: t("nav", "atlas")     },
    { route: "/locations", Icon: MapPin,   label: t("nav", "locations") },
    // tab_community, not community: the page heading can be long, a tab
    // label sharing a 320px bar with four others cannot.
    { route: "/community", Icon: Users,    label: t("nav", "tab_community") },
    { route: "/chat",      Icon: Sparkles, label: t("nav", "ai")        },
    { route: "/profile",   Icon: User,     label: t("nav", "profile")   },
  ] as const;

  return (
    <nav
      aria-label={t("nav", "primary")}
      className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--nav-bg)] border-t border-[var(--border)] glass"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-stretch h-[58px]">
        {TABS.map(({ route, Icon, label }) => {
          const active = isActive(route);
          return (
            <button
              key={route}
              onClick={() => navigate(route)}
              aria-current={active ? "page" : undefined}
              aria-label={label}
              className="relative flex flex-col items-center justify-center flex-1 min-w-0 gap-1.5 px-1"
            >
              {active && (
                <motion.span
                  layoutId="bottomnav-indicator"
                  transition={SPRING}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-px bg-gold-400"
                />
              )}

              <Icon
                className={cn(
                  "w-[18px] h-[18px] transition-colors duration-400",
                  active ? "text-accent" : "text-subtle",
                )}
                aria-hidden
              />

              {/* Sentence case at 10px, not 9px uppercase with tracking.
                  Uppercase plus letter-spacing is what made these too wide:
                  "Сообщество" truncated to "СООБЩЕСТ…" even at 9px, and 9px
                  is below the legible floor on a phone anyway. Dropping the
                  transform buys back more width than the extra pixel costs,
                  so the labels are both larger and no longer clipped.

                  truncate stays as a safety net: five tabs share a 320px bar
                  on the smallest phones, and a wrapped label would change
                  the bar's height mid-navigation. */}
              <span
                className={cn(
                  // 11px, not 10px: this is the primary navigation on every phone. At 320px the
                  // five labels still fit, with truncate below as the safety net.
                  "max-w-full px-0.5 truncate text-[11px] leading-none tracking-[0.01em]",
                  "transition-colors duration-400",
                  active ? "text-accent" : "text-subtle",
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
