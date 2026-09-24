import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoginTab, RegisterTab } from "@/components/auth/AuthForms";
import { Wordmark } from "@/components/brand/Wordmark";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";

import registanImg from "@/data/registan.jpg";
import ichanQalaImg from "@/data/ichan-qala.jpg";
import chimganImg from "@/data/chimgan-toglari.jpeg";
import chorsuImg from "@/data/chorsu-rinok.jpg";

/**
 * Full-page sign in / sign up, adapted from a 21st.dev split-screen layout.
 *
 * Substantive departures from the source, all forced by what this app
 * actually is:
 *   • The original's whole left panel advertised an image generator, with
 *     stock artwork and "/imagine" prompt captions. Replaced with the real
 *     location photography already in this repo — showing a travel app's
 *     sign-up next to AI art someone else generated would be a lie about
 *     the product.
 *   • Its "Sign up with Google / Apple" pair is gone. Social sign-in was
 *     deliberately replaced with emailed verification codes; rendering those
 *     buttons would promise an auth method that does not exist here.
 *   • Its inputs were an uncontrolled demo that wiped a hardcoded value on
 *     first focus. The real forms are imported from AuthForms, so this page
 *     and the modal share one implementation of the code-verification and
 *     password-reset flows rather than two that can drift.
 */

const SHOWCASE = [
  { img: registanImg,  key: "shot_registan"  },
  { img: ichanQalaImg, key: "shot_ichanqala" },
  { img: chimganImg,   key: "shot_chimgan"   },
  { img: chorsuImg,    key: "shot_chorsu"    },
] as const;

export default function Auth() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);

  // The route itself picks the tab, so /signup and /login are each a real,
  // shareable address rather than one page with hidden internal state.
  const [tab, setTab] = useState<"login" | "register">(
    pathname === "/signup" ? "register" : "login"
  );
  const [active, setActive] = useState(0);
  const [showcasePaused, setShowcasePaused] = useState(false);

  useEffect(() => {
    setTab(pathname === "/signup" ? "register" : "login");
  }, [pathname]);

  // Someone who is already signed in has no business on this page.
  useEffect(() => {
    if (isLoggedIn) navigate("/atlas", { replace: true });
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    // Respects both: someone hovering to actually read a caption
    // shouldn't have it swapped out from under them, and someone who
    // asked their OS to reduce motion shouldn't get an auto-advancing
    // slideshow at all (the crossfade/scale transitions on each panel
    // aren't covered by the CSS reduced-motion rule since they're driven
    // by framer-motion, not a CSS animation/transition).
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (showcasePaused || reduceMotion) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % SHOWCASE.length), 5000);
    return () => window.clearInterval(id);
  }, [showcasePaused]);

  function done() {
    navigate("/atlas", { replace: true });
  }

  return (
    // No page inset below lg: on a phone a 12px frame around a full-height
    // form reads as a misaligned card, not a page.
    <div className="app-bg min-h-dvh lg:p-3">
      <div className="grid min-h-dvh lg:min-h-[calc(100dvh-1.5rem)] gap-4 lg:grid-cols-[0.95fr_1.05fr]">

        {/* ── Showcase (desktop only) ────────────────────────────
            Hidden below lg rather than stacked: on a phone it would push
            the actual form a full screen down, turning sign-in into a
            scroll hunt. */}
        <div
          onMouseEnter={() => setShowcasePaused(true)}
          onMouseLeave={() => setShowcasePaused(false)}
          className="relative hidden lg:flex flex-col justify-between overflow-hidden rounded-sm bg-[#0C0A09] p-12 text-[#F5EFE3]"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={SHOWCASE[active].img}
              alt=""
              aria-hidden="true"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 0.55, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20" />

          <div className="relative">
            <Wordmark size="md" />
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-display text-[30px] leading-[1.15] max-w-[16ch]">
                  {t("auth", SHOWCASE[active].key)}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Rules rather than dots — the same margin-rule vocabulary the
                sidebar uses to mark the current row. */}
            <div className="mt-8 flex gap-2">
              {SHOWCASE.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={t("auth", s.key)}
                  aria-current={i === active}
                  className={cn(
                    "h-px transition-all duration-600 ease-spring",
                    i === active ? "w-12 bg-gold-400" : "w-5 bg-white/30 hover:bg-white/55",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Form ─────────────────────────────────────────────── */}
        {/* Top-aligned below lg. Centring a short form inside a full-height
            column left ~430px of empty screen above "Sign in" on a phone —
            the form only centres once the showcase panel gives it something
            to be centred against. */}
        <div className="flex items-start lg:items-center justify-center px-5 pt-8 pb-12 sm:px-10 lg:py-10">
          <div className="w-full max-w-sm">
            <button
              onClick={() => navigate("/")}
              className="tap-44 mb-7 inline-flex items-center gap-2 kicker hover:text-accent transition-colors duration-400"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
              {t("auth", "back_home")}
            </button>

            {/* Repeated for the mobile layout, where the showcase panel that
                carries the wordmark is hidden. */}
            <div className="lg:hidden mb-7">
              <Wordmark size="md" />
            </div>

            {/* Two ruled tabs, with the current one marked by a gold rule
                beneath it — not a sliding filled pill. */}
            <div className="flex gap-6 mb-8 border-b border-[var(--border)]">
              {(["login", "register"] as const).map((key) => {
                const isActive = tab === key;
                return (
                  <button
                    key={key}
                    onClick={() => navigate(key === "login" ? "/login" : "/signup", { replace: true })}
                    aria-current={isActive}
                    className={cn(
                      // min-h-[44px]: the padding alone made these 39px, and
                      // they are the switch between signing in and creating
                      // an account — the first thing a new visitor taps.
                      "relative min-h-[44px] pt-2 pb-3.5 text-[11px] uppercase tracking-[0.14em] transition-colors duration-400",
                      isActive ? "text-ink" : "text-subtle hover:text-ink",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="auth-page-rule"
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-0 right-0 -bottom-px h-px bg-gold-400"
                      />
                    )}
                    {key === "login" ? t("auth", "login") : t("auth", "register")}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* onClose means "you're done here" to both hosts; the modal
                    closes itself, this page navigates into the app. */}
                {tab === "login" ? <LoginTab onClose={done} /> : <RegisterTab onClose={done} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
