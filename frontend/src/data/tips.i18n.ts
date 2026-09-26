import type { Lang } from "@/i18n";
import type { Tip } from "./tips";

/**
 * Localised tip titles and bodies.
 *
 * The category chips beside these cards translate from the copy deck, but the
 * twenty-four tips themselves are editorial prose that lived only in English
 * in data/tips.ts — so the Community "Tips" tab stayed English in all six
 * languages, which reads as a broken language switch rather than as
 * untranslated content.
 *
 * Same shape as countries.i18n.ts: English is absent on purpose (the dataset
 * holds it) and a missing entry falls back to it, so this table can grow
 * without ever rendering a blank.
 */
type Entry = { title: string; body: string };
type Table = Record<string, Entry>;

const RU: Table = {
  "tip-uz-money": {
    title: "Берите наличные — карта это резерв, а не план",
    body: "Базары, такси и большинство ресторанов за пределами Ташкента работают с наличными. Банкоматы есть в городах, но между ними их мало, а купюры сума быстро складываются в толстую пачку — снятие на 50 долларов выглядит внушительно. Обменяйте разумную сумму сразу по прилёте, а не рассчитывайте найти банкомат по дороге.",
  },
  "tip-uz-customs": {
    title: "Снимайте обувь перед входом в дом",
    body: "Так принято в любом частном доме и в большинстве гостевых домов — если у двери стоит полка для обуви, следуйте этому, даже если никто не просит. В мечетях и медресе прикрытые плечи и колени ожидаются от всех, не только от женщин.",
  },
  "tip-uz-transport": {
    title: "Билеты на «Афросиёб» летом берите заранее",
    body: "На направлении Ташкент–Самарканд–Бухара «Афросиёб» распродаётся в высокий сезон (апрель–май, сентябрь–октябрь). Это самый быстрый и удобный способ передвижения между городами Шёлкового пути; если бронируете в последний момент, остаётся такси с попутчиками.",
  },
  "tip-jp-customs": {
    title: "Не оставляйте чаевые — это вызывает настоящее недоумение",
    body: "Обслуживание уже включено, а чаевые не часть культуры; оставленные на столе деньги персонал иногда догоняет вас, решив, что вы их забыли. Если хотите поблагодарить, словесное «готисосама дэсита» после еды работает лучше денег.",
  },
  "tip-jp-transport": {
    title: "Купите карту Suica или Pasmo в первый же день",
    body: "Она работает почти в каждом поезде, автобусе и магазине у дома по всей стране и избавляет от необходимости разбираться в тарифной сетке на незнакомой станции. Пополняется в автомате на любой станции, а остаток возвращают при выезде.",
  },
  "tip-jp-food": {
    title: "Лучший обед часто скрывается за торговым автоматом",
    body: "Во многих маленьких рамен- и карри-заведениях вместо меню у входа стоит автомат с талонами — выбираете блюдо, платите, отдаёте талон на стойку. Выглядит как препятствие, но обычно это признак места, которое десятилетиями делает одно блюдо хорошо.",
  },
  "tip-th-safety": {
    title: "Договаривайтесь о цене тук-тука или такси до поездки",
    body: "Счётчики есть, и водители должны их включать; некоторые не включают, пока не попросишь. Назвать пункт назначения и согласовать цену заранее — способ избежать торга по факту, который портит в остальном приятную поездку.",
  },
  "tip-th-customs": {
    title: "Голова священна, ноги — нет",
    body: "Не трогайте никого за голову, включая детей, и не показывайте ступнями на человека или изображение Будды — сидя, безопаснее убирать их под себя. И то, и другое — мелкие привычки, если знать, на что обращать внимание.",
  },
  "tip-it-food": {
    title: "Капучино — напиток на завтрак, а не после ужина",
    body: "Заказ капучино после еды выдаёт туриста сильнее почти всего остального — после ужина пьют эспрессо или диджестив. Никто вас не остановит, но поднятую бровь бариста можно и не собирать.",
  },
  "tip-it-money": {
    title: "Место за столиком дороже, чем у стойки",
    body: "Во многих кафе и барах тот же эспрессо заметно дороже, если сесть, а не выпить у стойки — это указано в прайсе (menu al banco против al tavolo), если присмотреться. Не обман, просто так устроены цены.",
  },
  "tip-fr-customs": {
    title: "Сначала bonjour, потом просьба",
    body: "Начинать любое взаимодействие — в магазине, в кафе, спрашивая дорогу — с приветствия, а не сразу с вопроса, сильнее всего меняет то, как вас примут. Пропустить его не то чтобы грубо, но звучит резко и окрашивает всё дальнейшее.",
  },
  "tip-ma-customs": {
    title: "Первая цена в сук — это начало разговора",
    body: "В лавках медины без указанных цен торг ожидаем, и это спокойный социальный обмен, а не конфронтация — высокая первая цена не попытка обмануть, просто так начинается беседа.",
  },
  "tip-eg-safety": {
    title: "В крупных комплексах берите лицензированного гида",
    body: "В Гизе, Луксоре и Абу-Симбеле хватает неофициальных гидов, которые подойдут ещё до кассы. Гид через отель или зарегистрированное агентство стоит чуть дороже, зато расскажет настоящую историю вместо придуманной — и не будет уговаривать что-то купить в конце.",
  },
  "tip-in-food": {
    title: "Уличная еда часто безопаснее полупустого ресторана",
    body: "Ищите прилавок с очередью и быстрым оборотом — то, что готовят при вас и быстро продают, надёжнее того, что стоит давно. Вода только бутилированная, лёд — лишь там, где доверяете источнику.",
  },
  "tip-in-transport": {
    title: "Вызывайте машину в приложении, а не с улицы",
    body: "Uber и Ola работают в большинстве городов и полностью убирают торг — цена известна до приезда машины. Авторикша с улицы тоже вариант, но сначала договоритесь о цене или настаивайте на счётчике.",
  },
  "tip-is-safety": {
    title: "Перед любой поездкой за пределы Рейкьявика смотрите road.is",
    body: "Погода меняется быстро и закрывает дороги почти без предупреждения, особенно горные F-дороги и всё зимой. Официальный сайт состояния дорог обновляется быстрее любых карт, и его стоит открывать каждое утро автопутешествия.",
  },
  "tip-ge-food": {
    title: "Тост — это речь, а не одна фраза",
    body: "На грузинской супре тамада ведёт длинную череду тостов — за гостей, за родителей, за ушедших — и каждый должен быть настоящим, пусть и коротким обращением. Пригубить вместо того, чтобы каждый раз допивать бокал, вполне допустимо.",
  },
  "tip-tr-transport": {
    title: "Istanbulkart стоит взять даже на пару дней",
    body: "Одна карта покрывает трамваи, метро, автобусы и паромы через Босфор, и каждая поездка выходит в разы дешевле бумажного билета. Продаётся в автоматах на любой станции и пополняется там же.",
  },
  "tip-mx-safety": {
    title: "Такси лучше заказывать в приложении, а не ловить на улице",
    body: "В Мехико и других крупных городах поездка через приложение отслеживается и стоит известную заранее сумму — после темноты это надёжнее. Официальные стоянки (sitios) у отелей и аэропортов — безопасная уличная альтернатива.",
  },
  "tip-kr-customs": {
    title: "Передавайте и принимайте двумя руками",
    body: "Протянуть деньги, визитку или подарок двумя руками (или поддерживая предплечье свободной рукой) — небольшой жест уважения, который замечают, когда он есть, и — всё реже у приезжих — когда его нет.",
  },
  "tip-pe-safety": {
    title: "Проведите день в Куско, прежде чем подниматься выше",
    body: "Сам Куско лежит на 3400 м, и горной болезни безразлично, в какой вы форме. Чай из коки, спокойный первый день и много воды решают, будете вы наслаждаться Священной долиной или проведёте её с головной болью.",
  },
  "tip-general-1": {
    title: "Предупредите банк до вылета, а не после отказа карты",
    body: "Карту, которой ни разу не платили за границей, иногда блокируют на первой же зарубежной операции из предосторожности. Двухминутная отметка в банковском приложении перед поездкой избавляет от разбирательств у кассы.",
  },
  "tip-general-2": {
    title: "Сфотографируйте паспорт и держите копию не только в телефоне",
    body: "Фото в галерее, письмо самому себе и — если вы любите бумагу — ксерокопия, упакованная отдельно от оригинала. Потерять паспорт неприятно; потерять его, не зная номера, гораздо хуже.",
  },
  "tip-general-3": {
    title: "Первым выучите местное «спасибо»",
    body: "Не язык, а одно слово, сказанное правильно. Это мелочь, которая надёжнее почти любой другой подготовки меняет тон общения — везде, куда дотягивается этот атлас.",
  },
};

