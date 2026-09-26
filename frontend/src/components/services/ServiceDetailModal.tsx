import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X, MapPin, Star, CheckCircle, DollarSign, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";
import type { Guide } from "@/types";

/**
 * The guide quick-look modal.
 *
 * Was written to cover restaurants, hotels and guides behind one shared
 * `ServiceDetail` union, on the reasoning that a modal was a dead end for all
 * three (a restaurant's full menu, a hotel's amenity list, neither shown on
 * the card). Restaurants and hotels were later given real pages instead
 * (RestaurantDetail.tsx, HotelDetail.tsx) — a menu or a booking form needs
 * more room than a sheet — which left the restaurant/hotel branches here
 * permanently unreachable: Services.tsx only ever constructs
 * `{ type: "guide", data }`. Narrowed to what is actually called.
 */
export function ServiceDetailModal({
  item,
  onClose,
}: {
  item: Guide | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const open = item !== null;

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {open && item && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xl"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center outline-none p-0 sm:p-4">
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ opacity: 0, y: 40, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
                  className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-sm border border-[var(--modal-border)] bg-[var(--modal)] shadow-[var(--shadow-modal)] max-h-[88vh] sm:max-h-[85vh] overflow-y-auto"
                >
                  {/* Cover image */}
                  <div className="relative h-44 sm:h-52 shrink-0">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover rounded-t-3xl sm:rounded-t-2xl" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent rounded-t-3xl sm:rounded-t-2xl" />
                    <Dialog.Close asChild>
                      <button
                        className="tap-44 absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-colors"
                        aria-label={t("services", "close_label")}
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </Dialog.Close>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <Dialog.Title className="font-display font-bold text-white text-lg leading-tight drop-shadow-md">
                        {item.name}
                      </Dialog.Title>
                      <Dialog.Description className="flex items-center gap-3 mt-1 text-white/85 text-xs">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {item.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-gold-300 fill-gold-300" /> {item.rating}
                        </span>
                      </Dialog.Description>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {/* Som, not dollars — see the note in Services.tsx. */}
                      <Fact
                        icon={DollarSign}
                        label={`${item.pricePerDay.toLocaleString()} ${t("services", "uzs_unit")} / ${t("services", "per_day")}`}
                      />
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[11px] font-bold",
                        item.available ? "bg-[var(--gold-soft)] text-accent" : "bg-copper-500/12 text-copper-400"
                      )}>
                        {item.available ? t("services", "available") : t("services", "busy")}
                      </span>
                      {item.verified && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--gold-soft)] text-accent">
                          <CheckCircle className="w-3 h-3" /> {t("detail", "verified")}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-[var(--foreground)] leading-relaxed">{item.bio}</p>
                      <div className="flex items-center gap-1.5 mt-3">
                        <Languages className="w-3.5 h-3.5 text-accent shrink-0" />
                        <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--muted-foreground)]">
                          {t("services", "languages_label")}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {item.langs.map((l) => (
                          <span key={l} className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--gold-soft)] text-accent border border-[var(--gold-hairline)] font-medium">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function Fact({ icon: Icon, label }: { icon: typeof MapPin; label: string }) {
  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--muted)] border border-[var(--border)] text-[11px] font-semibold text-[var(--foreground)]">
      <Icon className="w-3 h-3 text-accent" /> {label}
    </span>
  );
}
