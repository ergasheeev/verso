import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, UtensilsCrossed } from "lucide-react";
import { RESTAURANTS_BY_ID } from "@/data";
import { Kicker, Rule, PageWrap, Button, DataRow } from "@/components/ui/editorial";
import { useTranslation } from "@/i18n";

/**
 * A full page rather than a quick-look modal: the menu is the
 * reason someone opens this, not a footnote in a popup.
 *
 * The menu is set as a ruled list with prices in a tabular column, so the
 * eye can run down the prices without re-reading every description — which
 * is what a printed menu does and what a stack of bordered cards prevents.
 */
export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const restaurant = id ? RESTAURANTS_BY_ID.get(id) : undefined;
  const [imgFailed, setImgFailed] = useState(false);

  if (!restaurant) {
    return (
      <PageWrap>
        <div className="py-32 text-center">
          <Kicker className="mb-4">404</Kicker>
          <p className="font-display text-display-sm text-ink mb-8">
            {t("services", "not_found_restaurant")}
          </p>
          <Button variant="secondary" onClick={() => navigate("/locations?tab=restoranlar")}>
            {t("detail", "back")}
          </Button>
        </div>
      </PageWrap>
    );
  }

  const mapHref = `https://www.google.com/maps/search/${encodeURIComponent(
    `${restaurant.name} ${restaurant.address} ${restaurant.city}`,
  )}`;

  return (
    <div className="grain-overlay pb-24">
      {/* ── Plate ───────────────────────────────────────── */}
      <div className="figure relative h-[46vh] min-h-[300px] max-h-[460px]">
        {imgFailed ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--muted)]">
            <UtensilsCrossed className="w-10 h-10 text-subtle/30" strokeWidth={0.9} aria-hidden />
          </div>
        ) : (
          <img
            src={restaurant.img}
            alt={restaurant.name}
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

        <div className="absolute inset-x-0 bottom-0 z-[2]">
          <PageWrap className="pb-8">
            <Kicker className="text-[#F5EFE3]/70 mb-4">{restaurant.cuisine}</Kicker>
            <h1 className="font-display text-display-sm sm:text-display text-[#F5EFE3] max-w-[16ch] mb-4 break-words">
              {restaurant.name}
            </h1>
            <div className="flex items-center gap-3 flex-wrap tabular text-[12px] text-[#F5EFE3]/75">
              <span>{restaurant.city}</span>
              <span aria-hidden className="w-px h-3 bg-white/25" />
              <span className="text-gold-300">★ {restaurant.rating}</span>
              <span aria-hidden className="w-px h-3 bg-white/25" />
              <span>{restaurant.hours}</span>
            </div>
          </PageWrap>
        </div>
      </div>

      <PageWrap>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] py-12">
          {/* ── Menu ─────────────────────────────────── */}
          <section>
            <div className="flex items-end justify-between gap-6 mb-3.5">
              <div>
                <Kicker className="mb-2.5">{t("services", "tab_restaurants")}</Kicker>
                <h2 className="font-display text-2xl sm:text-3xl text-ink leading-[1.08]">
                  {t("services", "menu_title")}
                </h2>
              </div>
              <span className="tabular text-[11px] text-subtle shrink-0 pb-1">
                {String(restaurant.menu.length).padStart(2, "0")}
              </span>
            </div>
            <Rule gold />

            {restaurant.menu.length === 0 ? (
              <p className="py-16 text-center text-[14px] text-subtle">{t("services", "no_menu")}</p>
            ) : (
              <ul className="mt-2">
                {restaurant.menu.map((dish) => (
                  <li
                    key={dish.name}
                    className="flex items-start justify-between gap-6 sm:gap-10 py-5 hairline-b"
                  >
                    <div className="flex gap-4 min-w-0">
                      <div className="min-w-0">
                        <p className="font-display text-[18px] leading-tight text-ink">{dish.name}</p>
                        <p className="text-[13px] leading-relaxed text-subtle mt-1.5 max-w-[52ch]">
                          {dish.description}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 tabular text-[15px] text-accent whitespace-nowrap pt-0.5">
                      {dish.price.toLocaleString()}
                      <span className="text-[11px] text-subtle"> {t("services", "uzs_unit")}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ── Where ────────────────────────────────── */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <Kicker className="mb-3">{t("services", "address_label")}</Kicker>
            <Rule />
            <dl className="mt-1">
              <DataRow
                label={t("services", "address_label")}
                value={<span className="font-sans">{restaurant.address}</span>}
              />
              <DataRow label={t("detail", "hours")} value={restaurant.hours} />
              <DataRow label={t("locations", "city_filter")} value={restaurant.city} />
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
          </aside>
        </div>
      </PageWrap>
    </div>
  );
}
