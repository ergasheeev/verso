/**
 * Verso AI knowledge base — the verified Uzbekistan catalogue.
 *
 * Injected into the AI system prompt so the assistant gives accurate,
 * specific answers about locations, prices, hours and services.
 *
 * It is NOT sent whole any more. Groq's free tier allows 8,000 tokens per
 * minute and the upstream call was coming back
 * `413 Request too large … Limit 8000, Requested 8481` — one question could
 * not fit inside a whole minute's budget, which is why an Uzbekistan answer
 * took 25 seconds and then failed. `selectKnowledge()` below sends only the
 * sections a question can actually use.
 */

export const KNOWLEDGE_BASE = `
## Verso — TO'LIQ MA'LUMOTLAR BAZASI
Eslatma: Bu ma'lumotlar haqiqiy va dolzarb. Savollarda aniq narx,
vaqt va joylarni so'rashsa, shu ma'lumotlardan foydalangin.

════════════════════════════════════════════════════════
🏛️  TURISTIK JOYLAR (8 ta)
════════════════════════════════════════════════════════

① REGISTON — Samarqand
   🏷️ Kategoriya: Tarix | UNESCO Jahon Merosi
   ⭐ Reyting: 4.9/5 (3 841 ta sharh)
   🕐 Ish vaqti: 08:00–20:00 (yoz) | 09:00–18:00 (qish)
   💵 Kirish: 50 000 so'm (~$4)
   ⏱️ Tavsiya etilgan vaqt: 2–3 soat
   🚌 Transport: Markazdan taksi yoki №38 avtobus — 10 daqiqa
   🗓️ Eng yaxshi mavsum: Aprel–Iyun, Sentabr–Oktyabr
   🏷️ Teglar: UNESCO, Arxitektura, Madrasa, Ipak yo'li
   📝 Tavsif: Markaziy Osiyoning eng go'zal me'moriy ansamblı. Ulug'bek (1420),
      Sher Dor (1636) va Tillakori (1660) madrasalari. Kechki yoritilish shou
      (qo'shimcha narx) ajoyib. Ertalab 8–10 da turistlar kam.
   💡 Maslahat: Ertalab boring, kechqurun shou bor, fotosuratga 17:00–19:00 ideal.

② ICHAN-QAL'A — Xiva
   🏷️ Kategoriya: Tarix | UNESCO Jahon Merosi
   ⭐ Reyting: 4.8/5 (2 156 ta sharh)
   🕐 Ish vaqti: 24/7 (muzeylar 09:00–18:00)
   💵 Kirish: 75 000 so'm (~$6, kompleks bilet — barcha muzeylar)
   ⏱️ Tavsiya etilgan vaqt: Butun kun (6–8 soat)
   🚌 Transport: Urganchdan taksi — 35 daqiqa | Toshkentdan parvoz
   🗓️ Eng yaxshi mavsum: Mart–May, Sentabr–Noyabr (yozda +45°C!)
   🏷️ Teglar: UNESCO, Shahar-muzey, Qal'a, Xorazm
   📝 Tavsif: 2,2 km devorlar bilan o'ralgan tirik muzey shahar. 60+ tarixiy obida:
      Islam Xo'ja minorasi, Kalta Minor, Juma masjidi. 1990-da UNESCO ro'yxatiga kirgan.
   💡 Maslahat: Bir kundan kam vaqt sarflamang. Yozda erta tong (6–9) va kech kechqurun boring.

③ ARK QAL'ASI — Buxoro
   🏷️ Kategoriya: Tarix
   ⭐ Reyting: 4.7/5 (1 893 ta sharh)
   🕐 Ish vaqti: 09:00–17:00 (dushanba — dam olish kuni)
   💵 Kirish: 40 000 so'm (~$3)
   ⏱️ Tavsiya etilgan vaqt: 1.5–2 soat
   🚌 Transport: Buxoro markazidan piyoda 10 daqiqa
   🗓️ Eng yaxshi mavsum: Mart–May, Sentabr–Noyabr
   🏷️ Teglar: Qal'a, Saroy, Ipak yo'li, Buxoro amiri
   📝 Tavsif: 2500 yillik qal'a, 20 gektardan ortiq maydon. Amirlari saroyi, masjid,
      zindon. 1920-da yong'in bo'lgan, restoratsiya davom etmoqda.
   💡 Maslahat: Dushanbaga bormang (yopiq). Muzey eksozitsiyasi inglizcha izohli.

④ CHIMGAN TOG'LARI — Toshkent viloyati
   🏷️ Kategoriya: Tabiat | Tog' turizmi
   ⭐ Reyting: 4.6/5 (2 740 ta sharh)
   🕐 Ish vaqti: 24/7
   💵 Kirish: Bepul | Kanatli yo'l: 60 000 so'm (~$5)
   ⏱️ Tavsiya etilgan vaqt: 1–3 kun
   🚌 Transport: Toshkentdan avtobus yoki taksi — 1.5 soat (~80 km)
   🗓️ Eng yaxshi mavsum: Dekabr–Mart (ski) | Iyun–Avgust (treking)
   🏷️ Teglar: Tog', Ski, Yurish, Tabiat, Amirsoy, Beldersoy
   📝 Tavsif: Tyan-Shan tog' tizmasida 3309m balandlik. Yozda Charvak suv ombori,
      qishda Amirsoy ski kurortu. Kanatli yo'l, treking marshrurtlari.
   💡 Maslahat: Hafta oxirida juda gavjum. Chorshanba-payshanba borishni maslahat beraman.

⑤ GURI AMIR MAQBARASI — Samarqand
   🏷️ Kategoriya: Din | Me'morchilik
   ⭐ Reyting: 4.8/5 (2 312 ta sharh)
   🕐 Ish vaqti: 08:00–19:00
   💵 Kirish: 30 000 so'm (~$2)
   ⏱️ Tavsiya etilgan vaqt: 1 soat
   🚌 Transport: Registon maydonidan 10 daqiqa piyoda
   🗓️ Eng yaxshi mavsum: Yil bo'yi
   🏷️ Teglar: Maqbara, Temur, Gumbaz, Ziyoratgoh
   📝 Tavsif: Amir Temur, Ulug'bek va Temuriylar sulolasi maqbarasi (1403–1404).
      Ko'k piyozsimon gumbaz — Samarqand ramzi. Ichkisi oltin naqsh va lojuvard kashtalar.
   💡 Maslahat: Kechqurun 17:00–19:00 fotosurat uchun ideal yorug'lik.

⑥ CHORSU BOZORI — Toshkent
   🏷️ Kategoriya: Madaniyat | Bozor
   ⭐ Reyting: 4.5/5 (4 120 ta sharh)
   🕐 Ish vaqti: 07:00–19:00 (yakshanba — eng gavjum)
   💵 Kirish: Bepul
   ⏱️ Tavsiya etilgan vaqt: 1–2 soat
   🚌 Transport: Metro "Chorsu" bekatidan 2 daqiqa piyoda
   🗓️ Eng yaxshi mavsum: Yil bo'yi (yoz eng yaxshi)
   🏷️ Teglar: Bozor, Milliy taomlar, Ziravorlar, Hunarmandchilik
   📝 Tavsif: 2000 yillik an'anaviy bozor, 1000+ savdo nuqtasi. Ko'k gumbaz ostida
      ziravorlar, quruq mevalar, ipak, kulolchilik. Narx ustida kelishish mumkin.
   💡 Maslahat: Ertalab 8–10 da yangi non, somsa. Sotuvchilar bilan narx kelishiladi.

⑦ SHOH-I ZINDA — Samarqand
   🏷️ Kategoriya: Din | UNESCO
   ⭐ Reyting: 4.9/5 (1 987 ta sharh)
   🕐 Ish vaqti: 08:00–19:00
   💵 Kirish: 25 000 so'm (~$2)
   ⏱️ Tavsiya etilgan vaqt: 1–1.5 soat
   🚌 Transport: Registon maydonidan taksi yoki piyoda 20 daqiqa
   🗓️ Eng yaxshi mavsum: Aprel–Iyun, Sentabr–Oktyabr
   🏷️ Teglar: Ziyoratgoh, Maqbara, Mozaika, UNESCO
   📝 Tavsif: 11 ta maqbara (XI–XV asr), Qusam ibn Abbos dafn etilgan ziyoratgoh.
      Ko'k, feruza, oltin rangdagi noyob mozaikalar — dunyoda tengi yo'q.
   💡 Maslahat: Tushdan keyin boring — yorug'lik mozaikalarni yanada go'zal ko'rsatadi.

⑧ LYABI HOVUZ — Buxoro
   🏷️ Kategoriya: Madaniyat | Tarix
   ⭐ Reyting: 4.6/5 (1 543 ta sharh)
   🕐 Ish vaqti: 24/7
   💵 Kirish: Bepul (restoranlar alohida)
   ⏱️ Tavsiya etilgan vaqt: 1–3 soat
   🚌 Transport: Ark qal'asidan piyoda 10 daqiqa
   🗓️ Eng yaxshi mavsum: Aprel–Oktyabr
   🏷️ Teglar: Havuz, Choyxona, Milliy muhit, Tungi hayot
   📝 Tavsif: XVII asr ansambli — Nadir Devonbegi xonaqosi va madrasalari.
      360 yillik chinor daraxtlari, Xo'ja Nasriddin haykalchasi. Kechki hayot jonli.
   💡 Maslahat: Kechqurun 20:00 da milliy musiqa va taom uchun ideal. Yon ko'cha
      oshxonalari arzonroq (turistik narxlardan qoching).

════════════════════════════════════════════════════════
🍽️  RESTORANLAR (4 ta)
════════════════════════════════════════════════════════

① SAMARQAND DARVOZA — Samarqand
   📍 Registon ko'chasi 12  |  🕐 10:00–23:00
   ⭐ 4.7 | 💰 O'rtacha (₩₩) | 🍴 O'zbek milliy taomlar
   Menyu:
   • Osh (Plov) — 35 000 so'm ($2.7) — qo'y go'shti, Samarqand uslubi
   • Shashlik — 45 000 so'm ($3.5) — tandirda pishirilgan qo'y go'shti
   • Lag'mon — 28 000 so'm ($2.2) — qo'lda tortilgan uy qo'shimchali sho'rva
   • Manti — 22 000 so'm ($1.7) — bug'da pishirilgan go'shtli xamir
   💡 Registon yaqinida, sayohatdan so'ng ideal.

② BUXORO OSHXONASI — Buxoro
   📍 Lyabi Hovuz maydoni 3  |  🕐 09:00–22:00
   ⭐ 4.8 | 💰 Premium (₩₩₩) | 🍴 Buxoro an'anaviy taomlar
   Menyu:
   • Dimlama — 40 000 so'm ($3.1) — sabzavot va go'sht dimlab pishirilgan
   • Somsa — 8 000 so'm ($0.6) — tandirda pishirilgan go'shtli pirozhki
   • Qo'zi go'sht sho'rva — 32 000 so'm ($2.5) — qo'zi go'shti bilan
   • Qovurilgan baliq — 55 000 so'm ($4.3) — Amudaryo baliqlari (zander)
   💡 Lyabi Hovuz ko'rinishi bor, Buxorodagi eng yaxshi ovqat joyi.

③ CHORSU TAOMI — Toshkent
   📍 Chorsu bozori yonida, 5-blok  |  🕐 08:00–21:00
   ⭐ 4.5 | 💰 Arzon (₩) | 🍴 O'zbek-Osiyo fusion
   Menyu:
   • Non tandirdan — 5 000 so'm ($0.4) — yangi pishirilgan patir non
   • Mastava — 25 000 so'm ($2.0) — guruchli milliy sho'rva
   • Qozon kebab — 50 000 so'm ($3.9) — qozonda go'sht va kartoshka
   • Chuchvara — 20 000 so'm ($1.6) — kichik go'shtli pelmenlar sho'rvada
   💡 Toshkentning eng arzon va haqiqiy milliy taom joyi.

④ XIVA MEHMONXONA RESTAURANT — Xiva
   📍 Ichan-Qal'a, Palvon Darvoza ko'chasi 8  |  🕐 07:30–22:30
   ⭐ 4.6 | 💰 O'rtacha (₩₩) | 🍴 Xorazm milliy taomlar
   Menyu:
   • Xorazm oshi — 38 000 so'm ($3.0) — Xorazm uslubi qo'y go'shtli plov
   • Qovoq sho'rva — 22 000 so'm ($1.7) — qovoq va sabzavot sho'rva
   • Chelpak — 12 000 so'm ($0.9) — moyda qovurilgan xamir (Xorazm non)
   • Tabiiy qatiq — 10 000 so'm ($0.8) — uy qatiq va o'tlar
   💡 Ichan-Qal'a ichida, Xiva atmosferasini his qilish uchun ideal.

════════════════════════════════════════════════════════
🏨  MEHMONXONALAR (4 ta)
════════════════════════════════════════════════════════

① REGISTAN PLAZA HOTEL — Samarqand ⭐⭐⭐⭐⭐
   💵 1 200 000 so'm/kecha (~$94)
   ✅ Mavjud: Ha
   🛎️ Xizmatlar: Wi-Fi, Hovuz, Spa, Restoran, Konferents-zal, Parking, Lift, 24/7 qabulxona
   📍 Universitetskiy bulvar 1, Samarqand
   💡 Premium segment, Registon yaqinida.

② MALIKA KLASSIK — Buxoro ⭐⭐⭐⭐
   💵 750 000 so'm/kecha (~$59)
   ✅ Mavjud: Ha
   🛎️ Xizmatlar: Wi-Fi, Bog', Restoran, Ekskursiya tashkil etish, Parking
   📍 Ko'kaldosh ko'chasi 7, Buxoro
   💡 O'rta segment, Buxoro markazida, ekskursiya xizmati bor.

③ ORIENT STAR XIVA — Xiva ⭐⭐⭐⭐
   💵 900 000 so'm/kecha (~$70)
   ❌ Mavjud: Yo'q (hozircha band)
   🛎️ Xizmatlar: Wi-Fi, Tarixiy bino, Restoran, Ichki hovli, Ekskursiya
   📍 Ichan-Qal'a, Muhammad Amin Xon madrasasi yonida
   💡 Tarixiy bino ichida, juda atmosferali. Oldindan bron qilish zarur.

④ CHIMGAN OROMGOHI — Chimgan ⭐⭐⭐
   💵 500 000 so'm/kecha (~$39)
   ✅ Mavjud: Ha
   🛎️ Xizmatlar: Wi-Fi, Tog' manzarasi, Restoran, Kanatli yo'l yaqin, Bolalar maydoni
   📍 Chimgan qishlog'i, asosiy ko'cha 3
   💡 Arzon variant, tog'da dam olish uchun.

════════════════════════════════════════════════════════
🧭  SAYOHAT GIDLARI (4 ta)
════════════════════════════════════════════════════════

① JASUR RAHIMOV — Samarqand
   🌍 Tillar: O'zbek, Ingliz, Rus, Nemis
   ⭐ 4.9 | ✅ Tasdiqlangan gid
   💵 800 000 so'm/kun (~$63)
   ✅ Mavjud: Ha
   📝 Samarqand tarixini 15 yil o'rgangan mahalliy mutaxassis.
      Germaniya universitetida tarix magistraturasi. Registon, Shoh-i Zinda, Guri Amir eksperti.

② NILUFAR YUSUPOVA — Buxoro
   🌍 Tillar: O'zbek, Ingliz, Fransuz, Italyan
   ⭐ 4.8 | ✅ Tasdiqlangan gid
   💵 750 000 so'm/kun (~$59)
   ✅ Mavjud: Ha
   📝 Buxoro arxitekturasi va hunarmandchiligi bo'yicha 10 yillik tajriba.
      Yashirin burchaklar va noyob joylarni ko'rsatadi.

③ BOBUR MIRZAYEV — Xiva
   🌍 Tillar: O'zbek, Ingliz, Rus, Turk
   ⭐ 4.7 | ✅ Tasdiqlangan gid
   💵 700 000 so'm/kun (~$55)
   ❌ Mavjud: Yo'q (hozircha band)
   📝 Xorazm madaniyati va Ichan-Qal'a bo'yicha mahalliy mutaxassis.

④ KAMOLA HASANOVA — Toshkent
   🌍 Tillar: O'zbek, Ingliz, Xitoy, Yapon
   ⭐ 4.6 | Tasdiqlanmagan
   💵 850 000 so'm/kun (~$66)
   ✅ Mavjud: Ha
   📝 Toshkent va butun O'zbekiston bo'ylab guruhli sayohatlar mutaxassisi.
      Osiyo turistlari bilan ishlash tajribasi.

════════════════════════════════════════════════════════
🚌  TRANSPORT YO'NALISHLARI
════════════════════════════════════════════════════════

TEZKOR POYEZD (Afrosiyob):
  • Toshkent → Samarqand: 2 soat | 80 000 so'm (~$6.3)
  • Toshkent → Buxoro: 3.5 soat | 120 000 so'm (~$9.4)
  • Samarqand → Buxoro: 1.5 soat | 60 000 so'm (~$4.7)

AVTOBUS (shaharlararo):
  • Toshkent → Namangan: 4 soat | 40 000 so'm (~$3.1)
  • Toshkent → Andijon: 5 soat | 50 000 so'm (~$3.9)
  • Toshkent → Termiz: 8 soat | 70 000 so'm (~$5.5)

TAKSI / YO'LOVCHI:
  • Toshkent → Chimgan: 1.5 soat | ~150 000 so'm (~$11.7)
  • Urgench → Xiva: 30 daqiqa | ~30 000 so'm (~$2.3)
  • Buxoro → Shahrisabz: 1.5 soat | ~100 000 so'm (~$7.8)

AVIAKOMPANIYALAR (Toshkentdan):
  • Toshkent → Urgench (Xiva uchun): ~1 soat | $40–80
  • O'zbekiston Havo Yo'llari asosiy tashuvchi.

════════════════════════════════════════════════════════
💱  VALYUTA KURSLARI (taxminiy)
════════════════════════════════════════════════════════
  1 USD = 12 800 so'm
  1 EUR = 13 900 so'm
  1 GBP = 16 200 so'm
  1 CNY =  1 760 so'm
  1 RUB =    140 so'm
  1 KZT =     27 so'm

════════════════════════════════════════════════════════
📊  O'RTACHA KUNLIK XARAJATLAR
════════════════════════════════════════════════════════
Tejamkor ($25–40/kun/kishi):
  • Turar joy: $15–25 (3 yulduzli mehmonxona yoki hostel)
  • Ovqat: $5–10 (mahalliy oshxonalar)
  • Transport + kirish: $5–10

O'rtacha ($40–80/kun/kishi):
  • Turar joy: $30–60 (4 yulduzli mehmonxona)
  • Ovqat: $10–20 (restoranlar)
  • Transport + kirish: $10–15

Premium ($80+/kun/kishi):
  • Turar joy: $60–120 (5 yulduzli)
  • Ovqat: $20–40 (premium restoranlar)
  • Gid: $55–70/kun
  • Transport: $20+ (shaxsiy taksi)

════════════════════════════════════════════════════════
⚠️  MUHIM MASLAHATLAR
════════════════════════════════════════════════════════
• Viza: Ko'p mamlakatlar uchun elektron viza (e-visa) bor, $20–50
• Mavsim: Aprel–May va Sentabr–Oktyabr — ideal. Iyul–Avgust +40°C.
• Pul: Naqd so'm tavsiya etiladi. ATM deyarli hamma yerda bor.
• Kiyim: Diniy joylar uchun yelka va tizzani yopuvchi kiyim.
• Suv: Faqat qadoqlangan suv iching.
• Muloqot: Mahalliy bozor va oshxonalarda inglizcha kam, gid yordam beradi.
• Sim-karta: Ucell yoki Beeline — sayohat uchun qulay, arzon internet.
════════════════════════════════════════════════════════
`;

