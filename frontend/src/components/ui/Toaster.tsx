import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import type { Toast } from "@/store";

export function Toaster() {
  // Selectors, not a whole-store destructure — the Toaster is mounted for
  // the entire session, so subscribing it to every slice meant a plan
  // change or a theme toggle re-rendered it (and re-ran its
  // AnimatePresence diff) for no reason.
  const toasts       = useAppStore((s) => s.toasts);
  const dismissToast = useAppStore((s) => s.dismissToast);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center pointer-events-none w-full max-w-sm px-4"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  // Only an error gets its own colour. Success and info are the same quiet
  // surface with a gold mark: a toast is an acknowledgement, and three
  // different coloured cards flashing at the top of the page was three times
  // more attention than any of these messages deserve.
  const styles = {
    success: "border-[var(--gold-hairline)]",
    info:    "border-[var(--border)]",
    error:   "border-copper-500/45",
  };

  const iconEl =
    toast.type === "error" ? <AlertCircle className="w-4 h-4 text-copper-400 shrink-0" /> :
    toast.type === "info"  ? <Info className="w-4 h-4 text-subtle shrink-0" /> :
                             <CheckCircle className="w-4 h-4 text-accent shrink-0" />;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      className={cn(
        "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-sm border w-full",
        "glass bg-elevated",
        styles[toast.type ?? "success"]
      )}
    >
      {toast.icon ? (
        <span className="text-base shrink-0" aria-hidden="true">{toast.icon}</span>
      ) : (
        iconEl
      )}
      <p className="text-[13px] text-ink flex-1 leading-snug">
        {toast.message}
      </p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 w-6 h-6 rounded-sm flex items-center justify-center text-subtle hover:text-ink transition-colors duration-400"
        aria-label="Close"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
