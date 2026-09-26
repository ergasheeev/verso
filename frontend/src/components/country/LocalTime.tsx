import { useEffect, useState } from "react";
import { TIMEZONES } from "@/data/countries";
import { useTranslation, LOCALE_TAGS } from "@/i18n";

/**
 * What time it is there, and how far that is from the reader.
 *
 * The single most-looked-up fact about a country that this dossier did not
 * answer — it decides whether you can call the hotel now, and what "the
 * flight lands at 06:00" actually costs you in sleep.
 *
 * Everything here comes from `Intl` and the platform's own tz database, so
 * daylight saving is correct in both directions without this app shipping a
 * single offset of its own.
 */

/** The country's UTC offset in minutes, at this instant. */
function offsetMinutes(timeZone: string, at: Date): number {
  // Format the same instant as if it were in that zone, read the parts back
  // as if they were UTC, and the difference is the offset. This is the
  // standard trick, and it stays correct across DST because the formatter
  // resolves the rule for that specific date.
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  const p: Record<string, string> = {};
  for (const { type, value } of dtf.formatToParts(at)) p[type] = value;
  // Hour 24 is how some engines spell midnight under hour12:false.
  const hour = p.hour === "24" ? 0 : Number(p.hour);
  const asUTC = Date.UTC(
    Number(p.year), Number(p.month) - 1, Number(p.day),
    hour, Number(p.minute), Number(p.second),
  );
  return Math.round((asUTC - at.getTime()) / 60000);
}

/** "+4", "−5:30", or "" when the reader is already in that zone. */
function formatDelta(minutes: number): string {
  if (minutes === 0) return "";
  // A true minus sign, not a hyphen — this sits next to tabular figures.
  const sign = minutes > 0 ? "+" : "−";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return m === 0 ? `${sign}${h}` : `${sign}${h}:${String(m).padStart(2, "0")}`;
}

export function LocalTime({ code }: { code: string }) {
  const { t, lang } = useTranslation();
  const timeZone = TIMEZONES[code];
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!timeZone) return;
    // Tick on the minute boundary rather than every 30s on a fixed phase, so
    // the displayed minute changes when the reader's clock does.
    let timer: number;
    const schedule = () => {
      const ms = 60000 - (Date.now() % 60000);
      timer = window.setTimeout(() => { setNow(new Date()); schedule(); }, ms + 50);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [timeZone]);

  // A country we hold no zone for renders nothing rather than a wrong time.
  if (!timeZone) return null;

  const locale = LOCALE_TAGS[lang];
  const time = new Intl.DateTimeFormat(locale, {
    timeZone, hour: "2-digit", minute: "2-digit",
  }).format(now);
  const weekday = new Intl.DateTimeFormat(locale, { timeZone, weekday: "long" }).format(now);

  const here = -now.getTimezoneOffset();
  const there = offsetMinutes(timeZone, now);
  const delta = formatDelta(there - here);

  return (
    <div>
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="font-display tabular text-[34px] leading-none text-ink">{time}</span>
        {delta ? (
          <span className="tabular text-[12.5px] text-accent whitespace-nowrap">
            {delta} {t("country", "hours_short")}
          </span>
        ) : (
          <span className="text-[12.5px] text-subtle">{t("country", "same_time")}</span>
        )}
      </div>
      <p className="text-[12.5px] text-subtle mt-2 capitalize">{weekday}</p>
    </div>
  );
}
