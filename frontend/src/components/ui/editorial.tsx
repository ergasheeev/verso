import { forwardRef, useId, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────────
   The Verso editorial kit.

   Every page is built from these. The constraints they encode are the whole
   design system, so they are stated once here rather than re-decided per screen:

     • Elevation is a surface step plus a hairline — never a drop shadow. On the
       midnight canvas a shadow is invisible, so a card that relies on one has no
       edge at all.
     • Gold marks three things only: the primary action, premium/live state, and
       the rules that structure a page. Used more widely it stops reading as
       precious.
     • Corners are near-square. Radius lives in tailwind.config at 2–8px; a
       component should not reach past `rounded-2xl`.
     • Headings are Literata, labels are tracked-out Inter caps, data is tabular
       Inter. Mixing those roles is what makes a layout read as an app rather than
       a page.
   ──────────────────────────────────────────────────────────────────────── */

/** The tracked-out uppercase label that opens a section. */
export function Kicker({
  children,
  gold,
  className,
}: {
  children: ReactNode;
  gold?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("kicker block", gold && "kicker-gold", className)}>{children}</span>
  );
}

/** A hairline. `gold` privileges the section it opens. */
export function Rule({ gold, className }: { gold?: boolean; className?: string }) {
  return <hr className={cn(gold ? "rule-gold" : "rule", className)} />;
}

/* ── Button ──────────────────────────────────────────────────────────────
   The primary fill is gold with a near-black label, not gold with white.
   White on #E0A94E measures 1.9:1; the ink label measures 9.4:1 and is also
   simply how a gold-foil block is set in print. */

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-gold-400 text-[#0C0A09] hover:bg-gold-300 active:bg-gold-500 border border-gold-400 hover:border-gold-300",
  secondary:
    "bg-transparent text-ink border border-[var(--border)] hover:border-[var(--gold-hairline)] hover:bg-[var(--card-hover)]",
  ghost:
    "bg-transparent text-subtle hover:text-ink border border-transparent",
  danger:
    "bg-transparent text-copper-400 border border-copper-500/40 hover:bg-copper-500/10 hover:border-copper-500/70",
};

const SIZE: Record<Size, string> = {
  // `sm` is 44px on touch and 36px from sm: up, so back links, the legal pages' call
  // to action and the country hub's CTAs all clear the 44px touch minimum on a
  // phone. `md` and `lg` are already 44px or more.
  sm: "h-11 sm:h-9 px-3.5 text-[12px] tracking-[0.08em]",
  md: "h-11 px-5   text-[13px] tracking-[0.1em]",
  lg: "h-[3.25rem] px-7 text-[13px] tracking-[0.14em]",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Sets the label in tracked-out caps. Default on for primary CTAs. */
  caps?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", caps, fullWidth, className, children, ...props },
  ref,
) {
  // Every real button is set in tracked caps; only `ghost` opts out, because it is
  // used as an inline link inside running text where caps would shout. A
  // primary/secondary pair side by side is therefore always set the same way.
  const isCaps = caps ?? variant !== "ghost";
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm font-medium",
        "transition-all duration-400 ease-spring",
        "disabled:opacity-40 disabled:pointer-events-none",
        VARIANT[variant],
        SIZE[size],
        isCaps && "uppercase",
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

/* ── Surface ─────────────────────────────────────────────────────────────
   A card. Hairline-bordered, near-square, no resting shadow. */
export function Surface({
  children,
  className,
  interactive,
  gold,
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean; gold?: boolean }) {
  return (
    <div
      className={cn(
        "bg-surface border rounded-md",
        gold ? "border-[var(--gold-hairline)]" : "border-[var(--border)]",
        interactive &&
          "card-lift hover:border-[var(--gold-hairline)] cursor-pointer transition-colors duration-600",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Badge ───────────────────────────────────────────────────────────── */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "gold" | "copper" | "onImage";
  className?: string;
}) {
  const TONE = {
    neutral: "border-[var(--border)] text-subtle bg-[var(--muted)]",
    gold: "border-[var(--gold-hairline)] text-accent bg-[var(--gold-soft)]",
    copper: "border-copper-500/35 text-copper-400 bg-copper-500/10",
    // Badges sitting on a photograph cannot rely on a tint: a 12% wash over
    // an unknown image is invisible. A dark scrim makes legibility
    // independent of whatever is behind it.
    onImage: "border-white/20 text-[#F5EFE3] bg-black/55 backdrop-blur-sm",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-1",
        "text-[11px] sm:text-[10px] font-medium uppercase tracking-[0.14em] leading-none",
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── DataRow ─────────────────────────────────────────────────────────────
   The label/value row that country hubs, place details and pricing tables
   are all built from. Values are tabular so a column of them aligns. */
export function DataRow({
  label,
  value,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  className?: string;
}) {
  return (
    // flex-wrap with ml-auto on the value: when both halves fit, the row is
    // unchanged, and when they do not the value drops to its own line, still
    // right-aligned, instead of being squeezed into a column narrow enough to break
    // every phrase across two lines ("1 soat 30 / daqiqa" on a 375px screen).
    <div
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-x-4 sm:gap-x-6 gap-y-0.5 py-3 hairline-b last:border-b-0",
        className,
      )}
    >
      <dt className="kicker shrink-0">{label}</dt>
      <dd className="text-[13px] text-ink text-right min-w-0 tabular ml-auto">{value}</dd>
    </div>
  );
}

/* ── PremiumSeal ─────────────────────────────────────────────────────────
   The Pro mark. Deliberately a small typographic seal rather than an icon
   badge — it should read as a publisher's imprint, not a game achievement. */
export function PremiumSeal({ className, label = "Pro" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border border-[var(--gold-hairline)]",
        "bg-[var(--gold-soft)] px-1.5 py-0.5",
        "text-[11px] sm:text-[10px] font-medium uppercase tracking-[0.18em] leading-none text-accent",
        className,
      )}
    >
      {label}
    </span>
  );
}

/* ── Field ───────────────────────────────────────────────────────────────
   Inputs are underlined rather than boxed: a page of boxed fields reads as a
   form, an underlined one reads as a page you happen to be filling in. */
export const Field = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string }
>(function Field({ label, hint, error, className, id, ...props }, ref) {
  // Falls back to a generated id: `id ?? props.name` is undefined whenever a caller
  // passes neither (the Profile edit form does), which would leave
  // `htmlFor={undefined}` on the label and no id on the input, so the field would go
  // unnamed for a screen reader.
  const autoId = useId();
  const fieldId = id ?? props.name ?? autoId;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={fieldId} className="kicker block mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error && fieldId ? `${fieldId}-err` : undefined}
        className={cn(
          "w-full bg-transparent border-b px-0 py-2.5 text-[16px] sm:text-[15px] text-ink",
          "placeholder:text-subtle placeholder:text-[14px]",
          "transition-colors duration-400 outline-none",
          error
            ? "border-copper-500"
            : "border-[var(--input-border)] focus:border-gold-400",
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={fieldId ? `${fieldId}-err` : undefined} className="mt-2 text-[12px] text-copper-400">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-2 text-[12px] text-subtle">{hint}</p>
      ) : null}
    </div>
  );
});

/* ── Page shell ────────────────────────────────────────────────────────── */
export function PageWrap({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12", className)}>
      {children}
    </div>
  );
}
