import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Languages, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { useTranslation, LANGUAGE_OPTIONS } from "@/i18n";

/**
 * The language control.
 *
 * It started life on the landing page only, which left every signed-in
 * screen with no way to change language except digging into Profile
 * settings — so someone reading the atlas in the wrong language had to
 * leave the atlas to fix it. Lives in the app masthead now as well.
 *
 * `onImage` is for the landing hero, where the control sits on a
 * photograph and has to hold its own contrast; the default is for the
 * app canvas, where it matches the other masthead controls.
 */
export function LanguageSwitcher({
  onImage = false,
  compact = false,
}: {
  onImage?: boolean;
  /**
   * Icon and code only, sized like the other masthead controls.
   *
   * Exists so the control can be on a phone at all: the full trigger did
   * not fit a 320px row, so it was hidden below `sm` — which left the app
   * with no way to change language on a phone except digging into Profile
   * settings. A reader in the wrong language could not find their way out.
   */
  compact?: boolean;
}) {
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = LANGUAGE_OPTIONS.find((l) => l.code === lang) ?? LANGUAGE_OPTIONS[2];

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t("landing", "language_label")}
        aria-expanded={open}
        className={cn(
          // The compact trigger sits in the masthead row between the search
          // and bookmark controls, which are 44px on touch and 36px from sm:
          // up. It has to match them or it becomes the one odd-sized box in
          // an otherwise even row — and the smallest target in it.
          "tap-44 relative rounded-sm border flex items-center justify-center",
          "text-[11px] uppercase tracking-[0.12em] transition-colors duration-400",
          compact ? "w-11 h-11 sm:w-9 sm:h-9 gap-0" : "h-9 px-3 gap-1.5",
          onImage
            ? "border-white/25 bg-white/5 backdrop-blur-sm text-[#F5EFE3] hover:bg-white/12 hover:border-white/40"
            : "border-[var(--border)] text-subtle hover:text-accent hover:border-[var(--gold-hairline)]",
        )}
      >
        {/* Compact shows the code alone — two letters name the language far
            more directly than a globe glyph, and the icon is what there is
            no room for. */}
        {compact ? (
          <span className="tracking-[0.06em]">{current.code}</span>
        ) : (
          <>
            <Languages className="w-3.5 h-3.5" aria-hidden />
            {current.code}
            <ChevronDown
              className={cn("w-3 h-3 transition-transform duration-400", open && "rotate-180")}
              aria-hidden
            />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 w-44 rounded-sm border border-[var(--modal-border)]
                       bg-[var(--modal)] shadow-[var(--shadow-modal)] overflow-hidden z-[70]"
          >
            {LANGUAGE_OPTIONS.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-[13px] text-left",
                  "hover:bg-[var(--muted)] transition-colors duration-200",
                  l.code === lang ? "text-accent" : "text-ink",
                )}
              >
                {l.label}
                {l.code === lang && <Check className="w-3.5 h-3.5" aria-hidden />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
