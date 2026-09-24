/**
 * Auth form internals, shared by two hosts: the AuthModal (in-app sign-in
 * prompts) and the standalone /login and /signup pages.
 */
import { useState, useId } from "react";
import { isAxiosError } from "axios";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import { useTranslation } from "@/i18n";
import type { User } from "@/types";
import { Button } from "@/components/ui/editorial";
import { CountrySelect } from "./CountrySelect";

// 4-tier heuristic (length + character-class variety) — not trying to be
// a real entropy calculator, just enough signal to nudge users away from
// "password1" without being preachy about it.
function passwordStrength(pw: string): 0 | 1 | 2 | 3 {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 3) as 0 | 1 | 2 | 3;
}

function extractAuthError(err: unknown, fallback: string): string {
  if (!isAxiosError<{ message?: string }>(err)) return fallback;
  return err.response?.data?.message ?? fallback;
}

// ── Shared input ──────────────────────────────────────────────────────
export function Field({
  label, error, type = "text", value, onChange, placeholder, autoComplete, required,
}: {
  label: string; error?: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; autoComplete?: string; required?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  return (
    <div>
      <label htmlFor={fieldId} className="kicker block mb-2">
        {label}{required && <span className="text-copper-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          id={fieldId}
          type={isPassword ? (show ? "text" : "password") : type}
          value={value}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full bg-transparent border-b px-0 py-2.5 text-[16px] sm:text-[15px] text-ink",
            "placeholder:text-subtle placeholder:text-[14px]",
            "outline-none transition-colors duration-400",
            isPassword && "pr-9",
            error ? "border-copper-500" : "border-[var(--input-border)] focus:border-gold-400",
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="tap-44 absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10
                       flex items-center justify-end text-subtle
                       hover:text-accent transition-colors duration-400"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-[12px] text-copper-400">
          {error}
        </p>
      )}
    </div>
  );
}

// ── Password strength meter ────────────────────────────────────────────
function PasswordStrengthMeter({ password, t }: { password: string; t: ReturnType<typeof useTranslation>["t"] }) {
  if (!password) return null;
  const score = passwordStrength(password);
  const labels = [t("auth", "pw_weak"), t("auth", "pw_weak"), t("auth", "pw_medium"), t("auth", "pw_strong")];
  const colors = ["bg-copper-400", "bg-copper-400", "bg-gold-600", "bg-gold-400"];
  return (
    <div className="flex items-center gap-3 mt-3">
      <div className="flex-1 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "h-px flex-1 transition-colors duration-400",
              i < score ? colors[score] : "bg-[var(--border)]",
            )}
          />
        ))}
      </div>
      <span className={cn(
        "text-[11px] sm:text-[10px] uppercase tracking-[0.12em] shrink-0",
        score >= 3 ? "text-accent" : score === 2 ? "text-gold-600" : "text-copper-400",
      )}>
        {labels[score]}
      </span>
    </div>
  );
}

// ── Login tab ─────────────────────────────────────────────────────────
export function LoginTab({ onClose }: { onClose: () => void }) {
  const { login } = useAppStore();
  const { t } = useTranslation();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading]   = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!email.trim())                     e.email    = t("auth", "err_email_required");
    else if (!/\S+@\S+\.\S+/.test(email))  e.email    = t("auth", "err_email_invalid");
    if (!password)                         e.password = t("auth", "err_password_required");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      const res = await apiClient.post<{ user: User; accessToken: string }>(
        "/auth/login", { email: email.trim().toLowerCase(), password }
      );
      localStorage.setItem("trova-token", res.accessToken);
      login(res.user);
      onClose();
    } catch (err: unknown) {
      setApiError(extractAuthError(err, t("auth", "err_login")));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field label={t("auth", "email")} type="email" value={email} onChange={setEmail}
        placeholder={t("auth", "email_placeholder")} autoComplete="email" error={errors.email} />
      <Field label={t("auth", "password")} type="password" value={password} onChange={setPassword}
        placeholder={t("auth", "password_placeholder")} autoComplete="current-password" error={errors.password} />

      {apiError && (
        <p role="alert" className="text-[12px] text-copper-400 border border-copper-500/35 rounded-sm px-3 py-2.5">
          {apiError}
        </p>
      )}
      <Button type="submit" fullWidth disabled={loading} className="mt-1">
        {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
        {loading ? t("auth", "loading_login") : t("auth", "login_btn")}
      </Button>
    </form>
  );
}

// ── Register tab ──────────────────────────────────────────────────────
export function RegisterTab({ onClose }: { onClose: () => void }) {
  const { login } = useAppStore();
  const { t, lang } = useTranslation();
  const [name, setName]         = useState("");
  const [surname, setSurname]   = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry]   = useState("");
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading]   = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2)            e.name     = t("auth", "err_name_short");
    if (surname.trim().length < 2)         e.surname  = t("auth", "err_surname_short");
    if (!email.trim())                     e.email    = t("auth", "err_email_required");
    else if (!/\S+@\S+\.\S+/.test(email))  e.email    = t("auth", "err_email_invalid");
    if (password.length < 8)               e.password = t("auth", "err_password_short");
    else if (!/[A-Za-z]/.test(password) || !/\d/.test(password))
                                            e.password = t("auth", "err_password_weak");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      const res = await apiClient.post<{ user: User; accessToken: string }>(
        "/auth/register",
        { name: name.trim(), surname: surname.trim(), email: email.trim().toLowerCase(), password, country, lang },
      );
      localStorage.setItem("trova-token", res.accessToken);
      login(res.user);
      onClose();
    } catch (err: unknown) {
      setApiError(extractAuthError(err, t("auth", "err_register")));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
        <Field label={t("auth", "name")} value={name} onChange={setName} required
          placeholder={t("auth", "name_placeholder")} autoComplete="given-name" error={errors.name} />
        <Field label={t("auth", "surname")} value={surname} onChange={setSurname} required
          placeholder={t("auth", "surname_placeholder")} autoComplete="family-name" error={errors.surname} />
      </div>
      <Field label={t("auth", "email")} type="email" value={email} onChange={setEmail} required
        placeholder={t("auth", "email_placeholder")} autoComplete="email" error={errors.email} />
      <div className="space-y-1.5">
        <Field label={t("auth", "password")} type="password" value={password} onChange={setPassword} required
          placeholder={t("auth", "new_password_placeholder")} autoComplete="new-password" error={errors.password} />
        <PasswordStrengthMeter password={password} t={t} />
      </div>
      <CountrySelect
        value={country}
        onChange={setCountry}
        label={t("auth", "country")}
        placeholder={t("auth", "country_placeholder")}
        searchPlaceholder={t("auth", "country_search")}
        skipLabel={t("auth", "country_clear")}
        lang={lang}
      />

      {apiError && (
        <p role="alert" className="text-[12px] text-copper-400 border border-copper-500/35 rounded-sm px-3 py-2.5">
          {apiError}
        </p>
      )}
      <div className="pt-2">
        <Button type="submit" fullWidth disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
          {loading ? t("auth", "loading_register") : t("auth", "register_btn")}
        </Button>
      </div>
    </form>
  );
}
