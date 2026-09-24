// ============================================================
// A_countries/_template.ts — NAMUNA FAYL
// Yangi mamlakat qo'shayotganda shu fayldan nusxa oling.
// Barcha maydonlar to'ldirilishi MAJBURIY (null qoldirmang).
// Qoidalar: RULES.md
// ============================================================

// INSTRUKSIYA:
// summary   → 400–600 belgi. Tahririy ohang. Aniq joy nomlari.
//             1-gap: mamlakatning asosiy xarakteri
//             2-3-gap: aniq joylar/mintaqalar nomi bilan
//             Oxirgi gap: nimaga e'tibor berish kerak
//
// tagline   → 30–60 belgi. Nuqta bilan tugaydi. Kuzatuv, slogan emas.
//
// bestSeason → "Oy–Oy (sabab), Oy–Oy (sabab)" formatida.
//              Sababi qavs ichida bo'lsin.
//
// visaNote  → 50–120 belgi. Qaysi pasport ekani aniq.
//             "Ko'p mamlakatlar" — qabul qilinmaydi.
//
// visaCheckedOn → Har doim "YYYY-MM" formatida yozing.

export const XX = {
  // --- Asosiy maydonlar ---
  code: "XX",                       // ISO 3166-1 alpha-2 (katta harf)
  slug: "country-name",             // URL uchun (kichik harf, chiziqcha)

  // --- Matn maydonlari (QAYTADAN YOZILADI) ---
  summary: "",
  tagline: "",
  bestSeason: "",
  visaNote: "",
  visaCheckedOn: "2026-09",

  // --- Geografik ma'lumotlar ---
  capital: "",
  continent: "",                    // "Asia" | "Europe" | "Americas" | "Africa" | "Oceania"
  lat: 0.0000,
  lng: 0.0000,

  // --- Demografik ma'lumotlar ---
  population: "",                   // "9.1 million"
  area: "",                         // "448 978 km²"
  timezone: "",                     // "UTC+5" yoki "UTC+9 (JST)"
  callingCode: "",                  // "+998"

  // --- Amaliy ma'lumotlar ---
  currency: "",                     // "UZS"
  currencyName: "",                 // "O'zbek so'mi"
  languages: [],                    // ["Uzbek", "Russian"]
  plugType: "",                     // "C/F (220V)"
  drivingSide: "right",             // "right" | "left"

  // --- Sayohat ma'lumotlari ---
  priceLevel: 1,                    // 1 (arzon) → 5 (qimmat)
  safetyRating: 3,                  // 1 (xavfli) → 5 (xavfsiz)
  topCities: [],                    // ["Toshkent", "Samarqand", "Buxoro"]
  cuisine: [],                      // ["plov", "somsa", "shashlik"]
  unesco: 0,                        // UNESCO Jahon merosi obyektlari soni

  // --- Favqulodda raqamlar ---
  emergency: {
    police: "",                     // "102"
    ambulance: "",                  // "103"
    fire: "",                       // "101"
    general: "",                    // "112" (universal)
  },

  // --- Atlas ko'rinishi ---
  flag: "",                         // emoji bayroq: "🇺🇿"
  featured: false,                  // Atlas boshida featured qatorda chiqadimi
};
