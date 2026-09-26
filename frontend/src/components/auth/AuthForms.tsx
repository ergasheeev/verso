/**
 * Auth form internals, shared by two hosts: the AuthModal (in-app sign-in
 * prompts, where a modal preserves whatever the visitor was doing) and the
 * standalone /login and /signup pages. One implementation, so the
 * verification-code and password-reset flows cannot drift apart.
 */
import { useState, useRef, useEffect, useMemo, useId } from "react";
import { isAxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, ChevronRight, PartyPopper, CheckCircle2, AlertCircle, Loader2, MailCheck, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { apiClient, AUTH_TIMEOUT, warmBackend } from "@/lib/api-client";
import { mergePlanOnLogin } from "@/lib/plan-sync";
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

// A timed-out or network-level failure (no response at all — most often a
// free-tier backend cold-booting) reads very differently to a user than a real
// validation error, so it gets its own message instead of the generic fallback.
function extractAuthError(err: unknown, fallback: string, wakingUp: string): string {
  // isAxiosError actually checks the shape rather than assuming any
  // thrown value looks like one.
  if (!isAxiosError<{ message?: string }>(err)) return fallback;
  if (err.response?.data?.message) return err.response.data.message;
  if (err.code === "ECONNABORTED" || !err.response) return wakingUp;
  return fallback;
}

/**
 * True when the request never got an answer — a client-side timeout, a dropped
 * connection, a backend still cold-booting.
 *
 * This is handled apart from a real error response because the server may well
 * have succeeded: a cold-start registration can take ~41s, so the account is
 * created and the code emailed while the browser has already given up. Treating
 * that as a plain error would leave the user pressing the button again into the
 * 60s resend cooldown ("wait 58 seconds") — no account, no code, no way forward,
 * from a registration that actually worked.
 */
function isNoResponseError(err: unknown): boolean {
  if (!isAxiosError(err)) return false;
  return err.code === "ECONNABORTED" || !err.response;
}

/**
 * Seconds to wait, when the 429 is the per-address code cooldown.
 *
 * Two different 429s can come back from these endpoints and they mean
 * opposite things. `CODE_COOLDOWN` means a code was just issued and is
 * already in the user's inbox — the right move is the code screen with a
 * countdown. The IP rate limiter's 429 means too many requests from this
 * address altogether, and may well mean no account was created at all;
 * that one has to stay an error on the form. They are indistinguishable by
 * status, so the backend tags the first with a code, and this reads the
 * tag rather than hunting for digits in a translated sentence.
 */
function codeCooldownSeconds(err: unknown): number | null {
  if (!isAxiosError<{ code?: string; retryAfter?: number }>(err)) return null;
  if (err.response?.status !== 429 || err.response.data?.code !== "CODE_COOLDOWN") return null;
  const fromBody = err.response.data?.retryAfter;
  if (typeof fromBody === "number" && fromBody > 0) return Math.ceil(fromBody);
  const header = Number(err.response.headers?.["retry-after"]);
  return Number.isFinite(header) && header > 0 ? Math.ceil(header) : 60;
}

// ── Verification code entry ──────────────────────────────────────────────────
// Six separate boxes rather than one text field: it makes the expected
// length obvious without instructions, and lets paste-from-email fill all
// six at once (handled in onChange below).
function CodeInput({
  value,
  onChange,
  disabled,
  onComplete,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  onComplete?: (code: string) => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { refs.current[0]?.focus(); }, []);

  function setDigit(i: number, raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      // Deleting: blank this box only.
      const next = value.split("");
      next[i] = "";
      onChange(next.join("").slice(0, 6));
      return;
    }
    // Pasting a whole code into any box should fill from that box onward,
    // not drop everything but the first character.
    const next = (value.slice(0, i) + digits).slice(0, 6);
    onChange(next);
    const focusAt = Math.min(i + digits.length, 5);
    refs.current[focusAt]?.focus();
    if (next.length === 6) onComplete?.(next);
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    // Backspace on an already-empty box steps back, which is what every
    // native OTP field does — without it the caret gets stuck.
    if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
  }

  return (
    <div className="flex justify-center gap-2" dir="ltr">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={value[i] ?? ""}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          disabled={disabled}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          aria-label={`Digit ${i + 1}`}
          className={cn(
            // Explicit width and height so the boxes are square-ish; padding alone does
            // not give a fixed height.
            "w-11 h-12 rounded-sm border text-center text-[19px] tabular",
            "bg-transparent border-[var(--input-border)] text-ink",
            "outline-none transition-colors duration-400 focus:border-gold-400",
            "disabled:opacity-50",
          )}
        />
      ))}
    </div>
  );
}

