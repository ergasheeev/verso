# Verso Dataset — Qoidalar

Bu hujjatni bir marta o'qing va ishlayotganda unga qaytib keling.

---

## 1. Ohang Qoidalari

### Yozish kerak
- Aniq, tahririy, kuzatuvchi ton
- Aniq joy nomlari: "Kyoto's canal districts" ✅
- Aniq paytlar: "March–May (cherry blossom)" ✅
- Aniq narxlar: "¥1,000 (atigi $6.50)" ✅

### Yozmaslik kerak
- Reklama tili: "Ajoyib manzillar sizni kutmoqda!" ❌
- Wikipedia ensiklopediyasi: "Yaponiya — Sharqiy Osiyo davlati..." ❌
- Manbasisiz reyting: "4.8 yulduz" (qayerdan?) ❌
- Umumiy gap: "Ko'p narsalar bor ko'rish uchun" ❌

---

## 2. Maydon Formatlari

### summary (400–600 belgi)
```
Birinchi gap — mamlakatning asosiy xarakteri.
Ikkinchi-uchinchi gap — aniq joylar, mintaqalar nomi bilan.
Oxirgi gap — nimaga e'tibor berish kerak / qachon borish ideal.
```

### tagline (30–60 belgi)
```
Nuqta bilan tugaydi.
Slogan emas — kuzatuv yoki paradoks.
Yaxshi: "Precision as a form of hospitality."
Yomon: "Discover the land of cherry blossoms!"
```

### bestSeason
```
Format: "Oy–Oy (sabab), Oy–Oy (sabab)"
Misol: "March–May (cherry blossom), October–November (maples)"
Faqat oy emas — sababi majburiy.
```

### visaNote (50–120 belgi)
```
Qaysi pasport ekani aniq ko'rsating.
Format: "O'zbekiston pasporti: e-viza, 30 kun. EU pasporti: vizasiz 90 kun."
"Ko'p mamlakatlar uchun vizasiz" — qabul qilinmaydi.
visaCheckedOn: "2026-09" — har doim qo'shing.
```

### priceUSD
```
Raqam (number), string emas.
0 → bepul
5 → $5
Taxminiy bo'lsa ham yozing — bo'sh qoldirmang.
```

### hours
```
"09:00–18:00" yoki "24/7" yoki "Seshanba yopiq, 10:00–17:00"
Bo'sh qoldirmang — AI bu yerdan xato qiladi.
```

---

## 3. Joy Tanlash Qoidalari

Har mamlakatdan 5 ta minimum, shu tarkibda:
1. **Mashhur** — hamma biladigan (Kolizey, Fushimi Inari)
2. **Ikkinchi qator** × 2 — birinchisini ko'rgan odam uchun
3. **Tabiat** — faqat binolardan iborat ro'yxat zerikarli
4. **Mahalliy hayot** — bozor, hammom, kechki ko'cha

**Tanlamang:**
- Kirish taqiqlangan joylar
- Faqat ekskursiya bilan kiriladigan joylar
- Mavsumiy yopiq (buni `hours` da ko'rsating)

---

## 4. Rasm Qoidalari

### Qabul qilinadi
- Gorizontal (landscape) fotosurat
- Manba: Unsplash · Pexels · Wikimedia Commons
- Litsenziya: CC0 · CC BY 4.0 · CC BY-SA 4.0

### Qabul qilinmaydi
- Vertikal rasm
- Kollaj, logotip, karta skrinshoti
- Litsenziyasi noaniq
- Google Images (manba emas)
- Noto'g'ri joy suratlari (Tojmahal → Bibixonim o'rnida ❌)

### Nomlash
```
Mamlakat: uz.jpg, jp.jpg, it.jpg (kichik harf, ISO kodi)
Joy: uz-registan.jpg, jp-fushimi-inari.jpg (iso-joy-nomi)
Faqat lotin harflar, kichik, chiziqcha ajratgich
```

### Hajm
```
Mamlakat: 1920 × 1080 px (minimum 1280 × 720)
Joy:      1200 × 800 px  (minimum 900 × 600)
```

### credits.csv
Har rasm uchun **majburiy** to'ldiring:
```
file, source, license, author, sourceUrl, date
```
Litsenziyasi yozilmagan rasm qabul qilinmaydi.

---

## 5. Tarjima Qoidalari

- Joy nomlari tarjima qilinmaydi, faqat yozuv: Kyoto → Киото → 京都
- O'zbekcha: apostrof harf (ko'p, so'm) — tipografik ' emas
- Fransuzcha elizya: l'arrivée (apostrof bilan)
- Nemischa qo'shtirnoq: „ "
- Avval inglizcha matnni yakunlang, keyin tarjima qiling

---

## 6. Validatsiya

`scripts/validate.ts` quyidagilarni tekshiradi:
- summary: 400–600 belgi
- tagline: 30–60 belgi, nuqta bilan tugaydi
- visaCheckedOn: YYYY-MM formati
- priceUSD: raqam (string emas)
- id: kichik harf, chiziqcha, dublikat yo'q
- Rasm: credits.csv da mavjud
