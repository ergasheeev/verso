import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, Location } from "@/types";
import type { Lang } from "@/i18n/translations";

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

  // Language (app-level, persisted, works for guests too)
  lang: Lang;
  setLang: (lang: Lang) => void;

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

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ── Auth ──────────────────────────────────────────
      user: null,
      isLoggedIn: false,

      login: (user) =>
        set((state) => ({
          user,
          isLoggedIn: true,
          lang: (user.lang as Lang) ?? state.lang,
        })),

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

      // ── Language ──────────────────────────────────────
      lang: "en",

      setLang: (lang) =>
        set((state) => ({
          lang,
          user: state.user ? { ...state.user, lang } : null,
        })),

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
        const alreadyShowing = get().toasts.some((t) => t.message === message);
        if (alreadyShowing) return;

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
    }),
    {
      name: "verso-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        plan: state.plan,
        theme: state.theme,
        lang: state.lang,
      }),
      // Bumping this version forces a one-time migration, resetting the
      // persisted language to the current default.
      version: 1,
      migrate: (persisted, version) => {
        const state = persisted as { lang?: Lang };
        if (version < 1) state.lang = "en";
        return state;
      },
      // `user` is persisted but `isLoggedIn` deliberately is not — a stale
      // `true` surviving a failed logout would be a security-relevant lie.
      // It is derived from the restored `user` on rehydrate instead.
      onRehydrateStorage: () => (state) => {
        if (state) state.isLoggedIn = !!state.user;
      },
    }
  )
);