function VerifyStep({
  email,
  onVerified,
  initialDevCode,
  onChangeEmail,
  initialCooldown = 0,
  initialNotice,
}: {
  email: string;
  onVerified: (user: User) => void;
  /**
   * Seconds already burnt on the server's resend cooldown when this screen
   * opens. Registering issues a code, so arriving here means the 60s clock
   * is already running — starting the button at zero invited a tap that
   * could only ever come back 429.
   */
  initialCooldown?: number;
  /**
   * Shown once, above the code boxes. Used when the request that led here
   * timed out: the account was probably created and the code probably sent,
   * but "probably" is the honest word and the user deserves to be told.
   */
  initialNotice?: string;
  /**
   * Only ever set when the backend is running in development WITHOUT SMTP
   * credentials — in that case no mail was actually sent, so it hands the
   * code back and we show it here. Production never returns this field.
   */
  initialDevCode?: string;
  /**
 * The way back from a mistyped address; without it the only option is resending
 * to the same wrong inbox. Optional because ForgotPassword has no VerifyStep
 * call of its own.
 */
  onChangeEmail?: () => void;
}) {
  const { t } = useTranslation();
  const { showToast } = useAppStore();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(initialCooldown);
  const [devCode, setDevCode] = useState(initialDevCode);
  const [notice, setNotice] = useState(initialNotice);

  // The backend enforces a 60s resend cooldown; mirroring it here means the
  // button visibly counts down instead of failing with a 429 when tapped.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  async function submit(submitted?: string) {
    const value = submitted ?? code;
    if (value.length !== 6 || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.post<{ user: User; accessToken: string }>(
        "/auth/verify-email", { email, code: value }, { timeout: AUTH_TIMEOUT }
      );
      localStorage.setItem("verso-token", res.accessToken);
      onVerified(res.user);
    } catch (err: unknown) {
      setError(extractAuthError(err, t("auth", "err_verify"), t("auth", "err_waking_up")));
      setCode("");
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    if (cooldown > 0) return;
    setCooldown(60);
    setError("");
    setNotice(undefined);
    try {
      const res = await apiClient.post<{ devCode?: string } | null>(
        "/auth/resend-code", { email }, { timeout: AUTH_TIMEOUT }
      );
      if (res?.devCode) setDevCode(res.devCode);
      showToast(t("auth", "resend_sent"), undefined, "success");
    } catch (err: unknown) {
      // A 429 here is not a failure to report as one — it means a code is
      // already in flight. Sync the countdown to whatever the server is
      // actually waiting for and say so, instead of showing an error beside
      // a button the user can do nothing about.
      const wait = codeCooldownSeconds(err);
      if (wait !== null) {
        setCooldown(wait);
        setNotice(t("auth", "code_already_sent"));
        return;
      }
      setCooldown(0);
      setError(extractAuthError(err, t("auth", "err_verify"), t("auth", "err_waking_up")));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <MailCheck className="w-5 h-5 text-accent mb-4" strokeWidth={1.75} aria-hidden />
        <h3 className="font-display text-[22px] leading-tight text-ink">{t("auth", "verify_title")}</h3>
        <p className="text-[13px] text-subtle mt-2">{t("auth", "verify_desc")}</p>
        <p className="tabular text-[13px] text-ink mt-1 break-all">{email}</p>
      </div>

      {/* Explains why this screen appeared without a clean confirmation —
          the registration request timed out, or a code was already in
          flight. Informational, not an error: nothing has gone wrong that
          the reader needs to fix, and the next step is the same either way. */}
      {notice && (
        <p
          role="status"
          className="flex items-start gap-2 rounded-sm border border-[var(--gold-hairline)]
                     bg-[var(--gold-soft)] px-3 py-2.5 text-[12px] leading-relaxed text-ink"
        >
          <MailCheck className="w-3.5 h-3.5 shrink-0 mt-0.5 text-accent" aria-hidden />
          {notice}
        </p>
      )}

      {/* Development affordance: the server had no SMTP credentials, so no
          mail was sent and it handed the code back instead. Styled as an
          obvious warning, never as normal UI, and unreachable in production
          because the backend only returns devCode when NODE_ENV is
          development AND SMTP is unconfigured. */}
      {devCode && (
        <div className="rounded-sm border border-[var(--gold-hairline)] bg-[var(--gold-soft)] px-4 py-3 text-center">
          <p className="kicker kicker-gold mb-1.5">Dev — SMTP not configured</p>
          <button
            type="button"
            onClick={() => setCode(devCode)}
            className="tabular text-[21px] tracking-[6px] text-ink hover:text-accent transition-colors duration-400"
          >
            {devCode}
          </button>
          <p className="text-[11px] sm:text-[10px] text-subtle mt-1">tap to fill</p>
        </div>
      )}

      <CodeInput value={code} onChange={setCode} disabled={loading} onComplete={submit} />

      {error && (
        <p className="flex items-start gap-2 text-[12px] text-copper-400 border border-copper-500/35 rounded-sm px-3 py-2.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden />
          {error}
        </p>
      )}

      <Button
        type="button"
        fullWidth
        onClick={() => submit()}
        disabled={code.length !== 6 || loading}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
        {loading ? t("auth", "verify_loading") : t("auth", "verify_btn")}
      </Button>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={resend}
          disabled={cooldown > 0}
          className="w-full text-[11px] uppercase tracking-[0.12em] text-accent hover:text-gold-300
                     disabled:text-subtle disabled:cursor-not-allowed transition-colors duration-400"
        >
          {cooldown > 0 ? `${t("auth", "resend_wait")} (${cooldown})` : t("auth", "resend_btn")}
        </button>

        {onChangeEmail && (
          <button
            type="button"
            onClick={onChangeEmail}
            className="w-full text-[11px] uppercase tracking-[0.12em] text-subtle hover:text-ink transition-colors duration-400"
          >
            {t("auth", "change_email_btn")}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Shared input ──────────────────────────────────────────────────────────────
export function Field({
  label, error, type = "text", value, onChange, placeholder, autoComplete, required,
}: {
  label: string; error?: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; autoComplete?: string; required?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  // A real <label for>, not a styled <span>: it associates the label with the
  // input, so a screen reader announces each field by name and clicking the label
  // focuses the field.
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  return (
    // Underlined, not boxed — a page of boxed fields reads as a form, an
    // underlined one reads as a page you happen to be filling in. Matches the
    // Field in the editorial kit; this one stays separate because it takes an
    // (v: string) => void onChange that the whole auth flow is written
    // against.
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
          // 40×40 hit area with the glyph pinned right, rather than a bare 16×16 icon: the
          // reveal toggle sits in the one form everybody has to get through.
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
      {/* role="alert" so the message is announced when it appears, not only
          found if someone happens to navigate back over the field. */}
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-[12px] text-copper-400">
          {error}
        </p>
      )}
    </div>
  );
}

// ── Password strength meter ────────────────────────────────────────────────
function PasswordStrengthMeter({ password, t }: { password: string; t: ReturnType<typeof useTranslation>["t"] }) {
  if (!password) return null;
  const score = passwordStrength(password);
  const labels = [t("auth", "pw_weak"), t("auth", "pw_weak"), t("auth", "pw_medium"), t("auth", "pw_strong")];
  // Three hairlines, not three coloured bars. Strength is carried by how
  // many are lit; only genuinely weak reads as a warning colour.
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

// ── Forgot / reset password ──────────────────────────────────────────────────
// Three stages in one component (ask for email → code + new password → done)
// rather than three screens, because the email is carried between them and
// splitting it up would mean threading that state back through the parent
// for no user-visible benefit.
function ForgotPassword({
  onDone,
  onCancel,
  initialEmail,
}: {
  onDone: (user: User) => void;
  onCancel: () => void;
  initialEmail?: string;
}) {
  const { t } = useTranslation();
  const [stage, setStage] = useState<"email" | "reset" | "done">("email");
  const [email, setEmail] = useState(initialEmail ?? "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [devCode, setDevCode] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailValid = /\S+@\S+\.\S+/.test(email);
  // Same floor as registration's PASSWORD_RULE — the backend rejects a
  // weak new password on reset exactly as it would on signup, so the button
  // gate has to match or "valid here" would enable a submit that 400s.
  const passwordValid = password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
  const canReset = code.length === 6 && passwordValid;

  async function requestCode() {
    if (!emailValid || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.post<{ devCode?: string } | null>(
        "/auth/forgot-password", { email: email.trim().toLowerCase() }, { timeout: AUTH_TIMEOUT }
      );
      if (res?.devCode) setDevCode(res.devCode);
      setStage("reset");
    } catch (err: unknown) {
      setError(extractAuthError(err, t("auth", "err_reset"), t("auth", "err_waking_up")));
    } finally {
      setLoading(false);
    }
  }

  async function submitReset() {
    if (!canReset || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.post<{ user: User; accessToken: string }>(
        "/auth/reset-password",
        { email: email.trim().toLowerCase(), code, newPassword: password },
        { timeout: AUTH_TIMEOUT }
      );
      localStorage.setItem("verso-token", res.accessToken);
      setStage("done");
      // Brief pause so the success state is actually seen rather than the
      // modal vanishing the instant the request resolves.
      setTimeout(() => onDone(res.user), 1100);
    } catch (err: unknown) {
      setError(extractAuthError(err, t("auth", "err_reset"), t("auth", "err_waking_up")));
      setCode("");
    } finally {
      setLoading(false);
    }
  }

  if (stage === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="text-center py-8 space-y-3"
      >
        <div className="w-14 h-14 mx-auto rounded-sm border border-[var(--gold-hairline)] bg-[var(--gold-soft)] flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-accent" strokeWidth={1.5} />
        </div>
        <p className="font-display text-[20px] leading-tight text-ink">{t("auth", "reset_done")}</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <KeyRound className="w-5 h-5 text-accent mb-4" strokeWidth={1.75} aria-hidden />
        <h3 className="font-display text-[22px] leading-tight text-ink">
          {stage === "email" ? t("auth", "forgot_title") : t("auth", "reset_title")}
        </h3>
        <p className="text-[13px] leading-relaxed text-subtle mt-2">
          {stage === "email" ? t("auth", "forgot_desc") : t("auth", "reset_desc")}
        </p>
        {stage === "reset" && (
          <p className="tabular text-[13px] text-ink mt-1 break-all">{email}</p>
        )}
      </div>

      {stage === "email" ? (
        <>
          <Field
            label={t("auth", "email")} type="email" value={email} onChange={setEmail}
            placeholder={t("auth", "email_placeholder")} autoComplete="email"
          />
          <Button type="button" fullWidth onClick={requestCode} disabled={!emailValid || loading}>
            {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
            {t("auth", "forgot_send")}
          </Button>
        </>
      ) : (
        <>
          {devCode && (
            <div className="rounded-sm border border-[var(--gold-hairline)] bg-[var(--gold-soft)] px-4 py-3 text-center">
              <p className="kicker kicker-gold">
                Dev — SMTP not configured
              </p>
              <button
                type="button"
                onClick={() => setCode(devCode)}
                className="tabular text-[21px] tracking-[6px] text-ink hover:text-accent transition-colors duration-400"
              >
                {devCode}
              </button>
            </div>
          )}

          <CodeInput value={code} onChange={setCode} disabled={loading} />

          <div className="space-y-1.5">
            <Field
              label={t("auth", "new_password")} type="password" value={password} onChange={setPassword}
              placeholder={t("auth", "new_password_ph")} autoComplete="new-password" required
            />
            <PasswordStrengthMeter password={password} t={t} />
          </div>

          <Button type="button" fullWidth onClick={submitReset} disabled={!canReset || loading}>
            {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
            {loading ? t("auth", "reset_loading") : t("auth", "reset_btn")}
          </Button>
        </>
      )}

      {error && (
        <p className="flex items-start gap-2 text-[12px] text-copper-400 border border-copper-500/35 rounded-sm px-3 py-2.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={onCancel}
        className="w-full text-[11px] uppercase tracking-[0.12em] text-subtle hover:text-ink transition-colors duration-400"
      >
        {t("auth", "back_to_login")}
      </button>
    </div>
  );
}

// ── Login tab ─────────────────────────────────────────────────────────────────
export function LoginTab({ onClose }: { onClose: () => void }) {
  const { login } = useAppStore();
  const { t } = useTranslation();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading]   = useState(false);
  // Set when the backend reports EMAIL_NOT_VERIFIED, which switches this
  // tab over to the code screen rather than dead-ending on an error.
  const [needsVerify, setNeedsVerify] = useState(false);

  // Same reason as on the sign-up form: start the free-tier host waking as
  // soon as the form is on screen, so the cold start overlaps with typing
  // rather than landing on the submit.
  useEffect(() => { warmBackend(); }, []);
  const [forgot, setForgot] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!email.trim())                     e.email    = t("auth", "err_email_required");
    else if (!/\S+@\S+\.\S+/.test(email))  e.email    = t("auth", "err_email_invalid");
    if (!password)                         e.password = t("auth", "err_password_required");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function finishLogin(user: User) {
    login(user);
    mergePlanOnLogin().catch(() => {});
    onClose();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      // Longer timeout: a free-tier host that's spun down from inactivity
      // needs 30-60s to cold-boot the whole process, not just the DB.
      const res = await apiClient.post<{ user: User; accessToken: string }>(
        "/auth/login", { email: email.trim().toLowerCase(), password }, { timeout: AUTH_TIMEOUT }
      );
      localStorage.setItem("verso-token", res.accessToken);
      finishLogin(res.user);
    } catch (err: unknown) {
      // Correct password, unconfirmed address: send them to the code screen
      // and re-issue a code, instead of showing an error they can't act on.
      const code = isAxiosError<{ code?: string }>(err) ? err.response?.data?.code : undefined;
      if (code === "EMAIL_NOT_VERIFIED") {
        // AUTH_TIMEOUT rather than the 20s default, which is shorter than a cold start:
        // on exactly this request it would give up before the server answered.
        apiClient
          .post("/auth/resend-code", { email: email.trim().toLowerCase() }, { timeout: AUTH_TIMEOUT })
          .catch(() => {});
        setNeedsVerify(true);
        return;
      }
      setApiError(extractAuthError(err, t("auth", "err_login"), t("auth", "err_waking_up")));
    } finally {
      setLoading(false);
    }
  }

  if (needsVerify) {
    return (
      <VerifyStep
        email={email.trim().toLowerCase()}
        onVerified={finishLogin}
        onChangeEmail={() => setNeedsVerify(false)}
      />
    );
  }

  if (forgot) {
    return (
      <ForgotPassword
        // Carry over whatever they already typed, so someone who tried to
        // sign in and failed doesn't retype their address.
        initialEmail={email}
        onDone={finishLogin}
        onCancel={() => setForgot(false)}
      />
    );
  }

  return (
    <>
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

      <button
        type="button"
        onClick={() => setForgot(true)}
        className="w-full py-3.5 text-[11px] uppercase tracking-[0.12em] text-accent hover:text-gold-300 transition-colors duration-400"
      >
        {t("auth", "forgot_link")}
      </button>
    </form>
    </>
  );
}

// ── Register tab ──────────────────────────────────────────────────────────────
export function RegisterTab({ onClose }: { onClose: () => void }) {
  const { login } = useAppStore();
  const { t, lang } = useTranslation();
  const [step, setStep]         = useState(1);
  const [name, setName]         = useState("");
  const [surname, setSurname]   = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry]   = useState("");
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading]   = useState(false);
  const [doneUser, setDoneUser] = useState("");
  const [devCode, setDevCode] = useState<string | undefined>();
  /** Registration got no answer back — see the catch in onSubmit. */
  const [timedOut, setTimedOut] = useState(false);
  /** Seconds the server says are still left on its resend cooldown. */
  const [pendingCooldown, setPendingCooldown] = useState(0);

  // Wake the backend while the form is being filled in, not after it is
  // submitted. On a free-tier host the first request of the hour pays the
  // whole cold start; moving that cost to the moment the screen opens hides
  // it behind the twenty-odd seconds of typing that follow.
  useEffect(() => { warmBackend(); }, []);

  // There is no separate language step: `lang` is taken from the interface language
  // the visitor is already reading, and signup opens directly on the form.
  const STEPS = [
    t("auth", "step_info"),
    t("auth", "step_verify"),
    t("auth", "step_done"),
  ];

  function computeErrors() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2)            e.name     = t("auth", "err_name_short");
    if (surname.trim().length < 2)         e.surname  = t("auth", "err_surname_short");
    if (!email.trim())                     e.email    = t("auth", "err_email_required");
    else if (!/\S+@\S+\.\S+/.test(email))  e.email    = t("auth", "err_email_invalid");
    if (password.length < 8)               e.password = t("auth", "err_password_short");
    // Matches the backend's PASSWORD_RULE in auth.router.ts — checked here too so a
    // weak-but-long password ("aaaaaaaa") is caught with a translated message before
    // the request round-trips to a backend error that is only ever in English.
    else if (!/[A-Za-z]/.test(password) || !/\d/.test(password))
                                            e.password = t("auth", "err_password_weak");
    return e;
  }

  // Live validity for the submit-button gate — recomputed on every
  // keystroke but only actually SHOWN (via `errors`) once the user has
  // tried to submit once, so it doesn't flag empty required fields
  // as "errors" before they've had a chance to type anything.
  const liveErrors = useMemo(computeErrors, [name, surname, email, password]);
  const isValid = Object.keys(liveErrors).length === 0;
  const [attempted, setAttempted] = useState(false);

  // Once the user has tried to submit at least once, keep error messages
  // live as they correct each field — re-validating silently before that
  // point would flag untouched required fields as "wrong" the instant
  // the form opens, which reads as the form yelling at you before you've
  // done anything.
  useEffect(() => {
    if (attempted) setErrors(liveErrors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempted, name, surname, email, password]);

  function validate() {
    setAttempted(true);
    setErrors(liveErrors);
    return Object.keys(liveErrors).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      // Register does not return a session: it creates the account unverified and
      // emails a code. Step 2 collects that code, and /auth/verify-email is what
      // issues the tokens.
      const res = await apiClient.post<{ devCode?: string }>(
        "/auth/register",
        { name: name.trim(), surname: surname.trim(), email: email.trim().toLowerCase(), password, country, lang },
        { timeout: AUTH_TIMEOUT }
      );
      setDevCode(res?.devCode);
      setStep(2);
    } catch (err: unknown) {
      // A timeout is not a failed registration. A cold start answers POST
      // /auth/register in ~41s — the account is created and the code emailed whether
      // or not the browser was still listening. So move to the code screen and be
      // straight about the uncertainty: if a code arrives they can use it, and if none
      // does, resend is right there once the clock runs out.
      if (isNoResponseError(err)) {
        setTimedOut(true);
        setStep(2);
        return;
      }
      // Registering twice inside the cooldown lands here. The account
      // exists and a code is already on its way, so the code screen is
      // again the right place to be, not an error under the form.
      if (codeCooldownSeconds(err) !== null) {
        setPendingCooldown(codeCooldownSeconds(err)!);
        setStep(2);
        return;
      }
      setApiError(extractAuthError(err, t("auth", "err_register"), t("auth", "err_waking_up")));
    } finally {
      setLoading(false);
    }
  }

  function onVerified(user: User) {
    setDoneUser(user.name);
    login(user);
    mergePlanOnLogin().catch(() => {});
    setStep(3);
  }

  return (
    <div>
      {/* Progress — hairlines, not rounded pills. Everything else that marks state in
          this product is a rule. */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <span className="kicker">{STEPS[step - 1]}</span>
        <span className="tabular text-[11px] sm:text-[10px] text-subtle shrink-0">
          {String(step).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
        </span>
      </div>
      <div className="flex gap-1.5 mb-7">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-px flex-1 transition-colors duration-500",
              i + 1 < step ? "bg-gold-400" : i + 1 === step ? "bg-gold-600" : "bg-[var(--border)]",
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
      {/* Step 1 — Form */}
      {step === 1 && (
        <motion.form
          key="step1"
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          {/* Stacked on the narrowest phones. Side by side these two are
              ~130px each at 320px wide, which truncates both the placeholder
              and any validation message under them. */}
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

          {attempted && !isValid && (
            <p className="flex items-start gap-2 text-[12px] text-copper-400 border border-copper-500/35 rounded-sm px-3 py-2.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {t("auth", "form_errors_summary")}
            </p>
          )}
          {apiError && (
            <p role="alert" className="text-[12px] text-copper-400 border border-copper-500/35 rounded-sm px-3 py-2.5">
              {apiError}
            </p>
          )}
          {/* No "Back" here: this is the first step. */}
          <div className="pt-2">
            <Button type="submit" fullWidth disabled={loading || (attempted && !isValid)}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
              {loading ? t("auth", "loading_register") : t("auth", "register_btn")}
            </Button>
          </div>
        </motion.form>
      )}

      {/* Step 2 — Email verification code */}
      {step === 2 && (
        <motion.div
          key="step2"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <VerifyStep
            email={email.trim().toLowerCase()}
            onVerified={onVerified}
            initialDevCode={devCode}
            onChangeEmail={() => setStep(1)}
            // Registering issues a code, so the server's 60s clock is
            // already running when this screen opens.
            initialCooldown={pendingCooldown || 60}
            initialNotice={timedOut ? t("auth", "register_maybe_sent") : undefined}
          />
        </motion.div>
      )}

      {/* Step 3 — Success */}
      {step === 3 && (
        <motion.div
          key="step3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="text-center py-4 space-y-4"
        >
          <div className="w-14 h-14 mx-auto rounded-sm border border-[var(--gold-hairline)] bg-[var(--gold-soft)] flex items-center justify-center">
            <PartyPopper className="w-6 h-6 text-accent" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-display text-[24px] leading-tight text-ink">
              {t("auth", "success_title")}, {doneUser}
            </h3>
            <p className="text-[13.5px] leading-relaxed text-subtle mt-2">{t("auth", "success_desc")}</p>
          </div>
          <div className="text-left">
            {[
              t("auth", "success_feature1"),
              t("auth", "success_feature2"),
              t("auth", "success_feature3"),
            ].map((item) => (
              <p key={item} className="flex items-center gap-2.5 py-2.5 text-[13px] text-ink hairline-b last:border-b-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden />
                {item}
              </p>
            ))}
          </div>
          <Button fullWidth onClick={onClose}>
            {t("auth", "start")}
            <ChevronRight className="w-4 h-4" aria-hidden />
          </Button>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

