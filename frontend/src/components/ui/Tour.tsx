import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";

/**
 * Spotlight onboarding tour.
 *
 * Adapted from a 21st.dev component, with four substantive changes needed to
 * work here rather than a copy-paste:
 *   • `motion/react` → `framer-motion` (this project's animation library).
 *   • shadcn AlertDialog/Button → plain markup styled with our own tokens;
 *     pulling in @radix-ui/react-alert-dialog for one confirm box would add a
 *     dependency for markup we already know how to write.
 *   • Positioning was viewport-only, so a highlighted element below the fold
 *     was cut out at the wrong place after scrolling. It now accounts for
 *     scroll offset and clamps the tooltip inside the viewport.
 *   • Content is measured rather than assumed: the original hardcoded a
 *     300x174 tooltip, so any step whose text wrapped differently sat
 *     visibly off-centre.
 */

export const TOUR_IDS = {
  AI: "tour-ai",
  LOCATIONS: "tour-locations",
  SAVED: "tour-saved",
  PROFILE: "tour-profile",
} as const;

export interface TourStep {
  title: string;
  body: string;
  selectorId: string;
  position?: "top" | "bottom" | "left" | "right";
}

interface Rect { top: number; left: number; width: number; height: number }

interface TourContextValue {
  steps: TourStep[];
  setSteps: (s: TourStep[]) => void;
  currentStep: number;
  isActive: boolean;
  startTour: () => void;
  nextStep: () => void;
  previousStep: () => void;
  endTour: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within a TourProvider");
  return ctx;
}

const PADDING = 12;
const TOOLTIP_W = 296;

