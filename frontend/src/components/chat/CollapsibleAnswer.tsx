import { useState, useRef, useLayoutEffect, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Clamps a long assistant reply on a phone, with a control to open it.
 *
 * Most replies are short enough now — the prompt holds them to about 90
 * words on a phone — but some are legitimately long: a three-day itinerary
 * came back at 511 words, which is more than three screenfuls at 390px
 * before the reader can reach the next message or the input box.
 *
 * So this does not fight the length, it defers it. The first screenful is
 * shown, the rest is one tap away, and a reply that fits is not touched at
 * all: the clamp only appears once the content actually exceeds the
 * threshold, measured after layout rather than guessed from the character
 * count (markdown lists and tables render far taller than their text).
 */
export function CollapsibleAnswer({
  children,
  enabled,
  moreLabel,
  lessLabel,
  /** Clamp height in px. Roughly one phone screenful of body text. */
  maxHeight = 420,
}: {
  children: ReactNode;
  /** Off on desktop, and off while a reply is still streaming in. */
  enabled: boolean;
  moreLabel: string;
  lessLabel: string;
  maxHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [open, setOpen] = useState(false);

  // useLayoutEffect, not useEffect: the measurement decides whether the
  // clamp is painted at all, and doing it after paint makes a long reply
  // flash at full height before collapsing.
  useLayoutEffect(() => {
    if (!enabled) { setOverflows(false); return; }
    const el = ref.current;
    if (!el) return;
    const measure = () => setOverflows(el.scrollHeight > maxHeight + 40);
    measure();
    // Images and fonts settle after the first pass, and a reply can still be
    // growing while it streams.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [enabled, maxHeight, children]);

  const clamped = enabled && overflows && !open;

  return (
    <div>
      <div
        ref={ref}
        // The wrapper keeps its own overflow hidden only while clamped, so
        // an expanded reply cannot clip a table or a long link.
        className={clamped ? "relative overflow-hidden" : undefined}
        style={clamped ? { maxHeight } : undefined}
      >
        {children}
        {clamped && (
          // Fades into the page rather than cutting mid-line, which is what
          // makes it read as "there is more" instead of "this is broken".
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20
                       bg-gradient-to-t from-[var(--background)] to-transparent"
          />
        )}
      </div>

      {enabled && overflows && (
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          // Stable hook for tests. Every other way of finding this control
          // is ambiguous: its chevron is the same icon the language switcher
          // uses, and its label is translated into six languages.
          data-answer-toggle=""
          className={cn(
            "tap-44 mt-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em]",
            "text-subtle hover:text-accent transition-colors duration-400",
          )}
        >
          <ChevronDown
            className={cn("w-3.5 h-3.5 transition-transform duration-300", open && "rotate-180")}
            aria-hidden
          />
          {open ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  );
}
