import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, ExternalLink, Hotel as HotelIcon, Star, Loader2, CheckCircle2,
} from "lucide-react";
import { isAxiosError } from "axios";
import { HOTELS_BY_ID } from "@/data";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";
import { Kicker, Rule, PageWrap, Button, DataRow, Badge } from "@/components/ui/editorial";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
function addDaysISO(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Underlined field, matching the rest of the product's form language. */
function BookingField({
  label, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="min-w-0">
      <Kicker className="block mb-2">{label}</Kicker>
      <input
        {...props}
        className="w-full bg-transparent border-b border-[var(--input-border)]
                   px-0 py-2.5 text-[16px] sm:text-[15px] text-ink placeholder:text-subtle
                   outline-none focus:border-gold-400 transition-colors duration-400"
      />
    </div>
  );
}

/**
 * A real page rather than the earlier quick-look modal: a booking needs
 * dates, guests and contact details, which a popup has no room for.
 *
 * There is no payments or availability system behind this, so submitting
 * creates a *request* the hotel follows up on by phone. The copy says so —
 * a screen that said "confirmed" would be claiming a reservation system
 * that does not exist.
 */
export default function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useAppStore((s) => s.user);
  const hotel = id ? HOTELS_BY_ID.get(id) : undefined;

  const [checkIn, setCheckIn] = useState(todayISO());
  const [checkOut, setCheckOut] = useState(addDaysISO(todayISO(), 1));
  const [guests, setGuests] = useState(2);
  const [contactName, setContactName] = useState(user ? `${user.name} ${user.surname}` : "");
  const [contactPhone, setContactPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const nights = useMemo(() => {
    const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.round(ms / 86_400_000));
  }, [checkIn, checkOut]);

  if (!hotel) {
    return (
      <PageWrap>
        <div className="py-32 text-center">
          <Kicker className="mb-4">404</Kicker>
          <p className="font-display text-display-sm text-ink mb-8">
            {t("services", "not_found_hotel")}
          </p>
          <Button variant="secondary" onClick={() => navigate("/locations?tab=hotellar")}>
            {t("detail", "back")}
          </Button>
        </div>
      </PageWrap>
    );
  }

  const total = nights * hotel.pricePerNight;
  const valid = nights > 0 && contactName.trim().length >= 2 && contactPhone.trim().length >= 5;
  const mapHref = `https://www.google.com/maps/search/${encodeURIComponent(
    `${hotel.name} ${hotel.address} ${hotel.city}`,
  )}`;

  async function submitBooking() {
    if (!hotel || !valid || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await apiClient.post("/bookings", {
        hotelId: hotel.id,
        hotelName: hotel.name,
        city: hotel.city,
        checkIn,
        checkOut,
        guests,
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
      });
      setDone(true);
    } catch (err) {
      const msg = isAxiosError<{ message?: string }>(err) ? err.response?.data?.message : undefined;
      setError(msg || t("services", "booking_error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grain-overlay pb-24">
      {/* ── Plate ───────────────────────────────────────── */}
      <div className="figure relative h-[46vh] min-h-[300px] max-h-[460px]">
        {imgFailed ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--muted)]">
            <HotelIcon className="w-10 h-10 text-subtle/30" strokeWidth={0.9} aria-hidden />
          </div>
        ) : (
          <img
            src={hotel.img}
            alt={hotel.name}
            onError={() => setImgFailed(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        <button
          onClick={() => navigate(-1)}
          aria-label={t("detail", "back")}
          className="tap-44 absolute top-5 left-5 z-[3] w-10 h-10 rounded-sm border border-white/25
                     bg-black/45 backdrop-blur-sm text-[#F5EFE3] flex items-center justify-center
                     hover:border-gold-400 hover:text-accent transition-colors duration-400"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden />
        </button>

        <span className="absolute top-5 right-5 z-[3]">
          <Badge tone={hotel.available ? "onImage" : "copper"}>
            {hotel.available ? t("services", "available") : t("services", "busy")}
          </Badge>
        </span>

        <div className="absolute inset-x-0 bottom-0 z-[2]">
          <PageWrap className="pb-8">
            <span className="flex mb-4" aria-label={`${hotel.stars} stars`}>
              {Array.from({ length: hotel.stars }, (_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-gold-300 fill-gold-300" aria-hidden />
              ))}
            </span>
            <h1 className="font-display text-display-sm sm:text-display text-[#F5EFE3] max-w-[16ch] mb-4 break-words">
              {hotel.name}
            </h1>
            <div className="flex items-center gap-3 flex-wrap tabular text-[12px] text-[#F5EFE3]/75">
              <span>{hotel.city}</span>
              <span aria-hidden className="w-px h-3 bg-white/25" />
              <span className="text-gold-300">★ {hotel.rating}</span>
              <span aria-hidden className="w-px h-3 bg-white/25" />
              {/* Som, not dollars — see the note in Services.tsx. */}
              <span>
                {hotel.pricePerNight.toLocaleString()} {t("services", "uzs_unit")}{" "}
                {t("services", "per_night")}
              </span>
            </div>
          </PageWrap>
        </div>
      </div>

      <PageWrap>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] py-12">
          {/* ── Booking ──────────────────────────────── */}
          <section>
            <Kicker className="mb-3">{t("services", "booking_title")}</Kicker>
            <Rule gold />

            {done ? (
              <div className="mt-8 border border-[var(--gold-hairline)] bg-[var(--gold-soft)] rounded-sm p-8 text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto text-accent mb-4" strokeWidth={1.25} aria-hidden />
                <p className="font-display text-[22px] leading-tight text-ink mb-3">
                  {t("services", "booking_success_title")}
                </p>
                <p className="text-[13.5px] leading-relaxed text-subtle max-w-[44ch] mx-auto mb-7">
                  {t("services", "booking_success_desc")}
                </p>
                <Button variant="secondary" size="sm" onClick={() => setDone(false)}>
                  {t("services", "book_another")}
                </Button>
              </div>
            ) : (
              <div className="mt-8 space-y-7">
                <div className="grid sm:grid-cols-2 gap-6">
                  <BookingField
                    label={t("services", "check_in")}
                    type="date"
                    value={checkIn}
                    min={todayISO()}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (e.target.value >= checkOut) setCheckOut(addDaysISO(e.target.value, 1));
                    }}
                  />
                  <BookingField
                    label={t("services", "check_out")}
                    type="date"
                    value={checkOut}
                    min={addDaysISO(checkIn, 1)}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>

                <BookingField
                  label={t("services", "guests_label")}
                  type="number"
                  min={1}
                  max={20}
                  value={guests}
                  onChange={(e) => setGuests(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
                />

                <div className="grid sm:grid-cols-2 gap-6">
                  <BookingField
                    label={t("services", "contact_name_label")}
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                  <BookingField
                    label={t("services", "contact_phone_label")}
                    type="tel"
                    value={contactPhone}
                    placeholder="+998 90 123 45 67"
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>

                <div>
                  <Rule />
                  <dl className="mt-1">
                    <DataRow
                      label={t("services", "nights_label")}
                      value={
                        nights > 0
                          ? `${nights} × ${hotel.pricePerNight.toLocaleString()}`
                          : "—"
                      }
                    />
                    <DataRow
                      label={t("services", "total_label")}
                      value={
                        <span className="text-accent text-[17px]">
                          {total.toLocaleString()}
                          <span className="text-[11px] text-subtle">
                            {" "}{t("services", "uzs_unit")}
                          </span>
                        </span>
                      }
                    />
                  </dl>
                </div>

                {error && (
                  <p className="text-[12px] text-copper-400 border border-copper-500/35 rounded-sm px-3 py-2.5">
                    {error}
                  </p>
                )}

                <Button fullWidth onClick={submitBooking} disabled={!valid || submitting}>
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
                  {t("services", "submit_booking")}
                </Button>
              </div>
            )}
          </section>

          {/* ── The hotel ────────────────────────────── */}
          <aside className="lg:sticky lg:top-6 lg:self-start space-y-8">
            <section>
              <Kicker className="mb-3">{t("services", "address_label")}</Kicker>
              <Rule />
              <dl className="mt-1">
                <DataRow
                  label={t("services", "address_label")}
                  value={<span className="font-sans">{hotel.address}</span>}
                />
                <DataRow label={t("locations", "city_filter")} value={hotel.city} />
                <DataRow
                  label={t("detail", "price_label")}
                  value={
                    <span className="text-accent">
                      {hotel.pricePerNight.toLocaleString()}
                      <span className="text-[11px] text-subtle">
                        {" "}{t("services", "uzs_unit")}
                      </span>
                    </span>
                  }
                />
              </dl>
              <a
                href={mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 h-11 px-5 rounded-sm border border-[var(--border)] text-ink
                           text-[13px] uppercase tracking-[0.1em]
                           inline-flex items-center justify-center gap-2 w-full
                           hover:border-[var(--gold-hairline)] hover:text-accent
                           transition-colors duration-400"
              >
                <ExternalLink className="w-4 h-4" aria-hidden />
                {t("services", "open_map")}
              </a>
            </section>

            {hotel.amenities.length > 0 && (
              <section>
                <Kicker className="mb-3">{t("detail", "tags_section")}</Kicker>
                <Rule />
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                  {hotel.amenities.map((a) => (
                    <span key={a} className="text-[11px] sm:text-[10px] uppercase tracking-[0.14em] text-subtle">
                      {a}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </PageWrap>
    </div>
  );
}
