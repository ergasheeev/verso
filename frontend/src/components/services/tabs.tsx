import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone, CheckCircle, Star, Wifi, Car, Coffee, Dumbbell,
  Utensils, Hotel, Train, Bus, Zap, CircleDot, ArrowUpRight, Bookmark,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { RESTAURANTS, HOTELS, GUIDES, CURRENCY_RATES } from "@/data";
import { EMERGENCY_NUMBERS } from "@/data/emergency-numbers";
import { Kicker, Rule, DataRow, Badge, Button } from "@/components/ui/editorial";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { useTranslation } from "@/i18n";
import { useAppStore } from "@/store";
import type { Restaurant, Hotel as HotelType, Guide } from "@/types";

/**
 * Content for the Explore page's Restaurants / Hotels / Guides / Transport /
 * Currency tabs. Extracted from the old standalone Services.tsx so the same
 * components can sit behind a shared tab bar alongside Places, rather than
 * living on a separate page a visitor had to already know existed.
 */

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Wi-Fi":        <Wifi className="w-3 h-3" />,
  "Avtoturargoh": <Car className="w-3 h-3" />,
  "Parking":      <Car className="w-3 h-3" />,
  "Nonushta":     <Coffee className="w-3 h-3" />,
  "Fitnes":       <Dumbbell className="w-3 h-3" />,
};

function amenityIcon(name: string) {
  const icon = AMENITY_ICONS[name];
  if (!icon && import.meta.env.DEV) {
    console.warn(`tabs.tsx: no AMENITY_ICONS entry for "${name}"`);
  }
  return icon ?? <CircleDot className="w-3 h-3" />;
}

/** Corner bookmark toggle shared by restaurant/hotel cards — stops the click
 * from also bubbling into the card's own onSelect. */
function SaveButton({ saved, onToggle, label }: { saved: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      aria-label={label}
      aria-pressed={saved}
      className={cn(
        "tap-44 w-8 h-8 flex items-center justify-center rounded-sm backdrop-blur-sm transition-colors duration-400",
        saved ? "bg-gold-400 text-canvas" : "bg-black/40 text-[#F5EFE3] hover:bg-black/60",
      )}
    >
      <Bookmark className="w-3.5 h-3.5" fill={saved ? "currentColor" : "none"} aria-hidden />
    </button>
  );
}

export function EmptyTab({ label }: { label: string }) {
  return (
    <div className="py-20 text-center">
      <p className="font-display text-xl text-ink">{label}</p>
    </div>
  );
}

/** Shared plate for restaurant and hotel cards. */
function PlateCard({
  img, FallbackIcon, title, badge, bookmark, dim, children, onSelect,
}: {
  img: string;
  FallbackIcon: typeof Utensils;
  title: React.ReactNode;
  badge?: React.ReactNode;
  bookmark?: React.ReactNode;
  dim?: boolean;
  children: React.ReactNode;
  onSelect: () => void;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <motion.div
      variants={staggerItem}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(); }
      }}
      className="group cursor-pointer rounded-sm bg-surface border border-[var(--border)]
                 hover:border-[var(--gold-hairline)] transition-colors duration-600 card-lift
                 overflow-hidden flex flex-col"
    >
      <div className="figure relative h-44 shrink-0">
        {failed ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--muted)]">
            <FallbackIcon className="w-8 h-8 text-subtle/30" strokeWidth={0.9} aria-hidden />
          </div>
        ) : (
          <img
            src={img}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-900 ease-spring group-hover:scale-[1.04]"
          />
        )}
        {dim && <div className="absolute inset-0 bg-black/55 z-[2]" />}
        {badge && <span className="absolute top-3 right-3 z-[3]">{badge}</span>}
        {bookmark && <span className="absolute top-3 left-3 z-[3]">{bookmark}</span>}
        <div className="absolute inset-x-0 bottom-0 z-[2] p-4">{title}</div>
      </div>
      <div className="p-4 flex-1">{children}</div>
    </motion.div>
  );
}

