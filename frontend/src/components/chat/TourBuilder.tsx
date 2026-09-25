import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/editorial";
import { GenerateButton } from "@/components/ui/GenerateButton";
import { useTranslation } from "@/i18n";
import { LOCATIONS } from "@/data";

/**
 * Pick-the-answer tour planner.
 *
 * The visitor taps four choices instead of typing three answers, and the model
 * receives clean structured input (days, people, regions, budget) through
 * `POST /ai/tour-plan` rather than parsing prose.
 */

const CITIES = Array.from(new Set(LOCATIONS.map((l) => l.city))).sort();

export interface TourBuilderData {
  days: string;
  people: string;
  regions: string[];
  budget: string;
}

const DAY_OPTIONS = [2, 3, 5, 7, 10];

function ChipButton({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "tap-44 px-3.5 py-2.5 rounded-sm border text-[13px] transition-colors duration-400",
        active
          ? "border-[var(--gold-hairline)] text-accent bg-[var(--gold-soft)]"
          : "border-[var(--border)] text-subtle hover:text-ink hover:border-[var(--gold-hairline)]",
      )}
    >
      {children}
    </button>
  );
}

export function TourBuilder({
  open, onClose, onSubmit, generating,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TourBuilderData) => void;
  generating: boolean;
}) {
  const { t } = useTranslation();
  const [days, setDays] = useState<number | null>(null);
  const [people, setPeople] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [regions, setRegions] = useState<string[]>([]);

  const PEOPLE_OPTIONS = [
    t("chat", "tour_builder_people_solo"),
    t("chat", "tour_builder_people_couple"),
    t("chat", "tour_builder_people_family"),
    t("chat", "tour_builder_people_group"),
  ];
  const BUDGET_OPTIONS = [
    t("chat", "tour_builder_budget_low"),
    t("chat", "tour_builder_budget_mid"),
    t("chat", "tour_builder_budget_comfort"),
    t("chat", "tour_builder_budget_luxury"),
  ];

  const valid = days !== null && people !== null && budget !== null && regions.length > 0;

  function toggleRegion(city: string) {
    setRegions((prev) => (prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]));
  }

  function reset() {
    setDays(null); setPeople(null); setBudget(null); setRegions([]);
  }

  function submit() {
    if (!valid || generating) return;
    onSubmit({
      days: `${days} ${t("chat", "tour_builder_days_unit")}`,
      people: people!,
      budget: budget!,
      regions,
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o && !generating) { onClose(); reset(); } }}>
      <AnimatePresence>
        {open && (
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
              <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center outline-none">
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ opacity: 0, y: 40, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
                  className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-sm border border-[var(--modal-border)]
                             bg-[var(--modal)] shadow-[var(--shadow-modal)]
                             max-h-[88dvh] flex flex-col overflow-hidden"
                >
                  <div className="sm:hidden w-9 h-1 rounded-full bg-[var(--border)] mx-auto mt-4 mb-1 shrink-0" />

                  <div className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-5 pb-4 shrink-0">
                    <div>
                      <Dialog.Title className="font-display text-[20px] leading-tight text-ink">
                        {t("chat", "tour_builder_title")}
                      </Dialog.Title>
                      <Dialog.Description className="text-[12.5px] text-subtle mt-1.5">
                        {t("chat", "tour_builder_subtitle")}
                      </Dialog.Description>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        disabled={generating}
                        className="tap-44 shrink-0 flex items-center justify-center text-subtle hover:text-ink transition-colors duration-400 disabled:opacity-40"
                        aria-label="Close"
                      >
                        <X className="w-4 h-4" aria-hidden />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="overflow-y-auto px-5 sm:px-6 pb-5 flex-1 scroll-main space-y-6">
                    <div>
                      <span className="kicker mb-2.5 block">{t("chat", "tour_builder_days_label")}</span>
                      <div className="flex flex-wrap gap-2">
                        {DAY_OPTIONS.map((n) => (
                          <ChipButton key={n} active={days === n} onClick={() => setDays(n)}>
                            {n} {t("chat", "tour_builder_days_unit")}
                          </ChipButton>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="kicker mb-2.5 block">{t("chat", "tour_builder_people_label")}</span>
                      <div className="flex flex-wrap gap-2">
                        {PEOPLE_OPTIONS.map((p) => (
                          <ChipButton key={p} active={people === p} onClick={() => setPeople(p)}>{p}</ChipButton>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="kicker mb-2.5 block">{t("chat", "tour_builder_budget_label")}</span>
                      <div className="flex flex-wrap gap-2">
                        {BUDGET_OPTIONS.map((b) => (
                          <ChipButton key={b} active={budget === b} onClick={() => setBudget(b)}>{b}</ChipButton>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="kicker mb-1 block">{t("chat", "tour_builder_regions_label")}</span>
                      <p className="text-[11.5px] text-subtle mb-2.5">{t("chat", "tour_builder_regions_hint")}</p>
                      <div className="flex flex-wrap gap-2">
                        {CITIES.map((city) => (
                          <ChipButton key={city} active={regions.includes(city)} onClick={() => toggleRegion(city)}>
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="w-3 h-3" aria-hidden />
                              {city}
                            </span>
                          </ChipButton>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 px-5 sm:px-6 py-4 border-t border-[var(--border)] shrink-0">
                    <GenerateButton
                      onClick={submit}
                      generating={generating}
                      labelIdle={t("chat", "tour_builder_submit")}
                      labelActive={t("chat", "plan_generating")}
                      disabled={!valid}
                      className="!justify-center"
                    />
                    {!generating && (
                      <Button variant="secondary" onClick={() => { onClose(); reset(); }} className="justify-center">
                        {t("profile", "edit_cancel")}
                      </Button>
                    )}
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
