import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, MapPin, Sparkles, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring" as const, stiffness: 320, damping: 36 };

/**
 * The mobile tab bar.
 *
 * Marked by a gold rule above the active tab rather than a filled chip behind
 * its icon — a filled pill is the piece of chrome that most makes a page read
 * as an app. The rule slides between tabs as a shared layout element, which
 * is the one place motion earns its keep down here.
 */

const TABS = [
  { route: "/atlas",     Icon: Globe,    label: "Atlas" },
  { route: "/locations", Icon: MapPin,   label: "Joylar" },
  { route: "/community", Icon: Users,    label: "Hamjamiyat" },
  { route: "/chat",      Icon: Sparkles, label: "AI" },
  { route: "/profile",   Icon: User,     label: "Profil" },
] as const;

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function isActive(route: string) {
    if (route === "/atlas") return pathname === "/atlas" || pathname.startsWith("/c/");
    if (route === "/locations") return pathname === "/locations" || pathname.startsWith("/locations/");
    return pathname === route || pathname.startsWith(route + "/");
  }

  return (
    <nav
      aria-label="Asosiy navigatsiya"
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

              <span
                className={cn(
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
