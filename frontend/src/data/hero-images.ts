import registan from "./registan.jpg";
import shohiZinda from "./shohi-zinda.jpg";
import guriAmir from "./guri-amir.jpeg";
import lyabuHovuz from "./lyabu-hovuz.jpg";
import chimganToglari from "./chimgan-toglari.jpeg";
import chorsuRinok from "./chorsu-rinok.jpg";

/** Shared rotation for the Landing and Atlas hero carousels — every real
 * location photo bundled with the app, Registan first since it's the one
 * both pages load eagerly as their LCP image. Ichan-Qala's dusk shot is
 * deliberately left out here: it's naturally low-light, and stacked under
 * the hero's caption scrim it reads as an almost-black frame instead of a
 * photo (it's still used elsewhere, e.g. the auth screen, at full brightness). */
export const HERO_IMAGES = [
  registan, shohiZinda, guriAmir, lyabuHovuz, chimganToglari, chorsuRinok,
];
