import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A country flag as an image, not an emoji.
 *
 * Windows ships no colour flag glyphs at all — the emoji sequence renders as
 * the two literal regional-indicator letters, which is how this product ended
 * up showing "UZ" chips everywhere. An image renders identically on every
 * platform.
 *
 * `onError` falls back to the code chip, so a blocked CDN or an offline
 * device degrades to something readable rather than an empty square.
 */
export function Flag({
  code,
  size = "sm",
  className,
  fill,
}: {
  code: string;
  /** sm = inline with body text, md = list rows, lg = headers. */
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Fill the parent box edge to edge instead of a fixed size. */
  fill?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const lower = code.toLowerCase();
  const box = fill ? "w-full h-full" : { sm: "w-[22px] h-4", md: "w-7 h-5", lg: "w-9 h-6" }[size];

  if (failed) {
    return (
      <span
        className={cn(
          "mono shrink-0 inline-flex items-center justify-center text-[11px] sm:text-[10px] tracking-[0.1em]",
          "text-subtle bg-[var(--muted)] rounded-[2px]",
          box,
          className,
        )}
      >
        {code}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/${fill ? "w160" : "w40"}/${lower}.png`}
      srcSet={`https://flagcdn.com/${fill ? "w320" : "w80"}/${lower}.png 2x`}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn(
        "shrink-0 object-cover",
        !fill && "rounded-[2px] border border-[var(--border)]",
        box,
        className,
      )}
    />
  );
}
