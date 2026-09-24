import { useEffect } from "react";

/**
 * Sets the browser tab title for a route.
 *
 * Without this, a reader with the atlas, a country and the assistant open
 * would see three identical tabs, and every bookmark would carry the same
 * name — the static title in index.html says nothing about which page it is.
 *
 * Pass the page's own name; the brand is appended here so the distinctive
 * part comes first — a tab strip truncates from the right, and "Verso —
 * Ja…" tells you nothing.
 *
 * Passing `undefined` (a country still loading, say) leaves the previous
 * title in place rather than flashing a bare brand name.
 */
const BRAND = "Verso";

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    if (!title) return;
    const previous = document.title;
    // "Verso AI" and "Verso Pro" already carry the brand; appending it again
    // produced "Verso AI — Verso", which reads like a mistake because it is.
    document.title = title.includes(BRAND) ? title : `${title} — ${BRAND}`;
    // Restore on unmount so a route that sets no title of its own does not
    // inherit the last one during the transition between pages.
    return () => { document.title = previous; };
  }, [title]);
}
