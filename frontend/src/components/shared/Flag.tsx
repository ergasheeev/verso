import { useState } from "react";
import { cn } from "@/lib/utils";
import { plateHue } from "@/data/countries";

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
  /** Fill the parent box edge to edge (see FlagTile) instead of a fixed size. */
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
      // Tiles render up to ~90px wide, so they pull the 160px source; the
      // 40px one is only sharp at the small inline sizes.
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

const TILE = { sm: "w-9 h-6", md: "w-12 h-8", lg: "w-[88px] h-[58px]" } as const;

/**
 * The flag as an icon: a 3:2 tile the flag fills edge to edge.
 *
 * This replaced a square "plate" with a 28x20 flag centred inside it — most
 * of the tile was bare beige. The tile is now the flag's own 3:2 shape, so
 * `object-cover` crops nothing and there is no padding to leave empty; the
 * plate wash underneath only shows if the flag image fails to load (the
 * fallback chip in <Flag> then sits on it).
 */
export function FlagTile({
  code,
  size = "md",
  className,
}: {
  code: string;
  size?: keyof typeof TILE;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("plate relative shrink-0 inline-block overflow-hidden rounded-md", TILE[size], className)}
      style={{ "--plate-h": plateHue(code) } as React.CSSProperties}
    >
      <Flag code={code} fill />
    </span>
  );
}
