/**
 * Verso AI global knowledge base — verso-dataset's 331 places outside
 * Uzbekistan (45 countries), generated the same way knowledge-base.ts's
 * own Uzbekistan catalogue is authored, and read the same bounded way.
 *
 * Never sent whole: at 35347 tokens (roughly — 4 chars/token) this alone
 * would blow past Groq's free-tier 8,000-tokens-PER-MINUTE ceiling on its
 * own, which is the exact failure knowledge-base.ts's own selectKnowledge()
 * already exists to avoid for the Uzbekistan catalogue. selectGlobalKnowledge()
 * below applies the identical bounded-selection pattern.
 *
 * Source text is Uzbek only, same as the app's Atlas country-hub place
 * grid this was generated alongside — the dataset never produced
 * per-language versions of individual places.
 */
export const GLOBAL_KNOWLEDGE_BASE = `
🌍 UNITED ARAB EMIRATES (AE)
① BURJ KHALIFA — Dubai
   🏷️ Turi: attraction | ikonik
   🕐 Ish vaqti: 09:00–23:00 (har kuni)
   💵 Narxi: 169–399 AED
   🚌 Transport: Dubai Mall/Burj Khalifa metro bekatidan
   📝 Dunyo'ning eng baland binosi — 828 metr. 124, 125 va 148-qavat ko'rish maydonchalaridan Dubai panoramasi. Kechqurun su fontan tomoshasi bepul — pastda ko'riladi.

② DUBAI DESERT SAFARI — Dubai
   🏷️ Turi: attraction | safari, tabiat
   🕐 Ish vaqti: Kechki turlar: 15:00–21:00 (har kuni)
   💵 Narxi: 150–250 AED
   🚌 Transport: Mehmonxonadan olib ketish va qaytarish kiradi
   📝 4WD bilan qum tepalarida sayohat, tuyada minish, qayta qumda surfing, cho'lda BBQ va Arabiston raqsi. Kechki safari 3–5 soat. Sahroning qizil qumloqlari quyosh botishida ajoyib.

③ DUBAI FRAME — Dubai
   🏷️ Turi: attraction | rish maydoni, Dubai
   🕐 Ish vaqti: 09:00–21:00 (har kuni)
   💵 Narxi: 50 AED
   🚌 Transport: Al Jafiliya metro bekatidan 10 daqiqa piyoda
   📝 Zabeel parkida 150 metrlik ikkita ustun va shisha ko'prik. Bir tomonda eski Dubai, ikkinchi tomonda zamonaviy skyline ko'rinadi. Ramka Dubai tarixini ikki jahonga ulab turadi.

④ DUBAI MALL — Dubai
   🏷️ Turi: attraction | xarid, aquarium, Dubai
   🕐 Ish vaqti: 10:00–00:00 (juma: 10:00–01:00)
   💵 Narxi: 0 (kirish bepul)
   🚌 Transport: Burj Khalifa/Dubai Mall metro bekatidan shattl avtobus
   📝 Dunyodagi eng katta savdo markazi — 1200 do'kon, aquarium, muzqaymoqxona va Burj Khalifa fontan tomoshasi. Kuniga 750 000 tashrif buyuruvchi. Xariddan ko'ra diqqatga sazovor joy.

⑤ GOLD SOUK (OLTIN BOZORI) — Dubai
   🏷️ Turi: attraction | bozor, oltin
   🕐 Ish vaqti: 09:30–13:00, 16:00–22:00 (juma: 16:00–22:00)
   💵 Narxi: 0 (kirish bepul)
   🚌 Transport: Al Ras metro bekatidan 10 daqiqa piyoda
   📝 Deira tumanida 380 dan ortiq zargar do'konlari. 10 tonna oltin ko'rsatiladi. Oltin, kumush, platina va qimmatbaho toshlar. Savdolashish mumkin va kutiladi.

⑥ NOBU DUBAI — Dubai
   🏷️ Turi: restaurant | restoran, premium, Dubai
   🕐 Ish vaqti: 12:00–15:00, 18:00–00:00 (har kuni)
   💵 Narxi: 300–600 AED/kishi
   🚌 Transport: Atlantis The Palm, Palm Jumeirah
   📝 Atlantis The Palm'dagi Nobu Matsuhisa'ning mashhur yapon-peru fusyon restoroni. Sashimi, black cod miso va wagyu Dubai versiyasi. Dengiz ko'rinishi bilan fon noyob.

⑦ PALM JUMEIRAH — Dubai
   🏷️ Turi: attraction | orol, muhandislik, Dubai
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: 0 (orolga kirish bepul)
   🚌 Transport: Palm Monorail: Nakheel bekatidan
   📝 Xurmo shaklida sun'iy orol — Dubai'ning insoniy muhandislik mo'jizasi. Atlantis The Palm resort, plyajlar va Monorail. Tepadan ko'rinishi (samolyot/helikopter) ta'sirli.

⑧ SHEIKH ZAYED GRAND MASJIDI — Abu Dhabi
   🏷️ Turi: attraction | masjid
   🕐 Ish vaqti: 09:00–22:00 (juma: 16:30–22:00)
   💵 Narxi: 0 (bepul)
   🚌 Transport: Abu Dhabi'dan taksi yoki avtobus 54/56
   📝 Dunyodagi eng katta masjidlardan biri — 41 000 namozxon, 82 gumbaz, 1000 ustun. Oq marmar, oltin va semi-qimmatbaho toshlar. Kirishda abaya va sholcha bepul beriladi.

════════════════════════════════════════════════════════

🌍 ARMENIA (AM)
① DILIJAN MILLIY BOG'I — Dilijan
   🏷️ Turi: attraction | tabiat
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: 0 (park kirish bepul)
   🚌 Transport: Yerevandam marshrutka, 1.5 soat
   📝 «Armanistonning Shveytsariyasi» — yashin daraxtlar, tog'li ko'llar va toza havo. Haghartsin va Goshavank monastirlari o'rmonda yashiringan. Dilijan shahri eski tosh ko'chalari bilan sokin.

② GARNI IBODATXONASI — Garni
   🏷️ Turi: attraction | tarix, Rim, qadimiy
   🕐 Ish vaqti: 10:00–18:00 (har kuni)
   💵 Narxi: 1500 AMD
   🚌 Transport: Yerevandam marshrutka Garni yo'nalishi, 40 daqiqa
   📝 Old davr Greko-Roman uslubidagi 1-asrlik ibodatxona — Kavkazda yagona Rim ibodatxonasi. Axurean daryosi kanyoni fonida. Yonida Geghard bilan birgalikda ziyorat qilinadi.

③ GEGHARD MONASTIRI — Goght'
   🏷️ Turi: attraction | UNESCO, monastir, qoya
   🕐 Ish vaqti: 09:00–18:00 (har kuni)
   💵 Narxi: 0 (bepul)
   🚌 Transport: Yerevandam marshrutka, 45 daqiqa
   📝 Qoyaga o'yib qurilgan 13-asrlik monastir — UNESCO. Aziz nayza (Geghard) saqlanib, nom berilgan. Tog'lar orasidagi akustika noyob — cherkov xori sehrli eshitiladi.

④ NORAVANK MONASTIRI — Vayots Dzor
   🏷️ Turi: attraction | monastir, kanyon, arxitektura
   🕐 Ish vaqti: 08:00–20:00 (har kuni)
   💵 Narxi: 0 (bepul)
   🚌 Transport: Yerevandam taksi 2 soat yoki Ararat tashrifida birga
   📝 Qizil tosh kanyonda joylashgan 13-asrlik monastir — Armanistonning eng fotogen joyi. Surb Astvatsatsin kilisasining tik zinapoyasi noyob. Atrofdagi qizil tosh va yashil daraxtlar kontrasti.

⑤ RESPUBLIKA MAYDONI — Yerevan
   🏷️ Turi: attraction | maydon, arxitektura, Yerevan
   🕐 Ish vaqti: Doim ochiq (fontan: 21:00–23:00)
   💵 Narxi: 0
   🚌 Transport: Yerevan metro Respublika Maydoni bekatidan to'g'ridan-to'g'ri
   📝 Yerevan'ning asosiy maydoni — tuf tosh bilan qoplangan binolar ansambli. Kechqurun musiqiy fontan va yoritilgan bino. Tarix muzeyi va hukumat binosi atrofida.

⑥ SEVAN KO'LI — Sevan
   🏷️ Turi: attraction
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: 0 (ko'l). 500 AMD (Sevanavank)
   🚌 Transport: Yerevandam marshrutka, 1 soat
   📝 1900 metr balandlikdagi Kavkazning eng katta ko'li. Sevanavank monastiri yarim orolda. Yozda cho'milish va qayiqda sayr. Toza suv va baland tog'lar bilan Armanistonning eng yaxshi dam olish joyi.

⑦ TATEV MONASTIRI — Tatev
   🏷️ Turi: attraction | monastir
   🕐 Ish vaqti: Kanatli yo'l: 10:00–18:00 (seshanba yopiq)
   💵 Narxi: 7000 AMD (kanatli yo'l)
   🚌 Transport: Gorisdan taksi 20 daqiqa + kanatli yo'l
   📝 9-asrdagi arxitektura ansambli jarlik chetida. «Wings of Tatev» — dunyo'ning eng uzun (5752 metr) reversibel kanatli yo'li orqali kelinadi. Panorama va monastir birgalikda sehrli.

⑧ TAVERN YEREVAN — Yerevan
   🏷️ Turi: restaurant | restoran, milliy taom, Yerevan
   🕐 Ish vaqti: 12:00–00:00 (har kuni)
   💵 Narxi: 4000–8000 AMD/kishi
   🚌 Transport: Yerevan markazi, Tumanyan ko'chasi yaqinida
   📝 An'anaviy Armaniston oshxonasi — khorovats (shashliq), dolma va lavash. Respublika maydoni yaqinida. Milliy kuylar bilan jonli musiqa. Pomidor va bodring salatidan boshlab turib kelar taom uzun.

════════════════════════════════════════════════════════

🌍 ARGENTINA (AR)
① BUENOS AIRES — LA BOCA MAHALLASI — Buenos Aires
   🏷️ Turi: attraction | madaniyat, tango, mahalliy hayot, arxitektura
   🕐 Ish vaqti: 09:00–20:00 (faol saatlar)
   💵 Narxi: Bepul (mahalla)
   🚌 Transport: Mikroavtobus: 29, 53, 64, 168 (Buenos Aires markazidan)
   📝 Rang-barang temir binolar, ko'chada tango va asado hidi — La Boca italyan immigrantlari qurib bitirgan port mahallasi. Caminito ko'chasi jonli muzeyga aylangan. Boca Juniors stadioni — La Bombonera — faqat 500 metr narida.

② IGUAZÚ SHARSHARALARI (ARGENTINA TOMONI) — Puerto Iguazú
   🏷️ Turi: attraction | tabiat, sharshara, UNESCO
   🕐 Ish vaqti: 08:00–18:00 (har kuni)
   💵 Narxi: $20
   🚌 Transport: Puerto Iguazú shahridan avtobus 30 daqiqa
   📝 Braziliya tomoni panorama bersa, Argentina tomoni sizni sharshara ichiga olib kiradi. Garganta del Diablo — Iblis tomog'i — 80 metr balandlikda suv shovqini, tuman va kamalak bir joyda. Piyoda yo'llar suv ustida qurilgan.

③ MENDOZA — MALBEC ÜZUMZORLAR TURI — Mendoza
   🏷️ Turi: attraction | sharob, gastronomy, tabiat
   🕐 Ish vaqti: 09:00–18:00 (winery'lar)
   💵 Narxi: $30–80 (sharob turi)
   🚌 Transport: Mendoza aeroportidan 25 daqiqa; shahardan velosiped ijarasi
   📝 And tog'lari oyog'ida joylashgan Argentina'ning sharob poytaxti. Malbec uzumi bu yerda dunyodagi eng yaxshi namunalarini beradi. Luján de Cuyo va Maipú rayonlari veloloyih bilan aylanish uchun ideal. Sharob tatib ko'rish $10–30 dan.

④ PERITO MORENO MUZLIGI — El Calafate
   🏷️ Turi: attraction | tabiat, muzlik, Patagonia
   🕐 Ish vaqti: 08:00–20:00 (yoz); 09:00–18:00 (qish)
   💵 Narxi: $25 (kirish)
   🚌 Transport: El Calafate shahridan avtobus 1.5 soat
   📝 Patagoniya muzligining eng faol va yaqin ko'rish mumkin bo'lgan qismi — 5 km keng, 60 metr baland. Muzlik har 4–5 yilda yo'l to'sib, keyin portlaydi. Balkondan ko'rish yoki muzlikka piyoda trekking — ikki xil hayrat.

⑤ TANGO SHOU — SAN TELMO — Buenos Aires
   🏷️ Turi: attraction | madaniyat, tango, kechki hayot, tajriba
   🕐 Ish vaqti: Kechki seans 21:00 dan boshlanadi
   💵 Narxi: $20–80 (milonga/shou turiga qarab)
   🚌 Transport: Metro: Linea C, San Juan stantsiyasi
   📝 Tango Buenos Aires ko'chalarida tug'ildi va San Telmo mahallasida yashaydi. Milonga (raqsbop) kechalariga borish — nafis, intim, haqiqiy. Ba'zi restoranlar kechki ovqat bilan professional tango ko'rgazmasini taklif etadi. Qatnashuvchi darslar ham bor.

⑥ PATAGONIA — TORRES DEL PAINE — Puerto Natales
   🏷️ Turi: attraction | tabiat, trekking, Patagonia
   🕐 Ish vaqti: 24/7 (park yil bo'yi ochiq)
   💵 Narxi: $35 (kirish)
   🚌 Transport: Puerto Natales'dan avtobus 2 soat (Chili tomonida, lekin Argentina'dan kirish ham mumkin)
   📝 Dunyo eng dramatik manzaralaridan biri — uch granitli minora, moviy muzliklar, pampas shamol. Trekkingchilarning jannat manzili. W yoki O trek marshrutlari 4–8 kun davom etadi. Guanako va kondorlar yo'lingizga chiqishi aniq.

⑦ USHUAIA — DUNYO OXIRI — Ushuaia
   🏷️ Turi: attraction | tabiat, sarguzasht, ikonik
   🕐 Ish vaqti: 24/7
   💵 Narxi: Bepul (shahar); milliy bog' $22
   🚌 Transport: Ushuaia aeroporti — shahar markazi 5 daqiqa
   📝 Dunyo janubidagi eng qo'yidagi shahar — Tierra del Fuego orolida, Beagle kanalida. Antaiktidaga sayohat shu yerdan boshlanadi. Qishda qutb tuni, yozda o'n sakkiz soat kunduz. Tierra del Fuego milliy bog'i piyoda turlar uchun ajoyib.

════════════════════════════════════════════════════════

🌍 AUSTRIA (AT)
① BELVEDERE PALACE & GALLERY — Vienna
   🏷️ Turi: attraction | muzey
   🕐 Ish vaqti: 09:00–18:00 (chorshanba: 21:00 gacha)
   💵 Narxi: €16 (Yuqori Belvedere)
   🚌 Transport: Südtiroler Platz U1 metro, 10 daqiqa yurish
   📝 Klimt'ning "Bo'sa" asli shu yerda saqlanadi. Yuqori va Pastki Belvedere saroylari, Barok bog'i — hammasi bir kompleksda. Qishda qor ostidagi bog' — alohida go'zallik.

② GROSSGLOCKNER ALPINE ROAD — Heiligenblut
   🏷️ Turi: attraction | tabiat
   🕐 Ish vaqti: 06:00–21:30 (may–noyabr)
   💵 Narxi: €37 (avto o'tish)
   🚌 Transport: Salzburg dan avto, 2 soat
   📝 3,798 metrlik Avstriya ning eng baland tog'i tagidan o'tadigan 48 km li alp yo'li. Yo'lda ibex echkilari va tog' echkilari ko'rinadi. Faqat yoz oylarida ochiq bo'ladi.

③ HALLSTATT LAKE VILLAGE — Hallstatt
   🏷️ Turi: attraction | UNESCO, tabiat, fotografiya
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul (qishloqqa kirish)
   🚌 Transport: Salzburg dan poyezd va feri, 2 soat 30 daqiqa
   📝 Tuzlik tog'i tagida ko'l sohilida joylashgan qishloq — dunyodagi eng fotogenik joylardan biri. UNESCO ob'ekti. Erta borib tuman ko'lning yuzasida suzib yurganini ko'rish sehrli.

④ HOFBURG IMPERIAL PALACE — Vienna
   🏷️ Turi: attraction | tarix, arxitektura, muzey
   🕐 Ish vaqti: 09:00–17:30 (har kuni)
   💵 Narxi: €18 (Sisi + Xazina)
   🚌 Transport: Herrengasse U3 metro, 3 daqiqa yurish
   📝 Vena markazidagi imperatorlik saroyi kompleksi — Sisi muzeyi, Imperial Apartments va Xazina bir joyda. Ispaniya chavandozlar maktabi ham shu yer. 700 yillik imperiya tarixi.

⑤ PRATER & WURSTELPRATER — Vienna
   🏷️ Turi: attraction | mahalliy hayot, dam olish, park
   🕐 Ish vaqti: Park: doim ochiq. Riesenrad: 10:00–22:00
   💵 Narxi: Park bepul (Riesenrad: €13)
   🚌 Transport: Praterstern U1/U2 metro, 5 daqiqa yurish
   📝 1897 yildan ishlab turgan Riesenrad (katta g'ildirak) Vena panoramasini beradi. Prater o'rmoni velosipedchilar va yuguruvchilar uchun bepul. Mahalliylar dam olish kuni shu yerda.

⑥ SALZBURG OLD TOWN — Salzburg
   🏷️ Turi: attraction | UNESCO, musiqa, tarix
   🕐 Ish vaqti: 09:00–17:30 (har kuni)
   💵 Narxi: €12 (Mozart uyi)
   🚌 Transport: Salzburg HB dan piyoda 20 daqiqa yoki avtobus
   📝 Mozart tug'ilgan shahar — Getreidegasse ko'chasidagi uyi muzeyga aylantirilgan. Hohensalzburg qal'asi tepadan shahar manzarasini ochadi. Barok arxitektura — UNESCO himoyasida.

⑦ SCHÖNBRUNN PALACE — Vienna
   🏷️ Turi: attraction | ikonik, UNESCO, tarix
   🕐 Ish vaqti: 09:00–17:30 (har kuni)
   💵 Narxi: €26 (Grand Tour)
   🚌 Transport: Schönbrunn U4 metro, 5 daqiqa yurish
   📝 Habsburglar sulolasining 1,441 xonali saroyi. Gloriette pavilyonidan butun Vena ko'rinadi. Bog'idagi labirint va Neptun fontani ham sayrga loyiq. UNESCO obidalari ro'yxatida.

════════════════════════════════════════════════════════

🌍 AUSTRALIA (AU)
① BAROSSA VALLEY — SHAROB VADIYSI — Barossa Valley
   🏷️ Turi: attraction | sharob, gastronomy, tabiat, meros
   🕐 Ish vaqti: 10:00–17:00 (winery'lar)
   💵 Narxi: Bepul yo'l; tasting A$15–30
   🚌 Transport: Adelaide'dan 1 soat shimolga avtomobil
   📝 Avstraliyaning eng taniqli sharob vodiysi — Shiraz uzumi bu yerda 1840-lardan beri o'sadi. Penfolds Grange — dunyoning 100 ta zo'r vinolaridan biri shu erda ishlab chiqariladi. Nemis meros arxitekturasi va mahalliy peynir bilan tatib ko'rish kuni — Adelaidening eng yaxshi kuni.

② BYRON BAY — PLYAJ VA MAYOQ — Byron Bay
   🏷️ Turi: attraction | plyaj, surf, dam olish, tabiat
   🕐 Ish vaqti: 24/7
   💵 Narxi: Bepul (plyaj)
   🚌 Transport: Brisbane'dan 2.5 soat, Sydney'dan 9 soat avtomobil
   📝 Avstraliya materigining eng sharqiy nuqtasi — Cape Byron mayog'i — va uning atrofida cho'zilgan oq plyajlar. Hector delfin podasi ko'pincha surferlar bilan birga to'lqinlarda o'ynaydi. Yakshanba bozori va Belongil Beach — bohemian atmosfera.

③ DAINTREE O'RMONI — Mossman
   🏷️ Turi: attraction | tabiat
   🕐 Ish vaqti: 08:00–18:00 (turlar)
   💵 Narxi: A$30 ($20) gid tur; daryo kechishi A$28
   🚌 Transport: Cairns'dan 1.5 soat avtomobil
   📝 Yer yuzidagi eng qadimiy tropik o'rmon — 180 million yillik. Great Barrier Reef bilan yonma-yon — ikki UNESCO ob'ektini bir kunda ko'rish mumkin. Croc Express boti Daintree daryosida timsohlarni yaqin ko'rsatadi. Mossman Gorge — kristal suv va tosh yo'l.

④ GREAT BARRIER REEF — Cairns
   🏷️ Turi: attraction | tabiat, diving, UNESCO, dengiz
   🕐 Ish vaqti: Turlar 07:00 da jo'naydi, 17:00 da qaytadi
   💵 Narxi: A$200–350 ($130–230) kunlik tur
   🚌 Transport: Cairns shahridan parom — tur narxiga kiradi
   📝 Yer yuzidagi yagona tirik organizm bo'lib kosmosdan ko'rinadigan inshoot — 2900 ta alohida rif, 344,400 kv.km. Cairns va Port Douglas'dan kunlik tur. Snorkeling, skuba diving va samolyot turi mavjud. Iqlim isishi tufayli marjonlarning oqarishi — ko'rishga vaqt qolmayapti.

⑤ MELBOURNE — LANEWAY KOFE MADANIYATI — Melbourne
   🏷️ Turi: attraction | mahalliy hayot, qahva
   🕐 Ish vaqti: 24/7 (ko'chalar); kafelar 07:00–17:00
   💵 Narxi: Bepul (ko'chalar); qahva A$4–6
   🚌 Transport: Melbourne Flinders Street stantsiyasidan piyoda 5 daqiqa
   📝 Melbourne'ning yashirin tog'lari — Degraves Street, Centre Place va Hardware Lane. Graffiti devorlar, tiqin qahvaxonalar, baristalar podkastlarida suhbat — bu yerda dunyoning eng yaxshi flat white'lari tayyorlanadi deyishadi. Har burchakda yangi kashfiyot.

⑥ SYDNEY OPERA HOUSE — Sydney
   🏷️ Turi: attraction | arxitektura, UNESCO, madaniyat, ikonik
   🕐 Ish vaqti: 09:00–17:00 (ekskursiyalar); ko'rgazmalar kechgacha
   💵 Narxi: A$45 ($30) tur; ko'rgazma chiptalari farq qiladi
   🚌 Transport: Sydney CBD'dan piyoda 10 daqiqa; Circular Quay feri stantsiyasi
   📝 1973-yilda ochilgan, Jorn Utzon tomonidan loyihalangan UNESCO ob'ekti — qobiq shaklidagi tomlar Benet buxtasining ko'zgisida aks etadi. Ichki zal ekskursiyasi va jonli ko'rgazma — ikki xil tajriba. Harbour Bridge bilan birga — dunyodagi eng mashhur shahar manzarasi.

⑦ ULURU-KATA TJUTA MILLIY BOG'I — Yulara
   🏷️ Turi: attraction | madaniyat, tabiat, UNESCO, Aboriginal
   🕐 Ish vaqti: 05:00–21:00 (oy va mavsum bo'yicha)
   💵 Narxi: A$38 ($25) 3 kunlik o'tish kartasi
   🚌 Transport: Ayers Rock aeroportidan 20 daqiqa (Connellan aeroporti)
   📝 Anangu xalqining muqaddas toshlari — Uluru 348 metr baland, yerosti qismi esa ancha katta. Quyosh botishi va chiqishida qoya rangi daqiqada o'zgaradi — qizildan qo'ng'irga, binafshaga. Tirmashib chiqish 2019-yildan ta'qiqlangan — mahalliy odatga hurmat.

════════════════════════════════════════════════════════

🌍 AZERBAIJAN (AZ)
① ATESHGAH — OLOV IBODATXONASI — Suraxani, Baku
   🏷️ Turi: attraction | tarix, Zardusht, olov
   🕐 Ish vaqti: 10:00–18:00 (har kuni)
   💵 Narxi: 4 AZN
   🚌 Transport: Baku markazidan taksi, 30 daqiqa
   📝 17-18-asrlardagi Zardusht ibodatxonasi — tabiiy gaz oqimida yonuvchi olov. Hindiston va Eron ziyoratchilar uchun muqaddas joy. Hozir muzeyga aylangan. Olov teatral effekt bilan ko'rsatiladi.

② BAKU BULVARI — Baku
   🏷️ Turi: attraction | park, dengiz, istirohat
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: 0
   🚌 Transport: Icheri Sheher yoki Sahil metro bekatidan piyoda
   📝 1909-yildan beri Kaspiy dengizi qirg'og'idagi 3.5 km bulvar. Park, velosiped yo'li, kafelar va veneciyan gondola yo'li. Kechqurun Alov minoralar va Kaspiy fonida yurish.

③ FIRUZE RESTORAN — Baku
   🏷️ Turi: restaurant | restoran, milliy taom, Baku
   🕐 Ish vaqti: 12:00–00:00 (har kuni)
   💵 Narxi: 25–50 AZN/kishi
   🚌 Transport: Icheri Sheher yaqinida, Niyazi ko'chasi
   📝 Bakuning eng mashhur an'anaviy Ozarbayjon oshxonasi. Plov 7 xil, dolma va kutab lavash ichra. Icheri Sheher yaqinida, dekoratsiyasi tarixiy uslubda. Mahalliy va sayyohlar sevimli joyi.

④ ALOV MINORALAR — Baku
   🏷️ Turi: attraction
   🕐 Ish vaqti: Doim ko'rinadi (yoritish: quyosh botgandan)
   💵 Narxi: 0 (tashqaridan bepul)
   🚌 Transport: Sahil metro bekatidan 15 daqiqa piyoda
   📝 182 metrlik uch minorali kompleks — kechqurun LED yoritgichlar olov va Ozarbayjon bayrog'ini ko'rsatadi. Tepalikdan qo'shilgan shahar panoramasi uchun eng yaxshi nuqta. Baku'ning zamonaviy ramzi.

⑤ GOBUSTAN QOYATOSH RASMLARI — Gobustan
   🏷️ Turi: attraction | UNESCO, arxeologiya, qoyatosh
   🕐 Ish vaqti: 10:00–18:00 (dushanba yopiq)
   💵 Narxi: 10 AZN
   🚌 Transport: Baku'dan 60 km, taksi yoki ekskursiya avtobus
   📝 Mil. avv. 40 000-yildan boshlab yaratilgan qoya rasmlari — UNESCO. Ov manozalari, raqschilar, kemalar. Yonidagi loy vulqonlar (ko'piri qaynoq loy) ham noyob tabiiy hodisa.

⑥ ICHERI SHEHER (ESKI SHAHAR) — Baku
   🏷️ Turi: attraction | UNESCO, eski shahar, Baku
   🕐 Ish vaqti: Doim ochiq. Muzeylar: 10:00–18:00
   💵 Narxi: 0 (ko'cha). Muzey: 5–10 AZN
   🚌 Transport: Icheri Sheher metro bekatidan to'g'ridan-to'g'ri
   📝 Bakuning UNESCO qo'riqlanadigan o'rta asrlar eski shahri — darvoza ichida koʻhna ko'chalar, Qiz Minora va Shirvanshohlar saroyi. Piyoda sayr qilishning eng yaxshi joyi — 5 km radius.

⑦ LAHIJ MIS USTAXONALARI KO'CHASI — Lahij
   🏷️ Turi: attraction | hunarmandchilik, mahalliy hayot, mis
   🕐 Ish vaqti: Ustaxonalar: 09:00–18:00 (yakshanba ko'proq yopiq)
   💵 Narxi: 0 (ko'cha). Buyum narxi individual
   🚌 Transport: Ismailly'dan taksi 30 daqiqa
   📝 Tosh ko'chalari bo'ylab mis ustaxonalari — asrlar davomida o'zgarmagan hunarmandchilik. Sopol ko'za, mis piyola va dekorativ buyumlar qo'lda yasaladi. Tog'lar orasidagi qishloq o'zi go'zal.

⑧ SHEKI KARVONSAROYI — Sheki
   🏷️ Turi: attraction | tarix
   🕐 Ish vaqti: 09:00–17:00 (har kuni)
   💵 Narxi: 10 AZN (Xon saroyi)
   🚌 Transport: Baku'dan 3–4 soat avtobus yoki poyezd
   📝 18-asrdagi ipak yo'li karvonsaroyi — bugun ham faoliyat ko'rsatuvchi mehmonxona. Pishiq g'isht qurilish, yashil hovli va ko'k kamarlar. Sheki xoni saroyi yaqinida — freskalari mashhur.

════════════════════════════════════════════════════════

🌍 BRAZIL (BR)
① AMAZON O'RMON TURI — MANAUS — Manaus
   🏷️ Turi: attraction | tabiat, sarguzasht, yovvoyi tabiat, tur
   🕐 Ish vaqti: Turlar ertalab 06:00 boshlanadi
   💵 Narxi: $150–300 (2 kunlik tur)
   🚌 Transport: Manaus aeroportidan shahar markaziga, keyin daryo kechasi
   📝 Dunyo o'pkasi — 5.5 million kv.km o'rmon ichida bir necha kunlik tur. Rio Negro va Amazon daryolari qo'shilgan joyda 6 km davomida ular aralashmaydi — suv rangi va harorat farqi tufayli. Piraniya ovlash, piroga safari, qabilalar bilan uchrashuv.

② CHAPADA DIAMANTINA MILLIY BOG'I — Lençóis
   🏷️ Turi: attraction | tabiat, or
   🕐 Ish vaqti: 24/7 (bog'); turlar 07:00–18:00
   💵 Narxi: Bepul (bog'); turlar $40–80
   🚌 Transport: Salvador'dan avtobuslar, 7 soat; Lençóis shahridan turlar
   📝 Bahia shtatidagi kristal daryo va sharshara bilan to'lgan yassi tog' platosi. Fumaca sharsharasi — Braziliyaning eng baland sharsharasi 340 metr. Poço Encantado — er osti ko'li, quyosh nuri tushganda moviy rangga bo'yaladi.

③ RIO DE JANEIRO — CRISTO REDENTOR — Rio de Janeiro
   🏷️ Turi: attraction | ikonik, tarix
   🕐 Ish vaqti: 08:00–19:00 (har kuni)
   💵 Narxi: R$84 (~$17)
   🚌 Transport: Cosme Velho stantsiyasidan kremayer poyezdiga (R$84 narxga kiradi)
   📝 Corcovado tog'i tepasida 38 metr balandlikdagi Xristus haykali butun Rio'ni quchoqlaydi. Kanatkabi yoki piyoda yo'l bilan chiqiladi. Bulutli kunda haykal ustidan chiqib turadi — mistik ko'rinish. Dunyo yetti mo'jizasidan biri.

④ FLORIANÓPOLIS — JOAQUINA PLYAJI — Florianópolis
   🏷️ Turi: attraction | plyaj, surf, tabiat
   🕐 Ish vaqti: 24/7
   💵 Narxi: Bepul
   🚌 Transport: Florianópolis aeroportidan 30 daqiqa avtomobil
   📝 Braziliyaning Orollar oroli — 42 ta plyaj bir orolda. Joaquina surfchilar uchun ideal, Lagoa da Conceição esa kitesurfingning jannat. Janubiy Braziliyaning toza suvi va yaxshi infratuzilmasi bilan farqlanadi.

⑤ IGUAÇU SHARSHARALARI (BRAZILIYA TOMONI) — Foz do Iguaçu
   🏷️ Turi: attraction | tabiat, sharshara, UNESCO
   🕐 Ish vaqti: 09:00–17:00 (har kuni)
   💵 Narxi: R$92.5 (~$19)
   🚌 Transport: Foz do Iguaçu shahridan avtobus 30 daqiqa
   📝 Dunyodagi eng keng sharshara — 275 ta alohida oqim, umumiy eni 2.7 km. Braziliya tomoni panoramik ko'rinish uchun eng yaxshi, Argentina tomoni esa yaqin masofa uchun. Eleanor Roosevelt: "Niagara uyalib qoldi" degan edi bu yerni ko'rib.

⑥ PANTANAL YOVVOYI TABIAT SAFARISI — Cuiabá
   🏷️ Turi: attraction | safari, tabiat, yovvoyi tabiat, foto
   🕐 Ish vaqti: Turlar 05:30 tongda boshlanadi
   💵 Narxi: $100–200 (kunlik safari)
   🚌 Transport: Cuiabá aeroportidan lojlar 2–4 soat
   📝 Dunyo eng katta tropik botqoqlik — Amazon'dan ko'ra yovvoyi hayvonlarni ko'rish osonroq. Yaguarlar, kapibara, tapirlar, chuchuk suv delfini. Quruq mavsumda (May–Sentyabr) hayvonlar suv atrofida to'planadi va ko'rish ajoyib bo'ladi.

⑦ SALVADOR — PELOURINHO KO'CHASI — Salvador
   🏷️ Turi: attraction | madaniyat, tarix, Afrika merosi, UNESCO
   🕐 Ish vaqti: 24/7
   💵 Narxi: Bepul (mahalla)
   🚌 Transport: Salvador markazidan Elevador Lacerda bilan yuqori shaharga
   📝 Braziliyadagi Afrika madaniyatining qal'asi. Rang-barang koloniyal binolar, Candomblé diniy marosimlari, Capoeira o'yini ko'chada. Ommaviy karnaval vaqtida bu mahalla butun dunyo uchun zarb bo'lib otiladi.

════════════════════════════════════════════════════════

🌍 SWITZERLAND (CH)
① BAHNHOFSTRASSE ZURICH — Zurich
   🏷️ Turi: attraction | savdo, mahalliy hayot, lüks
   🕐 Ish vaqti: 09:00–20:00 (dushanba–shanba)
   💵 Narxi: Bepul (savdo: narxi o'zgaruvchan)
   🚌 Transport: Zurich HB dan piyoda 2 daqiqa
   📝 Dunyoning eng qimmat savdo ko'chalaridan biri — lüks soat, shokolad va moda brendlari. Lindenhügel tepasidan shahar manzarasi. Zürichsee ko'li bo'yida kechki sayr majburiy.

② BERN OLD TOWN — Bern
   🏷️ Turi: attraction | UNESCO, tarix, arxitektura
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul
   🚌 Transport: Bern HB dan piyoda 10 daqiqa
   📝 UNESCO ro'yxatidagi 6 km yopiq arkadali ko'chalar — Zytglogge soat minorasi, medievel fontanlar va Eynshteyn yashagan uy. Ayiq bog'i ham shu yerda joylashgan.

③ CHAPEL BRIDGE (KAPELLBRÜCKE) — Lucerne
   🏷️ Turi: attraction | tarix, arxitektura, ikonik
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul
   🚌 Transport: Luzern HB dan piyoda 5 daqiqa
   📝 1333 yildan beri turgan yog'och ko'prik — Yevropa ning eng qadimiy yopiq ko'prigi. Ichidagi XVII asr pannolari Shveytsariya tarixini aks ettiradi. Reuss daryosi bo'yida sayr qilinadi.

④ GRINDELWALD VALLEY — Grindelwald
   🏷️ Turi: attraction | tabiat, ski, piyoda yurish
   🕐 Ish vaqti: Gondola: 08:30–17:30 (har kuni)
   💵 Narxi: CHF 36 (First gondolasi)
   🚌 Transport: Interlaken Ost dan poyezd, 35 daqiqa
   📝 Eiger shimoliy yuz tagidagi qishloq — qish uchun ski, yoz uchun piyoda yurish bazasi. First tog'idan Bachalpsee ko'li ko'rinadi. Gondola bilan tepaga chiqish oson.

⑤ JUNGFRAUJOCH – TOP OF EUROPE — Grindelwald
   🏷️ Turi: attraction | ikonik
   🕐 Ish vaqti: 08:00–17:00 (har kuni)
   💵 Narxi: CHF 145.40 (Interlaken dan)
   🚌 Transport: Interlaken Ost dan Bernese Oberland Railway, 2 soat
   📝 3,454 metr balandlikdagi Yevropa ning eng yuqori temir yo'l stantsiyasi. Aletsch muzligi panoramasi, muz saroyi va tashqi kuzatuv maydoni. Ertalab boring — bulut kamroq.

⑥ OLYMPIC MUSEUM LAUSANNE — Lausanne
   🏷️ Turi: attraction | muzey, sport, Olimpiya
   🕐 Ish vaqti: 09:00–18:00 (seshambadan yakshanba)
   💵 Narxi: CHF 20
   🚌 Transport: Lausanne Ouchy metro M2, 5 daqiqa yurish
   📝 Olimpiya harakatining bosh muzeyida 5,000 dan ortiq artefakt — medallar, kiyimlar va video arxivlar. Geneva ko'li yonida joylashgan, bog'i ham go'zal. Sport tarixi sevuvchilar uchun majburiy.

⑦ MATTERHORN VIEW – ZERMATT — Zermatt
   🏷️ Turi: attraction | tabiat
   🕐 Ish vaqti: 07:00–19:00 (poyezd jadvali)
   💵 Narxi: CHF 99 (Gornergrad round trip)
   🚌 Transport: Visp dan poyezd, 1 soat 20 daqiqa
   📝 4,478 metrlik piramida shaklidagi tog' — Shveytsariya ramzi. Gornergrad temir yo'li bilan 3,089 metrga chiqib panorama tomosha qilish mumkin. Zermatt da avtomobil yo'q.

════════════════════════════════════════════════════════

🌍 CHINA (CN)
① THE BUND — Shanghai
   🏷️ Turi: attraction | arxitektura, daryokenar, Shanghai
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: 0
   🚌 Transport: East Nanjing Road metro bekatidan 10 daqiqa piyoda
   📝 Huangpu daryosi bo'ylab cho'zilgan Avropa uslubidagi binolar qatori va qarshisida Pudong zamonaviy osmono'par binoları. Kechqurun ikkala qirg'oqdan ajoyib ko'rinish.

② CHENGDU PANDA BAZASI — Chengdu
   🏷️ Turi: attraction | hayvonlar, panda, tabiat
   🕐 Ish vaqti: 07:30–18:00 (har kuni)
   💵 Narxi: 55 CNY
   🚌 Transport: Chengdu metro 3-liniya, Panda Avenue bekati
   📝 Katta pandalarni yaqindan ko'rish uchun dunyodagi eng yaxshi joy. 80 dan ortiq panda — kichiklar, kattalar. Ertalab 08:00–10:00 oralig'ida ularni yeyayotgan ko'rish mumkin.

③ DADONG PEKIN SHIRPECHAK O'RDAGI — Beijing
   🏷️ Turi: restaurant | restoran
   🕐 Ish vaqti: 11:00–22:00 (har kuni)
   💵 Narxi: 200–300 CNY/kishi
   🚌 Transport: Dongsi yoki Dongzhimen metro bekatidan taksi
   📝 Beijing Pekin o'rdagining eng mashhur restoranlari. Maxsus pechda qovurilgan o'rdak, ingichka blincik va hoisin sous bilan. Oldindan bron qilish tavsiya etiladi.

④ YASHRINGA KO'CHASI (FORBIDDEN CITY) — Beijing
   🏷️ Turi: attraction | UNESCO, saroy, Beijing
   🕐 Ish vaqti: 08:30–17:00 (dushanba yopiq)
   💵 Narxi: 60 CNY
   🚌 Transport: Tiananmen East/West metro bekatidan 5 daqiqa piyoda
   📝 Ming va Qing sulolalari imperatorlar saroyi — 9999 xona, 72 gektar maydon. Qizil devorlar, sariq sopol tomlar va katta hovlilar. Oldindan onlayn chipta band qiling.

⑤ BUYUK XITOY DEVORI — BADALING — Beijing
   🏷️ Turi: attraction | UNESCO, tarix, ikonik
   🕐 Ish vaqti: 07:30–17:00 (mavsum bo'yicha o'zgaradi)
   💵 Narxi: 40 CNY
   🚌 Transport: Beijing-da S2 poyezd yoki avtobus 877-marshrut
   📝 Eng yaxshi saqlanib qolgan va eng qulay bo'lim. Tong'da kamroq odamlar, panoramali manzaralar. 2000 yildan ortiq tarix — qadimiy harbiy mudofaa inshootining ramzi.

⑥ HUANGSHAN (SARIQ TOG') — Huangshan
   🏷️ Turi: attraction | UNESCO
   🕐 Ish vaqti: 06:00–17:00 (mavsum bo'yicha)
   💵 Narxi: 190 CNY
   🚌 Transport: Huangshan Yungu kanatli yo'l yoki piyoda marshrut
   📝 Bulutlar ichida suzuvchi granit cho'qqilari va qadimiy qarag'aylar. Xitoy rassomchiligi va she'riyatining ilhom manbai. Kanatli yo'l bilan tepaga, tong otishida fog ko'rinishi ajoyib.

⑦ LIJIANG ESKI SHAHRI — Lijiang
   🏷️ Turi: attraction | UNESCO, eski shahar, Yunnan
   🕐 Ish vaqti: Shahar: doim ochiq. Muzeylar: 08:00–17:30
   💵 Narxi: 80 CNY (kalit ob'ektlar uchun)
   🚌 Transport: Lijiang aeroportidan 20 daqiqa taksi bilan
   📝 Naxi xalqining yog'och uyli, tosh ko'chali UNESCO qo'riqlanadigan eski shahri. Kichik kanallar va ko'priklar. Yulong Qor tog'i fonida ayniqsa chiroyli.

⑧ TERRA-KOTTA ASKARLARI — Xi'an
   🏷️ Turi: attraction | UNESCO, arxeologiya, tarix
   🕐 Ish vaqti: 08:30–17:30 (har kuni)
   💵 Narxi: 120 CNY
   🚌 Transport: Xi'an East Station yaqinida, 306 yoki 914-avtobus
   📝 Mil. avv. 210-yilda ko'milgan 8000 dan ortiq loydan yasalgan askar haykali. Qin Shi Huang imperatorining qabri yonida. Kashf etilganida dunyo hayratga tushgan.

════════════════════════════════════════════════════════

🌍 COLOMBIA (CO)
① BOGOTÁ — LA CANDELARIA — Bogotá
   🏷️ Turi: attraction | tarix, muzey, madaniyat
   🕐 Ish vaqti: 09:00–18:00 (muzeylar)
   💵 Narxi: Bepul (mahalla); Museo del Oro 4,000 COP (~$1)
   🚌 Transport: TransMilenio: Portal Usme yoki Jimenez stantsiyalari
   📝 Bogota'ning tarixiy markazi — Museo del Oro (Oltin muzey), Botero muzeyi va Monserrate tog'i bilan. Museo del Oro da 55,000 dan ortiq oltin artefakt. Monserrate'dan 2600 metr balandlikdan butun Bogota ko'zga tashlanadi — bulutli kunlar ko'proq.

② CAÑO CRISTALES — RANGLAR DARYOSI — La Macarena
   🏷️ Turi: attraction | tabiat, noyob, daryo
   🕐 Ish vaqti: Tur vaqtida 08:00–16:00
   💵 Narxi: $50–80 (tur + kirish)
   🚌 Transport: Bogota'dan kichik samolyot La Macarena'ga 1 soat
   📝 Yil faqat Iyul–Noyabr orasida ko'rinadigan tabiiy mo'jiza — daryoning o'zi qizil, sariq, yashil, ko'k va qora ranglarga bo'yaladi. Macarenia clavigera suv o'ti quyosh nurida gullaydi. Dunyo eng rang-barang daryosi deb tan olingan.

③ CARTAGENA — WALLED CITY (ESKI SHAHAR) — Cartagena
   🏷️ Turi: attraction | tarix, arxitektura, UNESCO, shahar
   🕐 Ish vaqti: 24/7
   💵 Narxi: Bepul (shahar devori)
   🚌 Transport: Rafael Núñez aeroportidan taksi 15 daqiqa
   📝 1586-yilda qurilgan 11 km uzunlikdagi devor ichidagi shahar — ispan koloniyal arxitekturasining La Tin Amerikanidagi eng saqlanib qolgan namunasi. Sariq, ko'k, pushti rangdagi balkonlardan gullar osilib turadi. Kechasi devor ustida yurib okean shabadasi va shamol tabassum qildiradi.

④ COCORA VODIYSI — VAKS DARAXTI — Salento
   🏷️ Turi: attraction | tabiat, trekking, flora
   🕐 Ish vaqti: 07:00–17:00
   💵 Narxi: 5,000 COP (~$1.5) kirish
   🚌 Transport: Salento shahridan jeep 20 daqiqa
   📝 Kolumbiya milliy daraxti — vaks palma — 60 metr balandlikda, tumanli andin tog'larida o'sadi. Cocora vodiysi bu daraxtlarning jannat — yam-yashil o'tloqda ular muhtasham minoralar kabi turadi. 4–6 soatlik piyoda yo'l bor, qumoq daryo kechmalar bilan.

⑤ LETICIA — KOLUMBIYA AMAZONI — Leticia
   🏷️ Turi: attraction | tabiat, Amazon, sarguzasht, qabila
   🕐 Ish vaqti: Turlar 06:00 dan
   💵 Narxi: $80–150 (2 kunlik tur)
   🚌 Transport: Bogota'dan 2 soat uchish (faqat samolyot)
   📝 Kolumbiya, Braziliya va Peru chegaralari birlashadigan Amazon daryosi bo'yidagi shahar. Tikuna qabilalari qishloqlari, Amazon daryosida baliq ovi, Amacayacu milliy bog'i. Uch mamlakatni bir kuning ichida kesib o'tish mumkin — daryo chegarasi.

⑥ MEDELLÍN — TRANSFORMATION CITY TURI — Medellín
   🏷️ Turi: attraction | shahar, tarix, madaniyat
   🕐 Ish vaqti: Turlar 09:00–17:00
   💵 Narxi: $15–30 (yo'naltirilgan tur)
   🚌 Transport: José María Córdova aeroportidan metro 45 daqiqa
   📝 90-yillarda dunyo eng xavfli shahri — bugun innovatsiya poytaxti. Metrokabel bilan comunalar'ga chiqish, graffiti tur, Fernando Botero heykallari, La 70 va El Poblado ko'chalari. Shahardagi o'zgarish tarixi har so'qmoqda seziladi.

⑦ SAN ANDRÉS OROLI — San Andrés
   🏷️ Turi: attraction | plyaj, orol, Karib, suzish
   🕐 Ish vaqti: 24/7
   💵 Narxi: $30 (orolga kirish to'lovi) + parvoz
   🚌 Transport: Bogota, Medellín yoki Cartagena'dan 1–1.5 soat uchish
   📝 Nikaragua yaqinidagi Karib orolida kristal suv, moviy-yashil gradiyent — "Yetti rang dengizi" deb ataladi. Johnny Cay oroli va El Acuario suzish joylari. Orol Kolumbiyaga qarashli, lekin madaniyati va tilida ingliz va kreol ta'siri seziladi.

════════════════════════════════════════════════════════

🌍 CZECH REPUBLIC (CZ)
① ČESKÝ KRUMLOV — Český Krumlov
   🏷️ Turi: attraction | UNESCO, tarix, arxitektura
   🕐 Ish vaqti: 09:00–17:00 (dushanba yopiq)
   💵 Narxi: CZK 200 (qal'a)
   🚌 Transport: Praha florenc avtobus stantsiyasidan, 3 soat
   📝 Vltava daryosi qo'ynidagi o'rta asr shahri — UNESCO ob'ekti. Renessans qasri, barokko teatri va shahar markazidagi ko'chalar XVI asrda qolgan. Prag dan bir kun sayohat.

② CHARLES BRIDGE — Prague
   🏷️ Turi: attraction | UNESCO, tarix, arxitektura
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul
   🚌 Transport: Staroměstská A metrodan piyoda 5 daqiqa
   📝 1357 yilda qurilgan tosh ko'prik — 30 ta barokko heykali bilan bezatilgan. Tong 06:00 da sayrlovchilar kam bo'ladi. Ko'prik uchidan qal'a va Praga manzarasi ochiladi.

③ JOSEFOV JEWISH QUARTER — Prague
   🏷️ Turi: attraction | tarix, madaniyat, UNESCO
   🕐 Ish vaqti: 09:00–18:00 (shanba yopiq)
   💵 Narxi: CZK 350 (muzey to'plami)
   🚌 Transport: Staroměstská A metrosi yaqinida
   📝 Yevropaning eng yaxshi saqlangan yahudiy mahallasi. Olti sinagoga, qabriston va marosim xonasi. Yahudiy muzeyiga bilet olsangiz barchasiga kirish mumkin. Kafka shu yerda tug'ilgan.

④ SEDLEC OSSUARY – KUTNÁ HORA — Kutná Hora
   🏷️ Turi: attraction | tarix
   🕐 Ish vaqti: 08:00–18:00 (har kuni)
   💵 Narxi: CZK 130
   🚌 Transport: Praha HB dan poyezd, 1 soat
   📝 40,000–70,000 insonning suyaklaridan yasalgan bezaklar — chandelier, gerb va dekor. Bir tomondan dahshatli, bir tomondan g'alati go'zal. Kutna Hora katedrali ham UNESCO ob'ekti.

⑤ OLD TOWN SQUARE & ASTRONOMICAL CLOCK — Prague
   🏷️ Turi: attraction | ikonik, UNESCO, tarix
   🕐 Ish vaqti: Doim ochiq (soat: 09:00–22:00)
   💵 Narxi: Bepul (soat minorasi: CZK 250)
   🚌 Transport: Staroměstská A metrosi, 2 daqiqa yurish
   📝 1410 yildan ishlayotgan astronomik soat — har soatda 12 aposto figurasi harakatga keladi. Atrofidagi gotik va barokko binolar, Tyn cherkovi — Praga markazining ramzi.

⑥ PILSNER URQUELL BREWERY — Plzeň
   🏷️ Turi: attraction | pivo, sanoat
   🕐 Ish vaqti: 10:00–18:00 (har kuni)
   💵 Narxi: CZK 250 (degustatsiya bilan)
   🚌 Transport: Praha HB dan poyezd Plzeň ga, 1 soat 30 daqiqa
   📝 1842 yildan beri ishlayotgan dunyoning eng mashhur pivoxonasi — Pilsner stili shu yerda ixtiro qilingan. Yerosti tarvuzi omborida filtr qilinmagan pivo tatish mumkin. Bron qiling.

⑦ PRAGUE CASTLE — Prague
   🏷️ Turi: attraction | ikonik, UNESCO, tarix
   🕐 Ish vaqti: 09:00–17:00 (har kuni)
   💵 Narxi: CZK 250 (to'liq marshrut)
   🚌 Transport: Malostranska A metrodan funikulyor yoki piyoda
   📝 Dunyodagi eng katta qal'a kompleksi — 70,000 kv.m. Svyatoy Vit sobori, Qirol saroyi va Oltin yo'lcha — barchasi bir joyda. Kech kuzda tumanli shahar panoramasi misli yo'q.

════════════════════════════════════════════════════════

🌍 GERMANY (DE)
① BLACK FOREST (SCHWARZWALD) — Freiburg
   🏷️ Turi: attraction | tabiat, piyoda yurish, manzara
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul (Triberg: €5)
   🚌 Transport: Freiburg dan poyezd, 1 soat
   📝 Qalin ignabargli o'rmonlar, toza ko'llar va yashirin qishloqlar — Schwarzwald Germaniyaning yashil yuragi. Triberg sharsharalari va Titisee ko'li eng mashhur nuqtalar.

② BRANDENBURG GATE — Berlin
   🏷️ Turi: attraction | ikonik, tarix, arxitektura
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul
   🚌 Transport: Brandenburger Tor S/U-Bahn, 2 daqiqa yurish
   📝 1791 yilda qurilgan neoklassik darvoza — birlashgan Germaniya ramzi. Berlin devorining qulagandan keyin erkinlik timsolini bildiradi. Kechasi yoritilganda ayniqsa ta'sirchan.

③ CHECKPOINT CHARLIE — Berlin
   🏷️ Turi: attraction | tarix, muzey, Berlin devori
   🕐 Ish vaqti: Doim ochiq (muzey: 09:00–22:00)
   💵 Narxi: Bepul (muzey: €15)
   🚌 Transport: Kochstraße U6 metro, 3 daqiqa
   📝 Sovuq urush davrida G'arb va Sharq Berlini orasidagi eng mashhur o'tish nuqtasi. Yonidagi muzeyda devordan qochish urinishlari haqida hujjatlar saqlanadi.

④ COLOGNE CATHEDRAL — Cologne
   🏷️ Turi: attraction | UNESCO, arxitektura, din
   🕐 Ish vaqti: 06:00–21:00 (har kuni)
   💵 Narxi: Bepul (minora: €6)
   🚌 Transport: Köln Hauptbahnhof, 1 daqiqa yurish
   📝 632 yil qurilgan gotik soborning balandligi 157 metr. Ichkaridagi vitraj derazalar va Uch Shohi sandıqı — ibodatxona xazinasi. Minoraga chiqsangiz Reyn daryosi ko'rinadi.

⑤ HOFBRÄUHAUS MÜNCHEN — Munich
   🏷️ Turi: restaurant | restoran, pivo
   🕐 Ish vaqti: 11:00–23:30 (har kuni)
   💵 Narxi: €18–30 kishi boshiga
   🚌 Transport: Marienplatz U/S-Bahn, 5 daqiqa yurish
   📝 1589 yilda ochilgan qirollik pivoxonasi. 1 litrlik Masskrug bilan Bayern pivo va Schweinshaxe — an'anaviy bavariya kechkisi. Oktoberfest davrida bron majburiy.

⑥ NEUSCHWANSTEIN CASTLE — Schwangau
   🏷️ Turi: attraction | arxitektura, tarix, fotografiya
   🕐 Ish vaqti: 09:00–18:00 (aprel–okt), 10:00–16:00 (qish)
   💵 Narxi: €15 (ekskursiya)
   🚌 Transport: München dan avtobus va poyezd, 2 soat
   📝 Qirol Lyudvig II uchun 1869 yilda qurilgan ertak qasri. Disney qasrlari shu yerdan ilhom olgan. Alplar fonida tabiiy panorama uchun Marienbrücke ko'prigiga chiqing.

⑦ ROTHENBURG OB DER TAUBER — Rothenburg ob der Tauber
   🏷️ Turi: attraction | tarix, arxitektura
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul (shahar devori: bepul)
   🚌 Transport: Nürnberg dan poyezd, 1 soat 15 daqiqa
   📝 O'rta asrlarda to'liq saqlanib qolgan shahar. Devorlar bo'ylab yurish, gece darvozachi ekskursiyasi va Schneeball shirinligi — barchasi bir joyda. Romantik Germaniya yo'lida joylashgan.

════════════════════════════════════════════════════════

🌍 EGYPT (EG)
① ABU SIMBEL IBODATXONALARI — Aswan
   🏷️ Turi: attraction | tarix, Ramses, UNESCO, arxeologiya
   🕐 Ish vaqti: 05:00–18:00 (har kuni)
   💵 Narxi: 540 EGP (~$18)
   🚌 Transport: Aswan shahridan samolyot 45 min yoki avtobus 3 soat
   📝 Ramses II'ning 3200 yillik ulkan qoyaga o'yilgan ibodatxonasi. 1968-yilda suv omboridan qutqarish uchun butunlay ko'chirildi — muhandislik mo'jizasi. Yiliga ikki kun — 22 Fevral va 22 Oktyabrda — quyosh to'g'ri qorong'u zal ichiga kiradi.

② QOHIRA MISR MUZEYI — Qohira
   🏷️ Turi: attraction | muzey, tarix, Misr, arxeologiya
   🕐 Ish vaqti: 09:00–17:00 (har kuni)
   💵 Narxi: 200 EGP (~$7); momiyalar zali +180 EGP
   🚌 Transport: Tahrir maydoni — muzey yonida; metro Sadat stantsiyasi
   📝 Dunyo eng katta Misr arxeologiya kolleksiyasi — 120,000 dan ortiq artefakt. Tutankhamun'ning oltin niqobi va sarkofagi asosiy diqqat markazida. Momiyalar zali alohida chipta talab etadi, lekin davlat sirlarini ko'rganday his qilasiz.

③ GIZA PIRAMIDALAR VA SFINKS — Giza
   🏷️ Turi: attraction | tarix, UNESCO
   🕐 Ish vaqti: 08:00–17:00 (qishda), 08:00–19:00 (yozda)
   💵 Narxi: 360 EGP (~$12) + ichki kirish alohida
   🚌 Transport: Qohira markazidan taksi 30 daqiqa; metro + mikroavtobus
   📝 4500 yil oldin qurilgan va hali ham saqlanib qolgan qadimiy dunyo yetti mo'jizasining yagona namunasi. Xeops piramidasi 146 metr baland, 2.3 million tosh blokdan iborat. Katta Sfinks 73 metr uzunlikda, kimning yuzi ekanligi hali bahs mavzusi.

④ HURGHADA — MARJON RIFLAR — Hurghada
   🏷️ Turi: attraction | plyaj, diving, marjon, dengiz
   🕐 Ish vaqti: 08:00–17:00 (turlar)
   💵 Narxi: $25–60 (yarim kunlik tur)
   🚌 Transport: Hurghada aeroportidan kurort hududlariga 10–20 daqiqa
   📝 Qizil dengiz marjon riflari — Giftun va Abu Ramada orollari yaqinida suzish va skooba diving uchun Misrning eng mashhur joyi. Ko'rish masofasi 30 metrgacha, suv harorati yil bo'yi 22–28 daraja. Ko'p rangli baliqlar va marjonlar yangi boshlovchilar uchun ham xavfsiz.

⑤ XON EL-XALILI BOZORI — Qohira
   🏷️ Turi: attraction | bozor, mahalliy hayot, tarix, xarid
   🕐 Ish vaqti: 09:00–21:00 (Juma kuni yopiladi)
   💵 Narxi: Bepul (kirishga)
   🚌 Transport: Metro: Al-Azhar, so'ng piyoda 10 daqiqa
   📝 14-asrdan beri ochiq bo'lgan ulkan bozor labirint — ziravorlar, zargarlari, mis idishlar, gilamlar va esdalik buyumlar. Atqafa koridori eng qadimiy va haqiqiy qismi. El Fishawy qahvaxonasi 240 yildan beri ishlaydi — nargileh bilan qahva iching.

⑥ LUXOR — KARNAK IBODATXONA KOMPLEKSI — Luxor
   🏷️ Turi: attraction | tarix, ibodatxona, UNESCO, arxeologiya
   🕐 Ish vaqti: 06:00–17:30 (har kuni)
   💵 Narxi: 420 EGP (~$14)
   🚌 Transport: Luxor aeroportidan taksi 10 daqiqa; kallasha yoki taksi
   📝 Yer yuzidagi eng katta diniy bino majmuasi — 80 gektarlik maydon, 134 dona giganat ustunlar. 2000 yil davomida har bir Fir'avon biror narsa qo'shgan — tarix qatlamlarini his qilish mumkin. Kechasi sound-and-light shou bor.

⑦ NIL KRUIZI — ASWAN'DAN LUXOR'GA — Aswan
   🏷️ Turi: attraction | kruiz, Nil, tarix, tajriba
   🕐 Ish vaqti: 24/7 (kemada)
   💵 Narxi: $150–400 (3 tunlik paket)
   🚌 Transport: Aswan yoki Luxor aeroportidan kruiz terminali
   📝 3–4 kunlik kema safari — Nil bo'ylab Misr qadimiy ibodatxona va xarobalari yaqinidan o'tadi. Edfu va Kom Ombo ibodatxonalari yo'l ustida. Kechasi kemada yulduzli osmon, ertalab yangi qishloq va dalalar — bu Misr'ni boshqacha ko'rsatadi.

════════════════════════════════════════════════════════

🌍 SPAIN (ES)
① ALHAMBRA PALACE — Granada
   🏷️ Turi: attraction | UNESCO, tarix, arxitektura
   🕐 Ish vaqti: 08:00–20:00 (mavsumga qarab)
   💵 Narxi: €19 (Nasrid saroylari bilan)
   🚌 Transport: Granada markazidan C3 avtobus, 15 daqiqa
   📝 Nasrid sulolasining XIV asrdagi saroyi — arabcha muqarnas va suv havzalari ila bezatilgan. Generalife bog'lari va Alcazaba qo'rg'oni ham ichida. Kunlik chiptalar tez tugaydi.

② FLAMENCO SHOW SEVILLE — Seville
   🏷️ Turi: attraction | madaniyat, raqs
   🕐 Ish vaqti: 19:00–22:30 (har kuni, seans 1.5 soat)
   💵 Narxi: €18–35 kishi boshiga
   🚌 Transport: Archivo de Indias yaqinida, Sevilla markazida
   📝 Casa de la Memoria yoki Tablao El Arenal da jonli flamenco — gitara, zarb va raqschi. Triana mahallasidagi kichik tablao-larda atmosfera ulkan teatrga nisbatan ancha haqiqiyroq.

③ LA BOQUERIA MARKET — Barcelona
   🏷️ Turi: attraction | bozor, mahalliy hayot, oshxona
   🕐 Ish vaqti: 08:00–20:30 (yakshanba yopiq)
   💵 Narxi: Bepul (oziq-ovqat: narxi o'zgaruvchan)
   🚌 Transport: Liceu L3 metro, 2 daqiqa yurish
   📝 1836 yildan beri ishlaydigan bozor. Yangi dengiz mahsulotlari, Jamon Ibérico, tropik mevalar va yangi sharbatlar. Ertalab 09:00 da boring — kechroq sayyohlar to'lib ketadi.

④ MEZQUITA-CATEDRAL DE CÓRDOBA — Córdoba
   🏷️ Turi: attraction | UNESCO, arxitektura, tarix
   🕐 Ish vaqti: 10:00–19:00 (yakshanba: 08:30–11:30 bepul)
   💵 Narxi: €13
   🚌 Transport: Córdoba markazidan piyoda 15 daqiqa
   📝 VIII asr masjidi ichiga qurilgan XVI asr katedrali. Qizil-oq qavs ustunlar dengizi va oltin mihrab — islom arxitekturasining Ispaniyadagi eng go'zal namunasi.

⑤ PARK GÜELL — Barcelona
   🏷️ Turi: attraction | Gaudi, tabiat, manzara
   🕐 Ish vaqti: 08:00–21:30 (har kuni)
   💵 Narxi: €10 (asosiy maydon)
   🚌 Transport: Lesseps L3 metro, 15 daqiqa yurish
   📝 Gaudining mozaik bilan bezatilgan tabiat-parki. Asosiy terrasadan butun Barcelona va dengiz ko'rinadi. Ertalab 08:00 da kirsangiz olomon kamroq bo'ladi.

⑥ MUSEO DEL PRADO — Madrid
   🏷️ Turi: attraction | muzey
   🕐 Ish vaqti: 10:00–20:00 (dushanba yopiq)
   💵 Narxi: €15 (kechki seanslarda bepul)
   🚌 Transport: Banco de España yoki Atocha metro, 10 daqiqa
   📝 Velazkesning Las Meninas, Goyaning Qora rasmlar va El Greko kolleksiyasi — Ispaniya san'atining eng to'liq xazinasi. Ishchi kunlari kechki 18:00–20:00 bepul kirish.

⑦ SAGRADA FAMÍLIA — Barcelona
   🏷️ Turi: attraction | ikonik, arxitektura, Gaudi
   🕐 Ish vaqti: 09:00–20:00 (har kuni)
   💵 Narxi: €26 (minora: +€9)
   🚌 Transport: Sagrada Família L2/L5 metro, 1 daqiqa
   📝 Gaudining hali tugallanmagan katedrali — 1882 yildan beri qurilmoqda. Ichkarida rang-barang vitraj nurlar, tashqarida o'sib chiqayotgan minoralar. Bron shart.

════════════════════════════════════════════════════════

🌍 FRANCE (FR)
① EIFFEL TOWER — Paris
   🏷️ Turi: attraction | ikonik, manzara, tarix
   🕐 Ish vaqti: 09:30–23:45 (har kuni)
   💵 Narxi: €29.40 (lift, yuqori qavat)
   🚌 Transport: Bir Hakeim metro, 5 daqiqa yurish
   📝 1889 yilda qurilgan 330 metrlik temir minora. Kechqurun har soatda 5 daqiqa chaqnaydi. Yuqori qavatga lift bilan chiqish mumkin — Paris panoramasi ko'rinadi.

② LE MARAIS QUARTER — Paris
   🏷️ Turi: attraction | mahalliy hayot, oshxona
   🕐 Ish vaqti: Doim ochiq (do'konlar 10:00–19:00)
   💵 Narxi: Bepul (ko'chada sayr)
   🚌 Transport: Saint-Paul yoki Chemin Vert metro
   📝 Paris ning eng jonli ko'chalaridan biri. Yahudiy novvoyxonalar, zamonaviy galereyalar, vintage do'konlar va Place des Vosges — barchasi shu yerda joylashgan.

③ LOUVRE MUSEUM — Paris
   🏷️ Turi: attraction
   🕐 Ish vaqti: 09:00–18:00 (seshanba yopiq)
   💵 Narxi: €22 (oldindan bron qiling)
   🚌 Transport: Palais Royal–Musée du Louvre metro, 1 daqiqa
   📝 Dunyodagi eng katta san'at muzeyi va sobiq qirollik saroyi. Mona Liza, Venera de Milo kabi 380 000 dan ortiq durdonalar saqlanadi. I.M. Pei loyihalagan shisha piramida esa muzeyning zamonaviy ramziga aylangan.

④ BOUCHON LYONNAIS — Lyon
   🏷️ Turi: restaurant | restoran, mahalliy taom
   🕐 Ish vaqti: 12:00–14:00, 19:00–22:00 (yakshanba yopiq)
   💵 Narxi: €25–40 kishi boshiga
   🚌 Transport: Vieux-Lyon metro, 5 daqiqa yurish
   📝 Lyon ning an'anaviy bouchon restoranlarida quenelle, andouillette va tablier de sapeur tatib ko'rish mumkin. Chez Paul yoki Le Garet — mahalliylar sifatini tasdiqlaydi.

⑤ MONT SAINT-MICHEL — Normandiya
   🏷️ Turi: attraction | UNESCO, arxitektura, tarix
   🕐 Ish vaqti: 09:00–19:00 (mavsumga qarab)
   💵 Narxi: €13 (abbatiya kirish)
   🚌 Transport: Rennes yoki Caen dan avtobus, 1–1.5 soat
   📝 Dengiz o'rtasidagi tepalikda joylashgan o'rta asr abbatiyasi. Suvlar chekinganda piyoda borish mumkin. UNESCO ro'yxatidagi eng maftunkor Fransiya obidalari biri.

⑥ PROVENCE LAVENDER FIELDS — Valensole
   🏷️ Turi: attraction | tabiat, fotografiya, mavsumiy
   🕐 Ish vaqti: Doim ochiq (iyun–iyul eng yaxshi)
   💵 Narxi: Bepul (Manosque avtobuslari)
   🚌 Transport: Manosque dan taksi yoki avtomobil, 20 daqiqa
   📝 Iyun-iyul oylarida Valensole platosi binafsha-moviy lavanda dengizig aylanadi. Sabah ertalab yoki kechqurun borilsa yorug'lik va hid eng kuchli bo'ladi.

⑦ PALACE OF VERSAILLES — Versailles
   🏷️ Turi: attraction | tarix, arxitektura
   🕐 Ish vaqti: 09:00–18:30 (dushanba yopiq)
   💵 Narxi: €20 (saroy + bog')
   🚌 Transport: Paris Saint-Lazare dan RER C, 40 daqiqa
   📝 Qirol Lui XIV ning ulkan saroyi va 800 gektarlik bog'i. Oyna zali, Frantsuz bog'lari va Grande Trianon — har biri alohida ajoyib. Chorshanba kunlari fontanlar ishlaydi.

════════════════════════════════════════════════════════

🌍 UNITED KINGDOM (GB)
① BIG BEN & HOUSES OF PARLIAMENT — London
   🏷️ Turi: attraction | ikonik, siyosat, tarix
   🕐 Ish vaqti: Doim ko'rish mumkin (tours bron talab qiladi)
   💵 Narxi: Bepul (tashqaridan), Tours: £29.50
   🚌 Transport: Westminster Circle/District/Jubilee metro, 1 daqiqa
   📝 Elizabeth minorasi (rasmiy nomi) 96 metr baland. Parlament binosi Tours bilan ichkariga kirish mumkin. Westminster ko'prigi fotografiya uchun klassik nuqta.

② COTSWOLDS VILLAGES — Bourton-on-the-Water
   🏷️ Turi: attraction | tabiat, qishloq, fotografiya
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul (sayr)
   🚌 Transport: Oxford yoki Cheltenham dan avtobus, 30–50 daqiqa
   📝 Sariq ohaktosh uyli qishloqlar — Bibury, Bourton-on-the-Water va Castle Combe. Ingliz qishloq tabiatining jonli surati. Aprel-may oylarida lola va anemone gullari.

③ EDINBURGH CASTLE — Edinburgh
   🏷️ Turi: attraction | tarix, arxitektura, Shotlandiya
   🕐 Ish vaqti: 09:30–18:00 (har kuni)
   💵 Narxi: £20
   🚌 Transport: Edinburgn markazidan piyoda 15 daqiqa
   📝 Volkanik tepalik ustidagi qal'a — Shotlandiya tarixining markazi. Shotlandiya tojqo'y toshlari, eski qamoqxona va har kuni soat 13:00 da otiluvchi to'p — hammasi bir joyda.

④ OXFORD STREET & CARNABY STREET — London
   🏷️ Turi: attraction | savdo, mahalliy hayot, mod
   🕐 Ish vaqti: 10:00–22:00 (har kuni)
   💵 Narxi: Bepul (savdo: o'zgaruvchan)
   🚌 Transport: Oxford Circus Central/Victoria/Bakerloo metro
   📝 London ning savdo markazi — 300 dan ortiq do'kon. Carnaby Street — 1960-lar mod kulturasining manzili, hozir vintage va dizayn brendlari. Rozhdestvo chiroqlari maxsus.

⑤ STONEHENGE — Salisbury
   🏷️ Turi: attraction | ikonik, UNESCO, sirli
   🕐 Ish vaqti: 09:30–19:00 (har kuni)
   💵 Narxi: £22.50
   🚌 Transport: London Waterloo dan poyezd Salisbury ga, keyin avtobus
   📝 Miloddan avvalgi 3000 yildan qolgan sirli tosh doirasi. Har tosh 25 tonnadan og'ir. Yozgi quyosh tutilish kunida toshlar quyosh chiqish nuqtasi bilan aniq to'g'rilanadi.

⑥ SHAKESPEARE'S BIRTHPLACE — Stratford-upon-Avon
   🏷️ Turi: attraction | tarix, adabiyot, madaniyat
   🕐 Ish vaqti: 09:00–17:00 (har kuni)
   💵 Narxi: £23 (uy + bog')
   🚌 Transport: London Marylebone dan poyezd, 2 soat
   📝 Uilyam Shekspir 1564 yilda tug'ilgan XVI asr uyi. Muzey ko'rsatuvlari, kostyumli ekskursiyalar va RSC teatrida jonli spektakllar. Avon daryosida qayiqda suzish imkoni ham bor.

⑦ TOWER BRIDGE — London
   🏷️ Turi: attraction | ikonik, arxitektura, London
   🕐 Ish vaqti: 09:30–18:00 (har kuni)
   💵 Narxi: £12.30 (galereya)
   🚌 Transport: Tower Hill Circle/District metro, 5 daqiqa
   📝 1894 yilda ochilgan London ramzi. Shisha poldan Thames daryosiga qarash uchun yuqori galereya mavjud. Kema o'tganda ko'prik ko'tariladi — jadvali online tekshiriladi.

════════════════════════════════════════════════════════

🌍 GEORGIA (GE)
① BATUMI DENGIZKENNARI BULVARI — Batumi
   🏷️ Turi: attraction | dengiz, park, Batumi
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: 0
   🚌 Transport: Batumi markazidan piyoda
   📝 7 km uzunlikdagi Qora dengiz qirg'og'i bo'ylab cho'zilgan bulvar. Ali va Nino haykali kechqurun 7 daqiqada birlashadi. Muhiti jonli — restoran, attraktsion va musiqa.

② KAZBEGI — GERGETI TRINITY IBODATXONASI — Stepantsminda
   🏷️ Turi: attraction
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: 0 (bepul)
   🚌 Transport: Tbilisidan Kazbegi marshrutkasi (3 soat), keyin jeep
   📝 14-asrlik ibodatxona 2170 metr balandlikda, Kazbegi cho'qqisi (5047 m) fonida. Tog'ga piyoda 1.5–2 soat yoki jeep bilan. Bulutlar ibodatxona atrofida aylanib yuradi.

③ MTSKHETA — JVARI VA SVETITSKHOVELI — Mtskheta
   🏷️ Turi: attraction | UNESCO, diniy, tarix
   🕐 Ish vaqti: 10:00–18:00 (Svetitskhoveli)
   💵 Narxi: 0 (bepul)
   🚌 Transport: Tbilisidan marshrutka 10/37, 20 daqiqa
   📝 Gruziyaning qadimiy poytaxti va diniy markazi — UNESCO. Jvari xoch ibodatxonasi tepalikda Rioni daryosi qo'shilishini ko'rsatadi. Svetitskhoveli patriarxiya sobori 11-asrda qurilgan.

④ PHEASANT TEARS RESTORAN — Signagi
   🏷️ Turi: restaurant | restoran, vino, Kaxeti
   🕐 Ish vaqti: 12:00–23:00 (har kuni)
   💵 Narxi: 40–80 GEL/kishi
   🚌 Transport: Signagi markazida, Baratashvili ko'chasi 18
   📝 Amerika ruhoniysi John Wurdeman Kaxetida tashkil etgan natural vino restoran. Kvevri (sopol ko'za)da bijg'itilgan vino va an'anaviy Gruziya mezelari. Bog'dagi atmosfera noyob.

⑤ SIGNAGI SHAHAR DEVORI VA KAXETI — Signagi
   🏷️ Turi: attraction | shahar, vino, tarix
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: 0
   🚌 Transport: Tbilisidan marshrutka yoki taksi, 1.5 soat
   📝 Kaxeti viloyatidagi 18-asrlik devor bilan o'ralgan shaharcha — Gruziyaning eng chiroyli shahri. Bod bog'lari, yurt ma'nosi — Gruziya vinochiligining markazi. Nikah yozuvlar masjidi 24/7 ishlaydi.

⑥ TBILISI ESKI SHAHRI — Tbilisi
   🏷️ Turi: attraction | tarix, arxitektura, Tbilisi
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: 0 (ko'cha). Narikala: bepul
   🚌 Transport: Tbilisi metro Avlabari bekatidan 10 daqiqa piyoda
   📝 Rangli balkonli tarixiy uylar, g'or hammomlar va cherkov minoralari. Narikala qal'asi tepalikdan shaharni ko'rsatadi. Kanatli yo'l bilan ko'tarilish va yurish yo'li qulay.

⑦ TBILISI OLTINGUGURT HAMMOMLAR — Tbilisi
   🏷️ Turi: attraction | hammom, mahalliy hayot
   🕐 Ish vaqti: 08:00–23:00 (har kuni)
   💵 Narxi: 15–30 GEL (umumiy). 60–100 GEL (xususiy)
   🚌 Transport: Metekhi ko'prigidan 5 daqiqa piyoda
   📝 Abanotubani (hammom ko'chasi) — domlari xarakter gumbazli hammomlar. Tabiiy issiq oltingugurt suvida cho'milish. Xususiy xona bilan kese bilan tozalash Gruziya an'anasi.

⑧ VARDZIA G'OR SHAHRI — Aspindza
   🏷️ Turi: attraction | tarix
   🕐 Ish vaqti: 10:00–18:00 (har kuni)
   💵 Narxi: 3 GEL
   🚌 Transport: Tbilisidan 4–5 soat, yoki Borjomidan taksi 1.5 soat
   📝 12-asrda qoyaga o'yib qurilgan 3000 xonali monastir-shahar — Tamar qirolichasi davri. 6000 kishi istiqomat qilgan. G'or kilisa, kutubxona va saroylar. Janubiy Gruziyadagi eng noyob joy.

════════════════════════════════════════════════════════

🌍 GREECE (GR)
① ACROPOLIS OF ATHENS — Athens
   🏷️ Turi: attraction | ikonik, UNESCO, tarix
   🕐 Ish vaqti: 08:00–20:00 (har kuni)
   💵 Narxi: €20 (yozgi mavsumda)
   🚌 Transport: Acropolis M2 metro, 5 daqiqa yurish
   📝 Miloddan avvalgi V asrda qurilgan Parfenon ibodatxonasi — G'arb sivilizatsiyasining ramzi. Erechtheion va Propileon ham shu tepalikda. Quyosh chiqishida yoki botishida rang o'zgartiradi.

② DELPHI ARCHAEOLOGICAL SITE — Delphi
   🏷️ Turi: attraction | UNESCO, tarix, arxeologiya
   🕐 Ish vaqti: 08:00–20:00 (har kuni)
   💵 Narxi: €12 (muzey bilan)
   🚌 Transport: Afina dan avtobus, 2 soat 30 daqiqa
   📝 Parnass tog'i yon bag'rida joylashgan qadimgi Apollon ibodatxonasi va Oracle o'rni. Stadion, teatr va muzey kompleksi. Yunonlar uchun dunyoning markazi hisoblangan.

③ KNOSSOS PALACE – CRETE — Heraklion
   🏷️ Turi: attraction | tarix, arxeologiya, UNESCO
   🕐 Ish vaqti: 08:00–20:00 (har kuni)
   💵 Narxi: €15
   🚌 Transport: Heraklion markazidan avtobus 2, 15 daqiqa
   📝 Miloddan avvalgi 1700 yilda qurilgan Min sivilizatsiyasining ko'p qavatli saroyi. Minotavr afsonasining vatani. Qayta tiklangan freskalar va labirint tuzilmasi sayrni qiziqarli qiladi.

④ METEORA MONASTERIES — Kalambaka
   🏷️ Turi: attraction | UNESCO, din, fotografiya
   🕐 Ish vaqti: 09:00–17:00 (har biri turli kunda yopiq)
   💵 Narxi: €3 (har bir monastir)
   🚌 Transport: Afina dan poyezd, 4 soat
   📝 Ko'zni qamashtiradigan konglomerat qoya uchlaridagi XIV asr monastirlari. 6 ta hali faol. Tong chog'ida tumanlar orasida qoyalar otilib chiqadi — fotograflar uchun jannat.

⑤ MYKONOS TOWN (CHORA) — Mykonos
   🏷️ Turi: attraction | mahalliy hayot, fotografiya
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul (ko'chada sayr)
   🚌 Transport: Mykonos aeroportidan avtobus yoki taksi, 10 daqiqa
   📝 Labirint kabi oq ko'chalarda ittifoqchilar topmagan kapital qishloq. Little Venice bo'yi, Pelicans (orolning ramzi) va tegirmonlar — har burchak fotosuratga loyiq.

⑥ ANCIENT OLYMPIA — Olympia
   🏷️ Turi: attraction | tarix, sport, arxeologiya
   🕐 Ish vaqti: 08:00–20:00 (har kuni)
   💵 Narxi: €12 (muzey bilan)
   🚌 Transport: Afina dan avtobus, 4 soat
   📝 Olimpiya o'yinlari 776 miloddan avvalgi yildan boshlanib 1000 yil o'tkazilgan joy. Zeus ibodatxonasi xarobalari, stadion va muzey. Olimpiya alovi hali shu yerda yoqiladi.

⑦ OIA VILLAGE – SANTORINI — Oia
   🏷️ Turi: attraction | ikonik, fotografiya, romantik
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul (ko'chada sayr)
   🚌 Transport: Santorini aeroportidan avtobus, 30 daqiqa
   📝 Moviy gumbazli cherkovlar va oq uyli caldera tepasidagi qishloq. Quyosh botishi ko'rinishi uchun dunyoda eng mashhur joylardan biri. Ertalab sayrga chiqing — olomon kamroq.

════════════════════════════════════════════════════════

🌍 CROATIA (HR)
① DIOCLETIAN'S PALACE – SPLIT — Split
   🏷️ Turi: attraction | UNESCO, tarix, mahalliy hayot
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul (muzeylar: €3–8)
   🚌 Transport: Split markazida joylashgan
   📝 Imperator Diokletian III asrda qurib, o'ziga qamoqxona deb nomlagan saroy — ichida butun shahar joylashgan. Hozir bu yerda restoran, bar va mehmonxonalar faoliyat ko'rsatadi. UNESCO ob'ekti.

② DUBROVNIK CITY WALLS — Dubrovnik
   🏷️ Turi: attraction | UNESCO, tarix, arxitektura
   🕐 Ish vaqti: 08:00–19:30 (har kuni)
   💵 Narxi: €35
   🚌 Transport: Dubrovnik avtobus stantsiyasidan avtobus 4/6
   📝 14-16 asrlarda qurilgan 1,940 metrlik devorlar bo'ylab yurish. Adriatik dengizi va qizil tomli eski shahar manzarasi — Game of Thrones tasvirlangan joy. Ertalab boring — issiqlik va olomon kamroq.

③ HVAR ISLAND — Hvar
   🏷️ Turi: attraction | orol, tabiat, sohil
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul (orolga kirish); feri: €5
   🚌 Transport: Split dan katamaran, 1 soat
   📝 Lavanda dalalari va zeytun bog'lari bilan qoplangan Adriatik oroli. Hvar qasri va Franciscan monastiri shaharning ikki tarixiy markazi. Katamaranlar Splitdan kun bo'yi ishlaydi.

④ KRKA NATIONAL PARK — Šibenik
   🏷️ Turi: attraction | tabiat, sharshara, UNESCO
   🕐 Ish vaqti: 07:00–20:00 (har kuni)
   💵 Narxi: €25 (yozda)
   🚌 Transport: Šibenik dan avtobus yoki qayiq, 30 daqiqa
   📝 Skradinski Buk sharsharasi — Xorvatiyaning eng mashhur suv manzarasi. Ilgari ichida cho'milish mumkin edi, hozir faqat tomosha. Visovac orolchasi va Roški Slap ham parkda.

⑤ MOTOVUN & TRUFFLE EXPERIENCE — Motovun
   🏷️ Turi: attraction | oshxona, mahalliy hayot, Istra
   🕐 Ish vaqti: Doim ochiq (mahalliy do'konlar: 09:00–19:00)
   💵 Narxi: Bepul (trüffel degustatsiyasi: €15–25)
   🚌 Transport: Pula yoki Poreč dan avto, 40 daqiqa
   📝 Istra yarim orolining tepaligida joylashgan o'rta asr qishlog'i — dunyadagi eng qimmat zamburug' — trüffel shu oʻrmonlarda o'sadi. Kuz oylarida trüffel festivali o'tkaziladi.

⑥ PLITVICE LAKES NATIONAL PARK — Plitvice
   🏷️ Turi: attraction | UNESCO, tabiat, fotografiya
   🕐 Ish vaqti: 07:00–20:00 (har kuni)
   💵 Narxi: HRK 200–400 (mavsum)
   🚌 Transport: Zagreb yoki Split dan avtobus, 2–3 soat
   📝 16 ta yashil-moviy ko'l va 90 dan ortiq sharshara — taxta ko'priklardan suzayotgan suvlar ostini ko'rish mumkin. UNESCO manzarasi. Aprel-may da suvlar ko'p va rang boyroq bo'ladi.

⑦ ZADAR SEA ORGAN — Zadar
   🏷️ Turi: attraction
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul
   🚌 Transport: Zadar aeroportidan avtobus, 20 daqiqa
   📝 To'lqinlar energiyasini musiqaga aylantiradigan noyob arxitektura ob'ekti. Erta quyosh botishi vaqtida Zadar saluting the sun (yorug'lik installyatsiyasi) bilan birga tomosha qilish sehrli.

════════════════════════════════════════════════════════

🌍 HUNGARY (HU)
① BUDA CASTLE — Budapest
   🏷️ Turi: attraction | ikonik, tarix, UNESCO
   🕐 Ish vaqti: Doim ochiq (muzey: 10:00–18:00)
   💵 Narxi: Bepul (tashqaridan), muzey: HUF 2400
   🚌 Transport: Buda qal'asi funikulyori yoki avtobus 16
   📝 Duna daryosi ustidagi tepalikda joylashgan qirollik qasri. Milliy galereya va tarix muzeyi ichida. Fisherman's Bastion dan Pest tomoni — Budapesht ning eng mashhur panoramasi.

② DANUBE EVENING CRUISE — Budapest
   🏷️ Turi: attraction | kruiz, kechki, romantik
   🕐 Ish vaqti: 19:00–23:00 (har kuni)
   💵 Narxi: HUF 6000–15000
   🚌 Transport: Vigadó tér yoki Batthyány tér dan boshlanadi
   📝 Kechki soatlarda qayiqda Duna bo'ylab suzib yoritilgan parlament, Buda qasri va zanjir ko'prikni ko'rish. 1 soatlik kruizlar har kuni departures oladi. Champagne bilan VIP variant ham bor.

③ EGER CASTLE & WINE CELLARS — Eger
   🏷️ Turi: attraction | tarix, vino
   🕐 Ish vaqti: 09:00–18:00 (har kuni)
   💵 Narxi: HUF 1200 (qal'a)
   🚌 Transport: Budapest Keleti dan poyezd, 2 soat
   📝 1552 yilda 2000 Vengriya askari osmanli 100,000 lik qo'shinini to'xtatgan qal'a. Pincék ko'chasidagi qorovul xonalarida Egri Bikavér (Buqa qoni) vini degustatsiyasi majburiy.

④ LAKE BALATON — Balatonfüred
   🏷️ Turi: attraction | tabiat
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul (park: HUF 500)
   🚌 Transport: Budapest Déli dan poyezd, 1 soat 30 daqiqa
   📝 Markaziy Yevropaning eng katta ko'li — 77 km uzunlikda. Shimoliy sohil vinograd baglari, janubiy qum plyajlar. Tihanyi yarim oroli ko'l ustida yuradi — romantik va dam olish uchun ideal.

⑤ HUNGARIAN PARLIAMENT BUILDING — Budapest
   🏷️ Turi: attraction | ikonik, arxitektura, UNESCO
   🕐 Ish vaqti: 08:00–18:00 (har kuni)
   💵 Narxi: HUF 5400 (ekskursiya)
   🚌 Transport: Kossuth Lajos tér M2 metro, 2 daqiqa
   📝 Duna sohilida joylashgan neogotik parlament — Budapesht ning asosiy ramzi. Kechasi yoritilganda suv aksida ko'rish sehrli. Ichkariga ekskursiya bilan kirish mumkin — Muqaddas toj ko'rsatiladi.

⑥ RUIN BARS – SZIMPLA KERT — Budapest
   🏷️ Turi: attraction | mahalliy hayot, kechki, bar
   🕐 Ish vaqti: 12:00–04:00 (har kuni)
   💵 Narxi: Kirish bepul (ichimlik: HUF 1000–2000)
   🚌 Transport: Astoria M2 metro, 10 daqiqa yurish
   📝 Yahudiy mahallasidagi tashlandiq binalarga joylashgan eklektik barlar — Szimpla Kert eng mashhurii. Vintage mebellar, g'alati bezaklar va arzon narxlar. Shanba ertalabki fermer bozori ham shu yerda.

⑦ SZÉCHENYI THERMAL BATH — Budapest
   🏷️ Turi: attraction | hammom, ana
   🕐 Ish vaqti: 06:00–22:00 (har kuni)
   💵 Narxi: HUF 8000–10000
   🚌 Transport: Széchenyi fürdő M1 metro, 1 daqiqa
   📝 Barokko uslubidagi ulkan hammomda 18 ta havuz — tashqi hovuzlarda qishda ham 38°C issiq. Shaxmat o'ynaydigan erkaklar fotosurati ushbu hammomdan mashhur bo'lgan.

════════════════════════════════════════════════════════

🌍 INDONESIA (ID)
① BOROBUDUR BUDDA IBODATXONASI — Magelang, Java
   🏷️ Turi: attraction | UNESCO, Budda, arxeologiya
   🕐 Ish vaqti: 06:00–17:00 (har kuni)
   💵 Narxi: 350 000 IDR (xorijiylar)
   🚌 Transport: Yogyakartadan taksi yoki tur avtobus, 1 soat
   📝 Dunyodagi eng katta Budda ibodatxonasi — 9-asrda qurilgan, 504 ta Budda haykali. UNESCO. Tong otishida vulqonlar fonida suratga olish uchun sunrise tur mashhur.

② KOMODO MILLIY BOG'I — Flores, NTT
   🏷️ Turi: attraction | UNESCO, hayvonlar, tabiat
   🕐 Ish vaqti: Park: 08:00–17:00 (har kuni)
   💵 Narxi: 350 000 IDR + gid
   🚌 Transport: Labuan Bajo aeroportidan qayiq, 2–3 soat
   📝 Dunyoning eng katta kertankesi — Komodo varanini yovvoyi tabiatda ko'rish imkoni. Pink Beach va kristall dengiz. UNESCO'da tabiiy meros. Labuan Bajo'dan liveaboard kruizi tavsiya.

③ KUTA PLYAJI — Kuta, Bali
   🏷️ Turi: attraction | plyaj, surfing, Bali
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: 0
   🚌 Transport: Bali aeroportidan taksi, 10 daqiqa
   📝 Bali'ning asosiy surfing plyaji — to'lqinlar yangi boshlovchilar uchun ideal. 8 km cho'zilgan qum plyaji. Quyosh botishi va plyaj futboli kechqurun jonlanadi. Ko'p sayohatchilar bazasi.

④ LOCAVORE RESTORAN — Ubud, Bali
   🏷️ Turi: restaurant | restoran, premium, Bali
   🕐 Ish vaqti: 12:00–15:00, 18:00–23:00 (dushanba yopiq)
   💵 Narxi: 850 000–1 200 000 IDR/kishi
   🚌 Transport: Ubud markazida, Dewi Sita ko'chasi
   📝 Indoneziya'ning eng nufuzli restoranlari reytingida doim yuqorida. Faqat mahalliy ingredientlar — Bali va Java fermalaridan. Tasting menu 7–9 kurs. Oldindan bron qilish kerak.

⑤ PRAMBANAN HINDU IBODATXONASI — Yogyakarta, Java
   🏷️ Turi: attraction | UNESCO, Hindu, arxeologiya
   🕐 Ish vaqti: 06:00–17:00 (har kuni)
   💵 Narxi: 350 000 IDR (xorijiylar)
   🚌 Transport: Yogyakartadan 30 daqiqa taksi yoki avtobus
   📝 9-asrda qurilgan Trimurti (Shiva, Vishnu, Brahma) ibodatxona kompleksi — UNESCO. Borobudurdan 50 km sharqda. Kechqurun Ramayana ballet tomoshasi kompleks fonida o'tkaziladi.

⑥ RAJA AMPAT — West Papua
   🏷️ Turi: attraction | diving, marjon, tabiat
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: 1000 000 IDR (kirish ruxsati/yil)
   🚌 Transport: Sorong aeroportidan feri yoki speedboat, 2–4 soat
   📝 Dunyo'ning eng boy marjon riflari — 1500 dan ortiq baliq turi. Suzib yuruvchi bungalov-mehmonxonalar va diving. Yashil adalar va ko'k dengiz — so'zsiz jannat manzarasi.

⑦ TANAH LOT IBODATXONASI — Tabanan, Bali
   🏷️ Turi: attraction | ibodatxona, dengiz, ikonik
   🕐 Ish vaqti: 07:00–19:00 (har kuni)
   💵 Narxi: 60 000 IDR
   🚌 Transport: Denpasar yoki Seminyakdan taksi, 45 daqiqa
   📝 Dengiz ustidagi toshda turgan 16-asrlik Hindu ibodatxonasi — Balining eng ikonik tasviri. Quyosh botishida suratga olish uchun eng yaxshi joy. Qorong'ida to'lqin va masjid nuri.

⑧ UBUD MAYMUN O'RMONI — Ubud, Bali
   🏷️ Turi: attraction | tabiat, hayvonlar, ibodatxona
   🕐 Ish vaqti: 08:30–18:00 (har kuni)
   💵 Narxi: 80 000 IDR
   🚌 Transport: Ubud markazidan 10 daqiqa piyoda
   📝 700 dan ortiq erkin yuruvchi makak maymun va uchta Hindu ibodatxonasi. Zichlashgan tropik o'rmon ichida 14-asrga oid muqaddas joy. Kamerangizni va ovqatni yashiring.

════════════════════════════════════════════════════════

🌍 INDIA (IN)
① HAMPI XAROBALARI — Hampi
   🏷️ Turi: attraction | UNESCO, arxeologiya, Karnataka
   🕐 Ish vaqti: 08:00–18:00 (har kuni)
   💵 Narxi: 600 INR (Vittala ibodatxonasi)
   🚌 Transport: Hosapete bekatidan avtobus yoki taksi, 20 daqiqa
   📝 Vijayanagara imperiyasining 14-16-asrlardagi poytaxti xarobalari — 4000 dan ortiq ibodatxona va inshoot. Boulderlar orasida joylashgan sirli manzara. Karnataka'da UNESCO saytı.

② HAWA MAHAL — Jaipur
   🏷️ Turi: attraction | arxitektura, Rajputlar, Jaipur
   🕐 Ish vaqti: 09:00–17:00 (har kuni)
   💵 Narxi: 200 INR (xorijiylar)
   🚌 Transport: Jaipur markazida, avtobus yoki tuk-tuk bilan
   📝 1799-yilda qurilgan 953 ta mayda darchali pushti qumtosh saroyi — shamol saroyi. Haramdagi ayollar ko'chani ko'ra olishi uchun qurdirilgan. Old tomonidan surati ikonik, ichkaridan panorama chiroyli.

③ INDIAN ACCENT RESTORAN — Yangi Delhi
   🏷️ Turi: restaurant | restoran, premium, Delhi
   🕐 Ish vaqti: 12:00–14:30, 19:00–22:30 (har kuni)
   💵 Narxi: 4000–6000 INR/kishi
   🚌 Transport: The Lodhi hotel, Lodhi Road, Delhi
   📝 Hindistonning eng nufuzli restoranlari reytingida doim yuqorida. Zamonaviy Hindiston oshxonasi — an'anaviy taomlar zamonaviy texnika bilan. Oldindan bron qilish majburiy.

④ KERALA BACKWATERS — Alleppey
   🏷️ Turi: attraction | tabiat, kanal, houseboat
   🕐 Ish vaqti: Houseboat checkin: 12:00, checkout: 09:00
   💵 Narxi: 3000–8000 INR/tun (houseboat)
   🚌 Transport: Alleppey avtobus stantsiyasidan taksi, yoki Kochi'dan 1.5 soat
   📝 Hindistonning «Sharqdagi Venetsiyasi» — kanal, ko'l va laguna tarmog'i. Kettuvallam (sholi kemasidan) house-boat bilan bir kecha sayohat. Kokos daraxtlari va baliqchilar hayoti.

⑤ PUSHKAR BRAHMA IBODATXONASI VA KO'LI — Pushkar
   🏷️ Turi: attraction | diniy
   🕐 Ish vaqti: 06:00–22:00 (har kuni)
   💵 Narxi: 200 INR
   🚌 Transport: Ajmer bekatidan avtobus, 15 daqiqa
   📝 Dunyodagi kam Brahma ibodatxonalaridan biri. Muqaddas ko'l atrofidagi 400 dan ortiq ibodatxonalar. Noyabrda bo'ladigan deve yarmarkasi dunyodagi eng katta tuya yig'ilishi.

⑥ QUTB MINAR — Yangi Delhi
   🏷️ Turi: attraction | UNESCO, tarix, Delhi
   🕐 Ish vaqti: 07:00–17:00 (har kuni)
   💵 Narxi: 600 INR (xorijiylar)
   🚌 Transport: Qutb Minar metro bekatidan 500 metr piyoda
   📝 1193-yilda qurilgan 73 metrlik qizil qumtosh va marmar minora — Hindistondagi birinchi minora. UNESCO'da ro'yxatda. Atrofida Quvvat-ul-Islam masjidi va Temirdan ustun (zangjamas).

⑦ TOJ MAHAL — Agra
   🏷️ Turi: attraction | UNESCO, ikonik, tarix
   🕐 Ish vaqti: 30 daqiqa quyosh chiqishidan oldin–30 daqiqa botishgacha (seshanba yopiq)
   💵 Narxi: 1300 INR (xorijiylar)
   🚌 Transport: Agra Cantt bekatidan taksi yoki tuk-tuk, 15 daqiqa
   📝 Shoh Jahon tomonidan 1653-yilda qurilgan oq marmar maqbara — sevgi ramzi. Tong saharlab kelish tavsiya etiladi: kamroq odam, yumshoq yorug'lik. Dunyoning yetti mo'jizasidan biri.

⑧ VARANASI GHATLARI — Varanasi
   🏷️ Turi: attraction | diniy, daryokenar, madaniyat
   🕐 Ish vaqti: Doim ochiq (Aarti: tong va kechki 19:00)
   💵 Narxi: 0 (kirishda)
   🚌 Transport: Varanasi bekatidan taksi yoki rikshaw, 20 daqiqa
   📝 Gangaga tushuvchi 80 dan ortiq tosh zinapoya — Hindu dinining eng muqaddas joyi. Tong namozi (Aarti) suv ustida lampa bilan. Dashashvamedh Ghat kechqurun Ganga Aarti tomoshasi bepul va ta'sirli.

════════════════════════════════════════════════════════

🌍 ICELAND (IS)
① AURORA BOREALIS – NORTHERN ICELAND — Akureyri
   🏷️ Turi: attraction | tabiat
   🕐 Ish vaqti: Kechasi 21:00–03:00 (sentyabr–mart)
   💵 Narxi: Bepul (ekskursiya: ISK 12000)
   🚌 Transport: Akureyri aeroportidan taksi, 10 daqiqa
   📝 Sentabr-mart orasida Islandiyaning shimolida — Akureyri va Húsavík atrofida — aurora borealis eng kuchli ko'rinadi. Bulut bashorat saytlarini kuzating. Kamera qo'yib 30 soniyalik ekspozitsiya oling.

② BLUE LAGOON — Grindavík
   🏷️ Turi: attraction | ikonik, hammom, geologiya
   🕐 Ish vaqti: 08:00–22:00 (mavsumga qarab)
   💵 Narxi: ISK 9990–14990
   🚌 Transport: Keflavik aeroportidan avtobus, 20 daqiqa
   📝 Ko'k-oq rangli geotermik suv (38°C) — Islandiya ning eng mashhur joyi. Silika loyqasi teri uchun foydali. Aeroportdan yo'lda — ketayotganda yoki kelayotganda bemalol to'xtash mumkin.

③ GEYSIR & STROKKUR — Haukadalur
   🏷️ Turi: attraction | tabiat, ikonik, geologiya
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul
   🚌 Transport: Reykjavik dan avto, 1 soat 30 daqiqa (Golden Circle)
   📝 Har 6–10 daqiqada 30 metrga qadar otiladigan Strokkur geyzeristasi — jahon geyzerlarining nomi mana shu yerdan olingan. Suvdan oldingi ko'tarilish lahzasini kuzatib turing.

④ HALLGRÍMSKIRKJA CHURCH — Reykjavik
   🏷️ Turi: attraction | arxitektura, manzara, ikonik
   🕐 Ish vaqti: 09:00–21:00 (har kuni)
   💵 Narxi: ISK 1200 (minora)
   🚌 Transport: Reykjavik markazidan piyoda 10 daqiqa
   📝 74 metrlik beton cherkov — Islandiya ning eng baland binosi. Bazalt lava ustunlarini eslatuvchi fasad. Yuqoridagi kuzatuv maydonidan Reykjavik va dengiz ko'rinadi.

⑤ JÖKULSÁRLÓN GLACIER LAGOON — Jökulsárlón
   🏷️ Turi: attraction | tabiat, muzlik, fotografiya
   🕐 Ish vaqti: Doim ochiq (qayiq: mavsumiy)
   💵 Narxi: Bepul (qayiq: ISK 9900)
   🚌 Transport: Reykjavik dan avto, 5 soat (Ring Road)
   📝 Vatnajökull muzligidan uzilgan muz bloklari suzib yuradigan ko'l. Ko'k va oq rang muz amfibiya qayiqda yaqinidan ko'rish mumkin. Yonidagi Diamond Beach da shisha kabi muz parcha.

⑥ SELJALANDSFOSS WATERFALL — Seljaland
   🏷️ Turi: attraction | tabiat, sharshara, fotografiya
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: ISK 800 (parking)
   🚌 Transport: Reykjavik dan avto, 2 soat (Ring Road)
   📝 60 metr balandlikdan tushuvchi sharshara — g'or orqasiga o'tib ichidan tomosha qilish mumkin. Yozda tun o'rta yarmi yorug'ida suzib yurgan sharshara — Islandiya ning eng romantik joyi.

⑦ ÞINGVELLIR NATIONAL PARK — Þingvellir
   🏷️ Turi: attraction | UNESCO, tabiat, geologiya
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul (parking: ISK 750)
   🚌 Transport: Reykjavik dan avto, 45 daqiqa
   📝 Dunyo da birgina joy — Shimoliy Amerika va Yevropa tektonik plitalari ustida yurish mumkin. 930 yildan beri Islandiya parlamenti — Althing — shu yerda yig'ilgan. UNESCO ob'ekti.

════════════════════════════════════════════════════════

🌍 ITALY (IT)
① AMALFI COAST — Amalfi
   🏷️ Turi: attraction | tabiat, sohil, UNESCO
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul (avtobus: €1.30)
   🚌 Transport: Salerno dan feri yoki avtobus
   📝 Tyrrhen dengizi bo'ylab cho'zilgan qoyali sohil. Positano, Ravello va Amalfi qishloqlari — har biri pastel rangli uylari bilan o'ziga xos. Lemoncello va yangi dengiz mahsulotlari majburiy.

② COLOSSEUM — Rome
   🏷️ Turi: attraction | ikonik, tarix, arxitektura
   🕐 Ish vaqti: 09:00–19:00 (har kuni)
   💵 Narxi: €16 (Forum Romanum bilan)
   🚌 Transport: Colosseo metro B liniyasi, 1 daqiqa
   📝 72-yilda qurilgan 50,000 tomoshabin sig'dirgan amfiteatr. Gladiatorlar janglari o'tkazilgan asosiy arena hozir ham bor. Oldindan bron qilmasdan kirib bo'lmaydi.

③ GRAND CANAL — Venice
   🏷️ Turi: attraction | ikonik, tabiat, arxitektura
   🕐 Ish vaqti: 24 soat (vaporetto 05:00–00:30)
   💵 Narxi: Vaporetto №1: €9.50 bir yo'nalish
   🚌 Transport: Santa Lucia temir yo'l stantsiyasidan to'g'ridan-to'g'ri
   📝 Venetsiyaning asosiy suv ko'chasi. Vaporetto №1 bilan butun kanalni kezish mumkin. Rialto ko'prigi yonida to'xtab bozor va suv ustidagi restoranlarga kirish tavsiya etiladi.

④ PIAZZA DEL CAMPO — Siena
   🏷️ Turi: attraction | tarix, mahalliy hayot, arxitektura
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul (Mangia minorasi: €10)
   🚌 Transport: Siena avtobus stantsiyasi, 10 daqiqa yurish
   📝 Italiyaning eng go'zal o'rta asr maydoni. Yiliga ikki marta (iyul va avgust) bu yerda Palio ot poygasi o'tkaziladi. Mangia minorasi panoramasi — shaharsiz.

⑤ POMPEII ARCHAEOLOGICAL SITE — Pompeii
   🏷️ Turi: attraction | tarix, arxeologiya, UNESCO
   🕐 Ish vaqti: 09:00–19:00 (har kuni)
   💵 Narxi: €16
   🚌 Transport: Napoli dan Circumvesuviana poyezdida 35 daqiqa
   📝 79-yilda Vezuviy otqoni ostida qolgan shahar. Ko'chalar, mehmonxonalar va hatto nonvoyxonalar saqlanib qolgan. Bir kun kamlik qiladi — yurishga tayyorlaning.

⑥ ST. PETER'S BASILICA — Vatican City
   🏷️ Turi: attraction | ikonik, din
   🕐 Ish vaqti: 07:00–19:00 (har kuni)
   💵 Narxi: Bepul (gumbaz: €8)
   🚌 Transport: Ottaviano metro A liniyasi, 10 daqiqa yurish
   📝 Dunyodagi eng katta cherkov binosi. Mikelandjeloning Pietà heykali va Bernini'ning gumbaz osti — bepul kirish. Gumbazga chiqish uchun 551 zinadan o'tiladi.

⑦ UFFIZI GALLERY — Florence
   🏷️ Turi: attraction
   🕐 Ish vaqti: 08:15–18:50 (dushanba yopiq)
   💵 Narxi: €20 (oldindan bron: €25)
   🚌 Transport: Santa Maria Novella stantsiyasi, 15 daqiqa yurish
   📝 Botticellining Venera tavalludini va Leonardo da Vinchining ilk asarlarini ko'rish mumkin. Renessans san'atining eng to'liq kolleksiyasi bir tomda. Bron qilish shart.

════════════════════════════════════════════════════════

🌍 JAPAN (JP)
① ARASHIYAMA BAMBU O'RMONI — Kioto
   🏷️ Turi: attraction | tabiat, fotogen, Kioto
   🕐 Ish vaqti: 24 soat (har kuni)
   💵 Narxi: 0
   🚌 Transport: Randen Arashiyama bekatidan 5 daqiqa piyoda
   📝 Baland bambu daraxtlari orasidagi tor yo'lak — Yaponiyaning eng fotogen joyi. Shamol esa bambu tovushini yaratadi. Tenryu-ji bog'i va Togetsukyo ko'prigi yaqinda.

② DOTONBORI — Osaka
   🏷️ Turi: attraction | ovqat, kechki hayot, Osaka
   🕐 Ish vaqti: Doim ochiq (restoranlar 11:00–02:00)
   💵 Narxi: 0
   🚌 Transport: Namba metro bekatidan 5 daqiqa piyoda
   📝 Osaka'ning eng jonli ko'ngilochar va ovqat ko'chasi. Katta Glico yuguruvchi reklamasi, takoyaki va ramen restoranlar. Kechqurun neon chiroqlari kanalda aks etadi.

③ FUSHIMI INARI TAISHA — Kioto
   🏷️ Turi: attraction | diniy, tabiat, torii
   🕐 Ish vaqti: 24 soat (har kuni)
   💵 Narxi: 0
   🚌 Transport: Fushimi-Inari JR bekatidan 2 daqiqa piyoda
   📝 Ming-ming torii darvozalari bilan qoplangan tog'li ziyoratgoh. Tepaga chiqish 2-3 soat, lekin yarmi ham ta'sirli. Erta tongda sayyohlar kam, sehrli atmosfera.

④ HIROSHIMA TINCHLIK MEMORIAL — Hiroshima
   🏷️ Turi: attraction | tarix, UNESCO, xotira
   🕐 Ish vaqti: 08:30–18:00 (muzey, kuniga qarab)
   💵 Narxi: 200 JPY (muzey)
   🚌 Transport: Hiroshima tramvay 2/6 liniya, Genbaku Dome-mae bekati
   📝 1945-yildagi atom bombalanishidan omon qolgan Genbaku gumbazi va atrofdagi xotira bog'i. Tinchlik muzeyi insoniyat fojiasini hujjatlaydi. Chuqur his-tuyg'u uyg'otadi.

⑤ ICHIRAN RAMEN — Tokio
   🏷️ Turi: restaurant | restoran, ramen, mashhur
   🕐 Ish vaqti: 24 soat (har kuni)
   💵 Narxi: 980–1500 JPY
   🚌 Transport: Shibuya, Shinjuku, Hakata — ko'p joylarda
   📝 Yaponiyaning mashhur ramen zanjiri — yakka kabinadagi o'tirish joyi, shaxsiy buyurtma shakli. Tonkotsu shoʻrva 12 soat qaynatiladi. Shibuya va boshqa shaharlarda ko'p filiallari bor.

⑥ KINKAKU-JI (OLTIN PAVILYON) — Kioto
   🏷️ Turi: attraction | ibodatxona, UNESCO, Kioto
   🕐 Ish vaqti: 09:00–17:00 (har kuni)
   💵 Narxi: 500 JPY
   🚌 Transport: 59-avtobus bilan Kinkakuji-michi bekatigacha
   📝 Ko'l yuzasida aks etgan oltin barg bilan qoplangan uch qavatli Zen buddist ibodatxonasi. 14-asrda qurilgan, 1950-yilda yong'in chiqib qayta tiklangan. Yaponiyaning ramziy joyi.

⑦ NARA KIYIKLAR PARKI — Nara
   🏷️ Turi: attraction | tabiat, hayvonlar, ibodatxona
   🕐 Ish vaqti: Park: doim ochiq. Todai-ji: 07:30–17:30
   💵 Narxi: 600 JPY (Todai-ji)
   🚌 Transport: Nara JR yoki Kintetsu bekatidan 10 daqiqa piyoda
   📝 1200 ta erkin yuruvchi kiyik bilan to'lgan shahar parki. Kiyiklarga maxsus shikenbei krakerlari beriladi. Todai-ji — dunyodagi eng katta yog'och bino — ham shu yerda.

⑧ SHIBUYA KESISHMASI — Tokio
   🏷️ Turi: attraction | shahar hayoti, ikonik, Tokio
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: 0
   🚌 Transport: Shibuya metro/JR bekatidan chiqishdayoq
   📝 Dunyodagi eng gavjum piyodalar kesishmasi — bir signalda 3000 kishi o'tadi. Atrofdagi neon reklamalar va universal tezkor ritm. Scramble Square binosi tepasidan panoramasi ajoyib.

════════════════════════════════════════════════════════

🌍 KENYA (KE)
① AMBOSELI — KILIMANJARO KO'RINISHI — Amboseli
   🏷️ Turi: attraction | safari, fil, Kilimanjaro, tabiat
   🕐 Ish vaqti: 06:00–19:00
   💵 Narxi: $60 (kirish)
   🚌 Transport: Nairobi'dan 3.5–4 soat avtomobil
   📝 Kilimanjaro togining 5895 metrlik cho'qqisi Tanzaniyada bo'lsa ham, eng yaxshi ko'rish nuqtasi Amboseli milliy bog'i — Kenyada. Fil podaslari qor qopagan tog' fonida — bu rasm ikonaga aylangan. Ertalab bulut yoqilgandan keyin tog' ko'rinadi.

② DIANI BEACH — Diani
   🏷️ Turi: attraction | plyaj, dengiz, sport, dam olish
   🕐 Ish vaqti: 24/7
   💵 Narxi: Bepul (plyaj)
   🚌 Transport: Mombasa'dan parom + minivan, 45 daqiqa
   📝 Afrika'ning eng chiroyli oq qumli plyaji — Hind okeani, moviy suv, kokoschalar. Afrikada ko'plab tanlovlarda birinchi o'rinni egallagan. Kite surfing, snorkeling va Shimba Hills safari bir kungacha uyg'unlashadi. Mombasadan 30 km janubda.

③ KAREN BLIXEN MUZEYI — Nairobi
   🏷️ Turi: attraction | muzey, tarix, madaniyat, adabiyot
   🕐 Ish vaqti: 09:30–18:00 (har kuni)
   💵 Narxi: $11 (xorijliklar)
   🚌 Transport: Nairobi markazidan taksi 20 daqiqa (Karen tumani)
   📝 'Afrika haqida xotiram' kitobining muallifi Karen Blixen 17 yil yashagan ferma — bugun muzey. Ngong tepaliklari orqa fonida, plantatsiya atmosferasi saqlanib qolgan. Film suratga olish joylari, antiqa mebel va Blixenning shaxsiy buyumlari. Nairobi'ning eng yumshoq tomoni.

④ LAMU ESKI SHAHRI — Lamu
   🏷️ Turi: attraction | tarix, madaniyat, UNESCO, dengiz
   🕐 Ish vaqti: 24/7
   💵 Narxi: Bepul (shahar)
   🚌 Transport: Nairobi'dan Lamu aeroportiga parvoz, keyin parom
   📝 Sharqiy Afrikaning UNESCO'ga kiritilgan eng eski va yaxshi saqlanib qolgan shahri — arab, hindistonlik va suahili madaniyatining uyg'unligi. Avtomobil yo'q, eshak va qayiq transport. Tor arabcha ko'chalar, hashamatli eshik o'ymalari, dengiz havosi.

⑤ MASAI MARA SAFARI — Narok
   🏷️ Turi: attraction | safari, hayvonot, tabiat, Afrika
   🕐 Ish vaqti: Turlar 06:00 va 16:00 (ikki seans)
   💵 Narxi: $80–120 (jeep safari/kun)
   🚌 Transport: Nairobi'dan 6 soat avtomobil yoki 45 daqiqa kichik samolyot
   📝 Afrikaning eng ikonik safari joyi va Serengeti bilan tutashib ketuvchi ekotizm. Iyul–Oktyabr 'Katta ko'chish' — 1.5 million gʻu va zebra Mara daryosini kesib o'tadi — bu sayyoramizdagi eng buyuk spektakl. Ballon safar tongda butun savannani qamrab oladi.

⑥ MOUNT KENYA TREK — Naro Moru
   🏷️ Turi: attraction | trekking
   🕐 Ish vaqti: 24/7 (park yil bo'yi ochiq)
   💵 Narxi: $60 (kirish); guide $50/kun
   🚌 Transport: Nairobi'dan Naro Moru'ga 3.5 soat avtobus
   📝 Afrika'ning ikkinchi baland cho'qqisi (5199 m) va dunyodagi eng ikonik ekvatorial tog'. Batian va Nelion cho'qqilari alpinistlar uchun, Point Lenana (4985 m) esa trek uchun. 3–4 kunlik marshrut tropikal o'rmondan boshlab muzlikka qadar davom etadi.

⑦ NAIROBI MILLIY BOG'I — Nairobi
   🏷️ Turi: attraction | safari, shahar, tabiat, qulay
   🕐 Ish vaqti: 06:00–19:00
   💵 Narxi: $43 (xorijliklar)
   🚌 Transport: Nairobi markazidan 7 km; taksi 20 daqiqa
   📝 Poytaxt shahar chegarasida joylashgan yagona milliy bog'. Sher, karkidon, buyvol, leopard — shahar skalyinasi fonida. Ertalabki safari keyin Nairobi markaziga ikki soatda qaytish mumkin. Kenya'ga kelgan sayyohlar uchun qulay birinchi safari.

════════════════════════════════════════════════════════

🌍 KYRGYZSTAN (KG)
① ALA-ARCHA MILLIY BOG'I — Bishkek yaqini
   🏷️ Turi: attraction | tabiat, treking, muzlik
   🕐 Ish vaqti: 08:00–18:00 (har kuni, qish: soatlar qisqaradi)
   💵 Narxi: 200 KGS (kirish)
   🚌 Transport: Bishkekdan taksi, 40–50 daqiqa
   📝 Bishkekdan 40 km — Tyan-Shan togʻlari, muzlik va yaylov. Ak-Sai muzligiga trekking 4–5 soat. Yozda qorli cho'qqilar fonida yashil o'tloqlar. Alpinistlar uchun markaziy baza.

② BISHKEK OSH BOZORI — Bishkek
   🏷️ Turi: attraction | bozor, mahalliy hayot, ziravorlar
   🕐 Ish vaqti: 07:00–18:00 (har kuni)
   💵 Narxi: 0 (kirish bepul)
   🚌 Transport: Osh Bazar avtobus bekati, Bishkek markazi
   📝 Bishkekning eng katta va eng rang-barang bozori. Ziravorlar, dried fruit, milliy kiyim, ot-arqon va ko'chma hayot anjomlari. Achiq-chuchuk va kurt Qirg'iz taomlari tatib ko'rish.

③ BURANA MINORASI — Toqmok yaqini
   🏷️ Turi: attraction | tarix, minora, arxeologiya
   🕐 Ish vaqti: 09:00–17:00 (har kuni)
   💵 Narxi: 100 KGS
   🚌 Transport: Bishkekdan avtobus yoki taksi, 60 km (1 soat)
   📝 11-asrdagi Qarakxoniylar davri minora — bir vaqt 40 metr, hozir 21.7 metr. Atrofida balbal (qoya haykallar) va arxeologik qazilmalar. Bal'asag'un shahrining yagona qoldiq.

④ ISSIQ-KO'L KO'LI — Cholpon-Ata
   🏷️ Turi: attraction
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: 0 (ko'l bepul). Kurort: 1500–3000 KGS/kishi
   🚌 Transport: Bishkekdan marshrut avtobusi, 3–4 soat
   📝 Dunyo'ning ikkinchi chuqur tog'li ko'li — 6236 km², hech qachon muzlamaydi. Shimoliy qirg'oqda kurortlar, janubda yovvoyi tabiat. Tyan-Shan tog'lari fonida cho'milish va yelkanli kemalar.

⑤ JETI-OGUZ QOYA (YETTI HO'KIZ) — Jeti-Oguz
   🏷️ Turi: attraction | tabiat, qoya, manzara
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: 0 (bepul)
   🚌 Transport: Karakoldan taksi, 30 km (40 daqiqa)
   📝 Qizil rangli yetti qoya — Qirg'izistonning eng mashhur tabiiy manzaralari. Qo'shni Singan Yurak qoyasi ham shu tog'da. Atrofida yaylov va gulzorlar. Mavsumda yurt lagerlari.

⑥ KARAKOL BOZORI — Karakol
   🏷️ Turi: attraction | bozor, mahalliy hayot
   🕐 Ish vaqti: Yakshanba: 08:00–15:00
   💵 Narxi: 0 (kirish bepul)
   🚌 Transport: Karakol markazida
   📝 Issiq-Ko'l sharqidagi eng katta bozor — har yakshanba. Chorva, kiyim, ot jabduqlari va milliy oziq-ovqat. Dungan va Qirg'iz oshxonasi stallari. Ko'chma hayot madaniyatining jonli ko'rinishi.

⑦ SUPARA ETHNO COMPLEX — Bishkek yaqini
   🏷️ Turi: restaurant | restoran, yurt, milliy taom
   🕐 Ish vaqti: 11:00–22:00 (har kuni)
   💵 Narxi: 500–1500 KGS/kishi
   🚌 Transport: Bishkekdan taksi, 20 daqiqa
   📝 Bishkekdan 10 km — yurt ichida an'anaviy Qirg'iz taomlar. Beshbarmaq, kumys va qimiz bilan. Ot minish va ko'chma hayot namoyishi. Yurt ichida tunash ham mumkin.

⑧ TASH RABAT KARVONSAROYI — Naryn viloyati
   🏷️ Turi: attraction
   🕐 Ish vaqti: 09:00–18:00 (yoz mavsum)
   💵 Narxi: 200 KGS
   🚌 Transport: Naryndan taksi, 90 km (2 soat)
   📝 15-asrda Ipak yo'lida qurilgan tosh karvonsaroy — 3200 metr balandlikda, ajoyib saqlanib qolgan. 31 xona va markaziy gumbaz. Atrofida yaylovda chorvachilar yurtlari.

════════════════════════════════════════════════════════

🌍 KAZAKHSTAN (KZ)
① BAITEREK MONUMENTAL MINORA — Astana
   🏷️ Turi: attraction | ikonik, arxitektura, Astana
   🕐 Ish vaqti: 10:00–22:00 (har kuni)
   💵 Narxi: 700 KZT
   🚌 Transport: Astana markazida, taksi yoki avtobus
   📝 105 metrlik Qozogʻiston ramziy minorasi — quyosh tuxumini ushlab turgan daraxt afsonasidan ilhomlangan. Tepada Nursultan Nazarboyev qo'l izi bilan shisha shar. Ko'rish maydoni Astana panoramasi.

② KATTA ALMATY KO'LI — Almaty
   🏷️ Turi: attraction | tabiat
   🕐 Ish vaqti: 08:00–19:00 (mavsum bo'yicha)
   💵 Narxi: 700 KZT (kirish)
   🚌 Transport: Almatydan taksi, 40 daqiqa (ruxsat KPP orqali)
   📝 2511 metr balandlikdagi ko'k-yashil rangdagi tog'li ko'l. Atrof Tyan-Shan tog'lari bilan o'ralgan. Yoz fasli avtomobil bilan, qish qorbo'ron paytida bepul sayr.

③ CHARYN KANYONI — Almaty viloyati
   🏷️ Turi: attraction | tabiat, kanyon, geologiya
   🕐 Ish vaqti: 08:00–20:00 (har kuni)
   💵 Narxi: 1000 KZT
   🚌 Transport: Almatydan taksi yoki tur (200 km, 2.5 soat)
   📝 Amerika'ning Katta Kanyoniga o'xshatilgan 80 km uzunlikdagi kanyonning eng ta'sirli qismi — Zamklar vodiysi. Qizil va sariq tosh ustunlar. Shamolli shovqin va kechqurun qizil rang.

④ GREEN BAZAAR ALMATY — Almaty
   🏷️ Turi: attraction | bozor, mahalliy hayot, taom
   🕐 Ish vaqti: 07:00–19:00 (har kuni)
   💵 Narxi: 0 (kirish bepul)
   🚌 Transport: Zelyony Bazar avtobus bekati, Almaty markazi
   📝 Almatyning qadimiy va eng katta bozori — qo'zi go'shti, kurt, manti va ziravorlar. Qozog'iston milliy taomlari va mahsulotlari. Ertalab 07:00–10:00 oralig'i — do'konchilar yangi mahsulot keltirib turadi.

⑤ KHAN SHATYR KO'NGILOCHAR MARKAZI — Astana
   🏷️ Turi: attraction | arxitektura
   🕐 Ish vaqti: 10:00–22:00 (har kuni)
   💵 Narxi: 0 (kirish bepul, attraksionlar alohida)
   🚌 Transport: Baiterekdan 1 km piyoda yoki taksi
   📝 Norman Foster loyihalagan 150 metrlik shaffof cho'ponxona shaklidagi bino. Ichida monorail, tropik bog', plyaj va savdo markazi. Qozog'iston qishida tropik iqlim.

⑥ MEDEU MUZQAYMOQXONASI — Almaty
   🏷️ Turi: attraction | sport, qish, Almaty
   🕐 Ish vaqti: 10:00–22:00 (qish mavsum)
   💵 Narxi: 1500–2500 KZT (konki ijarasi)
   🚌 Transport: Almatydan konki avtobus yoki taksi, 20 daqiqa
   📝 Dengiz sathidan 1691 metr balandlikda joylashgan ochiq osmon ostidagi muzqaymoqxona — dunyo rekordlar maydoni. Qishda konki, yozda velosiped. Yangi yil va sport tadbirlari uchun mashhur.

⑦ NAVAT RESTORAN — Astana
   🏷️ Turi: restaurant | restoran, milliy taom, Astana
   🕐 Ish vaqti: 12:00–00:00 (har kuni)
   💵 Narxi: 3000–6000 KZT/kishi
   🚌 Transport: Astana markazida, taksi bilan
   📝 Astananing eng mashhur an'anaviy qozog'iston oshxonasi. Beshbarmaq, kuyrdak va sorpa — milliy taomlar yoqimli muhitda. Milliy kiyimli xodimlar va doira musiqa.

⑧ EXPO 2017 SAYTI — Astana
   🏷️ Turi: attraction | muzey, arxitektura, texnologiya
   🕐 Ish vaqti: 10:00–19:00 (dushanba yopiq)
   💵 Narxi: 3000 KZT
   🚌 Transport: Astana EXPO bekatidan — maxsus bus
   📝 2017-yilda «Kelajak energiyasi» mavzusida o'tkazilgan EXPO'ning asosiy pavilyon — Nur Alem: dunyodagi eng katta shisha shari (99 metr). Energetika va texnologiya muzeyi.

════════════════════════════════════════════════════════

🌍 MOROCCO (MA)
① YUKSAK ATLAS — TOUBKAL BAZASI VA BERBER QISHLOQLARI — Imlil
   🏷️ Turi: attraction | tabiat, trekking
   🕐 Ish vaqti: 24/7 (qishloq)
   💵 Narxi: $30–80 (guide bilan trek)
   🚌 Transport: Marrakesh'dan minivan 1.5 soat (Imlil'ga)
   📝 Afrika'ning eng baland cho'qqisi Toubkal (4167 m) atrofi. Imlil qishlog'i Berber madaniyatini hali saqlab kelmoqda — tosh uylar, qo'y va echkilar, argan moyining tayyorlanishi ko'rish mumkin. Trekking sezonida — aprel-oktyabr — tog' manzaralari nafasni rostlaydi.

② CHEFCHAOUEN — KO'K SHAHAR — Chefchaouen
   🏷️ Turi: attraction | shahar
   🕐 Ish vaqti: 24/7
   💵 Narxi: Bepul (shahar)
   🚌 Transport: Fes yoki Tangier'dan avtobus 3–4 soat
   📝 Rif tog'larida joylashgan, butun mahallasi ko'k va oq rangda bo'yalgan sirli shahar. Har burchak instagramdagi rasm — tor ko'chalar, ko'k eshiklar, gullar. Ko'k rang an'anasi 15-asrda yahudiy qochoqlar kiritgan deyiladi. Vaziyat sakin va sukunatli.

③ ESSAOUIRA — SHAMOLLAR SHAHRI — Essaouira
   🏷️ Turi: attraction | sohil, sport, tarix, shahar
   🕐 Ish vaqti: 24/7
   💵 Narxi: Bepul (shahar); kitesurf $80/kun
   🚌 Transport: Marrakesh'dan avtobus 3 soat
   📝 Atlantika sohilida Portugaliyadek tarixga ega qal'a shahar. Windsurfing va kitesurfing uchun Afrika'ning eng yaxshi joyi — doimiy shamol 30+ km/soat. Kumush savdo markazi, baliq bozori, ko'k-oq rangdagi qayiqlar — hamma narsa bir joyda.

④ FES EL-BALI — QADIMIY MEDINA — Fes
   🏷️ Turi: attraction | tarix, madaniyat, UNESCO, hunarmandchilik
   🕐 Ish vaqti: 24/7
   💵 Narxi: Bepul (medina); Chouara ko'rish punktlari bepul
   🚌 Transport: Fes-Saiss aeroportidan taksi 30 daqiqa
   📝 Dunyo eng katta piyoda transport ishlatiladigan shahar — 9400 ta ko'cha va xiyobon, 859-yilda tashkil etilgan. Chouara teritabdir — 600 yillik an'analar bilan teri bo'yash hovuzlari — hid kuchli, manzara unutilmas. Al-Qarawiyyin dunyodagi birinchi universitet.

⑤ MAJORELLE BOG'I — MARRAKESH — Marrakesh
   🏷️ Turi: attraction | at, tarix, dizayn
   🕐 Ish vaqti: 08:00–18:00 (Ramazon: 09:00–17:00)
   💵 Narxi: 150 MAD (~$15)
   🚌 Transport: Jemaa el-Fna'dan taksi 10 daqiqa
   📝 Frantsuz rassom Jacques Majorelle 1923-yilda yaratgan, keyinchalik Yves Saint Laurent sotib olgan ulkan bog'. Kobalt ko'k bino va sariq idishlarda berbercha kolleksiya. Cactuslar bog'i va exotik o'simliklar — shahar shapoligidan dam olish uchun yashil vohaning o'zi.

⑥ MARRAKESH — JEMAA EL-FNA MAYDONI — Marrakesh
   🏷️ Turi: attraction | madaniyat, bozor, UNESCO, mahalliy hayot
   🕐 Ish vaqti: 24/7 (kechqurun eng jonli)
   💵 Narxi: Bepul
   🚌 Transport: Marrakesh aeroportidan taksi 20 daqiqa
   📝 UNESCO'ga kiritilgan nomoddiy madaniy meros — kunduz afsungarlar, ilonbozlar va hina rassomlar, kechasi yuzlab yemak do'konlari va musiqachilar. Maydon bir asr davomida berishda bo'lmagan ko'rgazma sahnasidir. Yuqori qavatdan ko'rish yanada hayratlanarli.

⑦ SAHARA CHO'LI — MERZOUGA QUM DUNALARI — Merzouga
   🏷️ Turi: attraction | tabiat
   🕐 Ish vaqti: 24/7
   💵 Narxi: $60–120 (cho'l turi + tun)
   🚌 Transport: Marrakesh'dan 10 soat avtobus yoki Ouarzazate orqali
   📝 Erg Chebbi — qum dunaları 150 metr balandlikka ko'tariladi, tong paytida qizil-oltin rangga kiradi. Tuya safari, qum dunalariga chiqish va cho'l qishlog'ida yotish. Qishda sovuq, yozda issiq — aprel va oktyabr eng yaxshi. Yulduzli osmon beqiyos.

════════════════════════════════════════════════════════

🌍 MEXICO (MX)
① CHICHEN ITZA — Yucatan
   🏷️ Turi: attraction | tarix, Maya, UNESCO
   🕐 Ish vaqti: 08:00–17:00 (har kuni)
   💵 Narxi: 533 MXN (~$27)
   🚌 Transport: Cancun'dan 2.5 soat, Merida'dan 1.5 soat avtobus
   📝 Maya sivilizatsiyasining cho'qqisi — El Castillo piramidasi dunyoning yetti mo'jizasidan biri. Bahor va kuz tengkunida piramiada tomonida ilon soyasi hosil bo'ladi — 1000 yil oldin rejalashtirilgan optik effekt.

② GUANAJUATO RANG-BARANG SHAHAR — Guanajuato
   🏷️ Turi: attraction | shahar, arxitektura, UNESCO, madaniyat
   🕐 Ish vaqti: 24/7
   💵 Narxi: Bepul (shahar)
   🚌 Transport: Mexico City'dan avtobus 4 soat; Leon aeroportidan 1 soat
   📝 Tog' vodiyida joylashgan, yer osti yo'llar bilan ulangan ko'p rangli shahar. Sariq, ko'k, qizil, yashil uylar tepaliklarda mozaika hosil qiladi. Cervantes festivali davomida butun shahar teatr sahnasiga aylanadi.

③ OAXACA BENITO JUAREZ BOZORI — Oaxaca
   🏷️ Turi: attraction | bozor, oshxona, mahalliy hayot
   🕐 Ish vaqti: 07:00–20:00 (har kuni)
   💵 Narxi: Bepul (kirishga)
   🚌 Transport: Oaxaca markazidan piyoda
   📝 Meksikaning oshxona poytaxti deb tan olingan Oaxaca'ning yuragida joylashgan bozor. Chapulines (qovurilgan chigirtka), 7 xil mol bilan tamale, qora va qizil mole — hammasi bir bozoringiz. Zapotec hunarmandchiligi alohida qiziq.

④ TEOTIHUACAN PIRAMIDALAR — San Juan Teotihuacán
   🏷️ Turi: attraction | tarix, arxeologiya, UNESCO
   🕐 Ish vaqti: 09:00–17:00 (har kuni)
   💵 Narxi: 75 MXN (~$4)
   🚌 Transport: Mexico City'dan avtobus: Zona Norte terminali, 1 soat
   📝 Miloddan avvalgi I asrda qurilgan, Mesoamerikaning eng katta shahri. Quyosh va Oy piramidalarini ko'tarish shart — yuqoridan butun shahar ko'zga tashlanadi. Teotihuacan kim tomonidan qurilgani hali ham sirligicha qolmoqda.

⑤ TULUM MAYA XAROBALARI — Tulum
   🏷️ Turi: attraction | tarix, Maya, dengiz, arxeologiya
   🕐 Ish vaqti: 08:00–17:00 (har kuni)
   💵 Narxi: 90 MXN (~$5)
   🚌 Transport: Playa del Carmen'dan 1 soat avtobus
   📝 Karib dengizi qoyalarida joylashgan yagona dengiz bo'yidagi Maya qal'asi. Pastda moviy dengiz, ustida qadimiy ibodatxonalar — bu manzara oddiy emas. Erta tongda borishni tavsiya qilamiz, sayyohlar ko'p kelishidan oldin.

⑥ XCARET EKO-PARK — Playa del Carmen
   🏷️ Turi: attraction
   🕐 Ish vaqti: 08:30–22:00 (har kuni)
   💵 Narxi: $119
   🚌 Transport: Cancun'dan 1 soat, Playa del Carmen'dan 10 daqiqa
   📝 Yo'q joydan o'ylab chiqilgan emas — haqiqiy Maya shaharchasi ustiga qurilgan. Yer osti daryosida suzish, marallar, qushlar, Maya ko'rgazmalari va kechki ulug'vor ko'rgazma hammasi bir joyda. Riviera Maya'ning eng to'liq tajribasi.

⑦ MEXICO CITY ZOCALO — Mexico City
   🏷️ Turi: attraction | tarix, arxitektura, madaniyat
   🕐 Ish vaqti: 24/7 (maydon); Palacio 09:00–17:00
   💵 Narxi: Bepul (Palacio $80 MXN)
   🚌 Transport: Metro: Linea 2, Zocalo stantsiyasi
   📝 Dunyo eng katta maydoni — 46,000 kv.m. Azteklar ibodatxonasi xarobalari, muhtasham Katedrali va Milli saroy uning atrofida. Saroy devorlari Diego Rivera'ning ulkan freskalariga to'la — meksika tarixi jonli kitob kabi.

════════════════════════════════════════════════════════

🌍 MALAYSIA (MY)
① BATU CAVES — Kuala Lumpur yaqini
   🏷️ Turi: attraction | diniy
   🕐 Ish vaqti: 08:00–21:00 (har kuni)
   💵 Narxi: 0 (kirish bepul)
   🚌 Transport: Kuala Lumpur Sentral'dan KTM Komuter, 30 daqiqa
   📝 272 ta rangli zinapoya orqali ko'tarilish — 42 metrlik oltin Murugan haykali pastda kutib turadi. Hindu muqaddas g'or ibodatxonasi. Thaipusam festivalida 1.5 million tashrif buyuruvchi.

② CAMERON HIGHLANDS — Cameron Highlands
   🏷️ Turi: attraction | tabiat, choy
   🕐 Ish vaqti: Plantatsiyalar: 08:00–17:00 (har kuni)
   💵 Narxi: 0 (plantatsiya kirish ba'zida 5–10 MYR)
   🚌 Transport: Kuala Lumpur'dan avtobus, 3–4 soat
   📝 Togʻli iqlimda cho'zilgan choy plantatsiyalari — yashil teraslar va sovuq havo. Boh Choy Farm va Jim Thompson fermasi. Straberri terib yeyish va yerli asal sotib olish.

③ CENTRAL MARKET KUALA LUMPUR — Kuala Lumpur
   🏷️ Turi: attraction | bozor, hunarmandchilik, madaniyat
   🕐 Ish vaqti: 10:00–22:00 (har kuni)
   💵 Narxi: 0 (kirish bepul)
   🚌 Transport: Pasar Seni LRT bekatidan 3 daqiqa piyoda
   📝 1888-yilgi bino — bugun hunarmandchilik va madaniyat markazi. Batik, pewter, rattan va Malayziya san'at buyumlari. Har kuni jonli musiqa va madaniy ko'rsatuvlar.

④ JALAN ALOR STREET FOOD — Kuala Lumpur
   🏷️ Turi: restaurant | street food, kechki hayot, Kuala Lumpur
   🕐 Ish vaqti: 17:00–02:00 (har kuni)
   💵 Narxi: 15–50 MYR/kishi
   🚌 Transport: Bukit Bintang LRT bekatidan 10 daqiqa piyoda
   📝 Bukit Bintang tumanidagi Malayziyaning eng mashhur street food ko'chasi. Satay, grilled seafood, char kway teow va durian. Kechqurun 18:00 dan jonlanadi — ko'cha to'ladi.

⑤ KINABALU TOG'I — Kota Kinabalu, Sabah
   🏷️ Turi: attraction
   🕐 Ish vaqti: Trek: kuniga 192 kishiga ruxsat (oldindan bron)
   💵 Narxi: 200–300 MYR (kirish + gid)
   🚌 Transport: Kota Kinabalu shahridan 2 soat minibus
   📝 Janubi-Sharqiy Osiyodagi eng baland cho'qqi — 4095 metr. Ikkita kunga trekking: birinchi kun bazaga, ikkinchi kuni tong 2 da yo'lga chiqib, quyosh chiqishida cho'qqida. Oldindan ruxsat.

⑥ LANGKAWI OROLI — Langkawi
   🏷️ Turi: attraction | orol, plyaj, tabiat
   🕐 Ish vaqti: Cable car: 09:30–19:00 (chorshanba: 12:00 dan)
   💵 Narxi: 55 MYR (cable car)
   🚌 Transport: Kuala Lumpur'dan samolyot 1 soat yoki ferry Penang'dan
   📝 99 oroldan iborat arxipelag — dengiz, o'rmon va mangrove. Cable Car dunyodagi eng tik kanatli yo'llardan biri — tepadan Tailand ko'rinadi. Duty-free xarid va qumli plyajlar.

⑦ GEORGE TOWN KO'CHA SAN'ATI — Penang
   🏷️ Turi: attraction
   🕐 Ish vaqti: Doim ochiq (ko'chada)
   💵 Narxi: 0
   🚌 Transport: Georgetown feri terminalidan piyoda yoki trike
   📝 UNESCO shahridagi Ernest Zacharevic va boshqa rassomlar ko'cha saratlari. Interaktiv temir haykallar va devor rasmlari. Piyoda map bilan yurish — yashirin burchaklarni topish.

⑧ PETRONAS MINORA IKKITASI — Kuala Lumpur
   🏷️ Turi: attraction | ikonik
   🕐 Ish vaqti: 09:00–21:00 (dushanba yopiq)
   💵 Narxi: 85 MYR (ko'rish maydoni)
   🚌 Transport: KLCC LRT bekatidan to'g'ridan-to'g'ri
   📝 1998–2003-yillarda dunyoning eng baland binolari bo'lgan 452 metrlik juft minora. 41-qavatdagi ko'prik va 86-qavatdagi ko'rish maydoni. Kechqurun yoritilishi toshda aks etadi.

════════════════════════════════════════════════════════

🌍 NETHERLANDS (NL)
① ANNE FRANK HOUSE — Amsterdam
   🏷️ Turi: attraction | tarix, muzey, II Jahon urushi
   🕐 Ish vaqti: 09:00–22:00 (dushanba–juma), 09:00–22:00 (dam olish kunlari)
   💵 Narxi: €16
   🚌 Transport: Westermarkt tram 13/17, 5 daqiqa yurish
   📝 1942–1944 yillarda Anne Frank va oilasi yashiringan maxfiy xonalar. Asl kundalik va qo'lyozmalar saqlanadi. Biletlar faqat oldindan online sotiladi — kassa yo'q.

② EDAM CHEESE MARKET — Edam
   🏷️ Turi: attraction | mahalliy hayot
   🕐 Ish vaqti: Chorshanba 10:30–12:30 (iyul–avgust faqat)
   💵 Narxi: Bepul (tomosha)
   🚌 Transport: Amsterdam Centraal dan avtobus 316, 35 daqiqa
   📝 Yozda (iyul–avgust) chorshanba kunlari an'anaviy pishloq savdosi — kostyumli hammollar qizil va sariq pishloq g'ildiraklarini ko'taradi. 300 yillik an'ana jonli davom etmoqda.

③ GIETHOORN VILLAGE — Giethoorn
   🏷️ Turi: attraction | tabiat, qishloq, suv
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul (qayiq: €10/soat)
   🚌 Transport: Zwolle dan avtobus 70, 45 daqiqa
   📝 Ko'chasi bo'lmagan qishloq — hammasi kanal orqali bog'langan. Kichik qayiqda sayr qilib fermerlar uylari va o't bosgan tomlarni ko'rish mumkin. "Gollandiya Venetsiyasi" deyishadi.

④ KEUKENHOF GARDENS — Lisse
   🏷️ Turi: attraction | tabiat, gullar, fotografiya
   🕐 Ish vaqti: 08:00–19:30 (mart–may faqat)
   💵 Narxi: €22
   🚌 Transport: Amsterdam Schiphol aeroportidan avtobus 858, 40 daqiqa
   📝 Mart-may oylarida 7 million lalag'i, giatsint va narsiss gullashi — Dunyoning eng katta gul bog'i. Har yil mavzusi o'zgaradi. Erta bron qiling — biletlar tez tugaydi.

⑤ KINDERDIJK WINDMILLS — Kinderdijk
   🏷️ Turi: attraction | UNESCO, arxitektura, tarix
   🕐 Ish vaqti: 09:00–17:30 (har kuni)
   💵 Narxi: €12 (muzey bilan)
   🚌 Transport: Rotterdam Erasmusbrug dan feri, 40 daqiqa
   📝 1740 yillardan beri ishlab turgan 19 ta yel tegirmoni — Gollandiya ramzi. UNESCO ro'yxatida. Velosipedda aylanish eng zo'r usul; jul-avgustda tegirmonlar ichiga ham kirish mumkin.

⑥ RIJKSMUSEUM — Amsterdam
   🏷️ Turi: attraction | muzey
   🕐 Ish vaqti: 09:00–17:00 (har kuni)
   💵 Narxi: €22.50
   🚌 Transport: Rijksmuseum tram 2/12, 1 daqiqa
   📝 Rembrandt va Vermeerning asli asarlari, 8,000 tarixiy ob'ekt — Gollandiya oltin asri bir binoda. Kecha sog'lomlashtirish marshruti muzey bogʻidan bepul o'tadi.

⑦ VAN GOGH MUSEUM — Amsterdam
   🏷️ Turi: attraction | muzey
   🕐 Ish vaqti: 09:00–18:00 (har kuni, juma: 21:00 gacha)
   💵 Narxi: €22
   🚌 Transport: Van Baerlestraat tram 2/12, 2 daqiqa
   📝 Dunyoda Van Goghning eng ko'p asari — 200 rasm, 500 chizma bir joyda. Yulduzli tun, Kungaboqarlar va o'z-o'zini portretlari. Bron qilmasangiz 2–3 soat navbat kutiladi.

════════════════════════════════════════════════════════

🌍 NORWAY (NO)
① BRYGGEN WHARF – BERGEN — Bergen
   🏷️ Turi: attraction | UNESCO, tarix, ikonik
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul (sayr); funikulyor: NOK 155
   🚌 Transport: Bergen markazida joylashgan
   📝 XIV asrdan beri turgan Hanseatik savdo uylaridan iborat rangbarang taxta ko'chalari. UNESCO ob'ekti. Fløibanen funikulyorida yuqoriga chiqsangiz Bergen va fjordlar manzarasi ochiladi.

② FLÅM RAILWAY (FLÅMSBANA) — Flåm
   🏷️ Turi: attraction | transport, manzara, poyezd
   🕐 Ish vaqti: 08:00–20:00 (har kuni, mavsumga qarab)
   💵 Narxi: NOK 870 (Myrdal–Flåm)
   🚌 Transport: Bergen dan poyezd Myrdal ga, keyin Flåmsbana
   📝 Dunyoning eng qiyalik temir yo'l trissalaridan biri — 55 km da 864 metr balandlik o'zgarishi. Kjosfossen sharsharasida to'xtab foto olish imkoni bor. Norvegiyadagi turlarning eng sevimli qismi.

③ GEIRANGERFJORD — Geiranger
   🏷️ Turi: attraction | UNESCO, tabiat, fjord
   🕐 Ish vaqti: Kruiz: 10:00–17:00 (may–sentyabr)
   💵 Narxi: NOK 350 (kruiz)
   🚌 Transport: Ålesund dan avtobus va feri, 3 soat
   📝 UNESCO ro'yxatidagi eng chuqur fjordlardan biri — 260 metr chuqurlikda. Yetti singlil va Kuyov sharsharalari fjord devoridan oqib tushadi. Qayiq kruizi maj-sentabr orasida.

④ JOSTEDALSBREEN GLACIER — Fjærland
   🏷️ Turi: attraction | tabiat, muzlik, piyoda yurish
   🕐 Ish vaqti: 08:00–17:00 (may–sentyabr)
   💵 Narxi: NOK 495 (muzlik yurischi)
   🚌 Transport: Sogndal dan avtobus, 1 soat 30 daqiqa
   📝 Kontinental Yevropa ning eng katta muzligi — 487 kv.km. Briksdalsbreen va Nigardsbreen yo'lovchi kira oladigan qo'llari. Muzlik yurishi (crampon) bilan muzlik ustida sayr qilish mumkin.

⑤ NORTHERN LIGHTS – TROMSØ — Tromsø
   🏷️ Turi: attraction | tabiat
   🕐 Ish vaqti: Kechasi 22:00–02:00 (qishda)
   💵 Narxi: NOK 1200–1500 (ekskursiya)
   🚌 Transport: Tromsø aeroportidan taksi, 15 daqiqa
   📝 Oktyabr-mart orasida shimoliy yorug'lik — aurora borealis — Tromsø atrofida eng yaxshi ko'rinadi. Shahardan tashqariga chiqib kuzatish yaxshiroq. Ekskursiya qayiqdan ko'rish imkoni ham bor.

⑥ PREIKESTOLEN (PULPIT ROCK) — Stavanger
   🏷️ Turi: attraction | tabiat, piyoda yurish, fotografiya
   🕐 Ish vaqti: Doim ochiq (piyoda yo'l: aprel–oktabr)
   💵 Narxi: Bepul (avtobus: NOK 130)
   🚌 Transport: Stavanger dan feri va avtobus, 2 soat
   📝 604 metr balandlikdagi tekis qoya — Lysefjord ustida osilib turibdi. 4 soatlik piyoda yo'l (borish-kelish). Qoya chetida o'tirib oyoqlarni osiltirgan fotosurat dunyoga mashhur.

⑦ VIGELAND SCULPTURE PARK — Oslo
   🏷️ Turi: attraction
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul
   🚌 Transport: Majorstuen T-bane stansiyasi, 10 daqiqa yurish
   📝 212 ta bronza va granit heykali bilan boyitilgan park — Gustav Vigeland ning barcha asarlari bir joyda. Monolitt ustuni 121 inson figurasidan iborat. Bepul va 24 soat ochiq.

════════════════════════════════════════════════════════

🌍 NEW ZEALAND (NZ)
① ABEL TASMAN MILLIY BOG'I — Nelson
   🏷️ Turi: attraction | tabiat, kayak, trekking, plyaj
   🕐 Ish vaqti: 24/7
   💵 Narxi: Bepul kirish; kayak NZ$70/kun ($42)
   🚌 Transport: Nelson shahridan avtobus yoki qayiq Marahau'ga
   📝 Yangi Zelandiyaning eng kichik lekin eng mashhur milliy bog'i — oltin plyajlar, dengiz yo'llari, kayak safari. Abel Tasman Coast Track — 3–5 kunlik trekking va dengiz tekshirishi. Focke suv itbaliqlar koloniyasi yaqinida kayaking unutilmas tajriba.

② HOBBITON — MATAMATA — Matamata
   🏷️ Turi: attraction | kino, fantastika, tur, Lord of the Rings
   🕐 Ish vaqti: 09:00–17:00 (har kuni)
   💵 Narxi: NZ$89 ($53) standart tur
   🚌 Transport: Auckland'dan 2 soat, Hamilton'dan 45 daqiqa avtomobil
   📝 Haqiqiy Shire — Peter Jackson's The Lord of the Rings va Hobbit filmlarining asosiy manzara suratga olish joyi. 44 ta hobbit uyi, Bilbo'ning tor eshigi, Qo'ng'iroqlar qo'riqxonasi — hammasi saqlanib qolgan. Belgi'da yangi pivoni tatib ko'rish ham borq.

③ MILFORD SOUND — Fiordland
   🏷️ Turi: attraction | tabiat, fjord, UNESCO, kema
   🕐 Ish vaqti: Kema turlari 09:00, 11:00, 13:30, 15:30
   💵 Narxi: NZ$75–150 ($45–90) kema turi
   🚌 Transport: Queenstown'dan avtomobil 4 soat yoki Te Anau'dan 2 soat
   📝 Kipyuard Kipling «sakkizinchi dunyo mo'jizasi» deb atagan fjord — Mitre Peak 1692 metr to'g'ridan-to'g'ri dengizdan ko'tariladi. Yomg'ir ko'p yog'adi — lekin bu sharsharalarni kuchaytiradi. Kema turi, kayaking va suv osti kuzatuvxonasi mavjud.

④ QUEENSTOWN — SARGUZASHT POYTAXTI — Queenstown
   🏷️ Turi: attraction | sarguzasht, bungee, qish sporti, tabiat
   🕐 Ish vaqti: 08:00–17:00 (faoliyat markazlari)
   💵 Narxi: NZ$195 ($115) bungee; faoliyatga qarab farq qiladi
   🚌 Transport: Queenstown aeroporti — shahar markazi 8 daqiqa
   📝 Dunyo sarguzasht poytaxti — 1988-yilda Kawarau ko'prigida birinchi bungee jumping bo'lgan, hozir 43 metr. Jet boat, skydiving, zipline, heli-skiing — hammasi bir shaharda. Remarkables tog' tizmasi va Wakatipu ko'li manzarasi sarguzashtni yanada dramatiklashtiradi.

⑤ ROTORUA — GEOTERMIK MO'JIZALAR — Rotorua
   🏷️ Turi: attraction | tabiat, maoriy, geyzer, madaniyat
   🕐 Ish vaqti: 09:00–17:00 (har kuni)
   💵 Narxi: NZ$55 ($33) Te Puia kirish
   🚌 Transport: Auckland'dan 3 soat, Hamilton'dan 1 soat avtomobil
   📝 Shahar ichida geyzerlar va qaynayotgan loyqalar — ko'cha yoriqlaridan bug' chiqadi. Whakarewarewa maoriy qishlog'i hali ham geotermal energiyada pishiriq pishiradi. Te Puia geyzer kompleksi har 20 daqiqada otiladi. Maoriy haka raqsi va hangi ziyofati alohida tajriba.

⑥ WAITOMO G'ORLARI — YULDUZLI KIRPI CHIROQLARI — Waitomo
   🏷️ Turi: attraction | tabiat
   🕐 Ish vaqti: 09:00–17:00 (har kuni)
   💵 Narxi: NZ$55 ($33) qayiq turi
   🚌 Transport: Auckland'dan 2.5 soat, Hamilton'dan 1 soat avtomobil
   📝 Ohaktosh g'or shiftida millionlab bioluminestsent qurtlar yulduz kabi yiltillab turadi — go'yo yulduzli osmon ostida qayiq haydayapsiz. Arachnocampa luminosa — faqat Yangi Zelandiyada uchraydigan tur. Qorong'u jimlikda bu yoritilgan saq hayratlanarli.

⑦ WELLINGTON — TE PAPA TONGAREWA MUZEYI — Wellington
   🏷️ Turi: attraction | muzey, madaniyat, maoriy, bepul
   🕐 Ish vaqti: 10:00–18:00 (har kuni)
   💵 Narxi: Bepul (asosiy ekspozitsiya)
   🚌 Transport: Wellington aeroportidan taksi 20 daqiqa; Waterfront yaqinida
   📝 Yangi Zelandiya milliy muzeyi — maoriy madaniyati, tabiiy tarix va zamonaviy san'at bir joyda, barchasi bepul. Interaktiv zilzila simulyatori, dev kalamar va maoriy wharenui (uy) rekonstruksiyasi. Lambton Quay va Cuba Street — Wellington'ning mohir yuzi bilan birlashtirilsin.

════════════════════════════════════════════════════════

🌍 PERU (PE)
① CUSCO — PLAZA DE ARMAS — Cusco
   🏷️ Turi: attraction | tarix, Inka, UNESCO, shahar
   🕐 Ish vaqti: 24/7 (maydon); Katedral 10:00–18:00
   💵 Narxi: Bepul (maydon); Katedral $15
   🚌 Transport: Cusco aeroportidan taksi 15 daqiqa
   📝 Inka imperiyasining sobiq poytaxti, Quyosh shahri. Ispanlar Inka ibodatxonalari ustiga katedralni qurishgan — tarix ikki qatlam bo'lib ko'rinadi. Atrofidagi ingichka ko'chalarda Inka devorining aniq va ishlangan toshlari saqlanib qolgan.

② HUACACHINA — CHO'L OAZISI — Ica
   🏷️ Turi: attraction | tabiat, sarguzasht
   🕐 Ish vaqti: 06:00–18:00 (turlar)
   💵 Narxi: $30–50 (buggy + sandboard)
   🚌 Transport: Ica shahridan taksi 10 daqiqa
   📝 Peru'dagi yagona tabiiy oazis — qum dunalar o'rtasida yashil laguna. Sandboarding va dune buggy turlari kunda ikki marta: tong va kechqurun quyosh botishi paytida. 100 metrlik qum tepalaridan uchib tushish unutilmas tajriba.

③ LIMA — MIRAFLORES PARROTLAR PARKI — Lima
   🏷️ Turi: attraction | shahar, oshxona, mahalliy hayot, sohil
   🕐 Ish vaqti: 24/7
   💵 Narxi: Bepul (mahalla)
   🚌 Transport: Lima aeroportidan taksi 30–40 daqiqa
   📝 Lima'ning kosmopolit mahallasi, Tinch okeani qoyalari chetida. Parque del Amor va parrotlar to'plami, zamonaviy restoran va kafe tizimlari, xavfsiz piyoda ko'chalar. Lima'ning modern yuzi — ceviche va tiradito dunyoning eng yaxshi restoranlarida tatib ko'riladi.

④ MACHU PICCHU — Aguas Calientes
   🏷️ Turi: attraction | UNESCO, Inka, tarix
   🕐 Ish vaqti: 06:00–17:30 (har kuni)
   💵 Narxi: $55–75 (turistik marshrut)
   🚌 Transport: Cusco'dan Aguas Calientes'ga poyezd, u yerdan avtobus 25 daqiqa
   📝 Inka imperiyasining bulutlar ichidagi qal'asi — 2430 metr balandlikda, 1911-yilgacha g'arbga noma'lum edi. Intihuatana quyosh sog'ati, Sun Gate va Inka ko'prigi alohida e'tiborga loyiq. Tong paytida tuman ko'tarilib, qal'a asta-sekin ochilgani hayratlanarli manzara.

⑤ NAZCA CHIZMALARI — Nazca
   🏷️ Turi: attraction | sirli, tarix, UNESCO, samolyot turi
   🕐 Ish vaqti: 07:00–17:00 (uchishlar)
   💵 Narxi: $80–120 (samolyot uchushi)
   🚌 Transport: Lima'dan avtobus 6–8 soat; Ica'dan taksi 2 soat
   📝 Miloddan avvalgi 500–500 yillar orasida yaratilgan ulkan yer sathi rasmlar — maymun, kolibri, daraxt. Faqat havadan ko'rinadi. Nazca tekisligida 300 dan ortiq geometrik shakl va 70 hayvon tasviri bor. Hali ham to'liq tushuntirilib bo'lmagan sirlar bor.

⑥ MUQADDAS VODIY — PISAC BOZORI VA OLLANTAYTAMBO — Urubamba
   🏷️ Turi: attraction | Inka, tarix, bozor, arxeologiya
   🕐 Ish vaqti: 07:00–18:00
   💵 Narxi: $20–30 (kombinatsiyalangan chipa)
   🚌 Transport: Cusco'dan avtobus 1.5–2 soat
   📝 Cusco va Machu Picchu o'rtasidagi Inka vodiysi. Pisac bozori mahalliy to'qimachilik va ziravorlar uchun; Ollantaytambo tepalardagi Inka harbiy qal'asi va faol yashayotgan Inka shaharchasidan iborat. Yerli aholi hali ham quduq suvidan foydalanadi.

⑦ TITICACA KO'LI — UROS OROLLARI — Puno
   🏷️ Turi: attraction | tabiat, madaniyat
   🕐 Ish vaqti: 07:00–18:00 (qayiqlar)
   💵 Narxi: $10–20 (qayiq turi)
   🚌 Transport: Puno shahridan qayiq stantsiyasi 15 daqiqa piyoda
   📝 Dengiz sathidan 3812 metr balandlikdagi dunyo eng baland navigatsiya qilinadigan ko'li. Uros xalqi suzuvchi qamoq orollarida yashaydi — orollar o'zi ham qamoqdan qurilgan. Taquile oroli esa UNESCO'ga kiritilgan to'quv san'atiga ega.

════════════════════════════════════════════════════════

🌍 POLAND (PL)
① AUSCHWITZ-BIRKENAU MEMORIAL — Oświęcim
   🏷️ Turi: attraction | memorial, UNESCO, tarix
   🕐 Ish vaqti: 07:30–18:00 (mavsumga qarab)
   💵 Narxi: Bepul (ekskursiya bron: PLN 55)
   🚌 Transport: Kraków markazidan avtobus, 1 soat 30 daqiqa
   📝 1940–1945 yillarda 1.1 million kishi hayotini yo'qotgan kontslager. Hujjatlar, baraklar va gaz kamerasi — og'ir, lekin muhim ziyorat. Bepul ekskursiya bron qiling.

② GDAŃSK OLD TOWN & SHIPYARD — Gdańsk
   🏷️ Turi: attraction | tarix, dengiz, siyosat
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul (sayr); Solidarity: PLN 30
   🚌 Transport: Gdańsk Główny dan piyoda 10 daqiqa
   📝 Baltiq dengizi bo'yidagi hanseatik shahar. Ulug' arsenal, Neptun fontani va Amber Museum. Solidarity harakatining boshlanish joyi — kemasozlik zavodi va Solidarity markazi.

③ MALBORK CASTLE — Malbork
   🏷️ Turi: attraction | UNESCO, tarix, arxitektura
   🕐 Ish vaqti: 09:00–19:00 (har kuni)
   💵 Narxi: PLN 60
   🚌 Transport: Gdańsk Główny dan poyezd, 40 daqiqa
   📝 Dunyodagi eng katta g'isht qal'a — Teutonik ritsar ordenining XIV asrdagi markazi. UNESCO ro'yxatida. Muzeyda zirh, qurollar va o'rta asr artefaktlari. Bir kun vaqt ajrating.

④ WARSAW OLD TOWN (STARE MIASTO) — Warsaw
   🏷️ Turi: attraction | UNESCO, tarix, arxitektura
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul (qirol qasri: PLN 30)
   🚌 Transport: Krakowskie Przedmieście dan piyoda 10 daqiqa
   📝 II Jahon urushida butunlay vayron qilingan, keyin asl fotosuratlar asosida qayta qurilgan shahar. UNESCO bu qayta tiklanishni o'ziga xos deb himoya qilgan. Qirol qasri va bozor maydoni.

⑤ WAWEL CASTLE – KRAKÓW — Kraków
   🏷️ Turi: attraction | UNESCO, tarix, arxitektura
   🕐 Ish vaqti: 09:30–17:00 (dushanba yopiq)
   💵 Narxi: PLN 35 (davlat xonalari)
   🚌 Transport: Kraków markazidan piyoda 20 daqiqa
   📝 Vistula daryosi ustidagi tepalikda joylashgan qirollik qasri va katedrali. Polsha qirollarining qabriston. Qasrdagi Davinci rasmiga bron qilib kiring — "Ermin bilan xonim" original nusxasi.

⑥ WROCŁAW MARKET SQUARE — Wrocław
   🏷️ Turi: attraction | mahalliy hayot, tarix, sayr
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul
   🚌 Transport: Wrocław Główny stantsiyasidan tram, 10 daqiqa
   📝 Polshaning eng go'zal bozor maydonlaridan biri — rangli Tudor uyli binolar bilan o'ralgan. Kichik bronza gnomlar butun shahar bo'ylab yashiringan — topish o'yini mahalliylar an'anasi.

⑦ ZAKOPANE & TATRA MOUNTAINS — Zakopane
   🏷️ Turi: attraction | tabiat
   🕐 Ish vaqti: 07:30–21:30 (har kuni)
   💵 Narxi: PLN 85 (teleferik)
   🚌 Transport: Kraków dan avtobus, 2 soat
   📝 Polshaning "qishloq poytaxti" va Tatra milliy bog'i. Kasprowy Wierch teleferik stansiyasidan Slovakiya chegarasi ko'rinadi. Qishda ski, yozda piyoda yurish uchun mashhur.

════════════════════════════════════════════════════════

🌍 PORTUGAL (PT)
① ALGARVE CLIFFS & BEACHES — Lagos
   🏷️ Turi: attraction | tabiat, sohil, fotografiya
   🕐 Ish vaqti: Doim ochiq (qayiq: 09:00–17:00)
   💵 Narxi: Bepul (qayiq: €20)
   🚌 Transport: Lisbon dan poyezd Lagos ga, 4 soat
   📝 Ohaktosh qoyalar, yashirin kovaklar va to'q sariq qumli plyajlar. Ponta da Piedade qoya formatsiyalari qayiqdan ko'rilganda maftunkor. Lagos dan ekskursiya qayiqlar ishlaydi.

② BELÉM TOWER — Lisbon
   🏷️ Turi: attraction | UNESCO, tarix, dengiz
   🕐 Ish vaqti: 10:00–18:00 (dushanba yopiq)
   💵 Narxi: €6
   🚌 Transport: Lisbon markazidan tram 15E, 25 daqiqa
   📝 1519 yilda qurilgan Manuel gotik uslubidagi dengiz qo'rg'oni. Tejo daryosi og'zida joylashgan — dengiz kashfiyotchilari shu yerdan yo'lga chiqgan. Ichki minoraga chiqish mumkin.

③ DOURO VALLEY VINEYARDS — Pinhão
   🏷️ Turi: attraction | tabiat, vino, UNESCO
   🕐 Ish vaqti: Doim ochiq (tours 10:00–18:00)
   💵 Narxi: Bepul (vinoyard tours: €15–30)
   🚌 Transport: Porto dan poyezd Pinhão ga, 2 soat
   📝 Terrassimon bir-biriga o'ralgan uzumzorlar va Douro daryosi — Yevropa ning eng go'zal vinograd vodiylaridan biri. Qayiqda yoki poyezdda kezish mumkin. Vinhos do Porto degustatsiyasi.

④ FADO SHOW LISBON — Lisbon
   🏷️ Turi: attraction | madaniyat, musiqa
   🕐 Ish vaqti: 20:00–00:00 (har kuni)
   💵 Narxi: €25–50 (ovqat bilan)
   🚌 Transport: Alfama tramvay 28E, 15 daqiqa
   📝 Alfama mahallasidagi kichik tashnif (tashnif) uylarda jonli fado — mahzun va go'zal Portugalliya milliy qo'shig'i. UNESCO nomoddiy merosi. Kechki seans ovqat bilan birga bo'ladi.

⑤ PASTÉIS DE BELÉM CAFÉ — Lisbon
   🏷️ Turi: restaurant | restoran, mahalliy taom
   🕐 Ish vaqti: 08:00–23:00 (har kuni)
   💵 Narxi: €1.30 dona boshiga
   🚌 Transport: Lisbon markazidan tram 15E, Belém bekat
   📝 1837 yildan beri ishlayotgan kafeda asl Pastel de nata — yangi pishgan kremilyali puff xamir. Navbat doim bor, lekin tez siljiadi. Doljin va qand sepib iying.

⑥ PORTO RIBEIRA DISTRICT — Porto
   🏷️ Turi: attraction | UNESCO, mahalliy hayot, oshxona
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul (ko'chada sayr)
   🚌 Transport: Porto São Bento stantsiyasidan piyoda 10 daqiqa
   📝 Douro daryosi bo'yidagi azulejo kafellar bilan qoplangan binolar, kichik baliq restoranlari va Porto sharobi omborlari — barchasi shu yerda. Luis I ko'prigidan manzara ajoyib.

⑦ SINTRA ROYAL PALACES — Sintra
   🏷️ Turi: attraction | UNESCO, arxitektura, tabiat
   🕐 Ish vaqti: 09:30–19:00 (har kuni)
   💵 Narxi: €14 (Pena), €10 (Regaleira)
   🚌 Transport: Lisbon Rossio stantsiyasidan poyezd, 40 daqiqa
   📝 O'rmon ichiga o'rnatilgan romantik qasr va saroylar — Pena, Quinta da Regaleira, Monserrate. Har biri boshqa uslubda qurilgan. UNESCO manzarasida butun Sintra tog'i qamrab olingan.

════════════════════════════════════════════════════════

🌍 SWEDEN (SE)
① ABBA THE MUSEUM — Stockholm
   🏷️ Turi: attraction | muzey, musiqa, interaktiv
   🕐 Ish vaqti: 10:00–20:00 (har kuni)
   💵 Narxi: SEK 250
   🚌 Transport: Djurgårdsbroen feri yoki avtobus 67
   📝 Shvetsiyaning eng mashhur pop guruhi ABBA ga bag'ishlangan interaktiv muzey. Kiyimlar, studiya va hologramli konsert zalida — siz ham ABBA bilan sahnaga chiqasiz. Bron qiling.

② DROTTNINGHOLM PALACE — Drottningholm
   🏷️ Turi: attraction | UNESCO, tarix, arxitektura
   🕐 Ish vaqti: 10:00–16:30 (har kuni)
   💵 Narxi: SEK 160 (saroy)
   🚌 Transport: Stokholm Stadshusbroen dan qayiq, 1 soat
   📝 Shvetsiya qirol oilasining hozir ham yashash joyi — UNESCO ob'ekti. XVIII asr teatri hali ham spektakllar ko'rsatadi. Stokholm dan qayiqda kelish yo'li sayrning o'zi.

③ GAMLA STAN – STOCKHOLM — Stockholm
   🏷️ Turi: attraction | ikonik, tarix, UNESCO
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: Bepul (sayr); qirol saroyi: SEK 180
   🚌 Transport: Gamla Stan T-bana, 1 daqiqa
   📝 Stokholm ning XIII asrda asos solingan eski shahri — tor toshko'cha ko'chalari, qirol saroyi va Stortorget maydoni. Kechki yoritish ostida oltin va qizil binolar sehrli ko'rinadi.

④ LISEBERG AMUSEMENT PARK – GÖTEBORG — Göteborg
   🏷️ Turi: attraction
   🕐 Ish vaqti: 11:00–21:00 (mavsumga qarab)
   💵 Narxi: SEK 155 (kirish) + attraksion
   🚌 Transport: Göteborg markazidan tram 5, 5 daqiqa
   📝 Skandinaviyaning eng mashhur ko'ngil ochish bog'i — Helix roller coasteri va Atmos qo'rquv uyidan to gul ko'rgazmalarigacha. Yil oxirida Rozhdestvo bozori alohida atmosfera yaratadi.

⑤ SWEDISH LAPLAND – DOG SLEDDING — Kiruna
   🏷️ Turi: attraction | tabiat, qish, sarguzasht
   🕐 Ish vaqti: Tur: 09:00–16:00 (yanvar–mart)
   💵 Narxi: SEK 2500–4000 (bir kun tur)
   🚌 Transport: Kiruna aeroportidan transfer, 30 daqiqa
   📝 Qish oylarida itlar qo'shilgan pulkada qor o'rmonlari orqali safari. Aurora borealis ko'rish imkoni va Jukkasjärvi muzlik mehmonxona — Lapland turi unutilmas tajriba.

⑥ STOCKHOLM ARCHIPELAGO (SKÄRGÅRD) — Stockholm
   🏷️ Turi: attraction | tabiat, orol, dengiz
   🕐 Ish vaqti: Feri: 08:00–22:00 (har kuni)
   💵 Narxi: Vaxholm feri: SEK 175
   🚌 Transport: Stokholm Strömkajen qayiq bekatidan
   📝 30,000 dan ortiq orolcha, yarim orol va qoyalar — Stokholm ning yashirin go'zalligi. Yozda mahalliylar yog'och qayiqlarda dam oladi. Sandhamn yoki Vaxholm — sevimli manzillar.

⑦ VASA MUSEUM — Stockholm
   🏷️ Turi: attraction | muzey, dengiz, tarix
   🕐 Ish vaqti: 10:00–17:00 (har kuni, chorshanba: 20:00)
   💵 Narxi: SEK 190
   🚌 Transport: Djurgårdsbroen feri yoki avtobus 69
   📝 1628 yilda birinchi suzishida cho'kkan va 333 yil keyinida ko'tarilgan XVII asr harbiy kemasi. 95% asl qismlar bilan saqlanib qolgan — dunyo ning eng yaxshi saqlangan kemasi.

════════════════════════════════════════════════════════

🌍 SINGAPORE (SG)
① CHINATOWN — Singapur
   🏷️ Turi: attraction | madaniyat, bozor, tarix
   🕐 Ish vaqti: Doim ochiq (do'konlar: 10:00–22:00)
   💵 Narxi: 0
   🚌 Transport: Chinatown MRT bekatidan to'g'ridan-to'g'ri
   📝 Rangli shophouses, Buddist ibodatxonalar va ixtisoslashgan bozorlar. Sri Mariamman Hindu ibodatxonasi ham shu yerda. Kechqurun oziq-ovqat ko'chasi jonlanadi — hawker stalls qaynaydi.

② CLARKE QUAY — Singapur
   🏷️ Turi: attraction | kechki hayot, restoran, daryokenar
   🕐 Ish vaqti: Restoranlar: 12:00–00:00. Barlar: 18:00–03:00
   💵 Narxi: 0 (hudud)
   🚌 Transport: Clarke Quay MRT bekatidan 3 daqiqa piyoda
   📝 Singapore daryosi qirg'og'idagi tarixiy omborxonalardan restoran, bar va klublarga aylangan ko'ngilochar hudud. Kechqurun jonli musiqa, cocktail va daryokenar atmosfera.

③ GARDENS BY THE BAY — Singapur
   🏷️ Turi: attraction | tabiat
   🕐 Ish vaqti: 05:00–02:00 (bog'). Issiqxonalar: 09:00–21:00
   💵 Narxi: 0 (ochiq). 53 SGD (ikkala issiqxona)
   🚌 Transport: Bayfront MRT bekatidan 10 daqiqa piyoda
   📝 Kelajak o'rmoni — Supertree Grove'dagi 25-50 metrlik metall daraxtlar kechqurun yoritiladi. Flower Dome va Cloud Forest issiqxonalari alohida chiptali. Ochiq maydon bepul.

④ MAXWELL FOOD CENTRE — Singapur
   🏷️ Turi: restaurant | ovqat, mahalliy hayot, hawker
   🕐 Ish vaqti: 08:00–22:00 (dushanba ba'zi stalllar yopiq)
   💵 Narxi: 3–8 SGD/taom
   🚌 Transport: Chinatown MRT bekatidan 5 daqiqa piyoda
   📝 Singapurning eng mashhur hawker markazlaridan biri. Tian Tian Chicken Rice — Gordon Ramsay maktagan taom shu yerda. 100 dan ortiq stall, narxlar juda qulay. UNESCO nomidagi ovqat madaniyati.

⑤ LITTLE INDIA — Singapur
   🏷️ Turi: attraction | madaniyat, bozor, Hindiston
   🕐 Ish vaqti: Doim ochiq (do'konlar: 09:00–22:00)
   💵 Narxi: 0
   🚌 Transport: Little India MRT bekatidan to'g'ridan-to'g'ri
   📝 Atirgul gulchambarlar, ziravorlar va rangdor sarilari bilan to'liq ko'cha. Sri Veeramakaliamman ibodatxonasi markazda. Tekka Centre bozorida haqiqiy Janubiy Osiyo atmosferasi.

⑥ MARINA BAY SANDS — Singapur
   🏷️ Turi: attraction | ikonik, panorama, Singapur
   🕐 Ish vaqti: 10:00–22:00 (har kuni)
   💵 Narxi: 26–32 SGD (observation deck)
   🚌 Transport: Bayfront MRT bekatidan to'g'ridan-to'g'ri
   📝 Uch qavatli kemaga o'xshash bino tepasidagi SkyPark ko'rish maydoni. Mehmonda bo'lmasangiz ham observation deck'ga kirish mumkin. Kechqurun su fontan va yon tomondagi Gardens by the Bay bilan manzara to'liq.

⑦ RAFFLES HOTEL — Singapur
   🏷️ Turi: hotel | mehmonxona, tarix, premium
   🕐 Ish vaqti: Long Bar: 11:00–00:30 (har kuni)
   💵 Narxi: 800–2000 SGD/tun
   🚌 Transport: City Hall MRT bekatidan 10 daqiqa piyoda
   📝 1887-yilda qurilgan mustamlaka davri Neoklassik uslubidagi legendar mehmonxona. Singapore Sling kokteyli shu yerda ixtiro qilingan. Long Bar'da bir ichimlik buyurtma qilish tajriba.

⑧ SENTOSA OROLI — Singapur
   🏷️ Turi: attraction
   🕐 Ish vaqti: 24 soat (attraksionlar: 10:00–19:00)
   💵 Narxi: 0 (orolga kirish). Attraksionlar: 30–80 SGD
   🚌 Transport: HarbourFront MRT'dan Sentosa Express monorayli
   📝 Universal Studios, Palawan Beach va S.E.A. Aquarium bilan to'liq ko'ngilochar orol. Kanatsiz yo'l yoki express yo'l orqali bog'langan. Oilalar va yoshlar uchun bir kunlik dastur.

════════════════════════════════════════════════════════

🌍 THAILAND (TH)
① BLUE ELEPHANT RESTORAN — Bangkok
   🏷️ Turi: restaurant | restoran, royal tailand, Bangkok
   🕐 Ish vaqti: 11:30–14:30, 18:30–22:30 (har kuni)
   💵 Narxi: 600–1200 THB/kishi
   🚌 Transport: Surasak BTS bekatidan 10 daqiqa piyoda
   📝 Bangkok'ning 1980-yildan buyon mashhur tailand oshxonasi. Tarixiy binoda royal tailand taomlari. Massaman curry va pad thai bu yerda an'anaviy uslubda tayyorlanadi.

② CHATUCHAK DAM BOZORI — Bangkok
   🏷️ Turi: attraction | bozor, xarid, Bangkok
   🕐 Ish vaqti: Shanba–Yakshanba, 09:00–18:00
   💵 Narxi: 0
   🚌 Transport: Mo Chit BTS yoki Kamphaeng Phet MRT bekatidan 5 daqiqa
   📝 Dunyodagi eng katta dam bozori — 15 000 do'kon, 200 000 tashrif buyuruvchi. Kiyim, antika, o'simlik va oziq-ovqat. Navigatsiya qiyin — xarita olish tavsiya.

③ CHIANG MAI IBODATXONALARI (DOI SUTHEP) — Chiang Mai
   🏷️ Turi: attraction | ibodatxona
   🕐 Ish vaqti: 06:00–20:00 (har kuni)
   💵 Narxi: 30 THB
   🚌 Transport: Chiang Mai markazidan marshrutka yoki songthaew bilan
   📝 Chiang Mai tog'ida joylashgan Doi Suthep ibodatxonasi 1383-yilda qurilgan. Shahar panoramasi va oltin chedi. 309 ta zinapoya yoki kanatli yo'l bilan ko'tarilish.

④ DAMNOEN SADUAK SUZUVCHI BOZORI — Ratchaburi
   🏷️ Turi: attraction | bozor, kanal
   🕐 Ish vaqti: 07:00–12:00 (har kuni)
   💵 Narxi: 0 (kirish), qayiq: 100–300 THB
   🚌 Transport: Bangkok markazidan soat 1.5, marshrutka yoki tur avtobus
   📝 Kanalda qayiqda sotuvchi ayollar — Tailandning ikonik tasviri. Meva, taom va suvenir sotiladi. Ertalab 07:00–09:00 oralig'ida eng gavjum va haqiqiy ko'rinish.

⑤ JIM THOMPSON UYI — Bangkok
   🏷️ Turi: attraction | muzey
   🕐 Ish vaqti: 10:00–18:00 (har kuni)
   💵 Narxi: 200 THB
   🚌 Transport: National Stadium BTS bekatidan 5 daqiqa piyoda
   📝 Amerika razvedkachisi va ipak savdogari Jim Thompsonning 6 ta tarixiy Tailand uyi birlashtirilgan muzey-uyasi. Tailand san'ati va antika to'plamiga boy. Sirli yo'qolishi ham qiziqarli.

⑥ KO LANTA PLYAJLARI — Ko Lanta
   🏷️ Turi: attraction | plyaj, orol, dam olish
   🕐 Ish vaqti: Plyajlar doim ochiq
   💵 Narxi: 0 (plyaj)
   🚌 Transport: Krabi yoki Phuketdan ferry, soat 2–3
   📝 Phuketdan tinchroq muqobil — uzun qumli plyajlar, toza suv. Klong Dao va Long Beach eng mashhuri. Oktyabr–Aprel qutidor, lyuksdan budget variantlargacha mehmonxonalar.

⑦ PHANG NGA BAY — Phuket
   🏷️ Turi: attraction | tabiat, dengiz, qayiq
   🕐 Ish vaqti: Turlar 07:00–17:00 (har kuni)
   💵 Narxi: 1200–1800 THB (tur bilan)
   🚌 Transport: Phuket yoki Khao Lak dan tur qayiqlari
   📝 Yashil dengizda tik turgan ohaktosh qoyalari — James Bond oroli shu yerda. Kayak yoki qayiq bilan kovaklar ichiga kirish mumkin. Janubiy Tailandning eng ta'sirli manzarasi.

⑧ WAT PHRA KAEW — ZUMRAD BUDDA IBODATXONASI — Bangkok
   🏷️ Turi: attraction | ibodatxona, qirollik, Bangkok
   🕐 Ish vaqti: 08:30–15:30 (har kuni)
   💵 Narxi: 500 THB
   🚌 Transport: Chao Phraya ferry, Tha Chang bekati
   📝 Tailandning eng muqaddas ibodatxonasi, Qirollik saroyi hududida. Zumrad Budda haykali 66 sm — kichik lekin ulug'vor. Kirish uchun yopiq kiyim majburiy.

════════════════════════════════════════════════════════

🌍 TURKEY (TR)
① BODRUM QAL'ASI VA SHAHRI — Bodrum
   🏷️ Turi: attraction
   🕐 Ish vaqti: Qal'a: 09:00–18:30. Shahar: doim ochiq
   💵 Narxi: 400 TRY (qal'a)
   🚌 Transport: Bodrum aeroportidan 35 daqiqa taksi
   📝 Egey dengizi qirg'og'idagi oq va ko'k boʻyalgan shahar. 15-asrlik Sent Pyotr qal'asi ostidagi suv osti arxeologiya muzeyi noyob. Yaxta limoni va jonli kechki hayot.

② KAPADOKIYA — Nevshehir
   🏷️ Turi: attraction | UNESCO, or
   🕐 Ish vaqti: Doim ochiq (sharg'uf: tong azon)
   💵 Narxi: 250–350 EUR (sharg'uf)
   🚌 Transport: Nevshehir yoki Kayseri aeroportidan taksi/avtobus
   📝 Vulkanik tosh konuslar orasidagi g'or shaharlari va monastirlar. Tong saharlab sharg'uf parvozi Kapadokiyaning ramzi. Goreme ochiq havo muzeyi, Derinkuyu er osti shahri.

③ EFES XAROBALARI — Selcuk
   🏷️ Turi: attraction | UNESCO, antik, arxeologiya
   🕐 Ish vaqti: 08:00–18:30 (mavsum bo'yicha)
   💵 Narxi: 900 TRY
   🚌 Transport: Selcuk bekatidan 3 km, taksi yoki velosiped
   📝 O'rta er dengizi hududidagi eng yaxshi saqlanib qolgan antik Rim shahri. Celsus kutubxonasi, Buyuk teatr va marmor ko'chalar. Mil. avv. 6-asrdan beri aholi istiqomat qilgan.

④ GALATA MINORASI — Istanbul
   🏷️ Turi: attraction | tarix, panorama, Istanbul
   🕐 Ish vaqti: 09:00–22:00 (har kuni)
   💵 Narxi: 490 TRY
   🚌 Transport: Karakoy metro bekatidan 10 daqiqa piyoda
   📝 14-asrda Genuez tomonidan qurilgan 67 metrlik tosh minora. Tepadan Istanbul va Bosfor bo'g'ozi panoramasi. Galata tumani o'zi ham sayr qilish uchun ajoyib.

⑤ KAPALIÇARŞI (YOPIQ BOZOR) — Istanbul
   🏷️ Turi: attraction | bozor, tarix, Istanbul
   🕐 Ish vaqti: 09:00–19:00 (yakshanba yopiq)
   💵 Narxi: 0 (kirish bepul)
   🚌 Transport: Kapalıçarşı tramvay bekatidan to'g'ridan-to'g'ri
   📝 1461-yilda qurilgan, 4000 do'kon, 61 ko'cha — dunyodagi eng qadimiy va eng katta yopiq bozorlardan biri. Ziynat buyumlari, charm, ziravorlar. Savdolashish san'at.

⑥ HAGIA SOPHIA — Istanbul
   🏷️ Turi: attraction | UNESCO, tarix, ikonik
   🕐 Ish vaqti: 09:00–17:00 (namoz vaqtida yopiladi)
   💵 Narxi: 900 TRY
   🚌 Transport: Sultanahmet tramvay bekatidan 3 daqiqa piyoda
   📝 537-yilda qurilgan — avval cherkov, keyin masjid, soʻng muzey, yana masjid. Gumbazning ulug'vorligi va Vizantiya mozaikalari birga mavjud. Dunyoda o'xshashi yo'q.

⑦ KARAKOY GULLUOGLU BAKLAVA — Istanbul
   🏷️ Turi: restaurant | restoran, baklava, Istanbul
   🕐 Ish vaqti: 07:30–23:30 (har kuni)
   💵 Narxi: 150–300 TRY/kishi
   🚌 Transport: Karakoy metro bekatidan 3 daqiqa piyoda
   📝 1949-yildan beri Gaziantep'dan Istanbul'ga keltirilgan baklava san'ati. Pistachio va asal bilan yog'li qatlama. Karakoy'dagi asosiy do'kon eng mashhuri — nonushta va choy bilan.

⑧ PAMUKKALE — Denizli
   🏷️ Turi: attraction | tabiat, UNESCO, mineral suv
   🕐 Ish vaqti: 06:00–21:30 (har kuni)
   💵 Narxi: 600 TRY
   🚌 Transport: Denizli shahridan avtobus yoki taksi, 45 daqiqa
   📝 Issiq mineral suvlardan hosil bo'lgan oq travertin teraslar — pambiq qal'asi ma'nosi. Hierapolis antik shahri tepasida. Hovuzlarda cho'milish mumkin, lekin kiyim kechirish kerak.

════════════════════════════════════════════════════════

🌍 UNITED STATES (US)
① CHICAGO ARCHITECTURE FOUNDATION RIVER CRUISE — Chicago
   🏷️ Turi: attraction | arxitektura, tur, daryo
   🕐 Ish vaqti: Mart–Noyabr: 09:00–19:00 (har soatda)
   💵 Narxi: $52
   🚌 Transport: Michigan Avenue ko'prigi yaqinida, Riverwalk
   📝 Chicago daryosidan 90 daqiqa davomida 50+ binoni ko'rasiz: Art Deco masterpiece'lardan zamonaviy parvoz qilgan qabiqlar. Arxitektura izohlovchi qo'llanma bilan. Dunyoning eng yaxshi arxitektura turlaridan biri deb tan olingan.

② GOLDEN GATE BRIDGE & PRESIDIO — San Francisco
   🏷️ Turi: attraction | arxitektura
   🕐 Ish vaqti: 24/7 (turar joy parki 5:00–21:00)
   💵 Narxi: $9.75 (piyoda/velosiped bepul)
   🚌 Transport: Avtobuslar: 28, 29, 43 (Presidio side)
   📝 1937-yilda qurilgan, 2737 metr uzunlikdagi to'q sariq ko'prik. Presidio parki tomonidan piyoda o'tish eng yaxshisi. Ko'pincha tuman o'ragan bo'ladi — bu ham o'ziga xos manzara yaratadi.

③ GRAND CANYON NATIONAL PARK — Arizona
   🏷️ Turi: attraction | tabiat
   🕐 Ish vaqti: 24/7 (Janubiy qirg'oq yil bo'yi)
   💵 Narxi: $35 (avtomobil)
   🚌 Transport: Flagstaff shahridan 1.5 soat avtomobil
   📝 446 km uzunlikdagi ulkan vodiy, 1600 metr chuqurlikda. Janubiy qirg'oq yil bo'yi ochiq. Sunrise va sunset vaqti ayniqsa ta'sirli — ranglar daqiqada o'zgaradi, qizil-sariq-binafsha gradiyent osmonni bo'yaydi.

④ NEW ORLEANS FRENCH QUARTER — New Orleans
   🏷️ Turi: attraction | madaniyat, jazz, tarix, mahalliy hayot
   🕐 Ish vaqti: 24/7
   💵 Narxi: Bepul (kirishga)
   🚌 Transport: Markaziy avtobuslar va tramvay liniyalari
   📝 Amerika'ning eng qadimiy mahallasi — frantsuz-ispan arxitekturasi, temirdan ishlangan balkonlar, jazz musiqasi har burchakda. Bourbon Street kecha-kunduz jonli. Mardi Gras festivalida shahar butunlay o'zgaradi.

⑤ SMITHSONIAN INSTITUTION MUSEUMS — Washington D.C.
   🏷️ Turi: attraction | madaniyat, muzey, bepul
   🕐 Ish vaqti: 10:00–17:30 (har kuni)
   💵 Narxi: Bepul
   🚌 Transport: Metro: Blue/Orange/Silver line, Smithsonian stantsiyasi
   📝 Dunyo eng katta muzey kompleksi — 19 muzey, hammasi bepul. Natural History, Air and Space, American History — bir kunda hammasi imkonsiz. Milliy xazina deb bejiz aytmaydilar.

⑥ TIMES SQUARE — New York
   🏷️ Turi: attraction | shahar
   🕐 Ish vaqti: 24/7
   💵 Narxi: Bepul
   🚌 Transport: Metro: N, Q, R, W, 1, 2, 3, 7 liniyalar (42 St - Times Sq)
   📝 Manhattanning yuragi — 40 blok reklama ekranlar, minglab sayyohlar va Broadway teatrlari. Kechasi ayniqsa jonli: neon yog'du ko'chani kunduzgidek yoritadi. Yangi yil kechasi million kishi yig'iladi.

⑦ YELLOWSTONE NATIONAL PARK — Wyoming
   🏷️ Turi: attraction | tabiat
   🕐 Ish vaqti: 24/7 (ba'zi yo'llar qishda yopiladi)
   💵 Narxi: $35 (avtomobil)
   🚌 Transport: Jackson Hole aeroportidan 1 soat avtomobil
   📝 Dunyodagi birinchi milliy bog', geyzerlar va qaynoq buloqlar mamlakati. Old Faithful geyzer har 90 daqiqada otiladi. Grand Prismatic Spring — ko'zni qamashtiruvchi moviy-sariq-yashil rang gradiyenti.

════════════════════════════════════════════════════════

🌍 UZBEKISTAN (UZ)
① AMIR TEMUR MUZEYI — Toshkent
   🏷️ Turi: attraction | muzey, tarix, Temuriylar
   🕐 Ish vaqti: 10:00–17:00 (dushanba yopiq)
   💵 Narxi: 25 000 UZS
   🚌 Transport: Amir Temur Hiyoboni metro bekatidan 3 daqiqa piyoda
   📝 Toshkent markazidagi yashil gumbazli binoda Temuriylar sulolasiga oid eksponatlar. Ko'rgazmalar, xaritalar va qadimiy qurollar. Arxitekturasi o'zi ham diqqatga sazovor.

② ARK QAL'ASI — Buxoro
   🏷️ Turi: attraction | tarix
   🕐 Ish vaqti: 09:00–18:00 (chorshanba dam olish kuni)
   💵 Narxi: 30 000 UZS
   🚌 Transport: Buxoro markazidan 10 daqiqa piyoda
   📝 Buxoro amirlarining qadimiy qal'asi, 5-asrdan beri mavjud. Ichida muzey, saroy xonalari va ustaxonalar bor. Shahar panoramasi uchun eng baland nuqta.

③ CHORSU BOZORI — Toshkent
   🏷️ Turi: attraction | bozor, mahalliy hayot, ziravorlar
   🕐 Ish vaqti: 07:00–19:00 (har kuni)
   💵 Narxi: 0
   🚌 Transport: Chorsu metro bekatidan chiqishdayoq
   📝 Toshkentning eng qadimiy va eng katta bozori. Moviy gumbaz ostida ziravorlar, quruq mevalar, go'sht va non savdosi. Mahalliy hayotni his qilish uchun ideal joy.

④ ICHAN-QAL'A — Xiva
   🏷️ Turi: attraction | UNESCO, tarix, arxitektura
   🕐 Ish vaqti: 08:00–20:00 (har kuni)
   💵 Narxi: 120 000 UZS
   🚌 Transport: Xiva aeroportidan 10 daqiqa taksi bilan
   📝 Xivaning ichki shahri — UNESCO ro'yxatidagi yaxlit tarixiy kompleks. Kalta Minor, Juma masjidi va Ko'hna Ark bu yerda joylashgan. Sharq arxitekturasining jonli muzeyi.

⑤ LABI-HOVUZ MAJMUASI — Buxoro
   🏷️ Turi: attraction | arxitektura, istirohat, tarix
   🕐 Ish vaqti: Doim ochiq (restoranlar 09:00–23:00)
   💵 Narxi: 0
   🚌 Transport: Ark qal'asidan 15 daqiqa piyoda
   📝 Buxoroning qadimiy hovuzi atrofidagi choyxonalar, daraxtlar va madrasa ansambli. Kechqurun chiroyli yoritiladi. Sayyohlar va mahalliy aholi uchun eng sevimli istirohat joyi.

⑥ TOSHKENT PLOV MARKAZI — Toshkent
   🏷️ Turi: restaurant | restoran, plov, mahalliy taom
   🕐 Ish vaqti: 07:00–15:00 (yoki tugaguncha)
   💵 Narxi: 25 000–40 000 UZS
   🚌 Transport: Mirzo Ulug'bek tumani, Beshyog'och ko'chasi
   📝 Har kuni ertalab ulkan qozonlarda tonnalab an'anaviy o'zbek to'y oshi damlanadi. Bu yerda mahalliy aholi va sayyohlar yonma-yon o'tirib haqiqiy palov lazzatini totishadi. Soat 14:00 gacha tugab qolishi mumkin, shuning uchun tushlikka ertaroq keling.

⑦ REGISTON MAYDONI — Samarqand
   🏷️ Turi: attraction | arxitektura, tarix, UNESCO
   🕐 Ish vaqti: 08:00–21:00 (har kuni)
   💵 Narxi: 55 000 UZS
   🚌 Transport: Shahar markazida, taksi yoki avtobus bilan
   📝 Uch madrasadan iborat Temuriylar davri me'morchiligi. Sher-Dor, Tillakori va Ulug'bek madrasalari 15-17-asrlarda qurilgan. Kechqurun yoritilgan ko'rinishi ayniqsa ta'sirli.

⑧ SIYOB BOZORI — Samarqand
   🏷️ Turi: attraction | bozor, mahalliy hayot, oziq-ovqat
   🕐 Ish vaqti: 06:00–18:00 (har kuni)
   💵 Narxi: 0
   🚌 Transport: Bibi-Xonim masjididan 2 daqiqa piyoda
   📝 Samarqandning asosiy ochiq havoli bozori. Tarvuz, qovun, non va ziravorlar uchun mashhur. Bibi-Xonim masjidi yonida, shaharning yuragida joylashgan.

════════════════════════════════════════════════════════

🌍 VIETNAM (VN)
① BA DINH MAYDONI VA HO CHI MINH MAUSOLEUM — Hanoy
   🏷️ Turi: attraction | tarix, mausoleum, Hanoy
   🕐 Ish vaqti: Seshanba–Payshanba, Shanba–Yakshanba: 07:30–10:30
   💵 Narxi: 0 (mausoleum bepul)
   🚌 Transport: Hanoy markazidan taksi yoki avtobus 14-marshrut
   📝 Vyetnam mustaqilligini 1945-yilda e'lon qilingan maydonda Ho Chi Minh mausoleyumi. Askar qo'riqchilar almashinuvi kuzatish mumkin. Yaqinida Bir ustunli pagoda va Tarix muzeyi.

② BEN THANH BOZORI — Ho Chi Minh shahri
   🏷️ Turi: attraction | bozor, tarix, street food
   🕐 Ish vaqti: 06:00–18:00 (kechki bozor: 18:00–00:00)
   💵 Narxi: 0 (kirish bepul)
   🚌 Transport: Metro 1-liniya, Ben Thanh bekati
   📝 1914-yildan beri faoliyat ko'rsatuvchi mustamlaka davri bozori. Kiyim, ziravorlar, suvenir va street food. Kechki bozor 18:00 dan ochiladi — alohida atmosfera. Tashqi atrofi ham jonli.

③ HA LONG BAY — Quang Ninh
   🏷️ Turi: attraction | UNESCO, tabiat, kruiz
   🕐 Ish vaqti: Turlar: to'liq kun yoki bir kecha
   💵 Narxi: 150–350 USD (1-2 kechali kruiz)
   🚌 Transport: Hanoydan 3.5 soat avtobus, yoki elektr poyezd Halong shahriga
   📝 Dengizda 1969 ta ohaktosh oroli va qoya — UNESCO tabiat meros. Kruiz kema bilan bir yoki ikki kecha sayohat ular orasida. Kayak, g'or tadqiqoti va tong tumanida manzara.

④ HOI AN ESKI SHAHRI — Hoi An
   🏷️ Turi: attraction | UNESCO, eski shahar, lantera
   🕐 Ish vaqti: 08:00–21:00 (har kuni). Kechqurun bepul sayohat
   💵 Narxi: 120 000 VND (kombikarta)
   🚌 Transport: Da Nang aeroportidan 30 daqiqa taksi
   📝 Sariq rang bilan bo'yalgan 15-18-asrlardagi savdo shahri — UNESCO. Lanternalar bilan yoritilgan kechqurun sehrli ko'rinish. Cho'p yordamida taom pishirish kurslari mashxur.

⑤ MEKONG DELTA — Can Tho
   🏷️ Turi: attraction | tabiat, kanal, suzuvchi bozor
   🕐 Ish vaqti: Turlar: 07:00–17:00 (har kuni)
   💵 Narxi: 300 000–500 000 VND (tur)
   🚌 Transport: Ho Chi Minh shahridan 3 soat avtobus
   📝 Janubiy Vyetnamning «guruch savati» — suv kanallarida qayiq bilan suzib yuruvchi bozorlar. Cai Rang erta ertalab suzuvchi bozori, nok bog'lari va bal'iqchilar qishloqlari.

⑥ MY SON IBODATXONALARI — Hoi An yaqini
   🏷️ Turi: attraction | UNESCO, arxeologiya, Cham
   🕐 Ish vaqti: 06:00–17:00 (har kuni)
   💵 Narxi: 150 000 VND
   🚌 Transport: Hoi An'dan 40 daqiqa taksi yoki tur
   📝 4-13-asrlardagi Cham sivilizatsiyasining Hindu ibodatxona kompleksi — UNESCO. G'isht minoralar va rasm-naqshlar. Vietnam urushi paytida bir qismi vayron bo'lgan, lekin ko'pi saqlanib qolgan.

⑦ PHO GIA TRUYEN BAT DAN — Hanoy
   🏷️ Turi: restaurant | restoran, pho, Hanoy
   🕐 Ish vaqti: 06:00–10:00, 18:00–20:30
   💵 Narxi: 55 000–65 000 VND
   🚌 Transport: Bat Dan ko'chasi 49, Hoan Kiem tumani, Hanoy
   📝 Hanoyning eng mashhur pho restoroni — 1955-yildan beri. Suyak va ziravorlarda 8 soat qaynatilgan bulyon. Navbatda kutish kutiladi, 07:00–10:00 oralig'ida boring.

⑧ SAPA GURUCH DALALARI — Sapa
   🏷️ Turi: attraction | tabiat, treking, madaniyat
   🕐 Ish vaqti: Doim ochiq
   💵 Narxi: 0 (dalalar). Treking gid: 200 000–500 000 VND
   🚌 Transport: Hanoydan kechki poyezd Lao Cai, keyin minibus Sapa
   📝 Muong Hoa vodiysidagi Hmong va Dao xalqlari qurilgan gorizontal guruch dalalari — hashamatli terraslar. Sentyabr-oktyabr sariq, iyun-iyul yam-yashil. Trekking va qishloq qonunsaroyida tunash.

════════════════════════════════════════════════════════

🌍 SOUTH AFRICA (ZA)
① DRAKENSBERG — EJDER TOG'I — Durban
   🏷️ Turi: attraction | tabiat, trekking
   🕐 Ish vaqti: 24/7 (milliy bog')
   💵 Narxi: $10–15 (kirish)
   🚌 Transport: Durban'dan avtomobil 3–4 soat
   📝 Janubiy Afrika'ning eng baland tog' tizmasi — 3482 metr Thabana Ntlenyana. San-xalqiga oid qoya rasmlari 40,000 yillik. Cathedral Peak va Amphitheatre — trekking uchun ikonik joy. Kuchli shamol va qor ham Afrikada borligini eslatadi.

② GARDEN ROUTE — KEYPTAUNDAN PORT ELIZABETH'GA — George
   🏷️ Turi: attraction | avtotur, tabiat, sohil, sarguzasht
   🕐 Ish vaqti: 24/7 (yo'l)
   💵 Narxi: Bepul yo'l; aktivlar $20–100
   🚌 Transport: Keyptaundan avtomobil, o'z tezligingizda
   📝 Janubiy Afrika'ning eng mashhur avtoturizma yo'li — 300 km bo'ylab o'rmon, sohil, laguun. Knysna va Plettenberg Bay — asosiy to'xtash nuqtalari. Bungee jumping Tsitsikamma ko'prigidan (216 m) va qayiqda kit kuzatish ham route'ning bir qismi.

③ KRUGER MILLIY BOG'I SAFARISI — Nelspruit
   🏷️ Turi: attraction | safari, tabiat, hayvonot, Afrika
   🕐 Ish vaqti: 05:30–18:30 (mavsumga qarab)
   💵 Narxi: $30 (kirish); lojlar $80–300/kecha
   🚌 Transport: Johannesburg'dan 5 soat avtomobil; Skukuza aeroportiga parvoz
   📝 Afrika'ning katta beshtaligi — sher, fil, karkidon, buyvol, leopard — Kruger da hammasi bor. 2 million gektarlik qo'riqxonada yolg'iz yoki yo'naltirilgan jeep safari. Erta tong va kechki sayohat eng ko'p hayvonlar uchun. Lojlar o'rmon ichida joylashgan.

④ ROBBEN OROLI — Cape Town
   🏷️ Turi: attraction | tarix, siyosat, UNESCO, Mandela
   🕐 Ish vaqti: Paromlar 09:00, 11:00, 13:00 (Waterfront'dan)
   💵 Narxi: R750 (~$42) (parom + tur)
   🚌 Transport: V&A Waterfront'dan parom 30 daqiqa
   📝 Nelson Mandela 27 yilning 18 yilini shu qamoqxonada o'tkazdi. Bugun UNESCO'ga kiritilgan muzey — sobiq mahbuslar o'zlari yo'l-yo'riq ko'rsatadi. Qamog'xona hujrasi, tosh maydon va dengizdagi sarg'ish bino — apartheidning og'ir tarixini jonli his qilish.

⑤ SOWETO TOWNSHIP TURI — Johannesburg
   🏷️ Turi: attraction | tarix, mahalliy hayot, siyosat, madaniyat
   🕐 Ish vaqti: Turlar 08:00–17:00
   💵 Narxi: $25–40 (yo'naltirilgan tur)
   🚌 Transport: Johannesburg markazidan taksi 30 daqiqa
   📝 Apartheid davridagi qora aholi tumani bugun tirik tarix — Mandela va Desmond Tutu uylari yonma-yon turadi (dunyodagi yagona joy ikki Nobel laureati bir ko'chada yashagan). Kliptown bozori, Vilakazi ko'chasi va mahalliy oshxonalar — Johannesburg'ning haqiqiy yuzi.

⑥ STELLENBOSCH — SHAROB YO'LI — Stellenbosch
   🏷️ Turi: attraction | sharob, gastronomy, tabiat, dam olish
   🕐 Ish vaqti: 10:00–17:00 (winery'lar)
   💵 Narxi: Bepul yo'l; tasting $8–20 winery'da
   🚌 Transport: Keyptaundan 45 daqiqa avtomobil yoki poyezd
   📝 Afrikaning eng mashhur sharob vodiysi — Hollandiya kolonial arxitekturasi, imkon qadar dam olish muhiti va Kaap doua sharoblari. 150 dan ortiq winery — velosiped yoki wine tram bilan aylansa bo'ladi. Pinotage — faqat Janubiy Afrikada o'sadigan uzum.

⑦ KEYPTAUN — TABLE MOUNTAIN — Cape Town
   🏷️ Turi: attraction | tabiat, panorama, UNESCO
   🕐 Ish vaqti: 08:00–19:30 (iyun-avgust: 08:00–18:00)
   💵 Narxi: R430 (~$24) kanatkabi round trip
   🚌 Transport: Keyptaun markazidan taksi 15 daqiqa
   📝 Dengiz sathidan 1086 metr balandlikdagi yassi qoya ustidan butun Keyptaun va Cape Peninsula ko'rinadi. Kanatkabi 5 daqiqada ko'taradi yoki piyoda 2–3 soatlik marshrut. Bulut — "to'qima choyshab" kabi tepada yotganida mistik ko'rinish hosil bo'ladi.
`;