/**
 * The slice of the catalogue a given question can actually use.
 *
 * The file is one long string built from `════` rules and numbered entries.
 * Splitting on those rules gives one block per section (places, restaurants,
 * hotels, guides, currency, practical notes), and each place entry inside the
 * places block is itself separated by a blank line and a `①②③…` marker.
 *
 * A question about the Registan needs the Registan's prices and hours. It
 * does not need three hotels, four guides and the currency table — and
 * sending them cost more than the whole per-minute token budget.
 *
 * Always returns something: if nothing matches, the caller gets a short index
 * of what the catalogue holds, so the model still knows these places exist
 * and can say so rather than inventing an answer.
 */
export function selectKnowledge(query: string): string {
  const q = query.toLowerCase();

  // One block per `════`-ruled section, header line kept with its body.
  const raw = KNOWLEDGE_BASE.split(/\n═+\n/).map((s) => s.trim()).filter(Boolean);

  // Each numbered entry becomes its own unit so one place can be sent alone.
  const units: string[] = [];
  for (const block of raw) {
    const parts = block.split(/\n(?=[①②③④⑤⑥⑦⑧⑨⑩]\s)/);
    for (const p of parts) if (p.trim()) units.push(p.trim());
  }

  // Matching is on stems, not whole words. Uzbek is agglutinative: the
  // question says "Registonga" (to the Registan), "Buxoroda" (in Bukhara),
  // "Chorsuda" — an `includes` of the full word never matches the entry
  // titled "REGISTON", so the first version of this quietly dropped the real
  // prices out of exactly the answers that needed them. Comparing the first
  // six characters covers the suffixes without matching unrelated words.
  const stem = (w: string) => w.slice(0, 6);
  const words = q.split(/[^\p{L}\p{N}']+/u).filter((w) => w.length >= 4);
  const stems = words.map(stem);

  const hits = units.filter((u) => {
    const [titleLine, ...rest] = u.toLowerCase().split("\n");
    const titleStems = titleLine.split(/[^\p{L}\p{N}']+/u).filter(Boolean).map(stem);
    const bodyStems = rest.join(" ").split(/[^\p{L}\p{N}']+/u).filter((w) => w.length >= 4).map(stem);
    // One hit in the title is enough; the body needs two, so a passing
    // mention of "soat" does not drag in every entry.
    return stems.some((s) => titleStems.includes(s)) ||
      stems.filter((s) => bodyStems.includes(s)).length >= 2;
  });

  if (!hits.length) {
    const titles = units
      .map((u) => u.split("\n")[0].replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/, "").trim())
      .filter((t) => t && !/^[🏛🍽🏨👤💱🚕📌]/u.test(t))
      .slice(0, 24);
    return `Bazadagi joylar: ${titles.join(" · ")}`;
  }

  // Bounded: even a broad question cannot put the request back over budget.
  return hits.slice(0, 4).join("\n\n");
}