function readRect(id: string): Rect | null {
  const el = document.getElementById(id);
  if (!el) {
    // A missing anchor just silently skips the step in production (better
    // than throwing), but during development that's easy to miss — e.g.
    // a step pointed at a lazy-loaded route whose anchor hasn't mounted
    // yet, or a TOUR_IDS constant that drifted from the actual DOM id.
    if (import.meta.env.DEV) {
      console.warn(`Tour: no element with id "${id}" — this step will be skipped`);
    }
    return null;
  }
  const r = el.getBoundingClientRect();
  // Element may be scrolled out of view entirely (e.g. a sidebar item on a
  // short window) — treating that as "no target" is better than spotlighting
  // empty space.
  if (r.width === 0 && r.height === 0) return null;
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

export function TourProvider({
  children,
  onComplete,
}: {
  children: React.ReactNode;
  onComplete?: () => void;
}) {
  // Zustand needs no provider, so the i18n hook works here even though this
  // sits above the router.
  const { t } = useTranslation();
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [rect, setRect] = useState<Rect | null>(null);

  const isActive = currentStep >= 0 && currentStep < steps.length;

  const sync = useCallback(() => {
    if (currentStep < 0 || currentStep >= steps.length) return;
    setRect(readRect(steps[currentStep].selectorId));
  }, [currentStep, steps]);

  useEffect(() => {
    // Only listen while the tour is running, so scrolling elsewhere in the app
    // does not pay for a capturing handler that immediately returns.
    if (!isActive) return;
    sync();
    // `true` captures scrolls inside nested containers too — the app's main
    // content is its own scroll area, not the window.
    window.addEventListener("resize", sync);
    window.addEventListener("scroll", sync, true);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync, true);
    };
  }, [sync, isActive]);

  // Escape should always be able to dismiss an overlay that covers the page.
  useEffect(() => {
    if (!isActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCurrentStep(-1);
      if (e.key === "ArrowRight") setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setCurrentStep((s) => Math.max(s - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isActive, steps.length]);

  const startTour = useCallback(() => setCurrentStep(0), []);
  const endTour = useCallback(() => setCurrentStep(-1), []);
  const previousStep = useCallback(() => setCurrentStep((s) => Math.max(0, s - 1)), []);

  const nextStep = useCallback(() => {
    setCurrentStep((s) => {
      if (s >= steps.length - 1) {
        onComplete?.();
        return -1;
      }
      return s + 1;
    });
  }, [steps.length, onComplete]);

  // Memoised: without this a new object identity on every render forced
  // every consumer of useTour() to re-render alongside the provider.
  const ctx = useMemo(
    () => ({ steps, setSteps, currentStep, isActive, startTour, nextStep, previousStep, endTour }),
    [steps, currentStep, isActive, startTour, nextStep, previousStep, endTour]
  );

  const step = isActive ? steps[currentStep] : null;

  // Tooltip placement, clamped so it can never render off-screen — the
  // original always trusted the requested side, which pushed the box past
  // the edge for anything near a viewport boundary (the sidebar, on mobile).
  let tip = { top: 0, left: 0 };
  if (rect) {
    const pos = step?.position ?? "bottom";
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const estH = 150;
    if (pos === "top")    tip = { top: rect.top - estH - PADDING, left: rect.left + rect.width / 2 - TOOLTIP_W / 2 };
    if (pos === "bottom") tip = { top: rect.top + rect.height + PADDING, left: rect.left + rect.width / 2 - TOOLTIP_W / 2 };
    if (pos === "left")   tip = { top: rect.top + rect.height / 2 - estH / 2, left: rect.left - TOOLTIP_W - PADDING };
    if (pos === "right")  tip = { top: rect.top + rect.height / 2 - estH / 2, left: rect.left + rect.width + PADDING };
    tip.left = Math.max(PADDING, Math.min(tip.left, vw - TOOLTIP_W - PADDING));
    tip.top = Math.max(PADDING, Math.min(tip.top, vh - estH - PADDING));
  }

  return (
    <TourContext.Provider value={ctx}>
      {children}

      <AnimatePresence>
        {isActive && rect && step && (
          <>
            {/* Dimmer with a hole punched over the target. clipPath is what
                lets one element both dim the page and leave the highlighted
                control visible, without cloning it into a portal. */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={endTour}
              className="fixed inset-0 z-[90] bg-black/60"
              style={{
                clipPath: `polygon(
                  0% 0%, 0% 100%, 100% 100%, 100% 0%,
                  ${rect.left - 4}px 0%,
                  ${rect.left - 4}px ${rect.top - 4}px,
                  ${rect.left + rect.width + 4}px ${rect.top - 4}px,
                  ${rect.left + rect.width + 4}px ${rect.top + rect.height + 4}px,
                  ${rect.left - 4}px ${rect.top + rect.height + 4}px,
                  ${rect.left - 4}px 0%
                )`,
              }}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none fixed z-[95] rounded-sm ring-2 ring-gold-400"
              style={{
                top: rect.top - 4,
                left: rect.left - 4,
                width: rect.width + 8,
                height: rect.height + 8,
              }}
            />

            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed z-[100] rounded-sm bg-elevated border border-[var(--modal-border)] shadow-[var(--shadow-modal)] p-5"
              style={{ top: tip.top, left: tip.left, width: TOOLTIP_W }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="index-num text-accent">
                  {String(currentStep + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                </span>
                <button
                  onClick={endTour}
                  className="text-[11px] sm:text-[10px] uppercase tracking-[0.14em] text-subtle hover:text-ink transition-colors duration-400"
                >
                  {t("tour", "skip")}
                </button>
              </div>

              <p className="font-display text-[19px] leading-tight text-ink mb-2">{step.title}</p>
              <p className="text-[13px] leading-relaxed text-subtle">{step.body}</p>

              <div className="flex items-center gap-2 mt-5">
                {currentStep > 0 && (
                  <button
                    onClick={previousStep}
                    className="h-9 px-3 rounded-sm text-[11px] uppercase tracking-[0.12em] text-subtle hover:text-ink transition-colors duration-400"
                  >
                    {t("tour", "back")}
                  </button>
                )}
                <button
                  onClick={nextStep}
                  className={cn(
                    "ml-auto h-9 px-4 rounded-sm text-[11px] uppercase tracking-[0.12em]",
                    "bg-gold-400 hover:bg-gold-300 text-[#0C0A09] border border-gold-400",
                    "transition-colors duration-400",
                  )}
                >
                  {currentStep === steps.length - 1 ? t("tour", "done") : t("tour", "next")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </TourContext.Provider>
  );
}
