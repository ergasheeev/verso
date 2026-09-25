import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X, MessageSquare, Trash2 } from "lucide-react";
import { useTranslation } from "@/i18n";

/**
 * Past conversations, kept separate from the one on screen.
 *
 * Chat.tsx already persisted the CURRENT thread to localStorage and
 * restored it on reload — that part worked. What did not exist was any way
 * to look back: "New chat" simply overwrote the active thread with nothing
 * kept, so a conversation was one tap from being unrecoverable and there
 * was no list to browse older ones from, the way Claude's own sidebar
 * works. This is that list.
 *
 * The panel itself only renders what it is given; Chat.tsx owns reading,
 * archiving and persisting threads (see loadThreads/saveThreads there) so
 * that logic lives beside the message state it operates on rather than
 * being duplicated across two files.
 */
export interface ChatThreadSummary {
  id: string;
  title: string;
  /** Epoch ms of the thread's last message. */
  updatedAt: number;
}

export function ChatHistoryPanel({
  open,
  onClose,
  threads,
  onOpenThread,
  onDeleteThread,
  onClearAll,
}: {
  open: boolean;
  onClose: () => void;
  threads: ChatThreadSummary[];
  onOpenThread: (id: string) => void;
  onDeleteThread: (id: string) => void;
  onClearAll: () => void;
}) {
  const { t } = useTranslation();

  // Hand-written rather than Intl.RelativeTimeFormat: uz-UZ resolves as a locale
  // in Chromium but renders the bare fallback "-1 min" instead of a real Uzbek
  // phrase. A four-branch formatter using the app's own translated strings behaves
  // identically in every browser.
  function relative(ts: number): string {
    const diffMin = Math.round((Date.now() - ts) / 60_000);
    if (diffMin < 1) return t("chat", "time_just_now");
    if (diffMin < 60) return t("chat", "time_minutes_ago", { n: diffMin });
    const diffHr = Math.round(diffMin / 60);
    if (diffHr < 24) return t("chat", "time_hours_ago", { n: diffHr });
    return t("chat", "time_days_ago", { n: Math.round(diffHr / 24) });
  }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xl"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center outline-none">
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ opacity: 0, y: 40, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
                  className="w-full sm:max-w-md rounded-t-2xl sm:rounded-sm border border-[var(--modal-border)]
                             bg-[var(--modal)] shadow-[var(--shadow-modal)]
                             max-h-[80dvh] flex flex-col overflow-hidden"
                >
                  <div className="sm:hidden w-9 h-1 rounded-full bg-[var(--border)] mx-auto mt-4 mb-1 shrink-0" />

                  <div className="flex items-center justify-between px-5 pt-4 pb-4 shrink-0">
                    <Dialog.Title className="font-display text-[20px] leading-tight text-ink">
                      {t("chat", "history")}
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        className="tap-44 flex items-center justify-center text-subtle hover:text-ink transition-colors duration-400"
                        aria-label="Close"
                      >
                        <X className="w-4 h-4" aria-hidden />
                      </button>
                    </Dialog.Close>
                  </div>

                  {threads.length === 0 ? (
                    <p className="px-5 pb-8 text-[13px] text-subtle leading-relaxed">
                      {t("chat", "history_empty")}
                    </p>
                  ) : (
                    <>
                      <ul className="overflow-y-auto px-2.5 pb-2 flex-1 scroll-main">
                        {threads.map((th) => (
                          // The row and its delete control are siblings, not
                          // nested buttons — a <button> inside a <button> is
                          // invalid HTML and several browsers resolve the
                          // click to whichever one they feel like.
                          <li key={th.id} className="flex items-center gap-1">
                            <button
                              onClick={() => onOpenThread(th.id)}
                              className="flex-1 min-w-0 flex items-center gap-3 px-2.5 py-3 rounded-sm
                                         text-left hover:bg-[var(--card-hover)] transition-colors duration-400"
                            >
                              <MessageSquare className="w-4 h-4 text-subtle shrink-0" aria-hidden />
                              <span className="min-w-0 flex-1">
                                <span className="block text-[13px] text-ink truncate route-underline">
                                  {th.title}
                                </span>
                                <span className="block tabular text-[11px] text-subtle mt-0.5">
                                  {relative(th.updatedAt)}
                                </span>
                              </span>
                            </button>
                            <button
                              onClick={() => onDeleteThread(th.id)}
                              aria-label={t("chat", "history_delete")}
                              // Always visible, not hover-gated: a
                              // hover-only reveal is unreachable on a
                              // touchscreen, which is most of where this
                              // product is used.
                              className="tap-44 shrink-0 flex items-center justify-center text-subtle
                                         hover:text-copper-400 transition-colors duration-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="px-5 py-3 border-t border-[var(--border)] shrink-0">
                        <button
                          onClick={onClearAll}
                          className="tap-44 text-[11px] uppercase tracking-[0.12em] text-subtle hover:text-copper-400 transition-colors duration-400"
                        >
                          {t("chat", "history_clear_all")}
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
