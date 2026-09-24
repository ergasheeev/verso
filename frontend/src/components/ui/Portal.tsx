import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Renders children into document.body.
 *
 * Not a nicety — a correctness fix. Every page in this app is wrapped in
 * `.grain-overlay`, which sets `isolation: isolate` so the film-grain
 * pseudo-element cannot paint over the chrome. That also makes it a
 * stacking context, which means a `z-[100]` overlay rendered *inside* a page
 * is only z-100 relative to that page. `.grain-overlay` itself is `z-auto`,
 * so the whole page — modal included — lost to the masthead's `z-50` and
 * the tab bar's. The symptom was a modal whose header sat underneath the
 * header bar, which reads as a layout bug rather than a stacking one.
 *
 * Escaping to body puts the overlay back in the root stacking context,
 * where its z-index means what it says.
 *
 * Mounting is deferred one commit so nothing is created during render and
 * so this is inert during SSR or a pre-hydration pass.
 */
export function Portal({ children }: { children: React.ReactNode }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => setHost(document.body), []);
  if (!host) return null;
  return createPortal(children, host);
}
