import { cn } from "@/lib/utils";

/**
 * The Verso mark: an open book seen at a slight angle, left leaf solid and
 * right leaf in outline — one page written, one still blank.
 *
 * Both leaves paint with `currentColor` so the mark inherits whatever the
 * surrounding text colour is. That is deliberate: the previous brand shipped
 * two PNG/SVG variants and every call site carried a `dark:hidden` / `hidden
 * dark:block` pair to swap them, which meant the logo was wrong in exactly
 * the cases the pair did not anticipate — on a photograph, inside a modal,
 * or over a gold fill. One element that inherits colour has no such cases.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("shrink-0", className)}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M15.1 9.6 L3.4 6.7 V25.2 L15.1 28.1 Z" fill="currentColor" />
      <path
        d="M16.9 9.6 L28.6 6.7 V25.2 L16.9 28.1 Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface WordmarkProps {
  /** Renders the mark alone, without the word. Used in tight chrome. */
  markOnly?: boolean;
  /** Drops the mark and sets the word alone — for footers and legal pages. */
  wordOnly?: boolean;
  className?: string;
  /** Overrides the word's size; the mark scales to match. */
  size?: "sm" | "md" | "lg";
}

const SIZE = {
  sm: { mark: "w-5 h-5", word: "text-[15px] tracking-[0.2em]" },
  // `md` steps down on narrow screens. The masthead has to fit the wordmark,
  // three controls and a sign-in button on one row; at a fixed 19px the word
  // alone ate ~95px and the row overflowed a 320px phone.
  md: {
    mark: "w-5 h-5 sm:w-6 sm:h-6",
    word: "text-[15px] tracking-[0.16em] sm:text-[19px] sm:tracking-[0.2em]",
  },
  lg: { mark: "w-8 h-8", word: "text-[26px] tracking-[0.18em]" },
} as const;

export function Wordmark({ markOnly, wordOnly, className, size = "md" }: WordmarkProps) {
  const s = SIZE[size];
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-ink", className)}>
      {!wordOnly && <Mark className={cn(s.mark, "text-accent")} />}
      {!markOnly && (
        // The one place in the product that pins the optical size instead of
        // letting it track the rendered size: a logotype has to be the same
        // drawing in the masthead, the footer and the auth screen, not a
        // different cut at each. 20 sits at the text end of Literata's 7..72
        // axis, which is where the strokes stay even at the 19-28px this is
        // actually set at — 40 was upper-middle, and the thins visibly
        // thinned. It read as correct before only because the font request
        // was serving static instances with no opsz axis at all, so the
        // declaration did nothing; now that the axis is live the value has
        // to mean what the line above claims.
        <span
          className={cn("font-display font-normal leading-none", s.word)}
          style={{ fontVariationSettings: '"opsz" 20' }}
        >
          VERSO
        </span>
      )}
    </span>
  );
}

/** The brand line. Kept here so it is stated in exactly one place. */
export const TAGLINE = "Every place has a second page.";
