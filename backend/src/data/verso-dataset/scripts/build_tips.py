import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Dataset ildizi shu faylning joylashuvidan hisoblanadi — qattiq yozilgan
# yo'l boshqa kompyuterda ishlamaydi.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
output_dir = os.path.join(BASE_DIR, "output")
os.makedirs(output_dir, exist_ok=True)

# 24 Practical Editorial Travel Tips (Master English)
TIPS_MASTER = [
    {
        "id": "tip-01-uz-registan",
        "country": "UZ",
        "category": "customs",
        "title": "Visit Registan at dawn for complete serenity",
        "content": "Early morning light before 08:00 offers undisturbed architectural photography without tour groups. The monumental blue mosaics glow softly as the square slowly wakes.",
        "author": "Verso Editorial",
        "likes": 42
    },
    {
        "id": "tip-02-uz-som-cash",
        "country": "UZ",
        "category": "money",
        "title": "Keep Uzbek som in cash for regional bazaars",
        "content": "While credit cards and mobile QR payments work reliably across Tashkent hotels and supermarkets, bustling open-air bazaars and local chaikhanas deal strictly in cash.",
        "author": "Verso Editorial",
        "likes": 38
    },
    {
        "id": "tip-03-uz-afrosiyob-train",
        "country": "UZ",
        "category": "transport",
        "title": "Reserve Afrosiyob bullet train tickets weeks ahead",
        "content": "High-speed rail between Tashkent, Samarkand, and Bukhara operates at high demand. Tickets open 45 days in advance and sell out rapidly during peak spring and autumn seasons.",
        "author": "Verso Editorial",
        "likes": 56
    },
    {
        "id": "tip-04-uz-plov-hours",
        "country": "UZ",
        "category": "food",
        "title": "Authentic plov is strictly a midday tradition",
        "content": "Traditional plov centers prepare the national dish in massive wood-fired cauldrons for lunchtime. Arriving after 13:30 often means missing the freshest, richest master portions.",
        "author": "Verso Editorial",
        "likes": 64
    },
    {
        "id": "tip-05-jp-ic-card",
        "country": "JP",
        "category": "transport",
        "title": "Use digital Suica or Pasmo for all transit and konbini",
        "content": "Contactless IC cards streamline travel across subways, private railways, municipal buses, and vending machines across Tokyo, Kyoto, and Osaka without queuing for paper tickets.",
        "author": "Verso Editorial",
        "likes": 89
    },
    {
        "id": "tip-06-jp-tatami-shoes",
        "country": "JP",
        "category": "customs",
        "title": "Observe footwear boundaries at temple thresholds",
        "content": "Always step out of outdoor shoes before stepping onto raised wooden borders or tatami straw mats. Wearing clean, slip-on socks makes frequent temple explorations seamless.",
        "author": "Verso Editorial",
        "likes": 47
    },
    {
        "id": "tip-07-jp-konbini-meals",
        "country": "JP",
        "category": "food",
        "title": "Rely on convenience stores for premium quick bites",
        "content": "Japanese 7-Eleven, Lawson, and FamilyMart offer exceptional freshly delivered onigiri, bento boxes, hot fried chicken, and matcha snacks at very modest prices.",
        "author": "Verso Editorial",
        "likes": 73
    },
    {
        "id": "tip-08-jp-cash-backup",
        "country": "JP",
        "category": "money",
        "title": "Maintain a cash reserve for temples and ramen bars",
        "content": "Despite modern payment infrastructure, traditional temple ticket booths, heritage coin-operated ramen ticket machines, and suburban lockers still mandate physical yen.",
        "author": "Verso Editorial",
        "likes": 51
    },
    {
        "id": "tip-09-it-coperto-rule",
        "country": "IT",
        "category": "money",
        "title": "Understand the coperto table cover charge",
        "content": "Italian trattorias typically list a small fixed cover charge (coperto) per person on the receipt covering bread and table linen. Additional discretionary tips are not mandatory.",
        "author": "Verso Editorial",
        "likes": 62
    },
    {
        "id": "tip-10-it-ztl-warning",
        "country": "IT",
        "category": "transport",
        "title": "Never drive into restricted ZTL historic centers",
        "content": "Zona a Traffico Limitato (ZTL) zones in Florence, Rome, and Milan are strictly reserved for permitted residents. Automated street cameras issue hefty automated fines to rental vehicles.",
        "author": "Verso Editorial",
        "likes": 84
    },
    {
        "id": "tip-11-it-basilica-dress",
        "country": "IT",
        "category": "customs",
        "title": "Cover shoulders and knees when visiting basilicas",
        "content": "Strict modesty policies are rigorously enforced at St. Peter's Basilica, Florence Cathedral, and the Pantheon. Keep a light scarf in your bag during warm summer strolls.",
        "author": "Verso Editorial",
        "likes": 45
    },
    {
        "id": "tip-12-it-espresso-bancone",
        "country": "IT",
        "category": "food",
        "title": "Drink your espresso standing at the coffee counter",
        "content": "Italian coffee culture distinguishes counter service (al bancone) from seated table service (al tavolo). Standing up keeps prices under two euros and provides an authentic local encounter.",
        "author": "Verso Editorial",
        "likes": 71
    },
    {
        "id": "tip-13-fr-bonjour-courtesy",
        "country": "FR",
        "category": "customs",
        "title": "Always begin every shop and bakery interaction with 'Bonjour'",
        "content": "In French daily life, greeting the merchant or waiter with a polite 'Bonjour Madame' or 'Bonjour Monsieur' before asking questions is considered fundamental mutual respect.",
        "author": "Verso Editorial",
        "likes": 95
    },
    {
        "id": "tip-14-fr-museum-timeslot",
        "country": "FR",
        "category": "money",
        "title": "Reserve museum entry timeslots well in advance",
        "content": "Major Parisian institutions like the Louvre, Musée d'Orsay, and Sainte-Chapelle require mandatory timed reservations online, even when holding passes, to bypass multihour queues.",
        "author": "Verso Editorial",
        "likes": 66
    },
    {
        "id": "tip-15-fr-carafe-water",
        "country": "FR",
        "category": "food",
        "title": "Ask for 'une carafe d'eau' for complimentary tap water",
        "content": "French law guarantees clean, chilled tap water served in a glass pitcher free of charge upon request in every restaurant, saving significant dining expenses.",
        "author": "Verso Editorial",
        "likes": 78
    },
    {
        "id": "tip-16-tr-cay-hospitality",
        "country": "TR",
        "category": "customs",
        "title": "Welcome the gift of Turkish çay with gratitude",
        "content": "Being offered a steaming tulip-shaped glass of black tea by carpet merchants or bazaar shopkeepers is a sincere symbol of Turkish hospitality, carrying zero buying obligation.",
        "author": "Verso Editorial",
        "likes": 59
    },
    {
        "id": "tip-17-tr-istanbulkart",
        "country": "TR",
        "category": "transport",
        "title": "Consolidate your travels onto a single Istanbulkart",
        "content": "One rechargeable Istanbulkart grants instant access to Bosphorus ferries, nostalgic trams, metro trains, and Marmaray underwater tunnels for all members in your group.",
        "author": "Verso Editorial",
        "likes": 68
    },
    {
        "id": "tip-18-th-wat-decorum",
        "country": "TH",
        "category": "customs",
        "title": "Maintain respectful composure inside Buddhist wats",
        "content": "Remove footwear before entering sermon halls, keep shoulders covered, and sit with feet tucked behind or crossed so soles never point directly toward sacred Buddha statues.",
        "author": "Verso Editorial",
        "likes": 53
    },
    {
        "id": "tip-19-th-street-food-flow",
        "country": "TH",
        "category": "food",
        "title": "Select street stalls with rapid customer turnover",
        "content": "High footfall of local commuters indicates fresh wok-fired ingredients cooked on boiling heat right before your eyes, guaranteeing delicious safety and vibrant flavors.",
        "author": "Verso Editorial",
        "likes": 82
    },
    {
        "id": "tip-20-th-tuktuk-fare",
        "country": "TH",
        "category": "transport",
        "title": "Agree firmly on tuk-tuk fares before boarding",
        "content": "Tuk-tuks have no digital meters; negotiate and establish the full price for your destination before sitting down, or use metered street taxis and local ridesharing apps.",
        "author": "Verso Editorial",
        "likes": 49
    },
    {
        "id": "tip-21-ae-public-decorum",
        "country": "AE",
        "category": "safety",
        "title": "Respect public dress codes and modesty in the Emirates",
        "content": "While resort pools and beach clubs welcome swimwear, public shopping malls, metro transit, and cultural avenues require respectful shoulder-and-knee coverage.",
        "author": "Verso Editorial",
        "likes": 60
    },
    {
        "id": "tip-22-de-sunday-quiet",
        "country": "DE",
        "category": "customs",
        "title": "Anticipate the universal Sunday quiet day (Ruhetag)",
        "content": "Almost all supermarkets, retail boutiques, and pharmacies across Germany remain closed on Sundays. Stock essential groceries by Saturday evening or visit central station minimarkets.",
        "author": "Verso Editorial",
        "likes": 55
    },
    {
        "id": "tip-23-us-tipping-norm",
        "country": "US",
        "category": "money",
        "title": "Account for standard 18-20% gratuity in sit-down dining",
        "content": "Printed restaurant menu prices in the United States exclude state sales tax and standard waitstaff gratuity. Adding 18% to 20% on the final bill is normal standard practice.",
        "author": "Verso Editorial",
        "likes": 64
    },
    {
        "id": "tip-24-global-emergency-docs",
        "country": "all",
        "category": "safety",
        "title": "Secure offline digital backups of passports and emergency hotlines",
        "content": "Store encrypted digital scans of your passport bio-data page, travel insurance policy, and primary consular contacts offline in your phone before departure for peace of mind.",
        "author": "Verso Editorial",
        "likes": 112
    }
]

