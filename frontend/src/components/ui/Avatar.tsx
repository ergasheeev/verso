import { cn } from "@/lib/utils";

/**
 * One avatar renderer for the whole app (sidebar, header, chat, profile).
 * Previously each of those four spots re-implemented the same "photo, or
 * the first letter of the name on a colored circle" fallback independently
 * — fine while there was never a photo to show, but adding real avatar
 * uploads meant every one of those four call sites needed the same new
 * `avatarUrl ? <img> : <letter>` branch. One component instead of four
 * near-identical patches.
 */
export function Avatar({
  name,
  avatarUrl,
  size = 36,
  className,
}: {
  name: string;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        style={{ width: size, height: size }}
        className={cn("rounded-sm object-cover shrink-0", className)}
      />
    );
  }
  return (
    // The initial is set in the display serif on a hairline-bordered plate,
    // not white-on-a-coloured-circle: the circle was the last place in the
    // app still painting a solid accent fill behind UI chrome.
    <div
      style={{ width: size, height: size, fontSize: size * 0.44 }}
      className={cn(
        "rounded-sm border border-[var(--gold-hairline)] bg-[var(--gold-soft)]",
        "font-display text-accent shrink-0 flex items-center justify-center leading-none",
        className
      )}
    >
      {/* charAt, not [0] — [0] on an empty string is undefined and
          .toUpperCase() on it throws. */}
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