export function RestaurantsTab({ search, onSelect }: { search: string; onSelect: (r: Restaurant) => void }) {
  const { t } = useTranslation();
  const savedRestaurants = useAppStore((s) => s.savedRestaurants);
  const toggleSavedRestaurant = useAppStore((s) => s.toggleSavedRestaurant);
  const q = search.toLowerCase();
  const filtered = RESTAURANTS.filter(
    (r) => !q || r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q),
  );
  if (!filtered.length) return <EmptyTab label={t("services", "not_found_restaurant")} />;
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {filtered.map((r) => (
        <PlateCard
          key={r.id}
          img={r.img}
          FallbackIcon={Utensils}
          onSelect={() => onSelect(r)}
          badge={<Badge tone="onImage">{r.priceRange}</Badge>}
          bookmark={
            <SaveButton
              saved={savedRestaurants.includes(r.id)}
              onToggle={() => toggleSavedRestaurant(r.id)}
              label={t("saved", "toggle")}
            />
          }
          title={
            <h3 className="font-display text-[19px] leading-tight text-[#F5EFE3] truncate route-underline">
              {r.name}
            </h3>
          }
        >
          <div className="flex items-center gap-2.5 tabular text-[11px] text-subtle">
            <span className="truncate">{r.city}</span>
            <span aria-hidden className="w-px h-3 bg-[var(--border)] shrink-0" />
            <span className="text-accent shrink-0">★ {r.rating}</span>
            <span aria-hidden className="w-px h-3 bg-[var(--border)] shrink-0" />
            <span className="shrink-0 truncate">{r.hours}</span>
          </div>
          <p className="mt-2 text-[11px] sm:text-[10px] uppercase tracking-[0.14em] text-subtle truncate">{r.cuisine}</p>
        </PlateCard>
      ))}
    </motion.div>
  );
}

export function HotelsTab({ search, onSelect }: { search: string; onSelect: (h: HotelType) => void }) {
  const { t } = useTranslation();
  const savedHotels = useAppStore((s) => s.savedHotels);
  const toggleSavedHotel = useAppStore((s) => s.toggleSavedHotel);
  const q = search.toLowerCase();
  const filtered = HOTELS.filter((h) => !q || h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q));
  if (!filtered.length) return <EmptyTab label={t("services", "not_found_hotel")} />;
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {filtered.map((h) => (
        <PlateCard
          key={h.id}
          img={h.img}
          FallbackIcon={Hotel}
          onSelect={() => onSelect(h)}
          dim={!h.available}
          badge={
            <Badge tone={h.available ? "onImage" : "copper"}>
              {h.available ? t("services", "available") : t("services", "busy")}
            </Badge>
          }
          bookmark={
            <SaveButton
              saved={savedHotels.includes(h.id)}
              onToggle={() => toggleSavedHotel(h.id)}
              label={t("saved", "toggle")}
            />
          }
          title={
            <>
              <h3 className="font-display text-[19px] leading-tight text-[#F5EFE3] truncate route-underline">{h.name}</h3>
              <span className="flex mt-1.5" aria-label={`${h.stars} stars`}>
                {Array.from({ length: h.stars }, (_, i) => (
                  <Star key={i} className="w-3 h-3 text-gold-300 fill-gold-300" aria-hidden />
                ))}
              </span>
            </>
          }
        >
          <div className="flex items-center gap-2.5 tabular text-[11px] text-subtle mb-3">
            <span className="truncate">{h.city}</span>
            <span aria-hidden className="w-px h-3 bg-[var(--border)] shrink-0" />
            <span className="text-accent shrink-0">★ {h.rating}</span>
          </div>
          <div className="flex items-end justify-between gap-3">
            <p className="tabular text-[17px] text-ink leading-none">
              {h.pricePerNight.toLocaleString()}
              <span className="text-[11px] text-subtle"> {t("services", "uzs_unit")} / {t("services", "per_night")}</span>
            </p>
            <div className="flex gap-1.5 shrink-0 text-subtle">
              {h.amenities.slice(0, 3).map((a) => (
                <span key={a} title={a} className="w-6 h-6 rounded-sm border border-[var(--border)] flex items-center justify-center">
                  {amenityIcon(a)}
                </span>
              ))}
            </div>
          </div>
        </PlateCard>
      ))}
    </motion.div>
  );
}

