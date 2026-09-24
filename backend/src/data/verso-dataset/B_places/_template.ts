// ============================================================
// B_places/_template.ts — NAMUNA FAYL
// Yangi mamlakat joylari uchun shu fayldan nusxa oling.
// Qoidalar: RULES.md
// ============================================================

// INSTRUKSIYA:
// id         → "iso-joy-nomi" (kichik harf, chiziqcha, dublikat bo'lmasin)
// type       → "attraction" | "restaurant" | "hotel" | "guide"
// description → 150–300 belgi. Aniq, tahririy.
// price      → Mahalliy valyutada yoki "Bepul"
// priceUSD   → RAQAM (number, string emas!). 0 = bepul
// hours      → "09:00–18:00" yoki "24/7" yoki "Seshanba yopiq, 10:00–17:00"
//              BO'SH QOLDIRMANG — AI eng ko'p bu yerda xato qiladi
// transport  → Eng yaqin transport + yurish vaqti
// image      → "iso-joy-nomi.jpg" yoki null (rasm bo'lmasa null yozing)
//
// Tarkib: 5 ta minimum
//   1 ta mashhur + 2 ta ikkinchi qator + 1 ta tabiat + 1 ta mahalliy hayot

export const XX_places = [
  // --- 1. MASHHUR JOY ---
  {
    id: "xx-joy-nomi",
    name: "",
    type: "attraction" as const,
    city: "",
    country: "XX",
    description: "",
    price: "",
    priceUSD: 0,
    hours: "",
    transport: "",
    lat: 0.0000,
    lng: 0.0000,
    image: null as string | null,
    tags: [] as string[],
  },

  // --- 2. IKKINCHI QATOR (1) ---
  {
    id: "xx-joy-nomi-2",
    name: "",
    type: "attraction" as const,
    city: "",
    country: "XX",
    description: "",
    price: "",
    priceUSD: 0,
    hours: "",
    transport: "",
    lat: 0.0000,
    lng: 0.0000,
    image: null as string | null,
    tags: [] as string[],
  },

  // --- 3. IKKINCHI QATOR (2) ---
  {
    id: "xx-joy-nomi-3",
    name: "",
    type: "attraction" as const,
    city: "",
    country: "XX",
    description: "",
    price: "",
    priceUSD: 0,
    hours: "",
    transport: "",
    lat: 0.0000,
    lng: 0.0000,
    image: null as string | null,
    tags: [] as string[],
  },

  // --- 4. TABIAT ---
  {
    id: "xx-joy-nomi-4",
    name: "",
    type: "attraction" as const,
    city: "",
    country: "XX",
    description: "",
    price: "",
    priceUSD: 0,
    hours: "",
    transport: "",
    lat: 0.0000,
    lng: 0.0000,
    image: null as string | null,
    tags: ["tabiat"] as string[],
  },

  // --- 5. MAHALLIY HAYOT ---
  {
    id: "xx-joy-nomi-5",
    name: "",
    type: "attraction" as const,
    city: "",
    country: "XX",
    description: "",
    price: "",
    priceUSD: 0,
    hours: "",
    transport: "",
    lat: 0.0000,
    lng: 0.0000,
    image: null as string | null,
    tags: ["mahalliy", "bozor"] as string[],
  },
];
