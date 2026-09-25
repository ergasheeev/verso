import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Scroll-driven motion primitives.
 *
 * Two different pages need these. Inside MainLayout, the shell is a fixed
 * `h-dvh` and the actual scrolling happens on the inner `main.scroll-main`
 * — `window.scrollY` there is always 0. Landing sits outside MainLayout
 * entirely (no app chrome for a logged-out visitor) and scrolls the window
 * directly, where `main.scroll-main` doesn't exist at all. Every hook below
 * resolves to whichever one is actually present.
 *
 * Every effect here is decorative, so each one no-ops under
 * prefers-reduced-motion instead of animating a smaller distance.
 */

type ScrollTarget = HTMLElement | typeof window;

function isWindowTarget(t: ScrollTarget): t is typeof window {
  return t === window;
}

function scrollTopOf(t: ScrollTarget): number {
  return isWindowTarget(t) ? window.scrollY : t.scrollTop;
}

function scrollMaxOf(t: ScrollTarget): number {
  return isWindowTarget(t)
    ? document.documentElement.scrollHeight - window.innerHeight
    : t.scrollHeight - t.clientHeight;
}

/** The nearest scrollable ancestor, falling back to the window. */
function useScrollTarget(): ScrollTarget {
  const [target, setTarget] = useState<ScrollTarget>(() => window);
  useEffect(() => {
    setTarget(document.querySelector<HTMLElement>("main.scroll-main") ?? window);
  }, []);
  return target;
}

/**
 * A gold hairline tracking read position, sitting on the masthead's bottom
 * border. The product's whole vocabulary for "where am I" is a rule — the
 * nav underline, the active tab, the showcase pips — so progress is one too
 * rather than a floating percentage badge.
 */
export function ScrollProgress() {
  const target = useScrollTarget();
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);
  // Spring so a fast flick settles rather than snapping frame-to-frame.
  const scaleX = useSpring(progress, { stiffness: 220, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;

    // scrollHeight/clientHeight are layout reads; doing them inside the scroll
    // handler would force a synchronous reflow on every scroll event, and the handler
    // fires far more often than the screen refreshes. The extent is measured once and
    // re-measured only when something can actually have changed it.
    let max = scrollMaxOf(target);
    const remeasure = () => { max = scrollMaxOf(target); write(); };

    let raf = 0;
    const write = () => {
      raf = 0;
      // A page that doesn't scroll reports 0 and the rule stays invisible,
      // which is the correct resting state for short pages.
      progress.set(max > 0 ? Math.min(1, Math.max(0, scrollTopOf(target) / max)) : 0);
    };
    // Coalesce to one write per frame, whatever the scroll event rate.
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(write); };

    write();
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    // Lazy images and revealed sections change the page height after load.
    const ro = new ResizeObserver(remeasure);
    ro.observe(isWindowTarget(target) ? document.documentElement : target);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
    };
  }, [target, reduce, progress]);

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      // Sits exactly on the masthead's lower edge, which is the line the
      // rest of the page already hangs from. --masthead-h is the same token
      // the Chat page uses for its own height math.
      style={{ scaleX, transformOrigin: "0% 50%", top: "calc(var(--masthead-h) - 1px)" }}
      className="fixed left-0 right-0 z-[60] h-px bg-gold-400/70 pointer-events-none"
      initial={false}
    />
  );
}

/**
 * Hero parallax: the image drifts slower than the page, so a photograph
 * feels like it sits behind the text rather than being glued to it.
 *
 * Only correct for a hero at the very top of a page — offset is taken
 * straight from scrollTop rather than the element's own position, which is
 * all these heroes need and avoids a per-frame getBoundingClientRect.
 */
export function ParallaxHero({
  children,
  speed = 0.22,
  className,
}: {
  children: React.ReactNode;
  /** Fraction of scroll distance the image lags behind by. */
  speed?: number;
  className?: string;
}) {
  const target = useScrollTarget();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);

  useEffect(() => {
    if (reduce) return;
    const node = ref.current;
    if (!node) return;

    // offsetHeight is a layout read; measuring it per scroll event forced a
    // reflow every frame. It only changes on resize, so observe instead.
    let h = node.offsetHeight;
    const ro = new ResizeObserver(() => { h = node.offsetHeight; });
    ro.observe(node);

    let raf = 0;
    const write = () => {
      raf = 0;
      const top = scrollTopOf(target);
      // Stop once the hero is fully past — no point animating offscreen.
      if (top > h) return;
      y.set(top * speed);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(write); };

    write();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      target.removeEventListener("scroll", onScroll);
    };
  }, [target, reduce, speed, y]);

  return (
    <motion.div
      ref={ref}
      // Promote once so the drift is a compositor transform, not a repaint.
      style={reduce ? undefined : { y, willChange: "transform" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Reveals a section the first time it scrolls into view.
 *
 * `whileInView` with `once` rather than a load-time CSS animation, which would
 * finish its entrance while the section is still offscreen.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Counts up to a number the first time it comes into view.
 *
 * Editorial products set figures as figures — the count reads as something being
 * tallied rather than a value that was always there.
 */
export function CountUp({
  to,
  duration = 900,
  className,
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(reduce ? to : 0);
  const done = useRef(false);

  useEffect(() => {
    if (reduce) { setValue(to); return; }
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return;
        done.current = true;
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // Same settle-out character as the app's easing curve.
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(to * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        observer.disconnect();
        return () => cancelAnimationFrame(raf);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [to, duration, reduce]);

  // Re-run if the target changes after the first count (filtered results).
  useEffect(() => {
    if (done.current) setValue(to);
  }, [to]);

  return <span ref={ref} className={cn("tabular", className)}>{value}</span>;
}
