import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoginTab, RegisterTab } from "@/components/auth/AuthForms";
import { Wordmark } from "@/components/brand/Wordmark";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";

export default function Auth() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);

  const [tab, setTab] = useState<"login" | "register">(
    pathname === "/signup" ? "register" : "login"
  );

  useEffect(() => {
    setTab(pathname === "/signup" ? "register" : "login");
  }, [pathname]);

  useEffect(() => {
    if (isLoggedIn) navigate("/atlas", { replace: true });
  }, [isLoggedIn, navigate]);

  function done() {
    navigate("/atlas", { replace: true });
  }

  return (
    <div className="app-bg min-h-dvh">
      <div className="flex items-start justify-center px-5 pt-8 pb-12 sm:px-10">
        <div className="w-full max-w-sm">
          <button
            onClick={() => navigate("/")}
            className="tap-44 mb-7 inline-flex items-center gap-2 kicker hover:text-accent transition-colors duration-400"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
            {t("auth", "back_home")}
          </button>

          <div className="mb-7">
            <Wordmark size="md" />
          </div>

          <div className="flex gap-6 mb-8 border-b border-[var(--border)]">
            {(["login", "register"] as const).map((key) => {
              const isActive = tab === key;
              return (
                <button
                  key={key}
                  onClick={() => navigate(key === "login" ? "/login" : "/signup", { replace: true })}
                  aria-current={isActive}
                  className={cn(
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
              {tab === "login" ? <LoginTab onClose={done} /> : <RegisterTab onClose={done} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
