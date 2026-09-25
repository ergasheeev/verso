import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A slow crossfading hero backdrop.
 *
 * Cycles through a handful of real Uzbek location photos (the only photography
 * bundled) so the landing cover and the Atlas hero show more of what the app
 * covers, without new assets or a CMS.
 *
 * Renders as a stack of absolutely-positioned images inside whatever
 * `absolute inset-0` ancestor the caller already has (the hero section's own
 * parallax wrapper) — this component fills that box, it doesn't create one.
 */
export function HeroCarousel({
  images,
  intervalMs = 6000,
  imgClassName,
}: {
  images: string[];
  intervalMs?: number;
  imgClassName?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs);
    return () => window.clearInterval(id);
  }, [images.length, intervalMs]);

  return (
    <AnimatePresence>
      <motion.img
        key={images[index]}
        src={images[index]}
        alt=""
        aria-hidden
        loading={index === 0 ? "eager" : "lazy"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn("absolute inset-0 w-full h-full object-cover", imgClassName)}
      />
    </AnimatePresence>
  );
}
