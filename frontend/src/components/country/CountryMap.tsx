import { useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { motion, useReducedMotion } from "framer-motion";
import { GEO_ID, type Country } from "@/data/countries";
import { useTranslation } from "@/i18n";
import { countryName, capitalName } from "@/data/countries.i18n";
import { cn } from "@/lib/utils";

/**
 * A locator map, drawn rather than tiled.
 *
 * No Leaflet, no Mapbox, no raster tiles: someone else's road atlas dropped into
 * this page would fight everything around it, need an API key, and phone home on
 * every view. This is one SVG built from the public world-atlas outlines — it
 * takes the page's own colours, prints, scales, works offline after first load,
 * and makes no third-party request.
 *
 * Resolution is the 50m dataset, not 110m: at the size this map is shown, 110m's
 * simplification is plainly visible (Japan comes out as a row of angular
 * polygons rather than a coastline). 50m costs 231 KB gzipped against 38 KB,
 * paid once per session, only if the reader scrolls to a map, and then cached
 * in-module for every other country they open.
 */

// `?url` keeps the TopoJSON out of the JS bundle — Vite emits it as a
// hashed static file and we fetch it on demand.
import worldUrl from "world-atlas/countries-50m.json?url";

type Topo = {
  objects: { countries: unknown };
  [k: string]: unknown;
};

let cache: FeatureCollection<Geometry, { name?: string }> | null = null;
let inflight: Promise<FeatureCollection<Geometry, { name?: string }>> | null = null;

/** Fetch + convert once per session, however many maps mount. */
function loadWorld() {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = (async () => {
      const [{ feature }, res] = await Promise.all([
        import("topojson-client"),
        fetch(worldUrl),
      ]);
      const topo = (await res.json()) as Topo;
      const fc = feature(
        topo as never,
        topo.objects.countries as never,
      ) as unknown as FeatureCollection<Geometry, { name?: string }>;
      cache = fc;
      return fc;
    })();
  }
  return inflight;
}


/**
 * Raw lon/lat bounding box for a feature, from its own coordinates.
 *
 * `geoPath.bounds()` on all 241 features to decide which ones land in frame
 * projects every point of every country just to discard most of them. Reading
 * min/max straight off the coordinates is plain arithmetic with no projection,
 * and the result never changes, so it is computed once per feature for the whole
 * session.
 */
const bboxCache = new WeakMap<object, [number, number, number, number]>();

function lonLatBBox(f: Feature<Geometry>): [number, number, number, number] {
  const hit = bboxCache.get(f as object);
  if (hit) return hit;
  let minLon = 180, minLat = 90, maxLon = -180, maxLat = -90;
  const visit = (coords: unknown): void => {
    if (!Array.isArray(coords)) return;
    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      const [lon, lat] = coords as [number, number];
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      return;
    }
    for (const c of coords) visit(c);
  };
  visit((f.geometry as { coordinates?: unknown }).coordinates);
  const box: [number, number, number, number] = [minLon, minLat, maxLon, maxLat];
  bboxCache.set(f as object, box);
  return box;
}

/**
 * Finished map geometry, keyed by country. Readers move between countries
 * constantly, and recomputing from the source features each time is wasteful, so
 * the result is kept.
 */
const drawnCache = new Map<string, {
  focusPath: string;
  context: string[];
  capital: [number, number] | null;
}>();

const W = 640;
const H = 420;