# Write output/tips.ts
tips_ts_content = f"""// AUTO-GENERATED: scripts/build_tips.py
// Verso Sayohat Atlasi — 24 ta amaliy maslahat
// Inglizcha master ma'lumotlar to'plami

export interface TravelTip {{
  id: string;
  country: string;
  category: 'safety' | 'money' | 'customs' | 'transport' | 'food';
  title: string;
  content: string;
  author: string;
  likes: number;
}}

export const tips: readonly TravelTip[] = {json.dumps(TIPS_MASTER, indent=2, ensure_ascii=False)} as const;
"""

with open(os.path.join(output_dir, "tips.ts"), "w", encoding="utf-8") as f:
    f.write(tips_ts_content)

print(f"Generated output/tips.ts with {len(TIPS_MASTER)} tips!")

# Translations for 5 languages: uz, ru, zh, de, fr
TIPS_I18N = {
    "uz": {
        "tip-01-uz-registan": {
            "title": "Registon maydonini erta tongda ziyorat qiling",
            "content": "Ertalab soat 08:00 dan oldingi yorug'lik guruhli sayyohlarsiz tinchgina suratga tushish imkonini beradi. Qadimiy moviy koshinlar shahar uyg'onishi bilan ajib jilo sochadi."
        },
        "tip-02-uz-som-cash": {
            "title": "Mintaqaviy bozorlar uchun naqd so'm saqlang",
            "content": "Toshkentdagi mehmonxona va restoranlarda bank kartalari ishlagani bilan, qadimiy ochiq bozorlar va mahalliy choyxonalarda xaridlar faqat naqd so'mda amalga oshiriladi."
        },
        "tip-03-uz-afrosiyob-train": {
            "title": "Afrosiyob poyezd chiptasini oldindan band qiling",
            "content": "Toshkent, Samarqand va Buxoro o'rtasidagi tezyurar poyezd chiptalari 45 kun oldin sotuvga chiqadi va ayniqsa bahor hamda kuz oylarida bir necha kunda tugab qoladi."
        },
        "tip-04-uz-plov-hours": {
            "title": "Haqiqiy milliy osh faqat tushlikda yeyiladi",
            "content": "An'anaviy osh markazlari milliy taomni katta qozonlarda aynan tushlikka pishiradi. Soat 13:30 dan kech qolsangiz, eng tansiq va sergo'sht qismlari tugab qolishi mumkin."
        },
        "tip-05-jp-ic-card": {
            "title": "Barcha transport va do'konlarda Suica yoki Pasmo ishlating",
            "content": "Raqamli IC kartalar Tokio, Kioto va Osaka shaharlarida metro, avtobus va konbini do'konlarida qog'oz chiptasiz, birgina teginish orqali to'lov qilish imkonini beradi."
        },
        "tip-06-jp-tatami-shoes": {
            "title": "Ibodatxona va tatami ostona qoidalariga rioya qiling",
            "content": "Ibodatxona zallari yoki ryokan tatamilariga qadam qo'yishdan oldin doim tashqi poyabzalni yeching. Oson yechiladigan qulay poyabzal ko'p vaqtingizni tejaydi."
        },
        "tip-07-jp-konbini-meals": {
            "title": "Konbini do'konlaridagi sifatli taomlardan foydalaning",
            "content": "Yaponiyadagi 7-Eleven, Lawson va FamilyMart tarmoqlari har kuni yangi onigiri, bento va issiq qarsildoq tovuqlarni juda qulay narxlarda taklif etadi."
        },
        "tip-08-jp-cash-backup": {
            "title": "Kichik ibodatxona va ramenxonalar uchun naqd iyena oling",
            "content": "Zamonaviy to'lov tizimlariga qaramay, qadimiy ibodatxona chiptalari va an'anaviy ramen avtomatlari hali ham naqd yengina qabul qiladi."
        },
        "tip-09-it-coperto-rule": {
            "title": "Restoranlarda coperto (dasturxon xizmati) to'lovini biling",
            "content": "Italiya trattoriyalarida har bir kishi uchun non va dasturxon tayyorligi uchun belgilangan coperto to'lovi olinadi. Qo'shimcha choypuli qoldirish majburiy emas."
        },
        "tip-10-it-ztl-warning": {
            "title": "Tarixiy markazlardagi ZTL zonalariga mashinada kirmang",
            "content": "Rim, Florensiya va Milan markazlaridagi cheklangan transport zonalari (ZTL) kameralar orqali qattiq nazorat qilinadi va avtomatik ravishda katta jarimalar solinadi."
        },
        "tip-11-it-basilica-dress": {
            "title": "Soborlarga kirishda kiyinish madaniyatiga e'tibor bering",
            "content": "Muqaddas Pyotr sobori va Florensiya Duomosiga yelkasi va tizzasi ochiq kiyimda kirish taqiqlangan. Yozgi sayohatlarda o'zingiz bilan doim yengil ro'mol oling."
        },
        "tip-12-it-espresso-bancone": {
            "title": "Espressoni bar peshtaxtasida tik turib iching",
            "content": "Italiyada qahvani peshtaxta oldida (al bancone) ichish terasada o'tirib ichishdan ancha arzon bo'lib, haqiqiy mahalliy turmush tarzini his qilish imkonini beradi."
        },
        "tip-13-fr-bonjour-courtesy": {
            "title": "Do'kon va qahvaxonalarda so'zni doim 'Bonjour' bilan boshlang",
            "content": "Fransuz madaniyatida har qanday savol yoki buyurtmadan oldin sotuvchiga 'Bonjour' deb salom berish muhim ijtimoiy odob-axloq qoidasi hisoblanadi."
        },
        "tip-14-fr-museum-timeslot": {
            "title": "Muzeylarga aniq vaqt oralig'i chiptalarini oldindan oling",
            "content": "Luvr va Versal kabi yirik obidalarga soatlab navbatda turmaslik uchun oldindan onlayn tarzda aniq kirish vaqti ko'rsatilgan chiptani bron qiling."
        },
        "tip-15-fr-carafe-water": {
            "title": "Restoranlarda bepul 'carafe d'eau' (ko'za suvi) so'rang",
            "content": "Fransiya qonunchiligiga ko'ra har qanday ovqatlanish maskanida mijozga toza muzdek kran suvi ko'zada mutlaqo bepul taqdim etiladi."
        },
        "tip-16-tr-cay-hospitality": {
            "title": "Turk choyi taklif qilinsa, xushfe'llik bilan qabul qiling",
            "content": "Bozorlarda do'kondorlar tomonidan armudu stakanda taklif etilgan issiq choy turk mehmondo'stligining samimiy ifodasi bo'lib, xarid qilishga majburlamaydi."
        },
        "tip-17-tr-istanbulkart": {
            "title": "Butun jamoat transporti uchun yagona Istanbulkart oling",
            "content": "Bir dona Istanbulkart butun guruh uchun paromlar, metro, tramvay va Marmaray suvosti poyezdlarida birdek bemalol ishlatiladi."
        },
        "tip-18-th-wat-decorum": {
            "title": "Budda ibodatxonalarida odob me'yorlarini saqlang",
            "content": "Ibodatxonalarga kirishda poyabzalni yeching, kiyim yopiq bo'lsin va o'tirganda oyoq kaftini hech qachon muqaddas Budda haykallariga qaratmang."
        },
        "tip-19-th-street-food-flow": {
            "title": "Odamlar ko'p bo'lgan ko'cha oshxonalarini tanlang",
            "content": "Mahalliy aholi gavjum bo'lgan joylarda masalliqlar yangi bo'lib, taom ko'z o'ngingizda baland olovda pishiriladi va xavfsiz hamda lazzatli bo'ladi."
        },
        "tip-20-th-tuktuk-fare": {
            "title": "Tuk-tuk narxini o'tirishdan oldin aniq kelishib oling",
            "content": "Tuk-tuklarda hisoblagich (metr) bo'lmaydi, shuning uchun boradigan manzilingiz narxini oldindan qat'iy kelishing yoki rasmiy taksi ilovalaridan foydalaning."
        },
        "tip-21-ae-public-decorum": {
            "title": "BAA savdo markazlarida kiyinish qoidalarini hurmat qiling",
            "content": "Mehmonxona plyajlaridan tashqari, yirik savdo markazlari va jamoat joylarida tizza va yelkani yopuvchi madaniy kiyinish talab etiladi."
        },
        "tip-22-de-sunday-quiet": {
            "title": "Yakshanba kunlari hamma do'konlar yopiq bo'lishini unutmang",
            "content": "Germaniyada yakshanba qonuniy dam olish kuni (Ruhetag) bo'lib, oziq-ovqat xaridlarini shanba kuni kechgacha qilib qo'yish kerak."
        },
        "tip-23-us-tipping-norm": {
            "title": "AQSh restoranlarida 18-20% choypuli qoldirish me'yorini biling",
            "content": "Menyudagi narxlarga soliq va ofitsiant xizmat haqi qo'shilmagan bo'ladi; hisobga 18–20% choypuli qo'shib to'lash umumiy qoidadir."
        },
        "tip-24-global-emergency-docs": {
            "title": "Pasport va sug'urta nusxalarini oflayn rejimda saqlang",
            "content": "Safarga chiqishdan oldin shaxsingizni tasdiqlovchi hujjatlar, vizalar va elchixona raqamlarini telefoningizga oflayn saqlab oling."
        }
    },
    "ru": {
        "tip-01-uz-registan": {
            "title": "Посетите площадь Регистан на рассвете для полного спокойствия",
            "content": "Утренний свет до 08:00 позволяет сделать великолепные кадры без туристических групп. Величественные лазурные мозаики озаряются первыми лучами солнца."
        },
        "tip-02-uz-som-cash": {
            "title": "Всегда держите наличные сумы для колоритных базаров",
            "content": "Хотя банковские карты повсеместно принимают в Ташкенте, на исторических базарах и в чайханах расплачиваются исключительно наличными."
        },
        "tip-03-uz-afrosiyob-train": {
            "title": "Бронируйте билеты на поезд «Афросиаб» за несколько недель",
            "content": "Скоростные поезда между Ташкентом, Самаркандом и Бухарой пользуются огромным спросом. Билеты открываются за 45 суток и быстро раскупаются."
        },
        "tip-04-uz-plov-hours": {
            "title": "Настоящий плов готовится строго к обеденному времени",
            "content": "Аутентичные центры плова подают блюдо из гигантских казанов в полдень. Если прийти после 13:30, лучшие порции могут уже закончиться."
        },
        "tip-05-jp-ic-card": {
            "title": "Пользуйтесь цифровой картой Suica или Pasmo в транспорте",
            "content": "Бесконтактные транспортные карты работают во всех линиях метро, автобусах и автоматах Токио и Киото в одно касание смартфона."
        },
        "tip-06-jp-tatami-shoes": {
            "title": "Соблюдайте правила смены обуви в храмах и на татами",
            "content": "Всегда снимайте уличную обувь перед деревянными помостами храмов и рёканов. Удобная обувь без шнурков сэкономит вам массу времени."
        },
        "tip-07-jp-konbini-meals": {
            "title": "Не игнорируйте качественную готовую еду в круглосуточных комбини",
            "content": "Японские сети 7-Eleven, Lawson и FamilyMart предлагают отличные свежие онигири, бенто и горячие закуски по крайне демократичным ценам."
        },
        "tip-08-jp-cash-backup": {
            "title": "Держите запас наличных иен для древних храмов и раменных",
            "content": "Несмотря на развитую инфраструктуру, билеты во многие святилища и автоматы традиционных раменных принимают исключительно наличные банкноты."
        },
        "tip-09-it-coperto-rule": {
            "title": "Учитывайте плату за обслуживание coperto в тратториях",
            "content": "Итальянские рестораны обычно включают в счет небольшую фиксированную плату coperto за хлеб и сервировку. Дополнительные чаевые не обязательны."
        },
        "tip-10-it-ztl-warning": {
            "title": "Никогда не заезжайте на автомобиле в исторические зоны ZTL",
            "content": "Зоны ограниченного движения в Риме и Флоренции контролируются автоматическими камерами и наказываются крупными штрафами для прокатных машин."
        },
        "tip-11-it-basilica-dress": {
            "title": "Прикрывайте плечи и колени при входе в базилики",
            "content": "Дресс-код строго соблюдается в соборе Святого Петра и Дуомо во Флоренции. Летом всегда носите с собой легкий палантин."
        },
        "tip-12-it-espresso-bancone": {
            "title": "Пейте эспрессо у стойки баре, как делают местные жители",
            "content": "Цена кофе у стойки (al bancone) в разы ниже, чем за столиком на открытой террасе, и дарит неповторимый колорит итальянского утра."
        },
        "tip-13-fr-bonjour-courtesy": {
            "title": "Всегда начинайте любое обращение во Франции со слова «Bonjour»",
            "content": "Вежливое приветствие перед вопросом или заказом — фундаментальное правило этикета и залог дружелюбного сервиса."
        },
        "tip-14-fr-museum-timeslot": {
            "title": "Бронируйте слоты посещения музеев заранее через интернет",
            "content": "В Лувр и Версаль вход организован по временным интервалам; предварительная онлайн-бронь спасет от многочасового ожидания в очереди."
        },
        "tip-15-fr-carafe-water": {
            "title": "Просите бесплатный графин воды «une carafe d'eau»",
            "content": "По французскому закону рестораны обязаны бесплатно подавать чистую питьевую воду в графине по первой просьбе гостя."
        },
        "tip-16-tr-cay-hospitality": {
            "title": "Принимайте турецкий чай в знак искреннего гостеприимства",
            "content": "Угощение чаем в тюльпановидном стаканчике на базаре — традиционный жест дружелюбия, не накладывающий никаких обязательств по покупке."
        },
        "tip-17-tr-istanbulkart": {
            "title": "Купите единую карту Istanbulkart для паромов и метро",
            "content": "Одна карта Istanbulkart действует на всех членов семьи для поездок на паромах по Босфору, трамваях и в подземном туннеле Мармарай."
        },
        "tip-18-th-wat-decorum": {
            "title": "Соблюдайте почтение в буддийских храмах Таиланда",
            "content": "Снимайте обувь, закрывайте плечи и колени и никогда не направляйте ступни в сторону священных изображений Будды."
        },
        "tip-19-th-street-food-flow": {
            "title": "Выбирайте лотки уличной еды с постоянной очередью местных",
            "content": "Высокая проходимость гарантирует свежесть ингредиентов и молниеносную обжарку в раскаленном воке прямо перед вами."
        },
        "tip-20-th-tuktuk-fare": {
            "title": "Договаривайтесь о цене тук-тука строго до посадки",
            "content": "В тук-туках нет таксометров; четко зафиксируйте итоговую стоимость поездки заранее либо воспользуйтесь мобильными агрегаторами."
        },
        "tip-21-ae-public-decorum": {
            "title": "Уважайте нормы скромности в торговых центрах ОАЭ",
            "content": "Вне территории курортных пляжей в моллах и общественных местах Дубая и Абу-Даби необходимо прикрывать плечи и колени."
        },
        "tip-22-de-sunday-quiet": {
            "title": "Помните о воскресном дне покоя (Ruhetag) в Германии",
            "content": "По воскресеньям супермаркеты и аптеки закрыты по всей стране. Позаботьтесь о покупках в субботу вечером."
        },
        "tip-23-us-tipping-norm": {
            "title": "Оставляйте стандартные 18–20% чаевых в ресторанах США",
            "content": "Цены в меню не включают налог штата и обслуживание персонала; добавлять чаевые к финальному чеку является общепринятым правилом."
        },
        "tip-24-global-emergency-docs": {
            "title": "Сохраняйте цифровые копии документов офлайн на телефоне",
            "content": "Сделайте защищенные копии страниц паспорта, виз и телефонов экстренной связи посольства, доступные без интернета."
        }
    },
    "zh": {
        "tip-01-uz-registan": {
            "title": "清晨探访雷吉斯坦广场享受宁静时刻",
            "content": "早上08:00之前的光线最适合建筑摄影，避开大型旅行团，欣赏古老蓝色马赛克在晨曦中的静谧光彩。"
        },
        "tip-02-uz-som-cash": {
            "title": "前往地方传统市集备足苏姆现金",
            "content": "虽然塔什干的酒店普遍支持刷卡，但具有历史风情的巴扎集市和茶馆依然严格使用当地苏姆现金交易。"
        },
        "tip-03-uz-afrosiyob-train": {
            "title": "提前数周预订阿芙洛西阿卜高铁车票",
            "content": "连接塔什干、撒马尔罕和布哈拉的高铁车票十分紧俏，提前45天开售，春秋旅游旺季极易售罄。"
        },
        "tip-04-uz-plov-hours": {
            "title": "正宗抓饭是专属的正午传统美食",
            "content": "正宗抓饭中心在大锅中专为午市烹制，若超过下午13:30到达，最肥美多汁的部位往往已售空。"
        },
        "tip-05-jp-ic-card": {
            "title": "搭乘公共交通及便利店消费使用Suica交通卡",
            "content": "无接触IC卡支持无缝刷卡搭乘东京和京都的地铁、巴士以及在便利店轻松结账，省去纸质买票排队时间。"
        },
        "tip-06-jp-tatami-shoes": {
            "title": "进入寺庙及榻榻米区域遵循脱鞋礼仪",
            "content": "踏上木质台阶或榻榻米草席前请务必脱去外鞋，穿着便于穿脱的鞋袜会让寺院参观更加顺畅舒心。"
        },
        "tip-07-jp-konbini-meals": {
            "title": "便利店提供物美价廉的高品质便当小食",
            "content": "日本7-Eleven、罗森和全家每日供应新鲜饭团、便当和招牌炸鸡，性价比极高。"
        },
        "tip-08-jp-cash-backup": {
            "title": "参观古老神社及传统拉面店备足日元现金",
            "content": "尽管移动支付日益普及，许多神社门票售卖处和老字号拉面食券机依然只接受现金纸币。"
        },
        "tip-09-it-coperto-rule": {
            "title": "了解意大利餐馆的餐位费规则",
            "content": "意大利传统餐馆账单中常包含小额固定的coperto面包与桌布费，顾客无需再额外支付大额小费。"
        },
        "tip-10-it-ztl-warning": {
            "title": "切勿自驾驶入历史保护区ZTL限行区",
            "content": "罗马和佛罗伦萨市中心设有严格电子抓拍的车辆限行区，未经许可驶入将被处以昂贵罚款。"
        },
        "tip-11-it-basilica-dress": {
            "title": "进入天主教大教堂需着装得体遮盖肩膀和膝盖",
            "content": "圣彼得大教堂和圣母百花大教堂严格执行着装规定，夏季参观请随身携带一条轻便围巾。"
        },
        "tip-12-it-espresso-bancone": {
            "title": "像当地人一样在吧台站立饮用意式浓缩咖啡",
            "content": "在吧台站立饮用咖啡的价格远低于露天餐桌就座消费，是融入意大利晨间生活的最地道方式。"
        },
        "tip-13-fr-bonjour-courtesy": {
            "title": "在法国进店交流请务必先说一句'Bonjour'",
            "content": "在向店家提问或点单前礼貌问候，是法国日常生活中至关重要的礼节规范。"
        },
        "tip-14-fr-museum-timeslot": {
            "title": "提前在网上预约热门博物馆参观时段",
            "content": "卢浮宫和凡尔赛宫等热门场馆均要求按预约时段入场，提前预约可免除数小时的长队等候。"
        },
        "tip-15-fr-carafe-water": {
            "title": "就餐时可索取免费的餐桌饮用水",
            "content": "根据法国法律规定，餐厅有义务为顾客免费提供装在玻璃壶中的清洁自来水。"
        },
        "tip-16-tr-cay-hospitality": {
            "title": "欣然接受土耳其红茶感受热情待客之道",
            "content": "市集店主递上的郁金香形红茶是纯粹友好的好客象征，完全没有强制购物的负担。"
        },
        "tip-17-tr-istanbulkart": {
            "title": "一张伊斯坦布尔交通卡畅行所有交通工具",
            "content": "一张充值卡即可供多人一同刷卡搭乘博斯普鲁斯海峡轮渡、复古电车及海底列车。"
        },
        "tip-18-th-wat-decorum": {
            "title": "参观泰国佛教寺庙时保持庄严尊重",
            "content": "入殿脱鞋并穿着遮盖肩膝的服装，席地而坐时切忌将脚底对向神圣的佛像。"
        },
        "tip-19-th-street-food-flow": {
            "title": "选择当地食客络绎不绝的街头小吃摊",
            "content": "人流旺盛意味着食材周转迅速，旺火快炒现做不仅美味更确保饮食安全卫生。"
        },
        "tip-20-th-tuktuk-fare": {
            "title": "乘坐突突车前务必明确商定总车费",
            "content": "突突车不按计价器收费，上车前必须明确价格，或选择使用打车应用出行。"
        },
        "tip-21-ae-public-decorum": {
            "title": "在阿联酋大型商场与公共场所尊重着装规范",
            "content": "除度假海滩泳池外，出入大型购物中心和文化场馆要求穿着得体遮盖肩膀和膝盖。"
        },
        "tip-22-de-sunday-quiet": {
            "title": "提前做好德国周日商业休息日的采购安排",
            "content": "德国几乎所有超市和零售店在周日均依法停业，请在周六傍晚前备齐所需食品用品。"
        },
        "tip-23-us-tipping-norm": {
            "title": "在美国正餐餐厅留存18-20%的就餐小费",
            "content": "菜单价格不含税费及服务费，在结账时主动加上18%至20%小费是普遍社会公认标准。"
        },
        "tip-24-global-emergency-docs": {
            "title": "在手机中妥善保存证件及应急联系电话离线备份",
            "content": "出行前将护照页、签证及领事馆紧急热线离线保存在手机中，确保无网络时随时查验。"
        }
    },
    "de": {
        "tip-01-uz-registan": {
            "title": "Besuchen Sie den Registan im Morgengrauen für vollkommene Ruhe",
            "content": "Das Licht vor 08:00 Uhr morgens bietet ungestörte Architekturaufnahmen ohne Reisegruppen. Die monumentalen blauen Mosaike leuchten in der Morgensonne."
        },
        "tip-02-uz-som-cash": {
            "title": "Führen Sie auf regionalen Basaren stets Bargeld in Som mit",
            "content": "Während Kartenzahlung in Taschkent weit verbreitet ist, verlangen traditionelle Basare und historische Teehäuser ausschließlich Bargeld."
        },
        "tip-03-uz-afrosiyob-train": {
            "title": "Buchen Sie Afrosiyob-Hochgeschwindigkeitszüge Wochen im Voraus",
            "content": "Die Schnellzugstrecke Taschkent–Samarkand–Buchara ist extrem gefragt. Tickets werden 45 Tage vorher freigeschaltet und sind in der Hauptsaison rasch vergriffen."
        },
        "tip-04-uz-plov-hours": {
            "title": "Echter Plow ist eine reine Mittagstradition",
            "content": "Authentische Plow-Zentren bereiten das Nationalgericht in riesigen Kesseln frisch für den Mittag zu. Nach 13:30 Uhr sind die besten Portionen oft ausverkauft."
        },
        "tip-05-jp-ic-card": {
            "title": "Nutzen Sie Suica oder Pasmo für Nahverkehr und Konbinis",
            "content": "Kontaktlose Chipkarten ermöglichen bequemes Fahren mit U-Bahnen und Bussen in Tokio und Kyoto ohne Ticketkauf am Automaten."
        },
        "tip-06-jp-tatami-shoes": {
            "title": "Beachten Sie die Schuhetikette in Tempeln und auf Tatami",
            "content": "Ziehen Sie Ihre Straßenschuhe stets vor Holzschwellen und Tatamimatten aus. Bequeme Schuhe zum Hineinschlüpfen erleichtern Besichtigungen."
        },
        "tip-07-jp-konbini-meals": {
            "title": "Nutzen Sie das hochwertige Fertigessen in Convenience Stores",
            "content": "Japanische 7-Eleven-, Lawson- und FamilyMart-Filialen bieten täglich frische Onigiri, Bento-Boxen und Snacks zu erschwinglichen Preisen."
        },
        "tip-08-jp-cash-backup": {
            "title": "Halten Sie Yen-Bargeld für Schreine und traditionelle Ramen-Bars bereit",
            "content": "Viele Tempelkassen und klassische Ramen-Bestellautomaten akzeptieren trotz modernster Infrastruktur weiterhin nur Bargeld."
        },
        "tip-09-it-coperto-rule": {
            "title": "Beachten Sie das Coperto (Gedeckgebühr) in italienischen Trattorien",
            "content": "In italienischen Lokalen wird meist eine feste Gebühr für Brot und Gedeck auf der Rechnung ausgewiesen; zusätzliches Trinkgeld ist nicht obligatorisch."
        },
        "tip-10-it-ztl-warning": {
            "title": "Fahren Sie keinesfalls mit dem Mietwagen in verkehrsberuhigte ZTL-Zonen",
            "content": "Historische Innenstädte wie Rom und Florenz werden streng kamerabewacht. Das unbefugte Befahren führt zu empfindlichen Geldstrafen."
        },
        "tip-11-it-basilica-dress": {
            "title": "Bedecken Sie Schultern und Knie beim Besuch von Basiliken",
            "content": "Im Petersdom und Florentiner Dom gilt eine strenge Kleiderordnung. Ein leichtes Tuch in der Tasche schützt vor Einlassverweigerung."
        },
        "tip-12-it-espresso-bancone": {
            "title": "Trinken Sie Ihren Espresso wie die Einheimischen an der Theke",
            "content": "Kaffee an der Theke (al bancone) kostet nur einen Bruchteil des Preises an Außentischen und gewährt Einblick in den italienischen Alltag."
        },
        "tip-13-fr-bonjour-courtesy": {
            "title": "Beginnen Sie jedes Gespräch in Frankreich stets mit 'Bonjour'",
            "content": "Ein freundlicher Gruß vor einer Frage oder Bestellung gilt im französischen Alltag als unverzichtbare gesellschaftliche Höflichkeit."
        },
        "tip-14-fr-museum-timeslot": {
            "title": "Reservieren Sie Zeitfenster für Museen vorab im Internet",
            "content": "Institutionen wie der Louvre und Schloss Versailles erfordern feste Buchungen mit Zeitfenster, um stundenlange Warteschlangen zu vermeiden."
        },
        "tip-15-fr-carafe-water": {
            "title": "Bestellen Sie eine 'carafe d'eau' für kostenfreies Leitungswasser",
            "content": "In Frankreich haben Restaurantgäste per Gesetz Anspruch auf ein kostenloses Gefäß mit frischem Trinkwasser auf Anfrage."
        },
        "tip-16-tr-cay-hospitality": {
            "title": "Nehmen Sie angebotenen türkischen Çay dankbar an",
            "content": "Der in Tulpengläsern servierte heiße Tee ist eine Geste der Gastfreundschaft und verpflichtet zu keinerlei Warenkauf."
        },
        "tip-17-tr-istanbulkart": {
            "title": "Nutzen Sie eine einzige Istanbulkart für alle Verkehrsmittel",
            "content": "Mit einer aufladbaren Karte können mehrere Reisende Fähren auf dem Bosporus, Straßenbahnen und U-Bahnen bequem nutzen."
        },
        "tip-18-th-wat-decorum": {
            "title": "Wahren Sie Respekt in thailändischen Tempelanlagen (Wats)",
            "content": "Schuhe ausziehen, Schultern und Knie bedecken und im Sitzen niemals die Fußsohlen direkt auf Buddha-Statuen richten."
        },
        "tip-19-th-street-food-flow": {
            "title": "Wählen Sie Straßenküchen mit hohem Kundendurchlauf",
            "content": "Großer Andrang einheimischer Gäste garantiert frische Zutaten, die vor Ihren Augen im Wok scharf angebraten werden."
        },
        "tip-20-th-tuktuk-fare": {
            "title": "Vereinbaren Sie den Tuk-Tuk-Fahrpreis vor Fahrtantritt",
            "content": "Tuk-Tuks besitzen keine Taxameter; verhandeln Sie den Endpreis verbindlich vor dem Einsteigen oder nutzen Sie Fahrdienst-Apps."
        },
        "tip-21-ae-public-decorum": {
            "title": "Beachten Sie die Kleiderordnung in Einkaufszentren der VAE",
            "content": "Außerhalb von Hotelstränden wird in öffentlichen Einkaufszentren und Boulevards das Bedecken von Schultern und Knien erwartet."
        },
        "tip-22-de-sunday-quiet": {
            "title": "Berücksichtigen Sie die Sonntagsruhe für Einkäufe in Deutschland",
            "content": "Supermärkte und Geschäfte sind sonntags geschlossen. Erledigen Sie Besorgungen bis Samstagabend."
        },
        "tip-23-us-tipping-norm": {
            "title": "Kalkulieren Sie 18–20% Trinkgeld in US-Restaurants ein",
            "content": "Menüpreise enthalten weder Steuern noch Service; ein Aufschlag von 18 bis 20 Prozent Trinkgeld gehört zum Standard."
        },
        "tip-24-global-emergency-docs": {
            "title": "Speichern Sie Ausweiskopien und Notrufnummern offline auf dem Smartphone",
            "content": "Legen Sie vor Abreise digitale Kopien von Reisepass, Visa und Notfallkontakten offline gesichert ab."
        }
    },
    "fr": {
        "tip-01-uz-registan": {
            "title": "Visitez la place du Régistan à l'aube pour une sérénité absolue",
            "content": "La lumière matinale avant 08h00 offre des prises de vue exceptionnelles sans groupes touristiques. Les mosaïques bleues s'illuminent sous le soleil levant."
        },
        "tip-02-uz-som-cash": {
            "title": "Conservez des sommes ouzbeks en espèces pour les bazars",
            "content": "Bien que la carte soit acceptée dans les hôtels de Tachkent, les marchés historiques et les maisons de thé traditionnelles exigent des espèces."
        },
        "tip-03-uz-afrosiyob-train": {
            "title": "Réservez le train à grande vitesse Afrosiyob des semaines à l'avance",
            "content": "La liaison Tachkent–Samarcande–Boukhara est très demandée. Les billets ouvrent 45 jours avant et partent très vite en haute saison."
        },
        "tip-04-uz-plov-hours": {
            "title": "Le véritable plov est exclusivement un rituel du midi",
            "content": "Les centres de plov traditionnels préparent ce plat emblématique dans de grands chaudrons pour le déjeuner. Après 13h30, les meilleures parts sont souvent épuisées."
        },
        "tip-05-jp-ic-card": {
            "title": "Utilisez une carte Suica ou Pasmo pour les transports et konbini",
            "content": "Les cartes sans contact simplifient vos déplacements en métro et bus à Tokyo et Kyoto sans passer par les distributeurs de billets."
        },
        "tip-06-jp-tatami-shoes": {
            "title": "Respectez l'étiquette des chaussures dans les temples et ryokans",
            "content": "Déchaussez-vous impérativement avant de monter sur les estrades en bois et les tatamis. Des chaussures faciles à enfiler sont idéales."
        },
        "tip-07-jp-konbini-meals": {
            "title": "Profitez de la restauration de qualité dans les supérettes japonaises",
            "content": "Les enseignes 7-Eleven, Lawson et FamilyMart proposent quotidiennement d'excellents onigiris et bentos à des tarifs très abordables."
        },
        "tip-08-jp-cash-backup": {
            "title": "Gardez des yens en espèces pour les sanctuaires et bars à ramen",
            "content": "Nombre de guichets de temples et distributeurs de ramen traditionnels fonctionnent encore exclusivement avec des espèces."
        },
        "tip-09-it-coperto-rule": {
            "title": "Comprenez le frais de couvert (coperto) dans les trattorias",
            "content": "En Italie, un montant fixe par personne est couramment facturé pour le pain et la table ; aucun pourboire supplémentaire n'est obligatoire."
        },
        "tip-10-it-ztl-warning": {
            "title": "Ne pénétrez jamais en voiture dans les zones à trafic limité (ZTL)",
            "content": "Les centres historiques de Rome et Florence sont protégés par des caméras automatiques sanctionnant lourdement les véhicules non autorisés."
        },
        "tip-11-it-basilica-dress": {
            "title": "Couvrez épaules et genoux lors de la visite des basiliques",
            "content": "Une tenue décente est strictement exigée à la basilique Saint-Pierre et au Duomo de Florence. Prévoyez un foulard léger dans votre sac."
        },
        "tip-12-it-espresso-bancone": {
            "title": "Savourez votre expresso debout au comptoir comme les locaux",
            "content": "Prendre son café au comptoir (al bancone) coûte nettement moins cher qu'en terrasse et offre une immersion authentique dans la vie italienne."
        },
        "tip-13-fr-bonjour-courtesy": {
            "title": "Initiez toujours vos échanges en France par un poli 'Bonjour'",
            "content": "Saluer commerçants et serveurs avant toute demande constitue une règle élémentaire de politesse et d'égard mutuel."
        },
        "tip-14-fr-museum-timeslot": {
            "title": "Réservez vos créneaux horaires de musée en ligne au préalable",
            "content": "Le musée du Louvre et le château de Versailles requièrent des réservations horodatées pour éviter de longues heures d'attente."
        },
        "tip-15-fr-carafe-water": {
            "title": "Demandez 'une carafe d'eau' pour une eau fraîche gratuite",
            "content": "La législation française garantit le service gracieux d'une carafe d'eau potable fraîche sur simple demande au restaurant."
        },
        "tip-16-tr-cay-hospitality": {
            "title": "Acceptez le thé turc en signe de chaleureuse bienvenue",
            "content": "Le thé noir servi dans un petit verre tulipe au bazar est une marque sincère d'hospitalité sans aucune obligation d'achat."
        },
        "tip-17-tr-istanbulkart": {
            "title": "Munissez-vous d'une unique Istanbulkart pour tous vos trajets",
            "content": "Une seule carte rechargeable permet à plusieurs voyageurs d'emprunter ferrys sur le Bosphore, métros et tramways en toute simplicité."
        },
        "tip-18-th-wat-decorum": {
            "title": "Observez le respect requis dans les temples bouddhistes thaïlandais",
            "content": "Retirez vos chaussures, portez une tenue couvrante et veillez à ne jamais pointer vos pieds vers les représentations sacrées de Bouddha."
        },
        "tip-19-th-street-food-flow": {
            "title": "Privilégiez les stands de rue fréquentés par les habitants",
            "content": "Une forte affluence garantit la fraîcheur des aliments saisis au wok sous vos yeux à feu vif, alliant saveur et sûreté."
        },
        "tip-20-th-tuktuk-fare": {
            "title": "Fixez le prix de la course en tuk-tuk avant de monter",
            "content": "Les tuk-tuks ne disposant pas de compteur, négociez fermement le tarif avant le départ ou utilisez les applications de VTC."
        },
        "tip-21-ae-public-decorum": {
            "title": "Respectez les tenues décentes dans les centres commerciaux aux Émirats",
            "content": "En dehors des plages d'hôtels, les centres commerciaux et lieux publics requièrent une tenue couvrante sur les épaules et les genoux."
        },
        "tip-22-de-sunday-quiet": {
            "title": "Anticipez la fermeture dominicale des commerces en Allemagne",
            "content": "Supermarchés et boutiques sont fermés le dimanche (Ruhetag). Effectuez vos achats de première nécessité dès le samedi."
        },
        "tip-23-us-tipping-norm": {
            "title": "Prévoyez un pourboire usuel de 18 à 20% aux États-Unis",
            "content": "Les tarifs affichés n'incluent ni taxes ni service ; ajouter 18 à 20% au montant final est la coutume établie."
        },
        "tip-24-global-emergency-docs": {
            "title": "Conservez une copie numérique hors ligne de vos papiers",
            "content": "Enregistrez une copie chiffrée de votre passeport, de vos visas et des numéros d'urgence de l'ambassade dans votre smartphone avant le départ."
        }
    }
}

tips_i18n_content = f"""// AUTO-GENERATED: scripts/build_tips.py
// 24 ta maslahatning 5 ta tildagi tarjimalari (uz, ru, zh, de, fr)
// Eslatma: ingliz tili data/tips.ts da mavjud

export const tipsI18n = {json.dumps(TIPS_I18N, indent=2, ensure_ascii=False)} as const;
"""

with open(os.path.join(output_dir, "tips.i18n.ts"), "w", encoding="utf-8") as f:
    f.write(tips_i18n_content)

print(f"Generated output/tips.i18n.ts with 5 languages!")