const UZ: Table = {
  "tip-uz-money": {
    title: "Naqd pul oling — karta zaxira, reja emas",
    body: "Bozorlar, taksilar va Toshkentdan tashqaridagi ko'pchilik restoranlar naqd pul bilan ishlaydi. Bankomatlar shaharlarda yetarli, lekin ular orasidagi yo'lda kam uchraydi, so'm banknotalari esa tez to'planadi — 50 dollarlik yechim haqiqatan qalin dasta bo'lib chiqadi. Kelgan zahoti me'yorida pul almashtiring, keyin yo'lda bankomat topishga ishonmang.",
  },
  "tip-uz-customs": {
    title: "Uyga kirishdan oldin oyoq kiyimni yechib qo'ying",
    body: "Har qanday xususiy uyda va ko'pchilik mehmon uylarida bu odatiy hol — eshik yonida oyoq kiyim javoni bo'lsa, hech kim aytmasa ham shunday qiling. Masjid va madrasalarda yelka bilan tizzani yopish faqat ayollardan emas, hammadan kutiladi.",
  },
  "tip-uz-transport": {
    title: "Yozda «Afrosiyob»ga chiptani oldindan oling",
    body: "Toshkent–Samarqand–Buxoro yo'nalishida «Afrosiyob» yuqori mavsumda (aprel–may, sentabr–oktabr) sotilib ketadi. Buyuk ipak yo'li shaharlari orasida eng tez va qulay usul shu; oxirgi paytda bron qilsangiz, yo'lovchi taksi qoladi.",
  },
  "tip-jp-customs": {
    title: "Choychaqa qoldirmang — bu chinakam hayronlik tug'diradi",
    body: "Xizmat haqi allaqachon kiritilgan, choychaqa esa madaniyat qismi emas; stolda qolgan pulni xodimlar «esdan chiqardingiz» deb orqangizdan yugurib olib kelishi mumkin. Minnatdorchilik bildirmoqchi bo'lsangiz, ovqatdan keyin aytilgan «gochisousama deshita» puldan ko'ra yaxshi qabul qilinadi.",
  },
  "tip-jp-transport": {
    title: "Birinchi kuni Suica yoki Pasmo kartasini oling",
    body: "U mamlakatdagi deyarli har bir poyezd, avtobus va do'kon to'lovida ishlaydi va tanish bo'lmagan bekatda tarif jadvalini tushunish zaruratini yo'qotadi. Istalgan bekat avtomatida to'ldiriladi, qolgan mablag' esa ketishda qaytariladi.",
  },
  "tip-jp-food": {
    title: "Eng yaxshi ovqat ko'pincha avtomat ortida",
    body: "Ko'p kichik ramen va karri oshxonalarida menyu o'rniga kirishda chipta avtomati turadi — taomni tanlaysiz, to'laysiz, chiptani peshtaxtaga berasiz. To'siqday ko'rinadi, lekin bu ko'pincha o'nlab yillar bitta taomni yaxshi tayyorlab kelgan joy belgisi.",
  },
  "tip-th-safety": {
    title: "Tuk-tuk yoki taksi narxini o'tirishdan oldin kelishib oling",
    body: "Hisoblagichlar bor va haydovchilar ularni yoqishi kerak; ba'zilari so'ramaguningizcha yoqmaydi. Manzilni aytib, narxni oldin kelishish — yoqimli safarni buzadigan keyingi tortishuvdan qutqaradi.",
  },
  "tip-th-customs": {
    title: "Bosh muqaddas, oyoq esa yo'q",
    body: "Hech kimning, hatto bolaning ham boshiga tegmang, oyog'ingizni odamga yoki Budda tasviriga qaratmang — o'tirganda ularni ostingizga olish eng xavfsiz yo'l. Ikkisi ham e'tibor bersangiz, oson odatga aylanadi.",
  },
  "tip-it-food": {
    title: "Kapuchino — nonushta ichimligi, kechki ovqatdan keyingi emas",
    body: "Ovqatdan keyin kapuchino buyurtma qilish sizni boshqa hamma narsadan ko'ra ko'proq turist qilib ko'rsatadi — kechki ovqatdan keyin espresso yoki dijestiv ichiladi. Hech kim to'xtatmaydi, lekin baristaning chimirilgan qoshini o'tkazib yuborish mumkin.",
  },
  "tip-it-money": {
    title: "Stolda o'tirish peshtaxtadan qimmat",
    body: "Ko'p kafe va barlarda xuddi shu espresso peshtaxtada turib ichilganidan ko'ra o'tirib ichilganda sezilarli qimmat — bu narxlar ro'yxatida yozilgan (menu al banco va al tavolo). Bu firibgarlik emas, narx shunday tuzilgan.",
  },
  "tip-fr-customs": {
    title: "Avval bonjour, keyin savol",
    body: "Do'konda, kafeda yoki yo'l so'raganda — har qanday muloqotni to'g'ridan-to'g'ri iltimosdan emas, salomdan boshlash sizga bo'lgan munosabatni eng ko'p o'zgartiradi. Uni o'tkazib yuborish qo'pollik emas, lekin keskin eshitiladi va keyingi hammasiga soya soladi.",
  },
  "tip-ma-customs": {
    title: "Suqdagi birinchi narx — suhbat boshlanishi",
    body: "Narxi yozilmagan madina do'konlarida savdolashish kutiladi va bu qarama-qarshilik emas, xotirjam muomala — sotuvchining baland narx aytishi aldash emas, suhbat shunday boshlanadi.",
  },
  "tip-eg-safety": {
    title: "Yirik yodgorliklarda litsenziyali gid oling",
    body: "Giza, Luxor va Abu-Simbelda kassa oldiga yetmasingizdan yondashadigan norasmiy gidlar ko'p. Mehmonxona yoki ro'yxatdan o'tgan agentlik orqali olingan gid bir oz qimmat, lekin o'ylab chiqarilgan emas, haqiqiy tarixni aytadi — va oxirida biror narsa sotishga urinmaydi.",
  },
  "tip-in-food": {
    title: "Ko'cha taomi ko'pincha yarim bo'sh restorandan xavfsizroq",
    body: "Navbati bor va tez sotiladigan rastani tanlang — oldingizda tayyorlanib, tez sotilgan ovqat uzoq turganidan ishonchliroq. Suv faqat shishada, muz esa manbasiga ishonsangizgina.",
  },
  "tip-in-transport": {
    title: "Ko'chadan to'xtatgandan ko'ra ilova orqali chaqiring",
    body: "Uber va Ola ko'p shaharlarda ishlaydi va savdolashishni butunlay yo'qotadi — narx mashina kelishidan oldin belgilanadi. Ko'chadagi avtoriksha ham yaroqli, lekin narxni oldin kelishing yoki hisoblagichni talab qiling.",
  },
  "tip-is-safety": {
    title: "Reykyavikdan tashqariga yo'l olishdan oldin road.is ni tekshiring",
    body: "Ob-havo tez o'zgaradi va yo'llarni deyarli ogohlantirishsiz yopadi, ayniqsa ichki F-yo'llar va qishdagi hamma narsa. Yo'l holatining rasmiy sayti har qanday xarita ilovasidan yangiroq va avtosafarning har tongida ko'rishga arziydi.",
  },
  "tip-ge-food": {
    title: "Qadah so'zi — butun nutq, bitta gap emas",
    body: "Gruzin supra dasturxonida tamada uzun qadah so'zlari ketma-ketligini boshqaradi — mehmonlar uchun, ota-onalar uchun, o'tganlar uchun — va har biri qisqa bo'lsa ham haqiqiy murojaat bo'lishi kerak. Har safar qadahni bo'shatmay, ho'plab turish mutlaqo maqbul.",
  },
  "tip-tr-transport": {
    title: "Qisqa safarga ham Istanbulkart oling",
    body: "Bitta karta tramvay, metro, avtobus va Bosfor bo'ylab paromlarni qamrab oladi va har bir safar qog'oz chiptaning bir qismiga tushadi. Istalgan bekat avtomatida sotiladi va shu yerda to'ldiriladi.",
  },
  "tip-mx-safety": {
    title: "Taksini ko'chadan to'xtatmay, ilovada buyurtma qiling",
    body: "Mexiko va boshqa yirik shaharlarda ilova orqali chaqirilgan mashina kuzatiladi va narxi oldindan ma'lum — qorong'idan keyin shu ishonchliroq. Mehmonxona va aeroportlardagi rasmiy taksi to'xtash joylari (sitios) — ko'chadagi xavfsiz muqobil.",
  },
  "tip-kr-customs": {
    title: "Narsani ikki qo'l bilan bering va oling",
    body: "Pulni, tashrif qog'ozini yoki sovg'ani ikki qo'l bilan (yoki bo'sh qo'l bilan bilakni tutib) uzatish — bor bo'lganda sezilib qoladigan, yo'q bo'lganda esa darrov bilinadigan kichik hurmat ishorasi.",
  },
  "tip-pe-safety": {
    title: "Balandroqqa chiqishdan oldin Kuskoda bir kun turing",
    body: "Kusko o'zi 3400 metrda joylashgan va tog' kasalligi qanchalik chidamli ekaningizga qaramaydi. Koka choyi, sokin birinchi kun va ko'p suv — Muqaddas vodiydan zavqlanish yoki uni bosh og'rig'i bilan o'tkazish orasidagi farq.",
  },
  "tip-general-1": {
    title: "Bankka uchishdan oldin aytib qo'ying, karta ishlamagandan keyin emas",
    body: "Chet elda ishlatilmagan karta ko'pincha birinchi xorijiy to'lovda ehtiyot yuzasidan bloklanadi. Jo'nashdan oldin bank ilovasidagi ikki daqiqalik belgi kassa oldida nima bo'lganini tushunib turishdan saqlaydi.",
  },
  "tip-general-2": {
    title: "Passportni suratga oling va nusxasini telefondan tashqarida saqlang",
    body: "Galereyada surat, o'zingizga yuborilgan xat va — qog'ozni yaxshi ko'rsangiz — asl nusxadan alohida joylangan fotokopiya. Passportni yo'qotish asabiy ish; raqamini bilmay yo'qotish ancha yomon.",
  },
  "tip-general-3": {
    title: "Avvalo mahalliy «rahmat» so'zini o'rganing",
    body: "Tilni emas, to'g'ri aytilgan bitta so'zni. Bu kichik narsa muloqot ohangini boshqa har qanday tayyorgarlikdan ishonchliroq o'zgartiradi — bu atlas qamragan hamma joyda.",
  },
};

