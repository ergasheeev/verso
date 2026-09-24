import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Masthead } from "./Masthead";
import { BottomNav } from "./BottomNav";
import { useBreakpoint } from "@/hooks/useBreakpoint";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function PageTransition({ children }: { children: React.ReactNode }) {
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
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function MainLayout() {
  const { isDesktop } = useBreakpoint();
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col h-dvh app-bg overflow-hidden">
      <Masthead />
      <main className="scroll-main flex-1 min-h-0 overflow-y-auto">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      {!isDesktop && <BottomNav />}
    </div>
  );
}
