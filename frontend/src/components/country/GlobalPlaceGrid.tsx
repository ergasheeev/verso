import { useState } from "react";
import { MapPin, Utensils, Hotel as HotelIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { plateHue } from "@/data/countries";
import { useTranslation } from "@/i18n";
import type { GlobalPlace } from "@/data/global-places";

/**
 * A place from the global catalogue, set as a plate — the same photograph
 * + fallback-icon pattern PlateCard uses for restaurants and hotels
 * (components/services/tabs.tsx), not reimplemented from scratch.
 *
 * Not a link to a detail page: unlike Uzbekistan's Location catalogue,
 * these 331 places have no per-place route, no backend row and no review
 * thread — they are the country hub's "what's here" grid, not a full
 * booking flow. Adding that is real future work, not a rename.
 */
const TYPE_ICON: Record<GlobalPlace["type"], typeof MapPin> = {
  attraction: MapPin,
  restaurant: Utensils,
  hotel: HotelIcon,
};

function GlobalPlaceCard({ place }: { place: GlobalPlace }) {
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);
  const Icon = TYPE_ICON[place.type];
  const showImg = place.img && !failed;
  // A bare "0" in the source data means free admission with no further
  // note attached (most free entries read "0 (bepul)" and are left as-is —
  // only the ones with nothing after the digit need a real label here).
  const priceLabel = place.price.trim() === "0" ? t("detail", "free") : place.price;
  const typeLabel =
    place.type === "restaurant" ? t("services", "tab_restaurants")
    : place.type === "hotel" ? t("services", "tab_hotels")
    : t("nav", "locations");

  return (
    <div className="rounded-sm bg-surface border border-[var(--border)] overflow-hidden flex flex-col transition-colors duration-600 hover:border-[var(--gold-hairline)]">
      <div
        className={cn("relative aspect-[16/10] shrink-0 overflow-hidden isolate bg-[var(--muted)]", !showImg && "plate")}
        style={!showImg ? ({ "--plate-h": plateHue(place.countryCode) } as React.CSSProperties) : undefined}
      >
        {showImg ? (
          <img
            src={place.img}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-7 h-7 text-ink/25" strokeWidth={0.9} aria-hidden />
          </div>
        )}
        {showImg && (
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />
        )}
        <span className={cn("absolute bottom-3 left-4 z-[2] kicker", showImg ? "text-[#F5EFE3]" : "text-ink/70")}>
          {typeLabel}
        </span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-display text-[19px] leading-[1.2] text-ink line-clamp-2 mb-2">{place.name}</h3>
        <p className="text-[12.5px] leading-relaxed text-subtle line-clamp-3 mb-5 flex-1">
          {place.description}
        </p>
        <div className="flex items-center gap-3 tabular text-[11px] text-subtle hairline-t pt-3.5 mt-auto">
          <span className="truncate min-w-0">{place.city}</span>
          <span aria-hidden className="w-px h-3 bg-[var(--border)] shrink-0" />
          <span className="text-accent shrink-0">{priceLabel}</span>
          {place.hours && (
            <span className="ml-auto pl-2 flex items-center gap-1 shrink-0 truncate max-w-[40%]">
              <Clock className="w-3 h-3 shrink-0" aria-hidden />
              <span className="truncate">{place.hours}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function GlobalPlaceGrid({ places }: { places: GlobalPlace[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {places.map((p) => (
        <GlobalPlaceCard key={p.id} place={p} />
      ))}
    </div>
  );
}
