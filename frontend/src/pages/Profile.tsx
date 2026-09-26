import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LogOut, Moon, Sun, BookmarkX, ChevronRight, Compass, Trash2, Pencil,
  Check, X as XIcon, Loader2, Camera, ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import { isAxiosError } from "axios";
import { fileToAvatarDataUrl } from "@/lib/image";
import { syncRemoveFromPlan } from "@/lib/plan-sync";
import { Avatar } from "@/components/ui/Avatar";
import { CountrySelect } from "@/components/auth/CountrySelect";
import {
  Kicker, Rule, PageWrap, Button, Field, PremiumSeal, DataRow,
} from "@/components/ui/editorial";
import { ScrollRow } from "@/components/ui/ScrollRow";
import { CATEGORY_STYLE } from "@/lib/categories";
import { useTranslation, LANGUAGE_OPTIONS } from "@/i18n";
import type { Lang } from "@/i18n";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { LOCATIONS } from "@/data";
import { plateHue } from "@/data/countries";

/**
 * The account.
 *
 * Emergency numbers live on the country hubs and Services, and saved plans on
 * /saved; the guest view points there rather than duplicating them.
 */

const LANGUAGES = LANGUAGE_OPTIONS;

type ProfileTab = "itineraries" | "saved" | "reviews" | "settings";

