import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { CATEGORY_STYLE } from "@/lib/categories";
import { plateHue } from "@/data/countries";
import { useSpotlight } from "@/hooks/useSpotlight";
import { useTranslation } from "@/i18n";
import { syncAddToPlan, syncRemoveFromPlan } from "@/lib/plan-sync";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import type { Location } from "@/types";

/**
 * A place, set as a plate in a catalogue.
 *
 * One card, one action: a single save control. Rating, reviews, price, duration
 * and tags are one quiet tabular line, so the name is the only loud element —
 * which is what a catalogue entry looks like.
 */

interface LocationCardProps {
  location: Location;
  variant?: "default" | "featured";
  className?: string;
}

function LocationCardImpl({ location, variant = "default", className }: LocationCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // Selectors, not a whole-store destructure: the memo() below is worthless
  // if the component subscribes to every slice, since any toast or theme
  // toggle would re-render all 40+ cards in the grid.
  const addToPlan = useAppStore((s) => s.addToPlan);
  const removeFromPlan = useAppStore((s) => s.removeFromPlan);
  const showToast = useAppStore((s) => s.showToast);
  // Derived to a boolean so this card re-renders when ITS OWN saved state
  // flips, not when any other card's does.
  const inPlan = useAppStore((s) => s.plan.some((l) => l.id === location.id));

  const cat = CATEGORY_STYLE[location.category];
  const catLabel = t("home", cat.tKey as "cat_tarix");
  const freeLabel = t("detail", "free");

  const [imgLoaded, setImgLoaded] = useState(false);
  const spotlight = useSpotlight<HTMLDivElement>();

  const go = () => navigate(`/locations/${location.id}`);
  const price = location.priceUSD === 0 ? freeLabel : `$${location.priceUSD}`;

  function bookmark(e: React.MouseEvent) {
    e.stopPropagation();
    if (inPlan) {
      removeFromPlan(location.id);
      syncRemoveFromPlan(location.id);
      showToast(`${location.name} ${t("card", "removed_toast")}`, undefined, "info");
    } else {
      addToPlan(location);
      syncAddToPlan(location.id);
      showToast(`${location.name} ${t("card", "added_toast")}`, undefined, "success");
    }
  }

  /**
 * A place with no verified photograph gets a typographic plate rather than a
 * stand-in image, so a missing image is never mistaken for a confidently-wrong
 * one.
 */
  const img = location.img ? (
    <>
      {!imgLoaded && <div className="absolute inset-0 skeleton" />}
      <img
        src={location.img}
        alt={location.name}
        loading="lazy"
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgLoaded(true)}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-transform duration-900 ease-spring",
          "group-hover:scale-[1.04]",
          imgLoaded ? "opacity-100" : "opacity-0",
        )}
      />
    </>
  ) : (
    // A warm, per-place wash rather than a grey box with an icon in it —
    // which is indistinguishable from an image that failed to load.
    <div
      className="plate absolute inset-0 flex items-center justify-center"
      style={{ "--plate-h": plateHue(location.id) } as React.CSSProperties}
    >
      {/* text-ink, not a fixed cream. The plate flips with the theme (dark canvas vs
          paper), and a hard-coded cream would be nearly the same colour as the light
          plate — the placeholder icon would vanish. text-ink gives a visible watermark
          in both themes. */}
      <cat.Icon className="w-7 h-7 text-ink/25" strokeWidth={0.9} aria-hidden />
    </div>
  );

  const saveButton = (
    <motion.button
      onClick={bookmark}
      whileTap={{ scale: 0.9 }}
      aria-label={inPlan ? t("detail", "remove_plan") : t("card", "add_plan")}
      className={cn(
        // tap-44: the seal is 32px, under the touch guideline, and it sits on a card
        // that is itself a link — a near-miss would open the place instead of saving it.
        // It is in a corner with no neighbouring control, so the expanded hit area
        // steals nothing.
        "tap-44 absolute top-3 right-3 z-[3] w-8 h-8 rounded-sm flex items-center justify-center",
        "border backdrop-blur-md transition-colors duration-400",
        inPlan
          ? "bg-gold-400 text-[#0C0A09] border-gold-400"
          : "bg-black/35 text-[#F5EFE3] border-white/20 hover:border-gold-400 hover:text-accent",
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={inPlan ? "in" : "out"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className="flex"
        >
          {inPlan ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );

  /* ── Featured: the photograph carries everything ─────────── */
  if (variant === "featured") {
    return (
      <motion.div
        ref={spotlight.ref}
        onMouseMove={spotlight.onMouseMove}
        onClick={go}
        whileTap={{ scale: 0.99 }}
        className={cn(
          "figure group relative h-72 rounded-sm cursor-pointer shrink-0",
          "border border-[var(--border)] hover:border-[var(--gold-hairline)]",
          "transition-colors duration-600",
          className,
        )}
      >
        {img}
        {saveButton}

        <div className="absolute inset-0 z-[2] flex flex-col justify-end p-5">
          <span className="kicker text-[#F5EFE3]/90 mb-2.5">{catLabel}</span>
          <h2 className="font-display text-[23px] leading-[1.1] text-[#F5EFE3] mb-3 route-underline">
            {location.name}
          </h2>
          <div className="flex items-center gap-3 tabular text-[11px] text-[#F5EFE3]/90">
            <span>{location.city}</span>
            <span aria-hidden className="w-px h-3 bg-white/25" />
            <span className="text-gold-300">★ {location.rating}</span>
            <span aria-hidden className="w-px h-3 bg-white/25" />
            <span>{price}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  /* ── Default: plate above, catalogue line below ──────────── */
  return (
    <motion.div
      ref={spotlight.ref}
      onMouseMove={spotlight.onMouseMove}
      onClick={go}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "spotlight-card card-lift group cursor-pointer overflow-hidden rounded-sm",
        "bg-surface border border-[var(--border)] hover:border-[var(--gold-hairline)]",
        "transition-colors duration-600 flex flex-col",
        className,
      )}
    >
      {/* Not `.figure`: its ::after scrim is up to 90% black and is built for a title
          set over the photo. Only a small category label sits here, so a short, lighter
          gradient behind it is enough and the photograph stays visible. Fixed 16:10 so
          every card in a grid lines up. */}
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden isolate bg-[var(--muted)]">
        {img}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-[1] bg-gradient-to-t from-black/55 to-transparent" />
        {saveButton}
        <span className="absolute bottom-3 left-4 z-[2] kicker text-[#F5EFE3]">{catLabel}</span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h2 className="font-display text-[19px] leading-[1.2] text-ink line-clamp-2 mb-2 route-underline">
          {location.name}
        </h2>

        {location.shortDesc && (
          <p className="text-[12.5px] leading-relaxed text-subtle line-clamp-2 mb-5 flex-1">
            {location.shortDesc}
          </p>
        )}

        {/* One quiet tabular line, no pills: place on the left, the numbers
            spaced evenly, duration pushed to the right edge. */}
        <div className="flex items-center gap-3 tabular text-[11px] text-subtle hairline-t pt-3.5 mt-auto">
          <span className="truncate min-w-0">{location.city}</span>
          <span aria-hidden className="w-px h-3 bg-[var(--border)] shrink-0" />
          <span className="text-accent shrink-0">★ {location.rating}</span>
          <span aria-hidden className="w-px h-3 bg-[var(--border)] shrink-0" />
          <span className="shrink-0">{price}</span>
          <span className="ml-auto pl-2 shrink-0 truncate max-w-[38%] text-subtle/90">{location.duration}</span>
        </div>
      </div>
    </motion.div>
  );
}

// Locations re-renders the whole filtered list on every search keystroke;
// memoizing keeps a card's re-render tied to its own props.
export const LocationCard = memo(LocationCardImpl);