const ZH: Table = {
  "tip-uz-money": {
    title: "带现金 —— 卡只是备用，不是计划",
    body: "塔什干以外的巴扎、出租车和多数餐厅只收现金。城市里自动取款机不少，但城市之间很稀疏，而苏姆纸币很快就积成一叠 —— 取五十美元就是厚厚一把。抵达时先换一笔合理的金额，不要指望路上能找到机器。",
  },
  "tip-uz-customs": {
    title: "进屋前请脱鞋",
    body: "在任何私人住宅和多数民宿里这都是默认做法 —— 门边有鞋架就照做，即使没人提醒。在清真寺和经学院，遮住肩膀与膝盖是对所有人的要求，不只针对女性。",
  },
  "tip-uz-transport": {
    title: "夏季请提前订阿弗罗西约布高铁",
    body: "旺季（四至五月、九至十月）塔什干–撒马尔罕–布哈拉方向的阿弗罗西约布会售罄。这是丝路城市之间最快最舒适的方式；临时订票就只能改乘拼车出租。",
  },
  "tip-jp-customs": {
    title: "不要给小费 —— 它会引起真正的困惑",
    body: "服务费已包含，给小费并非当地文化；留在桌上的钱有时会被店员追出来还给你，因为他们以为你忘了。想表达感谢的话，饭后一句「gochisousama deshita」比钱更受用。",
  },
  "tip-jp-transport": {
    title: "第一天就办一张 Suica 或 Pasmo 交通卡",
    body: "全国几乎所有列车、公交和便利店消费都能刷，省去在陌生车站研究票价表的麻烦。任意车站的机器都能充值，离开时余额可以退。",
  },
  "tip-jp-food": {
    title: "最好的一餐常藏在售票机后面",
    body: "许多小拉面店和咖喱店门口摆着售票机而不是菜单 —— 选餐、付款、把票交给柜台。看着像门槛，其实往往说明这家店几十年只把一件事做好。",
  },
  "tip-th-safety": {
    title: "上车前先谈好嘟嘟车或出租车的价格",
    body: "计价器是有的，司机也应当使用；有些不问就不打表。先说清目的地并谈定价格，可以免去事后那场毁掉整趟愉快行程的讨价还价。",
  },
  "tip-th-customs": {
    title: "头是神圣的，脚不是",
    body: "不要碰任何人的头，包括小孩，也不要用脚指向他人或佛像 —— 坐下时把脚收到身下最稳妥。知道要注意之后，这两点都是很容易养成的小习惯。",
  },
  "tip-it-food": {
    title: "卡布奇诺是早餐饮品，不是餐后饮品",
    body: "饭后点一杯卡布奇诺，比几乎任何别的事都更能暴露游客身份 —— 晚餐之后喝的是浓缩咖啡或消食酒。没人真会阻止你，但咖啡师扬起的眉毛这笔小税可以免掉。",
  },
  "tip-it-money": {
    title: "坐着喝比站在吧台贵",
    body: "许多咖啡馆和酒吧里，同一杯浓缩咖啡坐下来喝明显更贵 —— 只要留意，价目表上写得清楚（menu al banco 对 al tavolo）。这不是坑人，定价本来如此。",
  },
  "tip-fr-customs": {
    title: "先说 bonjour，再提要求",
    body: "无论进店、进咖啡馆还是问路，先问好再开口，比什么都更能改变别人对你的态度。省掉它谈不上无礼，但显得生硬，并会给之后的一切染上底色。",
  },
  "tip-ma-customs": {
    title: "露天市场的第一个报价只是起点",
    body: "在老城没有标价的店里讨价还价是常态，而且是不紧不慢的社交往来，不是对抗 —— 店主开出高价并非想骗你，谈话就是这样开始的。",
  },
  "tip-eg-safety": {
    title: "在主要遗址请聘持证导游",
    body: "吉萨、卢克索和阿布辛贝都有非官方导游在你走到售票处之前就上来搭话。通过酒店或注册机构预订的导游贵一点，但讲的是真实历史而不是编造的 —— 结束时也不会逼你买东西。",
  },
  "tip-in-food": {
    title: "街头小吃常常比半空的餐厅更安全",
    body: "挑排着队、翻台快的摊子 —— 现做现卖的东西通常比放了很久的更可靠。水只喝瓶装的，冰只在信得过来源时才要。",
  },
  "tip-in-transport": {
    title: "用打车软件，而不是在街上拦车",
    body: "Uber 和 Ola 在多数城市都能用，完全省去议价 —— 车还没到价格就定好了。街上拦的三轮机动车也没问题，但要先谈好价钱或坚持打表。",
  },
  "tip-is-safety": {
    title: "离开雷克雅未克前先查 road.is",
    body: "天气变化很快，常常几乎毫无预警就封路，尤其是内陆 F 级公路和冬季的一切路段。官方路况网站比任何地图应用都及时，自驾途中每天早上都值得看一眼。",
  },
  "tip-ge-food": {
    title: "祝酒是一段讲话，不是一句话",
    body: "在格鲁吉亚的 supra 宴席上，tamada（司酒人）会主持一长串祝酒 —— 敬客人、敬父母、敬故人 —— 每一次都应当是真诚而简短的致辞。每轮只是浅尝而不喝干，完全可以接受。",
  },
  "tip-tr-transport": {
    title: "就算只待几天也值得买一张 Istanbulkart",
    body: "一张卡可以坐电车、地铁、公交和横渡博斯普鲁斯的渡轮，每程花费只是纸票的一小部分。任意车站的机器都能购买和充值。",
  },
  "tip-mx-safety": {
    title: "用软件叫车，不要在路边招手",
    body: "在墨西哥城等大城市，软件叫的车可以追踪、价格预先确定，天黑后更可靠。酒店和机场的正规候车点（sitios）是路边拦车的安全选择。",
  },
  "tip-kr-customs": {
    title: "双手接、双手递",
    body: "递钱、名片或礼物时用双手（或用空着的手托住另一只手的手臂），是一个做到了会被注意、没做到也会被察觉的小小敬意。",
  },
  "tip-pe-safety": {
    title: "上到更高处之前先在库斯科待一天",
    body: "库斯科本身就在海拔 3400 米，高原反应不在乎你体能多好。古柯茶、放慢的第一天和充足的水，决定你是享受圣谷，还是带着头痛度过。",
  },
  "tip-general-1": {
    title: "出发前告诉银行，而不是等卡被拒之后",
    body: "从未在国外用过的卡，有时会因防欺诈在第一笔境外交易时被冻结。出发前在银行 App 里花两分钟备注，就不用站在收银台前琢磨发生了什么。",
  },
  "tip-general-2": {
    title: "把护照拍下来，并在手机之外留一份",
    body: "相册里一张照片，一份发给自己的邮件，如果你习惯纸质 —— 再带一份与原件分开存放的复印件。丢护照本就麻烦；连号码都没有记录地丢掉要糟得多。",
  },
  "tip-general-3": {
    title: "先学会当地话里的「谢谢」",
    body: "不用流利，只要这一个词，说准就好。这件小事比几乎任何别的准备都更能可靠地改变交流的气氛 —— 在这本地图册覆盖的每个地方都是。",
  },
};