/** Inline name/surname/country/avatar editor, sent via PATCH /users/me. */
function EditProfileForm({
  name, surname, country, avatarUrl, onCancel, onSaved,
}: {
  name: string;
  surname: string;
  country: string;
  avatarUrl?: string | null;
  onCancel: () => void;
  onSaved: (d: { name: string; surname: string; country: string; avatarUrl?: string | null }) => void;
}) {
  const { t, lang } = useTranslation();
  const showToast = useAppStore((s) => s.showToast);
  const [editName, setEditName] = useState(name);
  const [editSurname, setEditSurname] = useState(surname);
  const [editCountry, setEditCountry] = useState(country);
  // undefined = untouched (do not send), null = explicitly removed, string =
  // newly picked. Telling "untouched" from "removed" is the whole reason this is
  // not just `string | null`.
  const [avatarDraft, setAvatarDraft] = useState<string | null | undefined>(undefined);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewAvatar = avatarDraft !== undefined ? avatarDraft : avatarUrl;
  const valid = editName.trim().length >= 2 && editSurname.trim().length >= 2;

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(t("profile", "avatar_invalid_file"));
      return;
    }
    setAvatarBusy(true);
    setError("");
    try {
      setAvatarDraft(await fileToAvatarDataUrl(file));
    } catch {
      setError(t("profile", "avatar_process_error"));
    } finally {
      setAvatarBusy(false);
    }
  }

  async function save() {
    if (!valid || saving) return;
    setSaving(true);
    setError("");
    try {
      const payload: { name: string; surname: string; country: string; avatarUrl?: string | null } = {
        name: editName.trim(),
        surname: editSurname.trim(),
        country: editCountry,
      };
      if (avatarDraft !== undefined) payload.avatarUrl = avatarDraft;
      await apiClient.patch("/users/me", payload);
      onSaved(payload);
      showToast(t("profile", "edit_saved_toast"), undefined, "success");
    } catch (err) {
      const msg = isAxiosError<{ message?: string }>(err) ? err.response?.data?.message : undefined;
      setError(msg || t("profile", "edit_error"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-[var(--border)] rounded-sm p-6 animate-scale-in">
      <div className="flex items-center gap-4 mb-7">
        <div className="relative shrink-0">
          <Avatar name={editName || name} avatarUrl={previewAvatar} size={60} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarBusy}
            aria-label={t("profile", "avatar_change")}
            className="tap-44 absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-sm bg-gold-400 text-[#0C0A09]
                       flex items-center justify-center border-2 border-canvas
                       hover:bg-gold-300 transition-colors duration-400"
          >
            {avatarBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarBusy}
            className="py-3.5 sm:py-2 text-[11px] uppercase tracking-[0.12em] text-accent hover:text-gold-300 text-left transition-colors duration-400"
          >
            {t("profile", "avatar_change")}
          </button>
          {previewAvatar && (
            <button
              type="button"
              onClick={() => setAvatarDraft(null)}
              className="text-[11px] uppercase tracking-[0.12em] text-subtle hover:text-copper-400 text-left transition-colors duration-400"
            >
              {t("profile", "avatar_remove")}
            </button>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <Field
          label={t("auth", "name")}
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
        <Field
          label={t("auth", "surname")}
          value={editSurname}
          onChange={(e) => setEditSurname(e.target.value)}
        />
      </div>

      <CountrySelect
        value={editCountry}
        onChange={setEditCountry}
        label={t("auth", "country")}
        placeholder={t("auth", "country_placeholder")}
        searchPlaceholder={t("auth", "country_search")}
        skipLabel={t("auth", "country_clear")}
        lang={lang}
      />

      {error && <p className="mt-4 text-[12px] text-copper-400">{error}</p>}

      <div className="flex gap-2 mt-7">
        <Button onClick={save} disabled={!valid || saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {t("profile", "edit_save")}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          <XIcon className="w-4 h-4" />
          {t("profile", "edit_cancel")}
        </Button>
      </div>
    </div>
  );
}

/** A saved place, as a ruled row. Shared by both views. */
function PlanRow({
  loc, onOpen, onRemove, removeLabel, freeLabel,
}: {
  loc: (typeof LOCATIONS)[number];
  onOpen: () => void;
  onRemove: () => void;
  removeLabel: string;
  freeLabel: string;
}) {
  const cat = CATEGORY_STYLE[loc.category];
  return (
    <div className="group flex items-center gap-4 py-4 hairline-b">
      <span className="shrink-0 w-12 h-12 rounded-md overflow-hidden bg-[var(--muted)] flex items-center justify-center">
        {loc.img ? (
          <img src={loc.img} alt="" loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <cat.Icon className="w-4 h-4 text-subtle/40" strokeWidth={1} aria-hidden />
        )}
      </span>
      <button onClick={onOpen} className="flex-1 min-w-0 text-left">
        <span className="block font-display text-[17px] leading-tight text-ink truncate route-underline">
          {loc.name}
        </span>
        <span className="block tabular text-[11px] text-subtle mt-0.5">
          {loc.city} · ★ {loc.rating} · {loc.priceUSD === 0 ? freeLabel : `$${loc.priceUSD}`}
        </span>
      </button>
      <button
        onClick={onRemove}
        aria-label={removeLabel}
        // Visible by default on touch: hiding it behind :hover made removing
        // a saved place impossible on a phone.
        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-sm
                   text-subtle hover:text-copper-400 transition-colors duration-400
                   opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
      >
        <BookmarkX className="w-4 h-4" aria-hidden />
      </button>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  useDocumentTitle(t("profile", "title"));
  const [tab, setTab] = useState<ProfileTab>("saved");
  const [editingProfile, setEditingProfile] = useState(false);
  const {
    user, isLoggedIn, logout, plan, lang, setLang, removeFromPlan,
    theme, toggleTheme, openAuthModal, userReviews, showToast, updateUser,
  } = useAppStore();

  // Flatten { locationId: Review[] } with the place name attached, so this
  // reads as an activity feed rather than raw store internals.
  const myReviews = Object.entries(userReviews).flatMap(([locationId, reviews]) =>
    reviews.map((r) => ({
      ...r,
      locationName: LOCATIONS.find((l) => l.id === locationId)?.name ?? locationId,
    })),
  );

  function handleLogout() {
    // Best-effort server-side termination too (clears the httpOnly refresh
    // cookie and the stored token), so a stray 401 elsewhere cannot mint a
    // fresh access token after "logging out".
    apiClient.delete("/auth/logout").catch(() => {});
    localStorage.removeItem("verso-token");
    logout();
  }

  async function handleLanguageChange(newLang: Lang) {
    setLang(newLang);
    if (user) {
      try {
        await apiClient.patch("/users/me", { lang: newLang });
      } catch {
        // silent — the local language has already changed
      }
    }
  }

  const chip = (active: boolean) =>
    cn(
      "tap-44 px-3 py-2 rounded-sm border text-[11px] uppercase tracking-[0.12em]",
      "transition-colors duration-400 shrink-0",
      active
        ? "border-[var(--gold-hairline)] text-accent bg-[var(--gold-soft)]"
        : "border-transparent text-subtle hover:text-ink",
    );

  const themeRow = (
    <div className="flex items-center justify-between gap-6 py-4">
      <span className="flex items-center gap-2.5 text-[13px] text-ink">
        {theme === "dark" ? (
          <Moon className="w-4 h-4 text-subtle" aria-hidden />
        ) : (
          <Sun className="w-4 h-4 text-accent" aria-hidden />
        )}
        {theme === "dark" ? t("profile", "theme_dark") : t("profile", "theme_light")}
      </span>
      <button
        onClick={toggleTheme}
        role="switch"
        aria-checked={theme === "dark"}
        aria-label="Theme"
        className={cn(
          "tap-44 w-11 h-6 rounded-sm border transition-colors duration-400 shrink-0",
          theme === "dark"
            ? "bg-[var(--gold-soft)] border-[var(--gold-hairline)]"
            : "bg-[var(--muted)] border-[var(--border)]",
        )}
      >
        <span
          className={cn(
            "absolute top-1 w-4 h-4 rounded-sm transition-all duration-400 ease-spring",
            theme === "dark" ? "left-6 bg-gold-400" : "left-1 bg-subtle",
          )}
        />
      </button>
    </div>
  );

  const languageGrid = (
    <div className="flex flex-wrap gap-1">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => handleLanguageChange(l.code)}
          aria-pressed={lang === l.code}
          className={chip(lang === l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );

  /* ── Guest ────────────────────────────────────────────────── */
  if (!isLoggedIn || !user) {
    const BENEFITS = [
      { title: t("profile", "benefit1_title"), desc: t("profile", "benefit1_desc") },
      { title: t("profile", "benefit2_title"), desc: t("profile", "benefit2_desc") },
      { title: t("profile", "benefit3_title"), desc: t("profile", "benefit3_desc") },
      { title: t("profile", "benefit4_title"), desc: t("profile", "benefit4_desc") },
    ];

    return (
      <div className="grain-overlay pb-24">
        <PageWrap>
          <header className="relative pt-12 sm:pt-16 pb-8">
            <div
              aria-hidden
              className="plate absolute -inset-x-4 sm:-inset-x-6 inset-y-0 opacity-[0.13] -z-10"
              style={{
                "--plate-h": plateHue("guest-profile"),
                maskImage: "linear-gradient(to bottom, black, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
              } as React.CSSProperties}
            />
            <Kicker gold className="mb-5">{t("nav", "profile")}</Kicker>
            <h1 className="font-display text-display-sm sm:text-display text-ink break-words">
              {t("profile", "guest_title")}
            </h1>
            <p className="text-[15px] leading-relaxed text-subtle mt-5 max-w-[52ch]">
              {t("profile", "guest_desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button onClick={() => openAuthModal()}>{t("profile", "login_btn")}</Button>
              <Button variant="secondary" onClick={() => openAuthModal()}>
                {t("profile", "register_btn")}
              </Button>
            </div>
          </header>

          <Rule gold />

          <section className="py-12">
            <Kicker className="mb-3">{t("profile", "benefits_title")}</Kicker>
            <Rule />
            {/* Two columns from sm. A single column would draw each hairline across the full
                page width while its text fills a fraction of it, which reads as content that
                failed to load rather than as a ruled index. */}
            <ul className="grid sm:grid-cols-2 sm:gap-x-12">
              {BENEFITS.map((b) => (
                <li key={b.title} className="py-5 hairline-b">
                  <div className="min-w-0">
                    <p className="font-display text-[18px] leading-tight text-ink mb-1.5">{b.title}</p>
                    <p className="text-[13px] leading-relaxed text-subtle">{b.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {plan.length > 0 && (
            <section className="pb-12">
              <div className="border border-[var(--gold-hairline)] rounded-sm bg-[var(--gold-soft)] p-6">
                <Kicker gold className="mb-3">
                  {plan.length} {t("profile", "plan_title")}
                </Kicker>
                <p className="text-[13px] leading-relaxed text-subtle mb-5 max-w-[48ch]">
                  {t("profile", "guest_plan_save_hint")}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => openAuthModal()}>
                    {t("profile", "login_btn")}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => navigate("/saved")}>
                    {t("nav", "saved")}
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
                  </Button>
                </div>
              </div>
            </section>
          )}

          <section className="pb-12 grid gap-10 sm:grid-cols-2">
            <div>
              <Kicker className="mb-3">{t("profile", "lang_title")}</Kicker>
              <Rule />
              <div className="mt-5">{languageGrid}</div>
            </div>
            <div>
              <Kicker className="mb-3">{t("profile", "settings_title")}</Kicker>
              <Rule />
              {themeRow}
            </div>
          </section>
        </PageWrap>
      </div>
    );
  }

  /* ── Signed in ────────────────────────────────────────────── */
  const TABS = [
    { key: "saved" as const,       label: t("profile", "tab_saved") },
    { key: "itineraries" as const, label: t("profile", "tab_itineraries") },
    { key: "reviews" as const,     label: t("profile", "tab_reviews") },
    { key: "settings" as const,    label: t("profile", "tab_settings") },
  ];

  const cities = new Set(plan.map((l) => l.city)).size;
  const planTotal = plan.reduce((sum, l) => sum + (l.priceUSD ?? 0), 0);

  return (
    <div className="grain-overlay pb-24">
      <PageWrap>
        {/* ── Masthead ─────────────────────────────────── */}
        <header className="relative pt-12 sm:pt-16 pb-8">
          <div
            aria-hidden
            className="plate absolute -inset-x-4 sm:-inset-x-6 inset-y-0 opacity-[0.13] -z-10"
            style={{
              "--plate-h": plateHue(user.id),
              maskImage: "linear-gradient(to bottom, black, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
            } as React.CSSProperties}
          />
          <Kicker gold className="mb-6">{t("nav", "profile")}</Kicker>
          <div className="flex items-start gap-5">
            <Avatar name={user.name} avatarUrl={user.avatarUrl} size={72} className="shrink-0" />
            <div className="min-w-0 flex-1">
              {/* Not flex-wrap: the name truncates, and a wrapping row decides where to break
                  before it shrinks anything, dropping the edit pencil onto its own line under a
                  name that is already cut short. Nowrap plus min-w-0 lets the name give up the
                  space instead. */}
              <div className="flex items-center gap-2.5 flex-nowrap">
                <h1 className="font-display text-display-sm text-ink truncate min-w-0">
                  {user.name} {user.surname}
                </h1>
                {!editingProfile && (
                  <button
                    onClick={() => setEditingProfile(true)}
                    aria-label={t("profile", "edit_profile")}
                    className="tap-44 shrink-0 w-7 h-7 rounded-sm flex items-center justify-center
                               text-subtle hover:text-accent transition-colors duration-400"
                  >
                    <Pencil className="w-3.5 h-3.5" aria-hidden />
                  </button>
                )}
                {user.isPremium && <PremiumSeal />}
              </div>
              <p className="tabular text-[11px] tracking-[0.08em] text-subtle mt-2">
                {user.email}
                {user.country && ` · ${user.country}`}
              </p>
            </div>
          </div>
        </header>

        {editingProfile && (
          <div className="mb-10">
            <EditProfileForm
              name={user.name}
              surname={user.surname}
              country={user.country ?? ""}
              avatarUrl={user.avatarUrl}
              onCancel={() => setEditingProfile(false)}
              onSaved={(data) => { updateUser(data); setEditingProfile(false); }}
            />
          </div>
        )}

        <Rule gold />

        {/* ── Standing ─────────────────────────────────── */}
        <dl className="flex flex-wrap gap-10 sm:gap-14 py-8">
          {[
            { label: t("profile", "stat_trips"), value: cities },
            { label: t("profile", "stat_saved"), value: plan.length },
            { label: t("profile", "stat_reviews"), value: myReviews.length },
          ].map((s) => (
            <div key={s.label}>
              <dt className="kicker mb-2">{s.label}</dt>
              <dd className="tabular font-display text-[30px] leading-none text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>

        <Rule />

        {/* ── Tabs ─────────────────────────────────────── */}
        <ScrollRow className="flex gap-1 py-6 -mx-1 px-1">
          {TABS.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              aria-pressed={tab === tb.key}
              className={chip(tab === tb.key)}
            >
              {tb.label}
            </button>
          ))}
        </ScrollRow>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* ── Saved ────────────────────────────────
                Same store slice /saved reads from, so there is one source of
                truth rather than two copies of the list. */}
            {tab === "saved" && (
              <section>
                <div className="flex items-end justify-between gap-6 mb-3.5">
                  <h2 className="font-display text-2xl text-ink leading-[1.08]">
                    {t("profile", "plan_title")}
                  </h2>
                  {plan.length > 0 && (
                    <button
                      onClick={() => navigate("/locations")}
                      className="shrink-0 pb-1 flex items-center gap-1 text-[11px] uppercase tracking-[0.12em] text-subtle hover:text-accent transition-colors duration-400"
                    >
                      {t("profile", "plan_add")}
                      <ChevronRight className="w-3.5 h-3.5" aria-hidden />
                    </button>
                  )}
                </div>
                <Rule />

                {plan.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="font-display text-xl text-ink mb-2">
                      {t("profile", "plan_empty_title")}
                    </p>
                    <p className="text-[13px] text-subtle mb-6">{t("profile", "plan_empty_desc")}</p>
                    <Button variant="secondary" size="sm" onClick={() => navigate("/locations")}>
                      {t("profile", "plan_empty_btn")}
                    </Button>
                  </div>
                ) : (
                  <>
                    <dl className="mt-1">
                      <DataRow label={t("saved", "cities_suffix")} value={cities} />
                      <DataRow
                        label={t("detail", "price_label")}
                        value={
                          <span className="text-accent">
                            {planTotal === 0 ? t("detail", "free") : `$${planTotal}`}
                          </span>
                        }
                      />
                    </dl>

                    <div className="mt-6">
                      {plan.map((loc) => (
                        <PlanRow
                          key={loc.id}
                          loc={loc}
                          freeLabel={t("detail", "free")}
                          removeLabel={t("detail", "remove_plan")}
                          onOpen={() => navigate(`/locations/${loc.id}`)}
                          onRemove={() => { removeFromPlan(loc.id); syncRemoveFromPlan(loc.id); }}
                        />
                      ))}
                    </div>

                    <Button className="mt-8" onClick={() => navigate("/chat")}>
                      {t("profile", "plan_ai_btn")}
                      <ArrowUpRight className="w-4 h-4" aria-hidden />
                    </Button>
                  </>
                )}
              </section>
            )}

            {/* ── Itineraries ──────────────────────────
                Nothing persists AI tour plans yet — they live in the chat
                transcript, not as structured itineraries — so this is an
                honest empty state pointing at the one real path, not a stub
                pretending data exists. */}
            {tab === "itineraries" && (
              <section className="py-16 max-w-[46ch]">
                <p className="font-display text-[22px] leading-snug text-ink mb-3">
                  {t("profile", "itineraries_empty_title")}
                </p>
                <p className="text-[13.5px] leading-relaxed text-subtle mb-7">
                  {t("profile", "itineraries_empty_desc")}
                </p>
                <Button onClick={() => navigate("/chat")}>
                  {t("profile", "plan_ai_btn")}
                  <ArrowUpRight className="w-4 h-4" aria-hidden />
                </Button>
              </section>
            )}

            {/* ── Reviews ──────────────────────────────── */}
            {tab === "reviews" && (
              <section>
                {myReviews.length === 0 ? (
                  <p className="py-16 text-[14px] text-subtle max-w-[44ch]">
                    {t("profile", "reviews_empty")}
                  </p>
                ) : (
                  <div>
                    {myReviews.map((r) => (
                      <article key={r.id} className="py-5 hairline-b">
                        <div className="flex items-baseline justify-between gap-5 mb-2">
                          <p className="font-display text-[17px] text-ink truncate">{r.locationName}</p>
                          <span className="tabular text-[12px] text-accent shrink-0">★ {r.stars}</span>
                        </div>
                        <p className="text-[13px] leading-relaxed text-subtle line-clamp-3 max-w-[64ch]">
                          {r.text}
                        </p>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ── Settings ─────────────────────────────── */}
            {tab === "settings" && (
              <div className="space-y-12">
                <section>
                  <Kicker className="mb-3">{t("profile", "lang_title")}</Kicker>
                  <Rule />
                  <div className="mt-5">{languageGrid}</div>
                </section>

                <section>
                  <Kicker className="mb-3">{t("profile", "settings_title")}</Kicker>
                  <Rule />
                  {themeRow}
                </section>

                {/* The only credential is the address itself and whether it has been confirmed
                    (sign-in is by emailed verification code). */}
                <section>
                  <Kicker className="mb-3">{t("profile", "linked_accounts_title")}</Kicker>
                  <Rule />
                  <dl className="mt-1">
                    <DataRow
                      label={user.email}
                      value={
                        <span className={user.emailVerified === false ? "text-subtle" : "text-accent"}>
                          {user.emailVerified === false
                            ? t("profile", "linked_not_connected")
                            : t("profile", "linked_connected")}
                        </span>
                      }
                    />
                  </dl>
                </section>

                <section className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="danger"
                    onClick={() => showToast(t("profile", "delete_account_soon"), undefined, "info")}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden />
                    {t("profile", "delete_account")}
                  </Button>
                </section>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="pt-12">
          <Rule />
          <Button variant="ghost" className="mt-6 -ml-1" onClick={handleLogout}>
            <LogOut className="w-4 h-4" aria-hidden />
            {t("profile", "logout")}
          </Button>
        </div>
      </PageWrap>
    </div>
  );
}
