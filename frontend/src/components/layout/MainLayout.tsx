import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Masthead } from "./Masthead";
import { BottomNav } from "./BottomNav";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";
import { ScrollProgress } from "@/components/ui/ScrollMotion";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function PageTransition({ children, fill }: { children: React.ReactNode; fill?: boolean }) {
  const { pathname } = useLocation();
  return (
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
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function MainLayout() {
  const { isDesktop } = useBreakpoint();
  const { pathname } = useLocation();
  // A page that manages its own inner scroll (the chat: toolbar, message list and
  // input stacked in a column) must fill <main> exactly. <main> stops scrolling for
  // it and the page sizes itself with h-full — no viewport arithmetic, so it cannot
  // drift by a pixel and leave <main> scrollable.
  const fillsViewport = pathname.startsWith("/chat");

  return (
    <div className="flex flex-col h-dvh app-bg overflow-hidden">
      <Masthead />
      <ScrollProgress />
      <main className={cn("scroll-main flex-1 min-h-0", fillsViewport ? "overflow-hidden" : "overflow-y-auto")}>
        <PageTransition fill={fillsViewport}>
          <Outlet />
        </PageTransition>
      </main>
      {!isDesktop && <BottomNav />}
    </div>
  );
}