const DE: Table = {
  "tip-uz-money": {
    title: "Bargeld mitnehmen — die Karte ist Reserve, kein Plan",
    body: "Basare, Taxis und die meisten Restaurants außerhalb Taschkents funktionieren mit Bargeld. Geldautomaten gibt es in den Städten reichlich, dazwischen kaum, und Som-Scheine summieren sich schnell — eine Abhebung von 50 Dollar ist ein wirklich dicker Stapel. Wechseln Sie bei der Ankunft einen vernünftigen Betrag, statt später auf einen Automaten zu hoffen.",
  },
  "tip-uz-customs": {
    title: "Vor dem Betreten eines Hauses die Schuhe ausziehen",
    body: "In jedem Privathaus und den meisten Gästehäusern ist das selbstverständlich — steht ein Schuhregal an der Tür, halten Sie sich daran, auch wenn niemand darum bittet. In Moscheen und Medresen werden bedeckte Schultern und Knie von allen erwartet, nicht nur von Frauen.",
  },
  "tip-uz-transport": {
    title: "Den Afrosiyob-Schnellzug im Sommer vorab buchen",
    body: "Taschkent–Samarkand–Buchara ist im Afrosiyob in der Hauptsaison (April–Mai, September–Oktober) ausverkauft. Es ist die schnellste und angenehmste Verbindung zwischen den Städten der Seidenstraße; wer spät bucht, bleibt beim Sammeltaxi.",
  },
  "tip-jp-customs": {
    title: "Kein Trinkgeld — es sorgt für echte Verwirrung",
    body: "Der Service ist enthalten, Trinkgeld gehört nicht zur Kultur; auf dem Tisch liegendes Geld wird Ihnen manchmal nachgetragen, weil das Personal denkt, Sie hätten es vergessen. Wer sich bedanken will, kommt mit einem gesprochenen „gochisousama deshita“ nach dem Essen weiter als mit Geld.",
  },
  "tip-jp-transport": {
    title: "Am ersten Tag eine Suica- oder Pasmo-Karte holen",
    body: "Sie funktioniert in fast jedem Zug, Bus und Convenience Store des Landes und erspart es, in einem unbekannten Bahnhof Tariftabellen zu entschlüsseln. Aufladbar an jedem Automaten, das Restguthaben wird bei der Abreise zurückgezahlt.",
  },
  "tip-jp-food": {
    title: "Das beste Essen steckt oft hinter einem Automaten",
    body: "Viele kleine Ramen- und Curry-Läden haben am Eingang einen Ticketautomaten statt einer Karte — Gericht wählen, zahlen, das Ticket an der Theke abgeben. Es wirkt wie eine Hürde, ist aber meist das Zeichen eines Lokals, das seit Jahrzehnten eine Sache gut macht.",
  },
  "tip-th-safety": {
    title: "Den Preis für Tuk-Tuk oder Taxi vor der Fahrt vereinbaren",
    body: "Taxameter gibt es, und die Fahrer sollen sie benutzen; manche tun es nur auf Nachfrage. Das Ziel nennen und den Preis vorher festmachen erspart das nachträgliche Verhandeln, das eine ansonsten angenehme Fahrt verdirbt.",
  },
  "tip-th-customs": {
    title: "Der Kopf ist heilig, die Füße sind es nicht",
    body: "Berühren Sie niemandem den Kopf, auch Kindern nicht, und richten Sie Ihre Füße nicht auf Menschen oder ein Buddha-Bild — im Sitzen sind sie untergeschlagen am sichersten. Beides sind kleine Gewohnheiten, sobald man darauf achtet.",
  },
  "tip-it-food": {
    title: "Cappuccino ist ein Frühstücksgetränk, kein Abschluss",
    body: "Einen nach dem Essen zu bestellen verrät Sie schneller als fast alles andere als Tourist — nach dem Abendessen kommt ein Espresso oder ein Digestivo. Aufhalten wird Sie niemand, aber die hochgezogene Braue des Baristas ist eine kleine Steuer, die Sie sich sparen können.",
  },
  "tip-it-money": {
    title: "Am Tisch kostet es mehr als an der Theke",
    body: "Viele Cafés und Bars verlangen für denselben Espresso merklich mehr, wenn man sitzt statt an der Bar zu stehen — es steht auf der Preisliste (menu al banco gegen al tavolo), wenn man hinsieht. Keine Masche, sondern einfach die Preisstruktur.",
  },
  "tip-fr-customs": {
    title: "Erst bonjour, dann die Frage",
    body: "Jede Begegnung — im Laden, im Café, beim Fragen nach dem Weg — mit einer Begrüßung statt direkt mit dem Anliegen zu beginnen, verändert am meisten, wie Sie empfangen werden. Es auszulassen ist nicht unhöflich, wirkt aber schroff und färbt alles Weitere.",
  },
  "tip-ma-customs": {
    title: "Der erste Preis im Souk ist ein Anfang",
    body: "In Medina-Läden ohne Preisschilder ist Handeln erwartet, und es ist ein ruhiger, sozialer Austausch, keine Konfrontation — ein hoher Einstiegspreis ist kein Betrugsversuch, so beginnt das Gespräch.",
  },
  "tip-eg-safety": {
    title: "An den großen Stätten einen lizenzierten Guide nehmen",
    body: "In Gizeh, Luxor und Abu Simbel sprechen Sie unlizenzierte Guides an, noch bevor Sie den Ticketschalter erreichen. Über das Hotel oder eine registrierte Agentur gebucht kostet es etwas mehr und bringt echte Geschichte statt einer erfundenen — und keinen Verkaufsdruck am Ende.",
  },
  "tip-in-food": {
    title: "Straßenessen ist oft sicherer als ein halbleeres Restaurant",
    body: "Suchen Sie einen Stand mit Schlange und hohem Durchsatz — frisch zubereitet und schnell verkauft ist verlässlicher als etwas, das lange steht. Wasser aus der Flasche, Eis nur, wo Sie der Quelle trauen.",
  },
  "tip-in-transport": {
    title: "Per App fahren statt auf der Straße zu winken",
    body: "Uber und Ola gibt es in den meisten Städten, und sie nehmen das Verhandeln komplett heraus — der Preis steht, bevor der Wagen kommt. Auf der Straße angehaltene Autorikschas sind auch in Ordnung, aber den Fahrpreis vorher vereinbaren oder auf den Taxameter bestehen.",
  },
  "tip-is-safety": {
    title: "Vor jeder Fahrt außerhalb Reykjavíks road.is prüfen",
    body: "Das Wetter dreht schnell und sperrt Straßen fast ohne Vorwarnung, besonders die F-Pisten im Hochland und im Winter überhaupt alles. Die offizielle Seite zum Straßenzustand ist aktueller als jede Karten-App und jeden Morgen einer Rundreise einen Blick wert.",
  },
  "tip-ge-food": {
    title: "Ein Trinkspruch ist eine Rede, kein Satz",
    body: "Bei einer georgischen Supra führt der Tamada eine lange Folge von Trinksprüchen — auf die Gäste, die Eltern, die Verstorbenen — und jeder ist als echte, wenn auch kurze Ansprache gedacht. Zu nippen statt jedes Mal auszutrinken ist völlig in Ordnung.",
  },
  "tip-tr-transport": {
    title: "Auch für einen kurzen Aufenthalt eine Istanbulkart holen",
    body: "Eine Karte gilt für Straßenbahnen, Metro, Busse und die Fähren über den Bosporus, zu einem Bruchteil des Papiertickets pro Fahrt. An Automaten in jeder Station erhältlich und ebenso aufladbar.",
  },
  "tip-mx-safety": {
    title: "Taxi per App bestellen statt heranwinken",
    body: "In Mexiko-Stadt und anderen Großstädten ist eine per App gebuchte Fahrt nachvollziehbar und vorab bepreist, was nach Dunkelheit die verlässlichere Wahl ist. Offizielle Taxistände (sitios) an Hotels und Flughäfen sind die sichere Straßenvariante.",
  },
  "tip-kr-customs": {
    title: "Mit beiden Händen geben und nehmen",
    body: "Geld, eine Visitenkarte oder ein Geschenk mit beiden Händen zu überreichen (oder die freie Hand am Unterarm) ist eine kleine Höflichkeit, die auffällt, wenn sie da ist — und, unter Reisenden immer seltener, wenn sie fehlt.",
  },
  "tip-pe-safety": {
    title: "Einen Tag in Cusco bleiben, bevor es höher geht",
    body: "Cusco selbst liegt auf 3.400 m, und die Höhenkrankheit interessiert sich nicht für Ihre Fitness. Coca-Tee, ein langsamer erster Tag und viel Wasser entscheiden, ob Sie das Heilige Tal genießen oder mit Kopfschmerzen verbringen.",
  },
  "tip-general-1": {
    title: "Der Bank vor dem Flug Bescheid geben, nicht nach der abgelehnten Karte",
    body: "Eine Karte, die noch nie im Ausland benutzt wurde, wird bei der ersten Auslandstransaktion manchmal vorsorglich gesperrt. Zwei Minuten in der Banking-App vor dem Abflug ersparen das Rätselraten an der Kasse.",
  },
  "tip-general-2": {
    title: "Den Pass fotografieren und eine Kopie außerhalb des Handys haben",
    body: "Ein Foto in der Galerie, eine E-Mail an sich selbst und — für Papierfreunde — eine Fotokopie, getrennt vom Original verpackt. Einen Pass zu verlieren ist ärgerlich; ihn ohne jede Notiz der Nummer zu verlieren, deutlich schlimmer.",
  },
  "tip-general-3": {
    title: "Zuerst das Wort für „danke“ lernen",
    body: "Keine Sprachkenntnisse, nur dieses eine Wort, richtig ausgesprochen. Eine Kleinigkeit, die den Ton eines Gesprächs zuverlässiger verändert als fast jede andere Vorbereitung — überall, wohin dieser Atlas reicht.",
  },
};

