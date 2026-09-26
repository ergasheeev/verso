# Verso

[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-6.1-2d3748?logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)](https://neon.tech)
[![Groq](https://img.shields.io/badge/Groq-gpt--oss-f55036)](https://groq.com)

**51 ta mamlakat bo'yicha tahrirlangan sayohat atlasi.** Har bir mamlakat uchun viza sharti,
valyuta, eng yaxshi mavsum va favqulodda raqamlar; ustiga sun'iy intellekt yordamchisi,
ikki tomonlama ovozli tarjimon va ishonch bali bilan filtrlangan sharhlar. Interfeys
olti tilda: **o'zbek, rus, ingliz, xitoy, nemis, fransuz**.

> Bu hujjat loyihani birinchi marta ko'rayotgan odam uchun yozilgan. Yuqoridan pastga
> o'qilsa — mahsulot nima qilishi, kod qanday tashkil etilgani va uni qanday ishga
> tushirish kerakligi ketma-ket ochiladi.

---

## Mundarija

1. [Bu nima va kimga kerak](#1-bu-nima-va-kimga-kerak)
2. [Tezkor ishga tushirish](#2-tezkor-ishga-tushirish)
3. [Arxitektura](#3-arxitektura)
4. [Sahifalar — har biri nima qiladi](#4-sahifalar--har-biri-nima-qiladi)
5. [Funksiyalar batafsil](#5-funksiyalar-batafsil)
6. [Backend API — to'liq ro'yxat](#6-backend-api--toliq-royxat)
7. [Ma'lumotlar bazasi](#7-malumotlar-bazasi)
8. [Statik ma'lumotlar to'plami](#8-statik-malumotlar-toplami)
9. [Ko'p tillilik qanday ishlaydi](#9-kop-tillilik-qanday-ishlaydi)
10. [Dizayn tizimi](#10-dizayn-tizimi)
11. [Muhim texnik qarorlar](#11-muhim-texnik-qarorlar)
12. [Muhit o'zgaruvchilari](#12-muhit-ozgaruvchilari)
13. [Skriptlar](#13-skriptlar)
14. [Hozircha mavjud bo'lmagan narsalar](#14-hozircha-mavjud-bolmagan-narsalar)

---

## 1. Bu nima va kimga kerak

Verso — sayohat **ma'lumotnomasi**, bron qilish sayti emas. Farqi shunda: Booking.com sizga
mehmonxona sotadi, Google Maps sizga yo'l ko'rsatadi, lekin ikkalasi ham "Yaponiyaga
qachon borish yaxshi, vizaga nima kerak, tez yordam raqami nechchi" degan savolga bitta
joyda javob bermaydi. Verso shu bo'shliqni to'ldiradi.

Mahsulot uch qatlamdan iborat:

| Qatlam | Nima beradi |
|---|---|
| **Atlas** | 51 mamlakat × 20 ga yaqin maydon — viza, valyuta, til, mavsum, favqulodda raqam, xarita, mahalliy vaqt |
| **Joylar** | Aniq lokatsiyalar, restoranlar, mehmonxonalar, gidlar — tafsilot va sharhlar bilan |
| **AI** | Suhbat yordamchisi, tur rejasi generatori, ovozli tarjimon, sharh tahlili |

Har bir qatlam olti tilda ishlaydi va telefon ekranidan boshlab to keng monitorgacha
moslashadi.

---

## 2. Tezkor ishga tushirish

Kerak: **Node.js 20+**, PostgreSQL ulanish satri (Neon bepul tier yetadi) va
[Groq API kaliti](https://console.groq.com) (bepul).

```bash
git clone https://github.com/ergasheeev/verso.git
cd verso
```

**1-qadam — backend**

```bash
cd backend
npm install
cp .env.example .env     # yo'q bo'lsa, 12-bo'limdagi namunadan yarating
npx prisma generate
npx prisma db push       # jadvallarni yaratadi
npm run dev              # → http://localhost:5000
```

**2-qadam — frontend** (yangi terminalda)

```bash
cd frontend
npm install
npm run dev              # → http://localhost:3000
```

Frontend `/api` so'rovlarini Vite proxy orqali `localhost:5000` ga uzatadi, shuning uchun
alohida `VITE_API_URL` kerak emas.

**Tekshirish:** brauzerda `http://localhost:3000` oching. Atlas sahifasi 51 mamlakat
bilan chiqishi kerak. AI ishlayotganini tekshirish uchun:

```bash
curl -X POST http://localhost:5000/api/ai/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Where is the train station?","from":"en","to":"ru"}'
# → {"success":true,"data":{"translation":"Где находится вокзал?"}}
```

---

## 3. Arxitektura

Monorepo, ikkita mustaqil ilova:

```
verso/
├── frontend/          React 18.3 + Vite + Tailwind  → statik sayt (Vercel)
└── backend/           Express + Prisma + Neon       → Node server
```

Ma'lumot oqimi:

```
   Brauzer
      │
      │  1. Sahifa va statik ma'lumotlar (51 mamlakat, lokatsiyalar)
      │     frontend bundle ichida keladi — server so'ralmaydi
      │
      │  2. Dinamik narsa uchun → /api/*
      ▼
   Express (backend)
      │
      ├─→ Prisma → PostgreSQL (Neon)    foydalanuvchi, sharh, reja, bron
      │
      └─→ Groq API (OpenAI SDK)         chat, tarjima, tahlil, tur rejasi
```

**Nega mamlakat ma'lumotlari bazada emas?** Ular tahririy kontent — yiliga bir necha marta
o'zgaradi, foydalanuvchi ularni tahrirlamaydi. Bundle ichida bo'lgani uchun atlas
internetsiz ham ochiladi va har sahifa yuklanishida so'rov ketmaydi. Bazada faqat
foydalanuvchi yaratadigan narsalar saqlanadi.

### Frontend papka tuzilmasi

```
frontend/src/
├── App.tsx                 Router + ErrorBoundary + Suspense
├── main.tsx                Kirish nuqtasi
├── index.css               Dizayn tizimi: ranglar, tipografika, komponent klasslari
│
├── pages/                  Har bir marshrut uchun bitta fayl (15 ta)
│   ├── Landing.tsx         "/" — ochiq sahifa
│   ├── Atlas.tsx           "/atlas" — ilovaning asosiy sahifasi
│   ├── CountryHub.tsx      "/c/:slug" — bitta mamlakat sahifasi
│   ├── Locations.tsx       "/locations" — joylar va xizmatlar
│   ├── Chat.tsx            "/chat" — Verso AI
│   ├── Community.tsx       "/community" — sharhlar + maslahatlar
│   └── …
│
├── components/
│   ├── layout/             Masthead, BottomNav, MainLayout, TourRunner
│   ├── country/            CountryMap (SVG xarita), CompareTray, LocalTime
│   ├── chat/               VoiceTranslator, MessageContent (markdown)
│   ├── auth/               AuthModal, AuthForms, CountrySelect
│   ├── shared/             CommandPalette, ErrorBoundary, Flag, PriorityImg
│   └── ui/                 Toaster, Tour, Avatar, Portal, editorial primitivlar
│
├── data/                   Statik tahririy ma'lumotlar
│   ├── countries.ts        51 mamlakat
│   ├── countries.i18n.ts   Mamlakat nomlari 5 tilda
│   ├── tips.ts             24 maslahat
│   ├── tips.i18n.ts        Maslahatlar 5 tilda
│   └── index.ts            Lokatsiya, restoran, mehmonxona, gid, sharh
│
├── i18n/
│   ├── translations.ts     TypeScript sxemasi — 17 bo'lim, 566 kalit
│   ├── index.ts            useTranslation() hook, lazy yuklash
│   └── locales/            uz · ru · en · zh · de · fr
│
├── store/index.ts          Zustand — user, plan, lang, theme, tourSeen, toasts
├── hooks/                  useAuth, useBreakpoint, useDocumentTitle,
│                           useSpeechVoices, useSpotlight
└── lib/                    api-client (axios + JWT), utils, image, motion
```

### Backend papka tuzilmasi

```
backend/src/
├── server.ts               Express, middleware, rate limit, router mount
├── config/env.ts           Zod bilan muhit o'zgaruvchilarini tekshirish
├── lib/
│   ├── prisma.ts           Prisma client + withRetry (Neon uyg'otish)
│   └── mail.ts             Tasdiqlash kodi xatlari
├── middleware/
│   ├── auth.middleware.ts  authenticate / optionalAuth
│   ├── validate.ts         Zod bilan body tekshirish
│   └── error-handler.ts    Global xato ushlagich
└── modules/
    ├── ai/                 5 ta AI endpoint
    ├── auth/               Ro'yxat, email tasdiqlash, kirish, token
    ├── locations/          Joylar
    ├── reviews/            Sharhlar + AI trustScore
    ├── users/              Profil va saqlangan reja
    └── bookings/           Bron so'rovi
```

---

## 4. Sahifalar — har biri nima qiladi

| Marshrut | Fayl | Nima qiladi |
|---|---|---|
| `/` | `Landing.tsx` | Ochiq marketing sahifasi. Kirgan foydalanuvchi ham ko'ra oladi — sarlavha va tugmalar moslashadi. |
| `/atlas` | `Atlas.tsx` | **Ilovaning asosiy sahifasi.** 51 mamlakat, qit'a bo'yicha guruhlangan, qidiruv va filtrlar bilan. |
| `/c/:slug` | `CountryHub.tsx` | Bitta mamlakat: xarita, viza, valyuta, mavsum, mahalliy vaqt, favqulodda raqamlar. |
| `/locations` | `Locations.tsx` | Joylar, restoranlar, mehmonxonalar, gidlar — bitta sahifada, tab bilan. |
| `/locations/:id` | `LocationDetail.tsx` | Joy tafsiloti, sharhlar, AI tahlil tugmasi, rejaga qo'shish. |
| `/chat` | `Chat.tsx` | Verso AI suhbati + ovozli tarjimon. |
| `/community` | `Community.tsx` | Ikki tab: sayohatchi sharhlari va 24 ta amaliy maslahat. |
| `/saved` | `SavedPlaces.tsx` | Saqlangan joylar ro'yxati. |
| `/pro` | `Pro.tsx` | A'zolik sahifasi (to'lov hali ulanmagan — 14-bo'limga qarang). |
| `/profile` | `Profile.tsx` | Profil, til, mavzu, favqulodda raqamlar, reja. |
| `/login` `/signup` | `Auth.tsx` | Mustaqil kirish sahifalari (modal ham mavjud). |
| `/privacy` `/terms` | `Privacy.tsx` `Terms.tsx` | Huquqiy sahifalar — auth talab qilmaydi. |
| `/services/hotels/:id` | `HotelDetail.tsx` | Mehmonxona + bron so'rovi formasi. |
| `/services/restaurants/:id` | `RestaurantDetail.tsx` | Restoran tafsiloti. |

**Eski manzillar.** `/home` → `/atlas`, `/uzbekistan` → `/c/uzbekistan`, `/services` →
`/locations`. Eski havolalar 404 bermasligi uchun redirect qilingan.

---

## 5. Funksiyalar batafsil

### 5.1 Atlas va mamlakat sahifasi

**Kod:** `pages/Atlas.tsx`, `pages/CountryHub.tsx`, `components/country/`

Har bir mamlakat `data/countries.ts` da quyidagi maydonlar bilan tavsiflanadi:

```ts
{
  code, slug, name, continent, capital,
  currency, currencyName, languages, callingCode, flag,
  lat, lng,                      // xarita va masofa bo'yicha saralash uchun
  priceLevel, bestSeason, visaNote,
  tagline, summary,
  emergency,                     // tez yordam, o't o'chirish, politsiya
  featured                       // atlas boshidagi tanlangan qatorda chiqadi
}
```

**Xarita** (`CountryMap.tsx`) — `world-atlas` 50m TopoJSON dan SVG chizadi. Dastlab har
bir mamlakat uchun `d3-geo`ning `path.bounds()` chaqirilardi: 241 ta chegara × har biri
proyeksiya hisobi = **294 ms bloklash**. Hozir chegara to'rtburchagi oddiy arifmetika
bilan hisoblanadi (`lonLatBBox`) va `WeakMap` da keshlanadi, ko'rinmaydigan mamlakatlar
esa umuman chizilmaydi. Natija: Yaponiya sahifasi **651 ms → 107 ms** (production build,
4× CPU sekinlashtirish, 3 o'lchovning medianasi).

Antimeridian (Fiji, Chukotka kabi 180° dan o'tuvchi mamlakatlar) alohida ishlanadi —
ko'rinadigan oyna ikkiga bo'linadi, aks holda mamlakat butun dunyo kengligiga cho'ziladi.

**Taqqoslash** (`CompareTray.tsx`) — bir vaqtda 3 tagacha mamlakatni yonma-yon qo'yish.

**Mahalliy vaqt** (`LocalTime.tsx`) — `Intl.DateTimeFormat.formatToParts` orqali IANA
zonasidan hisoblanadi, daqiqa chegarasida yangilanadi (har soniyada emas).

### 5.2 Verso AI — suhbat yordamchisi

**Kod:** `pages/Chat.tsx` → `POST /api/ai/chat`
**Model:** Standard — Groq `openai/gpt-oss-20b`; Pro — Gemini `gemini-3.6-flash` (Groq `openai/gpt-oss-120b` zaxira sifatida)

Sahifadagi tugma bilan ikki rejim tanlanadi:

| Rejim | Model | Qachon |
|---|---|---|
| Tezkor | `gpt-oss-20b` | Qisqa savollar, narx, yo'nalish |
| Chuqur (Pro) | `gemini-3.6-flash`, zaxira: `gpt-oss-120b` | Marshrut tuzish, taqqoslash, uzun tahlil |

Model nomi mijozdan **kelmaydi** — mijoz faqat `"fast"` yoki `"deep"` yuboradi,
serverdagi `z.enum(["fast","deep"])` uni oq ro'yxat sifatida ishlatadi. Shu sababli
mijoz ixtiyoriy model nomini majburlay olmaydi.

**Til qoidasi.** Tizim prompti javob tilini interfeys tiliga bog'laydi, lekin
foydalanuvchi boshqa tilda yozsa — o'sha tilda javob beradi. Ilgari prompt o'zbekcha
yozilgani uchun model ba'zan nemis foydalanuvchiga o'zbekcha javob berardi; endi bu
qoida promptning eng yuqori ustuvorligi sifatida yozilgan.

**Kontekst:** oxirgi 14 ta xabar + foydalanuvchi ismi, mamlakati va saqlangan rejasi.

### 5.3 Ovozli tarjimon

**Kod:** `components/chat/VoiceTranslator.tsx`, `hooks/useSpeechVoices.ts`
**Server:** `POST /api/ai/translate`

Brauzerning Web Speech API'si ustiga qurilgan — **audio serverga yuborilmaydi**.
Mikrofon va ovoz chiqarish brauzerda, server faqat matnni tarjima qiladi.

**Ikki tomonlama suhbat rejimi.** Bitta emas, **ikkita mikrofon** — har til uchun
bittadan. Ikki kishi telefonni almashib gaplashganda har safar tillarni almashtirish
tugmasini bosish shart emas: qaysi mikrofon bosilsa, tarjima yo'nalishi o'shanga qarab
belgilanadi.

**Ovoz tanlash.** `speechSynthesis.getVoices()` sahifa yuklangan zahoti **bo'sh massiv**
qaytaradi — ro'yxat `voiceschanged` hodisasi bilan keyin keladi (o'lchandi: 0 → 19 ta
ovoz). Shu sababli ovozlar hook orqali kutiladi, keyin til uchun eng mos ovoz tanlanadi:
aniq lokal teg (`zh-CN`) → o'sha tilning boshqa varianti → hech nima. Lokal ovoz
masofaviydan afzal ko'riladi, chunki masofaviy ovoz internetsiz ishlamaydi.

**Ovozi yo'q tillar.** Bu brauzerda `uz-UZ` uchun **birorta ovoz yo'q**. Agar shunchaki
`utterance.lang = "uz-UZ"` qo'yilsa, brauzer o'zbekcha matnni **inglizcha ovozda**
o'qiydi. Shuning uchun ovoz topilmasa — tarjima ko'rsatiladi, sababi yoziladi va
eshittirish tugmasi umuman chiqarilmaydi.

**Xatolar.** Har bir nutq tanish xatosi alohida xabar oladi: mikrofon rad etildi,
til qo'llab-quvvatlanmaydi, hech narsa eshitilmadi, mikrofon band, tarmoq yo'q.

**Matn bilan kiritish** har doim mavjud — Firefox va Safari'da nutq tanish yo'q, lekin
tarjimon baribir ishlaydi.

**Qo'shimcha:** seans tarixi, nusxalash, eshittirish/to'xtatish, `aria-live` bilan
ekran o'quvchiga e'lon qilish.

### 5.4 SmartReview — sharh tahlili

**Kod:** `modules/reviews/`, `modules/ai/ai.service.ts` → `analyzeReview()`
**Endpoint:** `POST /api/ai/analyze-review`

Har bir yangi sharh saqlanishdan oldin model orqali o'tadi va uchta natija qaytaradi:

- `trustScore` (0–100) — ishonchlilik bali
- `aiTags` — mavzu teglari
- `verified` — 70 baldan yuqori bo'lsa

AI ishlamasa ilova to'xtamaydi: matn uzunligi va tuzilishiga asoslangan zaxira hisob
ishlaydi.

### 5.5 Tur rejasi generatori

**Kod:** `components/ui/GenerateButton.tsx` → `POST /api/ai/tour-plan`

To'rtta savol — necha kun, necha kishi, qaysi mamlakatlar, qancha byudjet — asosida
kun-kun jadval tuziladi. Saqlangan joylar reja ichiga qo'shiladi. **Auth talab qilinadi.**

### 5.6 Joy insayti

**Endpoint:** `POST /api/ai/analyze-reviews`

Lokatsiya sahifasidagi tugma bosilganda oxirgi sharhlardan qisqa, xolis xulosa
chiqaradi — kuchli va kuchsiz tomonlar ajratib beriladi.

### 5.7 Hamjamiyat va maslahatlar

**Kod:** `pages/Community.tsx`, `data/tips.ts`, `data/tips.i18n.ts`

Ikki tab: sayohatchi sharhlari va **24 ta amaliy maslahat**. Maslahatlar mamlakat va
kategoriya (xavfsizlik, pul, urf-odat, transport, taom) bo'yicha filtrlanadi va
**olti tilda to'liq tarjima qilingan** — sarlavha ham, matn ham.

### 5.8 Autentifikatsiya

**Kod:** `modules/auth/`, `components/auth/`

Oqim: **ro'yxatdan o'tish → emailga kod → tasdiqlash → kirish**.

| Token | Muddat | Qayerda |
|---|---|---|
| Access | 15 daqiqa | Xotirada, `Authorization: Bearer` |
| Refresh | 7 kun | HTTP-only cookie |

Parol `bcryptjs` bilan xeshlanadi. Access token tugasa, `lib/api-client.ts` dagi axios
interceptor avtomatik yangilaydi va so'rovni qayta yuboradi.

Parolni tiklash ham kod orqali: `forgot-password` → email → `reset-password`.

### 5.9 Buyruqlar paneli

**Kod:** `components/shared/CommandPalette.tsx` — `Ctrl/Cmd + K`

Mamlakat, joy va sahifalar bo'yicha tezkor qidiruv va o'tish.

### 5.10 Tanishtiruv turi

**Kod:** `components/ui/Tour.tsx`, `components/layout/TourRunner.tsx`

Birinchi tashrifda asosiy bo'limlarni ko'rsatadigan qadamli tanishtiruv. Ko'rilgani
store'da `tourSeen` sifatida saqlanadi (alohida `localStorage` kaliti emas — bu
farqni bilish testlarni yozganda muhim).

---

## 6. Backend API — to'liq ro'yxat

Barcha javoblar bir xil shaklda: `{ success: boolean, data?: T, message?: string }`.

### Auth — `/api/auth`

| Metod | Yo'l | Auth | Tavsif |
|---|---|---|---|
| POST | `/register` | — | Ro'yxatdan o'tish, emailga kod yuboriladi |
| POST | `/verify-email` | — | Kod bilan emailni tasdiqlash |
| POST | `/resend-code` | — | Kodni qayta yuborish |
| POST | `/login` | — | Kirish |
| POST | `/forgot-password` | — | Parol tiklash kodini yuborish |
| POST | `/reset-password` | — | Yangi parol o'rnatish |
| POST | `/refresh` | cookie | Access tokenni yangilash |
| DELETE | `/logout` | — | Refresh tokenni bekor qilish |
| GET | `/me` | ✅ | Joriy foydalanuvchi |

### AI — `/api/ai`

| Metod | Yo'l | Auth | Tavsif |
|---|---|---|---|
| POST | `/chat` | ixtiyoriy | Suhbat. Body: `messages[]`, `userContext`, `model: "fast" \| "deep"` |
| POST | `/translate` | ixtiyoriy | Matn tarjimasi. Body: `text`, `from`, `to` |
| POST | `/analyze-review` | ixtiyoriy | Bitta sharh → `trustScore`, `aiTags` |
| POST | `/analyze-reviews` | ixtiyoriy | Lokatsiya sharhlaridan xulosa |
| POST | `/tour-plan` | ✅ | Kun-kun tur rejasi |

### Joylar — `/api/locations`

| Metod | Yo'l | Auth | Tavsif |
|---|---|---|---|
| GET | `/` | — | Ro'yxat. Query: `category`, `city`, `search` |
| GET | `/featured` | — | Tanlangan joylar |
| GET | `/:id` | — | Tafsilot |

### Sharhlar — `/api/reviews`

| Metod | Yo'l | Auth | Tavsif |
|---|---|---|---|
| GET | `/:locationId` | — | Joy sharhlari |
| GET | `/:locationId/stats` | — | O'rtacha ball va taqsimot |
| POST | `/` | ixtiyoriy | Yangi sharh — AI tahlil avtomatik ishga tushadi |
| DELETE | `/:id` | ✅ | O'chirish (faqat muallif) |

### Foydalanuvchi — `/api/users`

| Metod | Yo'l | Auth | Tavsif |
|---|---|---|---|
| PATCH | `/me` | ✅ | Profilni yangilash |
| GET | `/me/plan` | ✅ | Saqlangan reja |
| POST | `/me/plan` | ✅ | Rejaga joy qo'shish |
| DELETE | `/me/plan/:locationId` | ✅ | Rejadan olib tashlash |

### Bron — `/api/bookings`

| Metod | Yo'l | Auth | Tavsif |
|---|---|---|---|
| POST | `/` | ixtiyoriy | Bron **so'rovi** (to'lov emas — 14-bo'limga qarang) |
| GET | `/me` | ✅ | O'z so'rovlarim |

### So'rov cheklovlari

| Qamrov | Chegara |
|---|---|
| Barcha `/api` | 100 so'rov / 15 daqiqa |
| `/api/ai/*` | 20 so'rov / 1 daqiqa |
| Email yuboradigan yo'llar | 5 so'rov / 15 daqiqa |

---

## 7. Ma'lumotlar bazasi

PostgreSQL (Neon), Prisma ORM. Sxema: `backend/prisma/schema.prisma`.

| Model | Vazifasi |
|---|---|
| `User` | Hisob, parol xeshi, til, mamlakat, email tasdig'i |
| `VerificationCode` | Email tasdiqlash va parol tiklash kodlari (`CodePurpose` enum) |
| `Location` | Joylar (`Category` enum bilan) |
| `Review` | Sharhlar, `trustScore` va `aiTags` bilan |
| `UserPlan` | Foydalanuvchi ↔ joy bog'lanishi |
| `BookingRequest` | Mehmonxona bron so'rovi |

Jadvallarni yaratish:

```bash
cd backend
npx prisma db push        # tez, migratsiya fayllarisiz
# yoki
npx prisma migrate dev    # migratsiya tarixi bilan
npx prisma studio         # brauzerda ko'rish
```

---

## 8. Statik ma'lumotlar to'plami

Bular bundle ichida keladi, bazada emas:

| Fayl | Miqdor | Nima |
|---|---|---|
| `data/countries.ts` | 51 | Mamlakatlar, har biri ~20 maydon |
| `data/countries.i18n.ts` | 51 × 5 til | Mamlakat va poytaxt nomlari |
| `data/tips.ts` | 24 | Amaliy maslahatlar |
| `data/tips.i18n.ts` | 24 × 5 til | Maslahatlar tarjimasi |
| `data/index.ts` | 12 joy, 4 restoran, 4 mehmonxona, 4 gid, 18 sharh | Namuna katalog |
| `data/emergency-numbers.ts` | 5 | O'zbekiston favqulodda raqamlari |

**i18n fayllarida ingliz tili yo'q** — u asosiy ma'lumotlar to'plamining o'zida. Kalit
topilmasa ingliz tiliga qaytadi, shuning uchun tarjima to'liq bo'lmasa ham hech qachon
bo'sh joy chiqmaydi.

---

## 9. Ko'p tillilik qanday ishlaydi

**Kod:** `i18n/translations.ts` (sxema), `i18n/index.ts` (hook), `i18n/locales/*.ts`

```ts
const { t, lang } = useTranslation();
t("nav", "atlas");                          // → "Atlas" / "Атлас" / "地图集"
t("voice", "speak_in", { lang: "Русский" }); // → "Говорите на Русский"
```

- **566 ta kalit × 6 til**, 17 ta bo'limga ajratilgan (`nav`, `atlas`, `voice`, `chat`, …)
- `TranslationSchema` — TypeScript interfeysi. Kalit qo'shsangiz va biror tilda unutsangiz,
  `tsc` xato beradi. Tarjimalar jimgina tushib qolmaydi.
- Har bir til **alohida chunk** sifatida lazy yuklanadi — bitta 115 KB modul o'rniga.
- Tanlangan til Zustand `persist` orqali saqlanadi.

**Muhim tafovut.** Interfeys matni (tugmalar, sarlavhalar) va **kontent** (mamlakat nomi,
maslahat matni) alohida joylarda. Ilgari kontent faqat inglizcha edi va bu "til
almashmayapti" degan xato taassurot berardi — aslida interfeys to'liq tarjima qilingan
edi, lekin sahifadagi matnning ko'pi kontent edi. Hozir mamlakat nomlari va maslahatlar
ham tarjima qilingan.

---

## 10. Dizayn tizimi

**Kod:** `frontend/src/index.css`, `tailwind.config.js`

Uslub — **jurnal**, dashboard emas: seriflik sarlavhalar, ingichka chiziqlar, katta
rasmlar, kam rang.

| Element | Qiymat |
|---|---|
| Sarlavha shrifti | **Literata** (o'zgaruvchan serif, `opsz` 7–72) |
| Matn shrifti | **Inter** (o'zgaruvchan, 300–700) |
| Asosiy rang | Amber oltin `#E0A94E` |
| Fon (qorong'i) | `#0C0A09` |
| Mavzu | Qorong'i va yorug' — `<html>` dagi bitta klass |

**Shriftlar o'zgaruvchan (variable) holda so'raladi** — `wght@300..700`, ro'yxat bilan
emas (`300;400;500;…`). Bu farq muhim: ro'yxat bilan so'ralsa Google **statik**
instansiyalar yuboradi va ularda `opsz` o'qi umuman bo'lmaydi, ya'ni optik o'lcham
ishlamaydi va 21px sarlavhaga 72px plakat kesimi tushadi. Oraliq bilan so'ralganda
bitta haqiqiy o'zgaruvchan fayl keladi — va bu **kamroq** joy oladi: inglizcha sahifa
3 ta statik fayl (201.7 KB) o'rniga 2 ta o'zgaruvchan fayl (154.6 KB) yuklaydi.

### Kaskad tuzog'i — bilib qo'ying

`index.css` dagi komponent klasslari `@tailwind utilities` dan **keyin** e'lon qilingan.
Demak bir xil aniqlikdagi Tailwind utilitasi ular bilan to'qnashsa — **yutqazadi**:

```css
/* ❌ Bu .plate ustidagi har qanday text-* klassini yengib ketadi */
.kicker { color: var(--muted-foreground); }

/* ✅ Nol aniqlik — utilita yutadi */
:where(.kicker) { color: var(--muted-foreground); }
```

Bu tuzoq `.plate`, `.figure`, `.tap-44` va `.kicker` da to'rt marta yuz bergan. Yangi
komponent klassi yozsangiz va uni JSX dan utilita bilan bekor qilmoqchi bo'lsangiz —
`:where()` ishlating.

**Tailwind shaffoflik shkalasi** ham tuzoq: `text-[#F2EADC]/72` **hech qanday klass
chiqarmaydi**, chunki 72 shkalada yo'q (…70, 75, 80…). Natijada element rangsiz qoladi.

---

## 11. Muhim texnik qarorlar

### Neon avtomatik to'xtashi

Neon bepul tier faolsizlikdan keyin bazani uyquga qo'yadi va birinchi so'rov xato beradi:

```
Can't reach database server at ep-*.neon.tech:5432
```

Yechim — `backend/src/lib/prisma.ts` dagi `withRetry`: 3 urinish, ortib boruvchi
kechikish (2s → 4s → 6s), `P1001/P1002/P1008/P1017` kodlari va tarmoq xatolarini
ushlaydi. `DATABASE_URL` ga `connect_timeout=30` qo'shilgan.

### Hero rasmni oldindan yuklash

`vite.config.ts` dagi `preloadHero()` plagini build paytida hero rasmning hash nomini
`ctx.bundle` dan o'qib, `index.html` ga `<link rel="preload">` qo'shadi.
LCP: `/` uchun **3164 → 2112 ms**, `/atlas` uchun **3112 → 2344 ms**. Evaziga hero
ishlatmaydigan sahifalarga +132 KB tushadi.

### Chunk yuklash xatosi

`React.lazy` rad etilgan promise'ni **keshlaydi**. Deploy paytida eski chunk yo'qolsa,
ErrorBoundary'ni "tozalash" xatoni qayta o'ynatadi — faqat sahifani qayta yuklash
yordam beradi. `ErrorBoundary.tsx` shuni aniqlaydi (`isChunkLoadError`) va internet
qaytganda avtomatik qayta yuklaydi.

### `.grain-overlay` va z-index

`.grain-overlay { isolation: isolate }` yangi stacking context yaratadi. Shu sababli
uning ichida chizilgan `z-[100]` overlay sahifadan yuqoriga chiqa olmaydi.
`components/ui/Portal.tsx` shundan qutulish uchun — modal va tray'lar `document.body`
ga portal qilinadi.

### Vite proxy

Dev rejimda frontend `localhost:3000` da, backend `localhost:5000` da. `/api` so'rovlari
proxy orqali uzatiladi — CORS muammosi ham, alohida env o'zgaruvchisi ham kerak emas.

---

## 12. Muhit o'zgaruvchilari

**`backend/.env`**

```env
# Majburiy
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require&connect_timeout=30"
JWT_SECRET="kamida-32-belgi"
JWT_REFRESH_SECRET="kamida-32-belgi-boshqa"
GROQ_API_KEY="gsk_..."

# Ixtiyoriy — standart qiymatlari bor
NODE_ENV=development
PORT=5000
DIRECT_URL=                       # Prisma migratsiya uchun (Neon pooler bilan)
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000

# Pro rejimi uchun Gemini (bo'lmasa Pro ham Groq'da ishlaydi)
GEMINI_API_KEY=
GEMINI_RPM_LIMIT=5                # bepul tarif kvotasidan oshmaslik uchun
GEMINI_RPD_LIMIT=15

# Email (tasdiqlash kodlari) — bo'lmasa ro'yxatdan o'tish kodi yuborilmaydi
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
BREVO_API_KEY=
```

`config/env.ts` ularni Zod bilan tekshiradi — majburiy o'zgaruvchi yo'q bo'lsa server
tushunarli xato bilan **darhol** to'xtaydi, yarim ishlagan holatda qolmaydi.

**`frontend/.env`** — dev uchun kerak emas (proxy ishlaydi). Production'da:

```env
VITE_API_URL=https://sizning-backend.example.com/api
```

---

## 13. Skriptlar

**Frontend** (`frontend/`)

```bash
npm run dev       # Vite dev server → localhost:3000
npm run build     # tsc && vite build → dist/
npm run preview   # build natijasini tekshirish
```

**Backend** (`backend/`)

```bash
npm run dev         # ts-node-dev, hot reload
npm run build       # tsc && tsc-alias && prisma generate → dist/
npm run start       # node dist/server.js
npm run db:push     # sxemani bazaga yozish
npm run db:migrate  # migratsiya yaratish
npm run db:studio   # Prisma Studio
npm run db:seed     # namuna ma'lumot
npm run lint
npm run format
```

---

## 14. Hozircha mavjud bo'lmagan narsalar

Bu ro'yxat ataylab bor: mahsulotni baholayotgan odam nimani kutmaslik kerakligini
bilishi kerak.

| Narsa | Holat |
|---|---|
| **To'lov** | Ulanmagan. `/pro` sahifasidagi tugma "billing goes live" xabarini ko'rsatadi. |
| **Bron qilish** | `POST /api/bookings` — bu **so'rov** formasi, tasdiqlangan rezervatsiya emas. Band-bo'shligi tekshirilmaydi; odam telefon orqali bog'lanadi. |
| **Transport buyurtmasi** | Yo'q. |
| **Offline xarita** | Yo'q. Atlas ma'lumotlari bundle ichida bo'lgani uchun internetsiz ochiladi, lekin haqiqiy offline xarita mavjud emas. |
| **AR navigatsiya** | Yo'q — reja bosqichida. |
| **O'zbekcha nutq tanish/ovoz** | Brauzerlarda `uz-UZ` uchun na nutq tanish, na ovoz mavjud. Tarjimon buni aniqlaydi va matn bilan ishlashni taklif qiladi. |
| **Huquqiy matnlar** | `Privacy.tsx` va `Terms.tsx` da qo'llab-quvvatlash emaili va tegishli qonunchilik uchun to'ldirilmagan joylar bor. |
| **Avtomatlashtirilgan testlar** | Test to'plami yo'q. Tekshiruv `tsc`, `vite build` va brauzerda qo'lda/CDP orqali o'tkaziladi. |

---

## Litsenziya

MIT © 2026 Verso — *`LICENSE` fayli hali repozitoriyga qo'shilmagan.*

<div align="center">
  <sub>Dunyo — tartib bilan.</sub>
</div>
