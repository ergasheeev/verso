/**
 * scripts/validate.ts
 * Barcha A_countries/ va B_places/ fayllarini tekshiradi.
 * Ishlatish: npx ts-node scripts/validate.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";

interface ValidationError {
  file: string;
  field: string;
  message: string;
}

const errors: ValidationError[] = [];
const warnings: ValidationError[] = [];

function error(file: string, field: string, message: string) {
  errors.push({ file, field, message });
}
function warn(file: string, field: string, message: string) {
  warnings.push({ file, field, message });
}

// ─── A_countries validatsiyasi ────────────────────────────────────────────────
function validateCountry(filePath: string) {
  const rel = path.relative(process.cwd(), filePath);
  let mod: any;
  try {
    mod = require(filePath);
  } catch (e) {
    error(rel, "import", `Faylni import qilib bo'lmadi: ${e}`);
    return;
  }

  const key = Object.keys(mod).find((k) => !k.startsWith("_"));
  if (!key) return;
  const c = mod[key];

  // summary
  if (!c.summary) error(rel, "summary", "Bo'sh");
  else if (c.summary.length < 400) error(rel, "summary", `Qisqa: ${c.summary.length} belgi (min 400)`);
  else if (c.summary.length > 600) error(rel, "summary", `Uzun: ${c.summary.length} belgi (max 600)`);

  // tagline
  if (!c.tagline) error(rel, "tagline", "Bo'sh");
  else {
    if (c.tagline.length < 30) error(rel, "tagline", `Qisqa: ${c.tagline.length} belgi (min 30)`);
    if (c.tagline.length > 60) error(rel, "tagline", `Uzun: ${c.tagline.length} belgi (max 60)`);
    if (!c.tagline.endsWith(".")) warn(rel, "tagline", "Nuqta bilan tugamaydi");
  }

  // bestSeason
  if (!c.bestSeason) error(rel, "bestSeason", "Bo'sh");
  else if (!/\w+.+\(.+\)/.test(c.bestSeason))
    warn(rel, "bestSeason", `Format noto'g'ri (kerak: "Oy–Oy (sabab)"): "${c.bestSeason}"`);

  // visaNote
  if (!c.visaNote) error(rel, "visaNote", "Bo'sh");
  else {
    if (c.visaNote.length < 50) error(rel, "visaNote", `Qisqa: ${c.visaNote.length} belgi (min 50)`);
    if (c.visaNote.length > 120) error(rel, "visaNote", `Uzun: ${c.visaNote.length} belgi (max 120)`);
    if (/many|ko'p mamlakatlar/i.test(c.visaNote))
      error(rel, "visaNote", `"many/ko'p mamlakatlar" — qaysi pasport ekani aniq ko'rsating`);
  }

  // visaCheckedOn
  if (!c.visaCheckedOn) error(rel, "visaCheckedOn", "Bo'sh");
  else if (!/^\d{4}-\d{2}$/.test(c.visaCheckedOn))
    error(rel, "visaCheckedOn", `Format noto'g'ri (kerak: YYYY-MM): "${c.visaCheckedOn}"`);

  // emergency
  if (!c.emergency?.police) warn(rel, "emergency.police", "Bo'sh");
  if (!c.emergency?.ambulance) warn(rel, "emergency.ambulance", "Bo'sh");
  if (!c.emergency?.fire) warn(rel, "emergency.fire", "Bo'sh");

  // lat/lng
  if (c.lat === 0 && c.lng === 0) error(rel, "lat/lng", "Koordinatlar 0,0 — to'ldiring");
}

// ─── B_places validatsiyasi ───────────────────────────────────────────────────
const seenIds = new Set<string>();

function validatePlaces(filePath: string) {
  const rel = path.relative(process.cwd(), filePath);
  let mod: any;
  try {
    mod = require(filePath);
  } catch (e) {
    error(rel, "import", `Faylni import qilib bo'lmadi: ${e}`);
    return;
  }

  const key = Object.keys(mod).find((k) => k.endsWith("_places"));
  if (!key) return;
  const places: any[] = mod[key];

  if (places.length < 5) warn(rel, "places", `Joylar soni ${places.length} (minimum 5)`);

  places.forEach((p, i) => {
    const prefix = `[${i}] ${p.id || "id yo'q"}`;

    // id
    if (!p.id) error(rel, `${prefix}.id`, "Bo'sh");
    else {
      if (!/^[a-z]{2}-[a-z0-9-]+$/.test(p.id))
        error(rel, `${prefix}.id`, `Format noto'g'ri: "${p.id}" (kerak: iso-nom)`);
      if (seenIds.has(p.id)) error(rel, `${prefix}.id`, `Dublikat id: "${p.id}"`);
      else seenIds.add(p.id);
    }

    // type
    const validTypes = ["attraction", "restaurant", "hotel", "guide"];
    if (!validTypes.includes(p.type))
      error(rel, `${prefix}.type`, `Noto'g'ri: "${p.type}" (kerak: ${validTypes.join(" | ")})`);

    // description
    if (!p.description) error(rel, `${prefix}.description`, "Bo'sh");
    else if (p.description.length < 150) warn(rel, `${prefix}.description`, `Qisqa: ${p.description.length} belgi`);
    else if (p.description.length > 300) warn(rel, `${prefix}.description`, `Uzun: ${p.description.length} belgi`);

    // priceUSD
    if (typeof p.priceUSD !== "number") error(rel, `${prefix}.priceUSD`, `String emas, raqam bo'lishi kerak: "${p.priceUSD}"`);

    // hours
    if (!p.hours || p.hours.trim() === "") error(rel, `${prefix}.hours`, "Bo'sh — AI bu yerda xato qiladi!");

    // lat/lng
    if (p.lat === 0 && p.lng === 0) error(rel, `${prefix}.lat/lng`, "Koordinatlar 0,0");
  });
}

// ─── Ishlatish ────────────────────────────────────────────────────────────────
const countryFiles = glob.sync("A_countries/**/*.ts", { ignore: ["**/_*.ts"] });
const placesFiles = glob.sync("B_places/**/*.ts", { ignore: ["**/_*.ts"] });

console.log(`\n🔍 A_countries: ${countryFiles.length} fayl tekshirilmoqda...`);
countryFiles.forEach((f) => validateCountry(path.resolve(f)));

console.log(`🔍 B_places: ${placesFiles.length} fayl tekshirilmoqda...`);
placesFiles.forEach((f) => validatePlaces(path.resolve(f)));

// ─── Natija ───────────────────────────────────────────────────────────────────
if (warnings.length > 0) {
  console.log(`\n⚠️  OGOHLANTIRISHLAR (${warnings.length}):`);
  warnings.forEach((w) => console.log(`   ${w.file} → ${w.field}: ${w.message}`));
}

if (errors.length > 0) {
  console.log(`\n❌ XATOLAR (${errors.length}):`);
  errors.forEach((e) => console.log(`   ${e.file} → ${e.field}: ${e.message}`));
  console.log(`\nValidatsiya MUVAFFAQIYATSIZ — xatolarni tuzating.\n`);
  process.exit(1);
} else {
  console.log(`\n✅ Barcha maydonlar to'g'ri! (${countryFiles.length + placesFiles.length} fayl)\n`);
}
