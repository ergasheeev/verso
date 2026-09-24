import { useState, useRef, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";
import { Wordmark } from "@/components/brand/Wordmark";
import { LoginTab, RegisterTab } from "./AuthForms";

// ── Main modal ────────────────────────────────────────────────────────────────
export function AuthModal() {
  // Also mounted app-wide and closed almost all the time — same reason as
  // the command palette for selecting fields instead of the whole store.
  const authModalOpen  = useAppStore((s) => s.authModalOpen);
  const authModalTab   = useAppStore((s) => s.authModalTab);
  const closeAuthModal = useAppStore((s) => s.closeAuthModal);
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const tabResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (tabResetTimer.current) clearTimeout(tabResetTimer.current); }, []);

  // Whichever tab the caller asked for (openAuthModal("register") from
  // the landing page's "Get Started" CTA, vs the plain "Sign In" link)
  // becomes the tab shown when the modal opens.
  useEffect(() => {
    if (authModalOpen) setActiveTab(authModalTab);
  }, [authModalOpen, authModalTab]);

  function handleClose() {
    closeAuthModal();
    if (tabResetTimer.current) clearTimeout(tabResetTimer.current);
    tabResetTimer.current = setTimeout(() => setActiveTab("login"), 300);
  }

  return (
    <Dialog.Root open={authModalOpen} onOpenChange={(open) => !open && handleClose()}>
      <AnimatePresence>
        {authModalOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                // Darker scrim + a real blur radius (not backdrop-blur-sm's 4px), so the page
                // header behind the modal is not faintly legible and does not read as doubled
                // text next to the modal's own header.
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xl"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              {/* Mobile: full-width bottom sheet anchored to the screen
                  edge (rounded top corners only) instead of a small
                  centered card with large dark margins either side.
                  Desktop keeps the centered card. */}
              <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center outline-none">
                <motion.div
                  // Calm tween in/out (no elastic/spring overshoot) — faster
                  // out than in, per the "modal entrance" motion spec.
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ opacity: 0, y: 40, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
                  // Level 2: a neutral surface off the green ramp entirely,
                  // so the modal never reads as "the page, just blurred".
                  className="relative w-full sm:max-w-sm rounded-t-2xl sm:rounded-sm border border-[var(--modal-border)] bg-[var(--modal)] shadow-[var(--shadow-modal)] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:p-5 sm:m-4 max-h-[90vh] overflow-y-auto overflow-x-hidden"
                >
                  {/* Grab handle — sheet-only affordance, hidden on the
                      desktop centered-card layout. */}
                  <div className="sm:hidden w-9 h-1 rounded-full bg-[var(--border)] mx-auto mb-4" />

                  <div className="flex items-center justify-between mb-4">
                    <Wordmark size="sm" />
                    <Dialog.Close asChild>
                      <button className="w-11 h-11 rounded-full flex items-center justify-center transition-colors -mr-2" aria-label="Close">
                        <span className="w-7 h-7 rounded-full bg-[var(--muted)] hover:bg-[var(--border)] flex items-center justify-center transition-colors">
                          <X className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                        </span>
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Ruled tabs, matching the /login and /signup pages. The
                      modal previously used a filled gold pill, so the same
                      two choices looked like two different products
                      depending on how you got to them. */}
                  <div className="flex gap-6 mb-6 border-b border-[var(--border)]">
                    {(["login", "register"] as const).map((tab) => {
                      const active = activeTab === tab;
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          aria-current={active}
                          className={cn(
                            "relative pb-3 text-[11px] uppercase tracking-[0.14em] transition-colors duration-400",
                            active ? "text-ink" : "text-subtle hover:text-ink",
                          )}
                        >
                          {active && (
                            <motion.span
                              layoutId="auth-tab-rule"
                              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                              className="absolute left-0 right-0 -bottom-px h-px bg-gold-400"
                            />
                          )}
                          {tab === "login" ? t("auth", "login") : t("auth", "register")}
                        </button>
                      );
                    })}
                  </div>

                  {activeTab === "login" ? <LoginTab onClose={handleClose} /> : <RegisterTab onClose={handleClose} />}
                </motion.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