export function CountryMap({ c, className }: { c: Country; className?: string }) {
  const { t, lang } = useTranslation();
  const reduce = useReducedMotion();
  const [world, setWorld] = useState<FeatureCollection<Geometry, { name?: string }> | null>(cache);
  const [failed, setFailed] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Only fetch once the map is actually near the viewport. On the country
  // page it sits well below the fold, and a reader who never scrolls that
  // far should not pay for the geometry.
  useEffect(() => {
    const node = hostRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { rootMargin: "300px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || world) return;
    let alive = true;
    loadWorld().then(
      (fc) => { if (alive) setWorld(fc); },
      () => { if (alive) setFailed(true); },
    );
    return () => { alive = false; };
  }, [visible, world]);

  const drawn = useMemo(() => {
    if (!world) return null;
    const cached = drawnCache.get(c.code);
    if (cached) return cached;

    const id = GEO_ID[c.code];
    const target = world.features.find((f) => String(f.id).padStart(3, "0") === id);
    if (!target) return null;

    // Mercator fitted to the country itself, with padding so neighbours
    // show around it — a locator map is only legible with its context.
    // Mercator stretches at high latitude (Norway, Iceland); acceptable
    // here because the frame is small and the shape stays recognisable.
    const projection = geoMercator().fitExtent(
      [
        [W * 0.16, H * 0.16],
        [W * 0.84, H * 0.84],
      ],
      target as Feature<Geometry>,
    );
    const path = geoPath(projection);
    const focusPath = path(target as Feature<Geometry>) ?? "";

    // Which lon/lat window the frame actually shows. Inverting two corners is two
    // operations; the alternative is projecting 241 whole countries.
    const nw = projection.invert?.([0, 0]);
    const se = projection.invert?.([W, H]);
    const latOk = nw != null && se != null &&
      Number.isFinite(nw[1]) && Number.isFinite(se[1]) && se[1] < nw[1];

    // New Zealand and Fiji sit on the antimeridian, so the frame's west edge
    // inverts to a LARGER longitude than its east edge. Treating that as
    // "cannot cull" cost New Zealand 415ms against Japan's 130ms — the map
    // drew all 241 countries. The window is simply two ranges in that case.
    const wraps = latOk && nw![0] > se![0];
    const lonRanges: [number, number][] = !latOk
      ? []
      : wraps
        ? [[nw![0], 180], [-180, se![0]]]
        : [[nw![0], se![0]]];

    const context: string[] = [];
    for (const f of world.features) {
      if (f === target) continue;
      if (latOk) {
        const [minLon, minLat, maxLon, maxLat] = lonLatBBox(f as Feature<Geometry>);
        if (maxLat < se![1] || minLat > nw![1]) continue;
        let lonHit = false;
        for (const [lo, hi] of lonRanges) {
          if (maxLon >= lo && minLon <= hi) { lonHit = true; break; }
        }
        if (!lonHit) continue;
      }
      const d = path(f as Feature<Geometry>);
      if (d) context.push(d);
    }

    const capital = projection([c.lng, c.lat]);
    const result = { focusPath, context, capital };
    drawnCache.set(c.code, result);
    return result;
  }, [world, c.code, c.lat, c.lng]);

  return (
    <div
      ref={hostRef}
      className={cn(
        "relative overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--muted)]/30",
        className,
      )}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto block"
        role="img"
        aria-label={`${t("country", "map")}: ${countryName(c, lang)}`}
      >
        <defs>
          {/* The frame dissolves at its edges instead of stopping on a hard
              rectangle, so the map reads as a plate on the page rather than
              a screenshot pasted onto it. */}
          <radialGradient id={`vig-${c.code}`} cx="50%" cy="50%" r="72%">
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
          <linearGradient id={`fill-${c.code}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.30" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.13" />
          </linearGradient>
        </defs>

        {drawn && (
          <>
            {/* Neighbours: present, but clearly not the subject. */}
            <g
              fill="var(--foreground)"
              fillOpacity="0.055"
              stroke="var(--border)"
              strokeWidth={0.5}
              vectorEffect="non-scaling-stroke"
            >
              {drawn.context.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>

            {/* The subject. */}
            <motion.path
              d={drawn.focusPath}
              fill={`url(#fill-${c.code})`}
              stroke="var(--gold)"
              strokeWidth={1.1}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* The capital: a crosshair, the way an atlas marks a seat of
                government, not a dropped pin. */}
            {drawn.capital && (
              <motion.g
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: reduce ? 0 : 0.45 }}
              >
                <line
                  x1={drawn.capital[0] - 9} y1={drawn.capital[1]}
                  x2={drawn.capital[0] + 9} y2={drawn.capital[1]}
                  stroke="var(--gold)" strokeWidth={0.75} strokeOpacity={0.65}
                  vectorEffect="non-scaling-stroke"
                />
                <line
                  x1={drawn.capital[0]} y1={drawn.capital[1] - 9}
                  x2={drawn.capital[0]} y2={drawn.capital[1] + 9}
                  stroke="var(--gold)" strokeWidth={0.75} strokeOpacity={0.65}
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx={drawn.capital[0]} cy={drawn.capital[1]} r={3}
                  fill="var(--gold)"
                />
                <text
                  x={drawn.capital[0] + 13}
                  y={drawn.capital[1] + 4}
                  className="fill-[var(--foreground)]"
                  style={{
                    fontSize: 12,
                    fontFamily: "var(--font-body)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {capitalName(c, lang)}
                </text>
              </motion.g>
            )}
          </>
        )}

        <rect width={W} height={H} fill={`url(#vig-${c.code})`} pointerEvents="none" />
      </svg>

      {/* Neither state is an error the reader needs to act on, so both stay
          quiet: a skeleton while the geometry is in flight, and the plain
          coordinate line if it never arrives. */}
      {!drawn && (
        <div className="absolute inset-0 flex items-center justify-center">
          {failed ? (
            <span className="tabular text-[12px] text-subtle">
              {Math.abs(c.lat).toFixed(2)}°{c.lat >= 0 ? "N" : "S"}{" "}
              {Math.abs(c.lng).toFixed(2)}°{c.lng >= 0 ? "E" : "W"}
            </span>
          ) : (
            <span className="w-8 h-8 rounded-full border border-[var(--border)] border-t-[var(--gold)] animate-spin" />
          )}
        </div>
      )}
    </div>
  );
}
