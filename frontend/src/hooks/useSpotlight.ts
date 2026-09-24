import { useRef } from "react";

/** Tracks the cursor position inside an element as CSS vars (--x/--y) for the .spotlight-card effect. */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  function onMouseMove(e: React.MouseEvent<T>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return { ref, onMouseMove };
}
