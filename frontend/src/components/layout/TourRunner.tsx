import { useEffect } from "react";
import { useTour, TOUR_IDS } from "@/components/ui/Tour";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";

/**
 * Loads the tour's steps and decides when it should run.
 *
 * Desktop only, deliberately: the steps point at the masthead's nav row,
 * which is suppressed below `lg` in favour of the bottom tab bar. Spotlighting
 * an element that is not rendered would dim the screen around nothing.
 */
export function TourRunner() {
  const { setSteps, startTour } = useTour();
  const { isDesktop } = useBreakpoint();
  const { t, lang } = useTranslation();
  const tourSeen = useAppStore((s) => s.tourSeen);

  // Depends on `lang`, NOT on `t`. useTranslation builds a fresh `t` closure
  // on every render, so listing it here re-ran this effect each time, and
  // setSteps always stores a new array — that is an infinite render loop
  // that hangs the page. `lang` is a primitive and only changes when the
  // translations actually need rebuilding.
  useEffect(() => {
    setSteps([
      // All four anchors now sit in the masthead, so the tooltip hangs below
      // them rather than beside them — a "right"-positioned tooltip against a
      // top bar would be pushed off the viewport edge for the rightmost step.
      { selectorId: TOUR_IDS.LOCATIONS, position: "bottom", title: t("tour", "loc_title"),     body: t("tour", "loc_body") },
      { selectorId: TOUR_IDS.SAVED,     position: "bottom", title: t("tour", "saved_title"),   body: t("tour", "saved_body") },
      { selectorId: TOUR_IDS.AI,        position: "bottom", title: t("tour", "ai_title"),      body: t("tour", "ai_body") },
      { selectorId: TOUR_IDS.PROFILE,   position: "bottom", title: t("tour", "profile_title"), body: t("tour", "profile_body") },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSteps, lang]);

  useEffect(() => {
    if (tourSeen || !isDesktop) return;
    // One frame is not enough on a cold load — the masthead mounts with the
    // layout, but its final geometry settles after fonts and the logo image
    // resolve. Starting too early spotlights a box that then moves.
    const id = setTimeout(startTour, 900);
    return () => clearTimeout(id);
  }, [tourSeen, isDesktop, startTour]);

  return null;
}
