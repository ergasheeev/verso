# Verso Dataset — Progress Tracker

| ISO | Mamlakat | A Matn | B Joylar | C Rasm | D Tarjima |
|-----|----------|--------|----------|--------|-----------|
| **ASIA** |
| UZ | O'zbekiston | ✅ | ✅ | ✅ | ✅ |
| JP | Yaponiya | ✅ | ✅ | ✅ | ✅ |
| CN | Xitoy | ✅ | ✅ | ✅ | ✅ |
| TH | Tailand | ✅ | ✅ | ✅ | ✅ |
| AE | BAA | ✅ | ✅ | ✅ | ✅ |
| TR | Turkiya | ✅ | ✅ | ✅ | ✅ |
| IN | Hindiston | ✅ | ✅ | ✅ | ✅ |
| SG | Singapur | ✅ | ✅ | ✅ | ✅ |
| VN | Vyetnam | ✅ | ✅ | ✅ | ✅ |
| ID | Indoneziya | ✅ | ✅ | ✅ | ✅ |
| MY | Malayziya | ✅ | ✅ | ✅ | ✅ |
| KZ | Qozog'iston | ✅ | ✅ | ✅ | ✅ |
| GE | Gruziya | ✅ | ✅ | ✅ | ✅ |
| AM | Armaniston | ✅ | ✅ | ✅ | ✅ |
| AZ | Ozarbayjon | ✅ | ✅ | ✅ | ✅ |
| KG | Qirg'iziston | ✅ | ✅ | ✅ | ✅ |
| **EUROPE** |
| FR | Fransiya | ✅ | ✅ | ✅ | ✅ |
| IT | Italiya | ✅ | ✅ | ✅ | ✅ |
| DE | Germaniya | ✅ | ✅ | ✅ | ✅ |
| ES | Ispaniya | ✅ | ✅ | ✅ | ✅ |
| GB | Britaniya | ✅ | ✅ | ✅ | ✅ |
| NL | Niderlandiya | ✅ | ✅ | ✅ | ✅ |
| CH | Shveytsariya | ✅ | ✅ | ✅ | ✅ |
| AT | Avstriya | ✅ | ✅ | ✅ | ✅ |
| PT | Portugaliya | ✅ | ✅ | ✅ | ✅ |
| GR | Gretsiya | ✅ | ✅ | ✅ | ✅ |
| CZ | Chexiya | ✅ | ✅ | ✅ | ✅ |
| HU | Vengriya | ✅ | ✅ | ✅ | ✅ |
| PL | Polsha | ✅ | ✅ | ✅ | ✅ |
| HR | Xorvatiya | ✅ | ✅ | ✅ | ✅ |
| NO | Norvegiya | ✅ | ✅ | ✅ | ✅ |
| SE | Shvetsiya | ✅ | ✅ | ✅ | ✅ |
| IS | Islandiya | ✅ | ✅ | ✅ | ✅ |
| **AMERICAS** |
| US | AQSh | ✅ | ✅ | ✅ | ✅ |
| MX | Meksika | ✅ | ✅ | ✅ | ✅ |
| BR | Braziliya | ✅ | ✅ | ✅ | ✅ |
| AR | Argentina | ✅ | ✅ | ✅ | ✅ |
| PE | Peru | ✅ | ✅ | ✅ | ✅ |
| CO | Kolumbiya | ✅ | ✅ | ✅ | ✅ |
| **AFRICA / OCEANIA** |
| EG | Misr | ✅ | ✅ | ✅ | ✅ |
| MA | Marokash | ✅ | ✅ | ✅ | ✅ |
| ZA | Janubiy Afrika | ✅ | ✅ | ✅ | ✅ |
| KE | Keniya | ✅ | ✅ | ✅ | ✅ |
| AU | Avstraliya | ✅ | ✅ | ✅ | ✅ |
| NZ | Yangi Zelandiya | ✅ | ✅ | ✅ | ✅ |

---
**Jami:** 45 mamlakat | A ✅ 45/45 | B ✅ 45/45 (331 joy) | C ✅ 45/45 mamlakat rasmi | D ✅ 45/45 × 5 til (ru, uz, zh, de, fr)

## 2026-09-23 yangilanishi

- **A_countries** — barcha 45 fayl validate.ts dan xatosiz o'tadi. Tuzatilgan jiddiy xatolar:
  - ~30 faylda apostrof (`o'zbek` kabi so'zlardagi `'`) single-quote qatorlarni ertaroq yopib, faylni **sintaktik buzilgan** holga keltirgan edi (import qilib bo'lmasdi). Barchasi double-quote formatiga o'tkazildi.
  - `uz.ts` (O'zbekiston) yagona fayl bo'lib, boshqa 44 tasidan farqli, **inglizcha** yozilgan edi — o'zbek tiliga moslab qayta yozildi.
  - `cn.ts`, `kg.ts` da kirillcha harflar lotincha matn ichida qolib ketgan edi (`tariхning` → `tarixning`).
  - 39 faylda `summary`/`tagline`/`visaNote` RULES.md belgilangan chegaradan (600/60/120 belgi) oshib ketgan edi — barchasi qisqartirildi.
- **B_places** — barcha 45 fayl (331 joy) validatsiyadan o'tadi. Tuzatilgan:
  - `type` maydonida sxemaga kirmaydigan qiymatlar (`museum`, `nature`, `neighborhood`, `experience`, `beach`, `market`, `entertainment`) 84 o'rinda `attraction`ga normallashtirildi.
  - 3 faylda (`br.ts`, `co.ts`, `za.ts`) qo'shtirnoq escape xatosi tufayli fayl import bo'lmasdi — tuzatildi.
  - `tr.ts` da transport maydonida kirillcha "автобус" so'zi lotincha matn ichida qolib ketgan edi — tuzatildi.
- **D_translations** — 5 tilga (ru, uz, zh, de, fr) barcha 45 mamlakat tarjima qilindi (225 fayl).
  ⚠️ **Muhim eslatma:** loyiha hujjatlariga ko'ra `A_countries/` "inglizcha master" bo'lishi kerak edi, lekin haqiqatda 44/45 fayl **o'zbek tilida** yozilgan (faqat asl `uz.ts` inglizcha edi, u ham endi o'zbekchaga moslashtirildi). Demak hozircha inglizcha versiya umuman yo'q — `uz` tarjima fayllari asl matnning deyarli aynan o'zi. Agar ilova ingliz tilini asosiy/zaxira til sifatida talab qilsa (readme_pr.md 8-bo'limida shunday deyilgan), alohida inglizcha tarjima blokini qo'shish kerak bo'ladi.
- **output/** — `scripts/run-all.bat` orqali generatsiya qilindi: `countries.ts` (45), `index.ts` (331 joy), `countries.i18n.ts` (5 til), `knowledge-base.ts` (331 yozuv).
- **C_images** — 45/45 mamlakat fotosuratlari to'liq yuklandi va tekshirildi. Barcha rasmlar kengligi 1920px, toza landscape (16:9 / 3:2), real fotosuratlar (Wikimedia Commons) va `credits.csv` da litsenziya, muallif, manba bilan to'liq qayd etildi.
- **D_translations** — 5 ta til bo'yicha barcha 45 mamlakat (225 ta fayl) to'liq shakllantirildi (uz dagi yetishmayotgan 16 ta fayl ham to'liq yaratildi) va `output/countries.i18n.ts` qayta build qilindi.
- **Validatsiya holati** — `scripts/validate_all.py` orqali 100% muvaffaqiyatli tekshirildi (xatolar: 0, ogohlantirishlar: 0).