// Split once at module load, not per request: this text is ~35K tokens and
// re-splitting it on every chat message would be pure waste when the vast
// majority of questions ("when should I visit Japan?") never touch it.
const GLOBAL_UNITS: string[] = (() => {
  const raw = GLOBAL_KNOWLEDGE_BASE.split(/\n═+\n/).map((s) => s.trim()).filter(Boolean);
  const units: string[] = [];
  for (const block of raw) {
    const parts = block.split(/\n(?=[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚]\s)/);
    for (const p of parts) if (p.trim()) units.push(p.trim());
  }
  return units;
})();

/**
 * Same shape as knowledge-base.ts's selectKnowledge(): stems the query,
 * matches against place/country titles and bodies, returns at most a
 * handful of matched units so one call can never approach the token
 * ceiling regardless of how broad the question is.
 */
export function selectGlobalKnowledge(query: string): string {
  const q = query.toLowerCase();
  const stem = (w: string) => w.slice(0, 6);
  const words = q.split(/[^\p{L}\p{N}']+/u).filter((w) => w.length >= 4);
  const stems = words.map(stem);
  if (!stems.length) return "";

  const hits = GLOBAL_UNITS.filter((u) => {
    const [titleLine, ...rest] = u.toLowerCase().split("\n");
    const titleStems = titleLine.split(/[^\p{L}\p{N}']+/u).filter(Boolean).map(stem);
    const bodyStems = rest.join(" ").split(/[^\p{L}\p{N}']+/u).filter((w) => w.length >= 4).map(stem);
    return stems.some((s) => titleStems.includes(s)) ||
      stems.filter((s) => bodyStems.includes(s)).length >= 2;
  });

  // Bounded, same as the Uzbekistan version — a broad match still can't
  // put the request back over budget.
  return hits.slice(0, 4).join("\n\n");
}
