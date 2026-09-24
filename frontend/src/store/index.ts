import { create } from "zustand";
import type { User, Location } from "@/types";

export interface Toast {
  id: string;
  message: string;
  icon?: string;
  type?: "success" | "info" | "error";
}

interface AppStore {
  // Auth
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;

  // Plan
  plan: Location[];
  addToPlan: (location: Location) => void;
  removeFromPlan: (id: string) => void;
  isInPlan: (id: string) => boolean;
  clearPlan: () => void;

  // Theme
  theme: "dark" | "light";
  toggleTheme: () => void;

  // UI
  authModalOpen: boolean;
  authModalTab: "login" | "register";
  openAuthModal: (tab?: "login" | "register") => void;
  closeAuthModal: () => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, icon?: string, type?: Toast["type"]) => void;
  dismissToast: (id: string) => void;
}

export const useAppStore = create<AppStore>()((set, get) => ({
  // ── Auth ──────────────────────────────────────────
  user: null,
  isLoggedIn: false,

  login: (user) => set({ user, isLoggedIn: true }),

  logout: () => set({ user: null, isLoggedIn: false, plan: [] }),

  updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),

  // ── Plan ──────────────────────────────────────────
  plan: [],

  addToPlan: (location) =>
    set((state) => {
      if (state.plan.some((l) => l.id === location.id)) return state;
      return { plan: [...state.plan, location] };
    }),

  removeFromPlan: (id) =>
    set((state) => ({ plan: state.plan.filter((l) => l.id !== id) })),

  isInPlan: (id) => get().plan.some((l) => l.id === id),

  clearPlan: () => set({ plan: [] }),

  // ── Theme ─────────────────────────────────────────
  theme: "dark",

  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),

  // ── UI ────────────────────────────────────────────
  authModalOpen: false,
  authModalTab: "login",
  openAuthModal: (tab = "login") => set({ authModalOpen: true, authModalTab: tab }),
  closeAuthModal: () => set({ authModalOpen: false }),

  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),

  // ── Toasts ────────────────────────────────────────
  toasts: [],

  showToast: (message, icon, type = "success") => {
    // A rapid run of clicks with the SAME message must not stack a pile of
    // toasts, each with its own timer. If it is already showing, no-op.
    const alreadyShowing = get().toasts.some((t) => t.message === message);
    if (alreadyShowing) return;

    // Date.now() alone collides when two toasts fire in the same
    // millisecond — a random suffix keeps the key unique.
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    set((state) => {
      const next = [...state.toasts, { id, message, icon, type }];
      return { toasts: next.length > 3 ? next.slice(next.length - 3) : next };
    });
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },

  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
