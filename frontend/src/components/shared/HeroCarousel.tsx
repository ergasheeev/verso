import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
 *
 * The outgoing photo stays fully opaque underneath while the incoming one fades
 * in on top. Fading both at once (the old AnimatePresence enter/exit pair) left
 * two half-transparent photos superimposed mid-transition — a double exposure
 * with the dark canvas showing through.
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
  const [prev, setPrev] = useState<number | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => {
        setPrev(i);
        return (i + 1) % images.length;
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [images.length, intervalMs]);

  const cls = cn("absolute inset-0 w-full h-full object-cover", imgClassName);

  return (
    <>
      {prev !== null && prev !== index && (
        <img key={`prev-${images[prev]}`} src={images[prev]} alt="" aria-hidden className={cls} />
      )}
      <motion.img
        key={images[index]}
        src={images[index]}
        alt=""
        aria-hidden
        loading={index === 0 ? "eager" : "lazy"}
        // The first photo is already there on load; only later ones fade.
        initial={{ opacity: prev === null ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className={cls}
      />
    </>
  );
}
