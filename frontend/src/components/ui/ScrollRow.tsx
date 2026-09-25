import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A horizontally scrollable row that admits it scrolls.
 *
 * These rows use `scrollbar-hide`, which on a phone left no indication at
 * all that anything existed past the right edge. Measured at 390px, the
 * Explore tab bar ran to 623px — Transport and Currency sat entirely
 * off-screen, and nothing on screen suggested a swipe would reveal them.
 *
 * A fade on whichever edge still has content is the standard cue, and it
 * costs no layout: the gradients are absolutely positioned and
 * pointer-events-none, so they never intercept a tap meant for a tab.
 */
export function ScrollRow({
  children,
  className,
  /**
   * The colour the fades resolve to. Defaults to the page canvas; a row
   * inside a modal or card sits on --elevated instead, and a fade painted
   * in the wrong colour is more obvious than no fade at all.
   */
  surface = "background",
}: {
  children: React.ReactNode;
  className?: string;
  surface?: "background" | "elevated";
}) {
  // --modal, not --elevated: `bg-elevated` is the Tailwind alias and the
  // underlying custom property is --modal. Naming the alias here would have
  // produced an undefined colour, i.e. a fade to transparent that looks
  // like no fade at all.
  const fadeFrom =
    surface === "elevated"
      ? "from-[var(--modal)] via-[var(--modal)]"
      : "from-[var(--background)] via-[var(--background)]";
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setAtStart(el.scrollLeft <= 1);
      // A row that fits reports max <= 1 and is "at the end" from the
      // start, so neither fade is ever painted — which is correct.
      setAtEnd(max <= 1 || el.scrollLeft >= max - 1);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    // Fires on rotation, on a font swap, and when the row's own contents
    // change (switching tabs re-labels these in a different language).
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="relative">
      <div ref={ref} className={cn("overflow-x-auto scrollbar-hide", className)}>
        {children}
      </div>
      {/* Wider, and opaque for the first third rather than fading from the
          very edge. At 40px with an immediate falloff the chip under the
          fade stayed fully legible, so a half-cut word read as a layout bug
          instead of "there is more this way". */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-14 transition-opacity duration-300",
          "bg-gradient-to-r to-transparent from-30%",
          fadeFrom,
          atStart ? "opacity-0" : "opacity-100",
        )}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-14 transition-opacity duration-300",
          "bg-gradient-to-l to-transparent from-30%",
          fadeFrom,
          atEnd ? "opacity-0" : "opacity-100",
        )}
      />
    </div>
  );
}
