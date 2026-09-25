import { Church, Landmark, Leaf, Map as MapIcon, Palette, Pickaxe } from "lucide-react";
import type { Location } from "@/types";

export type Category = Location["category"];
export type CategoryFilterKey = Category | "all";

/**
 * The single source of truth for how a place category is rendered.
 *
 * Categories are told apart by icon and name, not hue: the palette spends colour
 * on exactly three things (the primary action, premium/live state, and the rules
 * that structure a page), and per-category accents would drown all three. The
 * only colour a category carries is gold, and only when selected. The icon set is
 * a single monoline family and the label is always present beside it.
 *
 * One record so the filter row and the card badges read from one place and cannot
 * drift apart.
 */
export interface CategoryStyle {
  /** lucide icon — one monoline family, constant 2px stroke */
  Icon: typeof Landmark;
  /** icon-only colour (filter row) */
  icon: string;
  /** text colour for a badge/chip */
  text: string;
  /** fill + border for a badge/chip sitting on a --card surface */
  surface: string;
  /**
   * Badge treatment for a badge sitting ON A PHOTOGRAPH. A tint alone is
   * invisible over an unknown image, which left 9px text floating on whatever
   * happened to be in that corner — unreadable against a bright sky. A dark
   * scrim makes legibility independent of the photograph.
   */
  onImage: string;
  /** i18n key under the `home` section */
  tKey: string;
}

/** Every category is drawn identically; only the icon and label differ. */
const NEUTRAL = {
  icon: "text-subtle",
  text: "text-subtle",
  surface: "bg-[var(--muted)] border-[var(--border)]",
  onImage: "bg-black/55 text-[#F5EFE3] border-white/20 backdrop-blur-sm",
} as const;

export const CATEGORY_STYLE: Record<CategoryFilterKey, CategoryStyle> = {
  all:         { Icon: MapIcon,  ...NEUTRAL, tKey: "cat_all" },
  tarix:       { Icon: Landmark, ...NEUTRAL, tKey: "cat_tarix" },
  tabiat:      { Icon: Leaf,     ...NEUTRAL, tKey: "cat_tabiat" },
  madaniyat:   { Icon: Palette,  ...NEUTRAL, tKey: "cat_madaniyat" },
  din:         { Icon: Church,   ...NEUTRAL, tKey: "cat_din" },
  arxeologiya: { Icon: Pickaxe,  ...NEUTRAL, tKey: "cat_arxeologiya" },
};
