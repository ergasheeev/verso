import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Flag } from "@/components/shared/Flag";
import { LOCALE_TAGS, type Lang } from "@/i18n";

const COUNTRIES: { code: string; name: string }[] = [
  ["UZ","Uzbekistan"],["KZ","Kazakhstan"],["KG","Kyrgyzstan"],["TJ","Tajikistan"],["TM","Turkmenistan"],
  ["RU","Russia"],["US","United States"],["GB","United Kingdom"],["DE","Germany"],["FR","France"],
  ["IT","Italy"],["ES","Spain"],["PT","Portugal"],["NL","Netherlands"],["BE","Belgium"],
  ["CH","Switzerland"],["AT","Austria"],["SE","Sweden"],["NO","Norway"],["DK","Denmark"],
  ["FI","Finland"],["PL","Poland"],["CZ","Czechia"],["SK","Slovakia"],["HU","Hungary"],
  ["RO","Romania"],["BG","Bulgaria"],["GR","Greece"],["TR","Turkey"],["UA","Ukraine"],
  ["BY","Belarus"],["MD","Moldova"],["GE","Georgia"],["AM","Armenia"],["AZ","Azerbaijan"],
  ["IE","Ireland"],["IS","Iceland"],["HR","Croatia"],["RS","Serbia"],["SI","Slovenia"],
  ["EE","Estonia"],["LV","Latvia"],["LT","Lithuania"],["CN","China"],["JP","Japan"],
  ["KR","South Korea"],["IN","India"],["PK","Pakistan"],["BD","Bangladesh"],["ID","Indonesia"],
  ["MY","Malaysia"],["SG","Singapore"],["TH","Thailand"],["VN","Vietnam"],["PH","Philippines"],
  ["MN","Mongolia"],["AF","Afghanistan"],["IR","Iran"],["IQ","Iraq"],["SA","Saudi Arabia"],
  ["AE","United Arab Emirates"],["QA","Qatar"],["KW","Kuwait"],["IL","Israel"],["JO","Jordan"],
  ["LB","Lebanon"],["EG","Egypt"],["MA","Morocco"],["DZ","Algeria"],["TN","Tunisia"],
  ["ZA","South Africa"],["NG","Nigeria"],["KE","Kenya"],["ET","Ethiopia"],["GH","Ghana"],
  ["CA","Canada"],["MX","Mexico"],["BR","Brazil"],["AR","Argentina"],["CL","Chile"],
  ["CO","Colombia"],["PE","Peru"],["VE","Venezuela"],["AU","Australia"],["NZ","New Zealand"],
  ["LU","Luxembourg"],["MT","Malta"],["CY","Cyprus"],["AL","Albania"],["MK","North Macedonia"],
  ["BA","Bosnia and Herzegovina"],["ME","Montenegro"],["XK","Kosovo"],
].map(([code, name]) => ({ code, name }));

export function CountrySelect({
  value,
  onChange,
  label,
  placeholder,
  searchPlaceholder,
  skipLabel,
  lang,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  skipLabel: string;
  lang: Lang;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const displayNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([LOCALE_TAGS[lang]], { type: "region", fallback: "code" });
    } catch {
      return null;
    }
  }, [lang]);
  const localName = (c: { code: string; name: string }) => displayNames?.of(c.code) || c.name;

  const sortedCountries = useMemo(
    () => [...COUNTRIES].sort((a, b) => localName(a).localeCompare(localName(b), LOCALE_TAGS[lang])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang, displayNames],
  );
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [inDialog, setInDialog] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = COUNTRIES.find((c) => c.name === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedCountries;
    return sortedCountries.filter(
      (c) => localName(c).toLowerCase().includes(q) || c.name.toLowerCase().includes(q),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sortedCountries]);

  function updateCoords() {
    const r = triggerRef.current?.getBoundingClientRect();
    if (r) setCoords({ top: r.bottom + 6, left: r.left, width: r.width });
  }

  useEffect(() => {
    if (!open) return;
    setInDialog(!!rootRef.current?.closest('[role="dialog"]'));
    updateCoords();
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    window.addEventListener("resize", updateCoords);
    window.addEventListener("scroll", updateCoords, true);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords, true);
    };
  }, [open]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
    else setQuery("");
  }, [open]);

  return (
    <div ref={rootRef}>
      <span className="kicker block mb-2">{label}</span>
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "field-trigger w-full flex items-center gap-2.5 bg-transparent border-b px-0 py-3 sm:py-2.5 text-[15px] text-left",
            "transition-colors duration-400",
            value ? "pr-14" : "pr-6",
            open ? "border-gold-400" : "border-[var(--input-border)]"
          )}
        >
          {selected ? (
            <>
              <Flag code={selected.code} />
              <span className="flex-1 text-ink truncate">{localName(selected)}</span>
            </>
          ) : (
            <span className="flex-1 text-subtle text-[14px]">{placeholder}</span>
          )}
        </button>

        {/* Clear and chevron sit OUTSIDE the trigger: a control nested inside a
        <button> is invalid HTML and would open the dropdown on Enter instead of
        clearing. */}
        <div className="absolute right-0 top-0 bottom-0 flex items-center gap-1.5 pointer-events-none">
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label={skipLabel}
              className="tap-44 pointer-events-auto flex items-center justify-center w-6 h-6
                         text-subtle hover:text-accent transition-colors duration-300"
            >
              <X className="w-3.5 h-3.5" aria-hidden />
            </button>
          )}
          <ChevronDown
            className={cn(
              "w-4 h-4 text-subtle transition-transform duration-400 shrink-0",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </div>

        {open && (() => {
          const panel = (
            <div
              ref={dropdownRef}
              style={inDialog ? undefined : { position: "fixed", top: coords.top, left: coords.left, width: coords.width }}
              className={cn(
                "z-[100] rounded-sm border border-[var(--input-border)] bg-[var(--modal)] shadow-[var(--shadow-modal)] overflow-hidden",
                inDialog && "absolute mt-1.5 w-full"
              )}
            >
              <div className="p-1.5 border-b border-[var(--border)]">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted-foreground)]" aria-hidden />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-8 pr-2 py-1.5 rounded-sm bg-[var(--input-bg)] border border-[var(--input-border)] text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus:border-gold-400 transition-colors duration-300"
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto overscroll-contain py-1 scrollbar-thin">
                {filtered.length === 0 ? (
                  <p className="px-3 py-3 text-xs text-[var(--muted-foreground)] text-center">—</p>
                ) : (
                  filtered.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => { onChange(c.name); setOpen(false); }}
                      aria-selected={value === c.name}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-1.5 text-[13px] leading-tight text-left hover:bg-[var(--muted)] transition-colors duration-200",
                        value === c.name ? "text-accent" : "text-[var(--foreground)]"
                      )}
                    >
                      <Flag code={c.code} className="shrink-0" />
                      <span className="truncate">{localName(c)}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          );
          return inDialog ? panel : createPortal(panel, document.body);
        })()}
      </div>
    </div>
  );
}
