# Verso — Loyiha haqida qisqacha

**51 ta mamlakat bo'yicha tahrirlangan sayohat atlasi.** Har bir mamlakat uchun viza sharti,
valyuta, eng yaxshi mavsum va favqulodda raqamlar; ustiga sun'iy intellekt yordamchisi
**Verso AI**, ikki tomonlama ovozli tarjimon va ishonch bali bilan filtrlangan sharhlar.
Interfeys olti tilda.

## Texnologik stek

| Qatlam           | Texnologiya                                                                 |
| ---------------- | --------------------------------------------------------------------------- |
| Frontend         | React 18.3 + TypeScript 5.7 + Vite 6.1, Tailwind CSS 3.4, Framer Motion, Zustand |
| Xarita           | d3-geo + topojson-client + world-atlas (SVG, mijoz tomonida)                |
| Backend          | Express 4.21 + TypeScript, Prisma 6.1                                       |
| Baza             | PostgreSQL (Neon, serverless)                                               |
| Sun'iy intellekt | Groq API (`openai/gpt-oss-20b`) va Gemini API (`gemini-3.6-flash`, Pro)       |
| Autentifikatsiya | JWT — access 15 daqiqa + refresh 7 kun (httpOnly cookie), email tasdig'i bilan |
| Deploy           | Frontend — Vercel, Backend — Render, Baza — Neon                            |

## Asosiy funksionallik

- **Atlas** — 51 mamlakat, qit'a bo'yicha guruhlangan; har biri uchun viza, valyuta, til,
  mavsum, favqulodda raqam, SVG xarita, mahalliy vaqt va 3 tagacha mamlakatni taqqoslash
- **Verso AI** — ko'p tilli suhbat, ikki model rejimi (tezkor / chuqur), 4 savol asosida
  kun-kun tur rejasi, Markdown formatida render
- **Ovozli tarjimon** — 6 tilda ikki tomonlama; ikkita mikrofon (har til uchun bittadan),
  audio brauzerdan chiqmaydi, server faqat matnni tarjima qiladi
- **SmartReview** — har bir sharh AI orqali ishonchlilik balli (`trustScore`) va mavzu
  teglari bilan tahlil qilinadi; lokatsiya bo'yicha AI-xulosa generatsiyasi
- **Joylar va xizmatlar** — 12 lokatsiya, restoran, mehmonxona, gid; bron **so'rovi** formasi
- **Hamjamiyat** — sayohatchi sharhlari va 24 ta amaliy maslahat, oltala tilda
- **Shaxsiy reja** — mehmon va kirgan foydalanuvchi uchun ishlaydi, login qilinganda
  qurilmalar orasida sinxronlanadi
- **6 tillilik** — o'zbek, rus, ingliz, xitoy, nemis, fransuz; 566 ta kalit, har bir til
  alohida chunk sifatida lazy yuklanadi
- **Global qidiruv** — Ctrl+K buyruq paneli
- **To'liq responsiv** — mobil pastki navigatsiya, desktop masthead

## Loyiha tuzilmasi

```
verso/
├── frontend/   React SPA — 15 sahifa, komponentlar, i18n, Zustand store, statik atlas
└── backend/    Express API — auth, joylar, sharhlar, AI, foydalanuvchilar, bronlar
```

## Dizayn tili

Jurnal uslubi, dashboard emas. Yagona aksent — **Amber Gold `#E0A94E`**, fon esa iliq
qora **`#0C0A09`** (yorug' mavzu ham bor, `<html>` dagi bitta klass bilan almashadi).
Sarlavhalar **Literata** o'zgaruvchan seriflik shriftida, optik o'lcham o'qi keglga
qarab avtomatik moslashadi; matn **Inter** da. Chiziqlar hairline, rasmlar katta, rang
kam. Animatsiyalar holatga bog'liq — dekorativ emas.

## Ishonchlilik va barqarorlik

- Serverless baza (Neon) uyg'onishi uchun avtomatik qayta urinish (`withRetry`, 3 urinish)
- Chunk yuklash xatosini aniqlash va internet qaytganda avtomatik qayta yuklash
- Cross-origin (Vercel ↔ Render) uchun sozlangan CORS va cookie'lar
- So'rov cheklovlari: umumiy 100/15daq, AI 20/daq, email 5/15daq
- Muhit o'zgaruvchilari Zod bilan tekshiriladi — noto'g'ri sozlamada server darhol to'xtaydi
- Barcha asosiy oqimlar uchun aniq, tarjima qilingan xato xabarlari

---

_To'liq texnik hujjat, API endpointlar ro'yxati, funksiyalarning batafsil tavsifi va ishga
tushirish yo'riqnomasi uchun [README.md](README.md) ga qarang._
