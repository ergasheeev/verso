import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { Masthead } from "./Masthead";
import { BottomNav } from "./BottomNav";
import { Toaster } from "@/components/ui/Toaster";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";
import { TourRunner } from "./TourRunner";
import { ScrollProgress } from "@/components/ui/ScrollMotion";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function PageTransition({ children, fill }: { children: React.ReactNode; fill?: boolean }) {
  const { pathname } = useLocation();
  return (
    // popLayout crossfades the outgoing and incoming pages: the new page renders
    // immediately and the old one animates out on top of it, pulled out of document
    // flow so it causes no layout jump. (mode="wait" would fade the old page out
    // fully before the new one starts, leaving a blank content gap on every route
    // change.)
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={fill ? "h-full" : undefined}
      >
        {/* Keyed by pathname so navigating away from a crashed page
            resets the boundary instead of it staying stuck. */}
        <ErrorBoundary key={pathname}>{children}</ErrorBoundary>
      </motion.div>
    </AnimatePresence>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const main = document.querySelector<HTMLElement>("main.scroll-main");
    if (!main) return;
    mainRef.current = main;
    const handler = () => setVisible(main.scrollTop > 320);
    main.addEventListener("scroll", handler, { passive: true });
    return () => main.removeEventListener("scroll", handler);
  }, [pathname]);

  const scrollUp = () => mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      className={cn(
        // tap-44: the visual button stays a restrained 36px square, but the
        // hit area is expanded to the 44px touch minimum — this floats over
        // content on every page, so a near-miss scrolls the page instead.
        "tap-44 fixed right-5 z-40 w-9 h-9 rounded-sm",
        "bg-surface border border-[var(--border)]",
        "flex items-center justify-center",
        "text-subtle hover:text-accent hover:border-[var(--gold-hairline)]",
        "transition-all duration-400 active:scale-95",
        "bottom-[76px] md:bottom-6",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      )}
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}

// Keyboard and screen-reader users otherwise have to tab through the entire
// sidebar (5 nav items + AI + profile card) or the header controls before
// reaching page content, on every single route change. The link is visually
// hidden until it takes focus, at which point it becomes a normal, visible
// control — the standard pattern, and the first thing an accessibility
// audit looks for.
function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[300]
                 focus:px-4 focus:py-2.5 focus:rounded-sm focus:bg-gold-400 focus:text-[#0C0A09]
                 focus:text-[11px] focus:uppercase focus:tracking-[0.14em]"
    >
      {label}
    </a>
  );
}

export function MainLayout() {
  const { isDesktop } = useBreakpoint();
  const { checkAuth } = useAuth();
  const { t } = useTranslation();
  const checked = useRef(false);
  const { pathname, hash } = useLocation();
  // A page that manages its own inner scroll (the chat: toolbar, message list and
  // input stacked in a column) must fill <main> exactly. <main> stops scrolling for
  // it and the page sizes itself with h-full — no viewport arithmetic, so it cannot
  // drift by a pixel and leave <main> scrollable.
  const fillsViewport = pathname.startsWith("/chat");

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    checkAuth();
  }, []); // eslint-disable-line

  // <main>, not window, is the scroll container (see overflow-y-auto below), and it
  // is never unmounted between routes (only <Outlet>'s child is), so its scrollTop
  // is reset by hand on navigation: otherwise Atlas -> a country page lands however
  // far down Atlas the reader had scrolled, not at the country's hero.
  // useLayoutEffect (not useEffect) so this runs before the new page paints.
  //
  // Skipped when the navigation carries a hash: an in-page anchor link (or a deep
  // link to one) is asking to land somewhere specific.
  useLayoutEffect(() => {
    if (hash) return;
    const main = document.querySelector<HTMLElement>("main.scroll-main");
    if (main) main.scrollTop = 0;
  }, [pathname, hash]);

  // One structure for both sizes: navigation lives in the masthead, and the only
  // difference is the tab bar, which exists on touch and is where the masthead's own
  // nav row is suppressed.
  //
  // h-dvh (not min-h) gives every descendant a bounded height to size against —
  // without it, flex-1 + overflow-y-auto on <main> never gets a real height to
  // overflow within, so it never scrolls.
  return (
    <div className="flex flex-col h-dvh app-bg overflow-hidden">
      <SkipLink label={t("nav", "skip_to_content")} />
      <Masthead />
      <ScrollProgress />
      <main
        id="main-content"
        tabIndex={-1}
        className={cn("scroll-main flex-1 min-h-0", fillsViewport ? "overflow-hidden" : "overflow-y-auto")}
        // Reserves real room for the fixed tab bar so the last section of a
        // page is never sitting underneath it. --tabbar-h is 0 on desktop,
        // where the bar does not exist.
        style={{ paddingBottom: "var(--tabbar-h)" }}
      >
        {/* No max-width here. Each page sets its own measure (PageWrap caps
            at 1280px, long-form copy at ~68ch); a second cap in the shell
            meant a page could never reach the width it was designed to. */}
        <PageTransition fill={fillsViewport}>
          <Outlet />
        </PageTransition>
      </main>
      {!isDesktop && <BottomNav />}
      <Toaster />
      <ScrollToTop />
      {isDesktop && <TourRunner />}
    </div>
  );
}