export function GuidesTab({ search, onSelect }: { search: string; onSelect: (g: Guide) => void }) {
  const { t } = useTranslation();
  const q = search.toLowerCase();
  const filtered = GUIDES.filter(
    (g) => !q || g.name.toLowerCase().includes(q) || g.city.toLowerCase().includes(q) || g.langs.some((l) => l.toLowerCase().includes(q)),
  );
  if (!filtered.length) return <EmptyTab label={t("services", "not_found_guide")} />;
  return (
    <ul>
      {filtered.map((g) => (
        <li key={g.id}>
          <div
            onClick={() => onSelect(g)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(g); } }}
            className="group cursor-pointer flex items-start gap-4 sm:gap-5 py-6 hairline-b"
          >
            <span className="relative shrink-0">
              <img
                src={g.img}
                alt=""
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(g.name)}&background=1A1E28&color=E0A94E&size=64`;
                }}
                className="w-14 h-14 rounded-sm object-cover border border-[var(--border)]"
              />
              {g.available && <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-gold-400 border-2 border-canvas" />}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="font-display text-[18px] leading-tight text-ink truncate route-underline">{g.name}</h3>
                {g.verified && <CheckCircle className="w-3.5 h-3.5 text-accent shrink-0" aria-label={t("detail", "verified")} />}
              </div>
              <p className="tabular text-[11px] text-subtle mb-2.5">{g.city} · ★ {g.rating} · {g.langs.join(", ")}</p>
              <p className="text-[12.5px] leading-relaxed text-subtle line-clamp-2 max-w-[60ch]">{g.bio}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="tabular text-[17px] text-ink leading-none">{g.pricePerDay.toLocaleString()}</p>
              <p className="text-[11px] text-subtle mt-1">{t("services", "uzs_unit")} / {t("services", "per_day")}</p>
              <p className={cn("text-[11px] sm:text-[10px] uppercase tracking-[0.12em] mt-2", g.available ? "text-accent" : "text-copper-400")}>
                {g.available ? t("services", "available") : t("services", "busy")}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function TransportTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  function formatDuration(hours: number, mins: number): string {
    const h = t("services", "hours_unit");
    const m = t("services", "min_unit");
    if (hours > 0 && mins > 0) return `${hours} ${h} ${mins} ${m}`;
    if (hours > 0) return `${hours} ${h}`;
    return `${mins} ${m}`;
  }
  const formatPrice = (uzs: number) => `${new Intl.NumberFormat("uz-UZ").format(uzs)} ${t("services", "uzs_unit")}`;

  const TRANSPORT_OPTIONS = [
    { type: t("services", "train_type"), Icon: Train, desc: t("services", "train_desc"),
      routes: [
        { from: "Toshkent", to: "Samarqand", hours: 2, mins: 0,  priceUZS: 80000 },
        { from: "Toshkent", to: "Buxoro",    hours: 3, mins: 30, priceUZS: 120000 },
        { from: "Samarqand", to: "Buxoro",   hours: 1, mins: 30, priceUZS: 60000 },
      ] },
    { type: t("services", "bus_type"), Icon: Bus, desc: t("services", "bus_desc"),
      routes: [
        { from: "Toshkent", to: "Namangan", hours: 4, mins: 0, priceUZS: 40000 },
        { from: "Toshkent", to: "Andijon",  hours: 5, mins: 0, priceUZS: 50000 },
        { from: "Toshkent", to: "Termiz",   hours: 8, mins: 0, priceUZS: 70000 },
      ] },
    { type: t("services", "taxi_type"), Icon: Zap, desc: t("services", "taxi_desc"),
      routes: [
        { from: "Toshkent", to: "Chimgan",    hours: 1, mins: 30, priceUZS: 150000 },
        { from: "Urgench",  to: "Xiva",       hours: 0, mins: 30, priceUZS: 30000 },
        { from: "Buxoro",   to: "Shahrisabz", hours: 1, mins: 30, priceUZS: 100000 },
      ] },
  ];

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div>
        {TRANSPORT_OPTIONS.map((opt) => (
          <section key={opt.type} className="mb-10">
            <div className="flex items-baseline justify-between gap-6 mb-3">
              <div className="flex items-center gap-2.5">
                <opt.Icon className="w-4 h-4 text-accent" strokeWidth={1.75} aria-hidden />
                <h3 className="kicker kicker-gold">{opt.type}</h3>
              </div>
            </div>
            <Rule />
            <p className="text-[12px] text-subtle mt-3 mb-1">{opt.desc}</p>
            <dl className="mt-3">
              {opt.routes.map((route) => (
                <DataRow
                  key={`${route.from}-${route.to}`}
                  label={<span className="font-sans normal-case tracking-normal text-[12.5px] text-ink">{route.from} → {route.to}</span>}
                  value={
                    <span className="flex items-baseline gap-3 justify-end">
                      <span className="text-subtle text-[11px] whitespace-nowrap">{formatDuration(route.hours, route.mins)}</span>
                      <span className="text-accent whitespace-nowrap">~{formatPrice(route.priceUZS)}</span>
                    </span>
                  }
                />
              ))}
            </dl>
          </section>
        ))}
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="border border-[var(--gold-hairline)] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-1">
            <Phone className="w-3.5 h-3.5 text-accent" aria-hidden />
            <Kicker gold>{t("services", "emergency")}</Kicker>
          </div>
          <p className="text-[11px] text-subtle mb-4">{t("services", "uzbekistan")}</p>
          <Rule />
          <dl className="mt-1">
            {EMERGENCY_NUMBERS.map((item) => (
              <DataRow
                key={item.number}
                label={
                  <span className="flex items-center gap-2">
                    <item.Icon className="w-3.5 h-3.5 text-subtle" strokeWidth={1.75} aria-hidden />
                    {t("services", item.key)}
                  </span>
                }
                // tap-44: emergency numbers are the one list somebody taps under stress, so
                // they need a full-size target.
                value={<a href={`tel:${item.number}`} className="tap-44 inline-block text-accent hover:text-gold-300 transition-colors">{item.number}</a>}
              />
            ))}
          </dl>
          <Button variant="ghost" size="sm" className="mt-5 -ml-1" onClick={() => navigate("/atlas")}>
            {t("services", "other_countries")}
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
          </Button>
        </div>
      </aside>
    </div>
  );
}

export function CurrencyTab() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");

  const currencies = Object.entries(CURRENCY_RATES).map(([code, rate]) => ({ code, rate }));
  const MAX_CONVERTIBLE = 1_000_000_000;
  const parsedAmount = parseFloat(amount);
  const numericAmount = Number.isFinite(parsedAmount) ? Math.min(Math.max(parsedAmount, 0), MAX_CONVERTIBLE) : 0;
  const baseRate = CURRENCY_RATES[fromCurrency] ?? 1;
  const uzsAmount = numericAmount * baseRate;

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start">
      <section>
        <Kicker className="mb-3">{t("services", "currency_calc_title")}</Kicker>
        <Rule gold />
        <div className="flex gap-3 mt-7">
          <input
            type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
            min="0" max={MAX_CONVERTIBLE} aria-label={t("services", "currency_calc_title")}
            className="flex-1 min-w-0 bg-transparent border-b border-[var(--input-border)] px-0 py-2.5 tabular text-[22px] text-ink outline-none focus:border-gold-400 transition-colors duration-400"
          />
          <select
            value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} aria-label="Currency"
            className="shrink-0 bg-transparent border-b border-[var(--input-border)] px-0 py-2.5 tabular text-[15px] text-ink outline-none focus:border-gold-400 transition-colors duration-400"
          >
            {currencies.map(({ code }) => <option key={code} value={code} className="bg-elevated">{code}</option>)}
            <option value="UZS" className="bg-elevated">UZS</option>
          </select>
        </div>
        <div className="mt-8">
          <Kicker className="mb-2.5">
            {fromCurrency !== "UZS" ? `${numericAmount} ${fromCurrency}` : `${numericAmount.toLocaleString()} UZS`}
          </Kicker>
          <p className="tabular font-display text-display-sm text-accent leading-none break-all">
            {fromCurrency !== "UZS" ? (
              <>{new Intl.NumberFormat("uz-UZ").format(Math.round(uzsAmount))}<span className="text-[17px] text-subtle"> {t("services", "uzs_unit")}</span></>
            ) : (
              <>${(numericAmount / CURRENCY_RATES.USD).toFixed(2)}<span className="text-[17px] text-subtle"> USD</span></>
            )}
          </p>
        </div>
      </section>
      <section>
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <Kicker>{t("services", "currency_table_title")}</Kicker>
          <span className="text-[11px] text-subtle">{t("services", "currency_table_unit")}</span>
        </div>
        <Rule />
        <dl className="mt-1">
          {currencies.map(({ code, rate }) => (
            <div key={code} className="flex items-baseline justify-between gap-6 py-3 hairline-b last:border-b-0">
              <dt>
                <button
                  type="button" onClick={() => setFromCurrency(code)} aria-pressed={fromCurrency === code}
                  className={cn("tap-44 tabular text-[12px] tracking-[0.14em] transition-colors duration-400", fromCurrency === code ? "text-accent" : "text-subtle hover:text-ink")}
                >
                  {code}
                </button>
              </dt>
              <dd className="tabular text-[13px] text-ink">{new Intl.NumberFormat("uz-UZ").format(rate)}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