const FR: Table = {
  "tip-uz-money": {
    title: "Prévoyez du liquide — la carte est un secours, pas un plan",
    body: "Les bazars, les taxis et la plupart des restaurants hors de Tachkent fonctionnent en espèces. Les distributeurs sont fréquents en ville, rares entre les villes, et les billets de sum s'accumulent vite — un retrait de 50 dollars fait une liasse épaisse. Changez une somme raisonnable à l'arrivée plutôt que de compter sur un distributeur en route.",
  },
  "tip-uz-customs": {
    title: "Retirez vos chaussures avant d'entrer chez quelqu'un",
    body: "C'est l'usage dans toute maison privée et la plupart des maisons d'hôtes — s'il y a un meuble à chaussures près de la porte, suivez-le même si personne ne le demande. Dans les mosquées et les médersas, épaules et genoux couverts sont attendus de tous, pas seulement des femmes.",
  },
  "tip-uz-transport": {
    title: "Réservez le train rapide Afrosiyob à l'avance en été",
    body: "Tachkent–Samarcande–Boukhara se remplit sur l'Afrosiyob en haute saison (avril–mai, septembre–octobre). C'est le moyen le plus rapide et le plus confortable entre les villes de la Route de la soie ; le taxi collectif reste le recours de dernière minute.",
  },
  "tip-jp-customs": {
    title: "Ne laissez pas de pourboire — cela crée une vraie confusion",
    body: "Le service est compris et le pourboire ne fait pas partie de la culture ; l'argent laissé sur une table vous est parfois rapporté en courant par un serveur persuadé que vous l'avez oublié. Pour remercier, un « gochisousama deshita » après le repas passe mieux que de l'argent.",
  },
  "tip-jp-transport": {
    title: "Prenez une carte Suica ou Pasmo dès le premier jour",
    body: "Elle fonctionne dans presque tous les trains, bus et supérettes du pays et évite de déchiffrer une grille tarifaire dans une gare inconnue. Rechargeable à n'importe quelle borne, et le solde restant est remboursé au départ.",
  },
  "tip-jp-food": {
    title: "Le meilleur repas se cache souvent derrière un distributeur",
    body: "Beaucoup de petites échoppes de ramen ou de curry ont une borne à tickets à l'entrée plutôt qu'une carte — vous choisissez, vous payez, vous donnez le ticket au comptoir. Cela ressemble à un obstacle, c'est le plus souvent le signe d'une maison qui fait bien une seule chose depuis des décennies.",
  },
  "tip-th-safety": {
    title: "Fixez le prix du tuk-tuk ou du taxi avant de monter",
    body: "Les compteurs existent et les chauffeurs sont censés les utiliser ; certains ne le font que si on le demande. Annoncer sa destination et convenir d'un prix évite la négociation d'après-course qui gâche un trajet par ailleurs agréable.",
  },
  "tip-th-customs": {
    title: "La tête est sacrée, les pieds ne le sont pas",
    body: "Ne touchez la tête de personne, même celle d'un enfant, et ne pointez pas vos pieds vers quelqu'un ou vers une image du Bouddha — les replier sous soi en position assise est la solution sûre. Deux réflexes faciles, une fois qu'on y pense.",
  },
  "tip-it-food": {
    title: "Le cappuccino se boit au petit-déjeuner, pas après le dîner",
    body: "En commander après un repas vous désigne comme touriste plus que presque n'importe quoi d'autre — après le dîner viennent l'espresso ou le digestif. Personne ne vous en empêchera, mais le sourcil levé du barista est une petite taxe évitable.",
  },
  "tip-it-money": {
    title: "Assis, c'est plus cher qu'au comptoir",
    body: "Beaucoup de cafés facturent le même espresso nettement plus cher en salle qu'au comptoir — c'est écrit sur le tarif (menu al banco / al tavolo) pour qui le lit. Ce n'est pas une arnaque, juste la façon dont les prix sont faits.",
  },
  "tip-fr-customs": {
    title: "Dites bonjour avant de demander quoi que ce soit",
    body: "Ouvrir toute interaction — une boutique, un café, une demande de direction — par une salutation plutôt que par la requête change plus que tout la manière dont on vous reçoit. L'omettre n'est pas impoli à proprement parler, mais c'est brusque, et cela colore tout le reste.",
  },
  "tip-ma-customs": {
    title: "Le premier prix dans un souk est un point de départ",
    body: "Le marchandage est attendu dans les boutiques de la médina sans prix affichés, et c'est un échange social tranquille, pas un affrontement — un premier prix élevé n'est pas une tentative d'arnaque, c'est ainsi que la conversation commence.",
  },
  "tip-eg-safety": {
    title: "Prenez un guide agréé sur les grands sites",
    body: "Guizeh, Louxor et Abou Simbel attirent des guides non officiels qui vous abordent avant même la billetterie. Un guide réservé par l'hôtel ou une agence enregistrée coûte un peu plus et raconte l'histoire réelle plutôt qu'une histoire inventée — sans pression d'achat à la fin.",
  },
  "tip-in-food": {
    title: "La cuisine de rue est souvent plus sûre qu'un restaurant à moitié vide",
    body: "Cherchez un stand avec une file et une forte rotation — ce qui est cuisiné à la commande et vendu vite vaut mieux que ce qui attend. De l'eau en bouteille, et de la glace seulement là où vous faites confiance à la source.",
  },
  "tip-in-transport": {
    title: "Utilisez une application plutôt que de héler dans la rue",
    body: "Uber et Ola couvrent la plupart des villes et suppriment toute négociation — le prix est fixé avant l'arrivée de la voiture. Les auto-rickshaws hélés dans la rue conviennent aussi, mais fixez le prix d'abord ou insistez sur le compteur.",
  },
  "tip-is-safety": {
    title: "Consultez road.is avant tout trajet hors de Reykjavík",
    body: "La météo tourne vite et ferme les routes sans grand préavis, surtout les pistes F de l'intérieur et tout l'hiver. Le site officiel de l'état des routes est plus à jour que n'importe quelle application de cartes, et mérite un coup d'œil chaque matin.",
  },
  "tip-ge-food": {
    title: "Un toast est un discours, pas une phrase",
    body: "Lors d'une supra géorgienne, le tamada mène une longue série de toasts — aux invités, aux parents, aux disparus — et chacun est censé être une vraie adresse, même brève. Tremper les lèvres plutôt que vider son verre à chaque fois est parfaitement admis.",
  },
  "tip-tr-transport": {
    title: "Prenez une Istanbulkart même pour un court séjour",
    body: "Une seule carte couvre tramways, métro, bus et ferries du Bosphore, pour une fraction du prix d'un ticket papier par trajet. Vendue aux bornes de n'importe quelle station et rechargeable au même endroit.",
  },
  "tip-mx-safety": {
    title: "Commandez un taxi par application plutôt que dans la rue",
    body: "À Mexico et dans les autres grandes villes, une course réservée par application est traçable et tarifée d'avance, ce qui est plus fiable après la tombée de la nuit. Les stations officielles (sitios) des hôtels et aéroports sont l'alternative sûre dans la rue.",
  },
  "tip-kr-customs": {
    title: "Donnez et recevez à deux mains",
    body: "Tendre de l'argent, une carte de visite ou un cadeau à deux mains (ou la main libre soutenant l'avant-bras) est une petite marque de respect qu'on remarque quand elle est là et, de plus en plus rarement chez les visiteurs, quand elle manque.",
  },
  "tip-pe-safety": {
    title: "Passez une journée à Cusco avant de monter plus haut",
    body: "Cusco est déjà à 3 400 m, et le mal d'altitude ne s'intéresse pas à votre condition physique. Thé de coca, première journée lente et beaucoup d'eau font la différence entre profiter de la Vallée sacrée et la passer avec un mal de tête.",
  },
  "tip-general-1": {
    title: "Prévenez votre banque avant de partir, pas après un refus",
    body: "Une carte jamais utilisée à l'étranger est parfois bloquée dès la première transaction hors du pays, par précaution. Deux minutes dans l'application bancaire avant le départ évitent de rester devant la caisse à comprendre ce qui se passe.",
  },
  "tip-general-2": {
    title: "Photographiez votre passeport et gardez une copie ailleurs que sur le téléphone",
    body: "Une photo dans la galerie, un e-mail à soi-même et — si vous aimez le papier — une photocopie rangée à part de l'original. Perdre un passeport est pénible ; le perdre sans aucune trace du numéro l'est beaucoup plus.",
  },
  "tip-general-3": {
    title: "Apprenez d'abord le mot local pour « merci »",
    body: "Pas la langue, juste ce mot, bien prononcé. Une petite chose qui change le ton d'un échange plus sûrement que presque n'importe quelle autre préparation, partout où va cet atlas.",
  },
};

const TABLES: Partial<Record<Lang, Table>> = { ru: RU, uz: UZ, zh: ZH, de: DE, fr: FR };

export function tipTitle(tip: Tip, lang: Lang): string {
  return TABLES[lang]?.[tip.id]?.title ?? tip.title;
}

export function tipBody(tip: Tip, lang: Lang): string {
  return TABLES[lang]?.[tip.id]?.body ?? tip.body;
}
