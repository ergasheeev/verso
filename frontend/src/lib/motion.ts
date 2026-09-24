import type { Variants } from "framer-motion";

/**
 * Shared entrance motion, so every list/grid in the app enters the same way
 * instead of each page inventing its own timing.
 *
 * The easing is the same [0.16, 1, 0.3, 1] curve already used by the page
 * transition and modal entrances — a fast start that settles gently, which
 * reads as responsive rather than floaty.
 */

/** Parent: staggers its children. Pair with `staggerItem` on each child. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

/** Child of `staggerContainer`. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

