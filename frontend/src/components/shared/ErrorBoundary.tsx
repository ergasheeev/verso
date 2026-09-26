import { Component, useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, RotateCcw, WifiOff } from "lucide-react";
import { useTranslation } from "@/i18n";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * A route chunk that could not be fetched is not a crash.
 *
 * Pages are code-split, so navigating to one you have not opened yet needs
 * a network request. On a train, in a tunnel, or abroad on a dead SIM —
 * which is most of when this app is actually used — that request fails and
 * React throws. The boundary caught it and said "something went wrong",
 * which is both wrong and unactionable: nothing went wrong, the phone is
 * simply offline, and "try again" cannot succeed until it is not.
 */
function isChunkLoadError(error: Error): boolean {
  const text = `${error.name} ${error.message}`;
  return (
    /ChunkLoadError/i.test(text) ||
    /Failed to fetch dynamically imported module/i.test(text) ||
    /Importing a module script failed/i.test(text) ||
    /error loading dynamically imported module/i.test(text)
  );
}

/**
 * The fallback, as a function component so it can be translated.
 *
 * The boundary itself has to be a class — React offers no hook equivalent —
 * but the UI it renders does not, so it is translated.
 */
function ErrorFallback({ error, onRetry }: { error: Error; onRetry: () => void }) {
  const { t } = useTranslation();
  // `navigator.onLine` is only reliable as a negative — false really does
  // mean no connection. Combined with a chunk failure, that is enough.
  const [online, setOnline] = useState(() => navigator.onLine);
  const offline = isChunkLoadError(error) && !online;

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  /**
   * Recover by itself the moment the connection returns.
   *
   * A reload, not `onRetry()`. React.lazy memoises the import promise, so
   * once a chunk fetch has rejected, every later render of that same lazy
   * component replays the rejection — clearing the boundary's state just
   * re-threw and landed on the generic error screen, which is what the
   * first version of this actually did. Reloading discards the memoised
   * rejection, and the URL already points at the route the reader asked
   * for, so they land where they were going.
   *
   * It also covers the other cause of a missing chunk: a deploy rotated
   * the asset hashes while this tab was open, in which case the old chunk
   * is gone for good and only a reload can fix it.
   */
  useEffect(() => {
    if (!online || !isChunkLoadError(error)) return;
    // A short beat so the network is actually usable, not just announced.
    const id = window.setTimeout(() => window.location.reload(), 400);
    return () => window.clearTimeout(id);
  }, [online, error]);

  const Icon = offline ? WifiOff : AlertTriangle;

  return (
    <div className="flex flex-col items-center justify-center text-center gap-3 px-6 py-20">
      <div
        className={
          "w-14 h-14 rounded-sm flex items-center justify-center border " +
          (offline
            ? "bg-[var(--muted)] border-[var(--border)]"
            : "bg-copper-500/10 border-copper-500/35")
        }
      >
        <Icon className={"w-6 h-6 " + (offline ? "text-subtle" : "text-copper-400")} aria-hidden />
      </div>
      <p className="font-display text-[19px] text-ink">
        {t("nav", offline ? "offline_title" : "err_title")}
      </p>
      <p className="text-[13px] leading-relaxed text-subtle max-w-[34ch]">
        {t("nav", offline ? "offline_body" : "err_body")}
      </p>
      {!offline && (
        <button
          onClick={onRetry}
          className="tap-44 flex items-center gap-1.5 mt-2 px-4 py-2 rounded-sm bg-gold-400
                     hover:bg-gold-300 text-[#0C0A09] text-[13px] font-semibold
                     transition-colors active:scale-[0.97]"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden />
          {t("nav", "err_retry")}
        </button>
      )}
    </div>
  );
}

// Without this, any uncaught render exception anywhere in the tree (a bad
// data field, a null-check miss, a third-party library throwing) unmounts
// the whole app to a blank white/dark screen with zero feedback — the
// worst possible failure mode. This catches it and shows something the
// user can actually act on instead.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // An offline chunk fetch is expected operation, not a fault worth a
    // red console entry every time someone walks into a lift.
    if (isChunkLoadError(error)) {
      console.warn("[ErrorBoundary] route chunk unavailable:", error.message);
      return;
    }
    console.error("[ErrorBoundary] Uncaught render error:", error, info.componentStack);
  }

  private retry = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return <ErrorFallback error={this.state.error} onRetry={this.retry} />;
    }
    return this.props.children;
  }
}
