import { PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

// Mirrors frontend/src/data/index.ts LOCATIONS — same ids (slugs) so that
// UserPlan / Review foreign keys line up with what the client shows.
const LOCATIONS: {
  id: string; name: string; city: string; region: string; category: Category;
  rating: number; reviewCount: number; tags: string[]; shortDesc: string;
  fullDesc: string; transport: string; hours: string; price: string;
  priceUSD: number; googleMapsUrl: string; bestSeason: string; duration: string;
  featured: boolean;
}[] = [
  { id: "registan", name: "Registon", city: "Samarqand", region: "Samarqand viloyati", category: "tarix", rating: 4.9, reviewCount: 3841, tags: ["UNESCO", "Arxitektura", "Madrasa", "Ipak yo'li"], shortDesc: "Markaziy Osiyo me'morchiligining eng go'zal durdonasi.", fullDesc: "Registon maydoni — Samarqandning qalbi.", transport: "Taksi yoki avtobus №38", hours: "08:00–20:00", price: "50 000 so'm", priceUSD: 4, googleMapsUrl: "https://maps.google.com/?q=Registan,Samarkand", bestSeason: "Aprel–Iyun, Sentabr–Oktyabr", duration: "2–3 soat", featured: true },
  { id: "ichan-kala", name: "Ichan-Qal'a", city: "Xiva", region: "Xorazm viloyati", category: "tarix", rating: 4.8, reviewCount: 2156, tags: ["UNESCO", "Shahar-muzey", "Qal'a", "Xorazm"], shortDesc: "Xivaning ichki qal'asi — tirik muzey shahar.", fullDesc: "Ichan-Qal'a — Xivaning ichki shahri.", transport: "Urganchdan taksi 35 daqiqa", hours: "24/7", price: "75 000 so'm", priceUSD: 6, googleMapsUrl: "https://maps.google.com/?q=Ichan-Kala,Khiva", bestSeason: "Mart–May, Sentabr–Noyabr", duration: "Butun kun", featured: true },
  { id: "ark", name: "Ark qal'asi", city: "Buxoro", region: "Buxoro viloyati", category: "tarix", rating: 4.7, reviewCount: 1874, tags: ["Qal'a", "Muzey", "Tarix"], shortDesc: "Buxoro hukmdorlarining qadimiy qarorgohi.", fullDesc: "Ark qal'asi — 1500 yillik hukmdorlar qarorgohi.", transport: "Markazdan piyoda 15 daqiqa", hours: "09:00–18:00", price: "35 000 so'm", priceUSD: 3, googleMapsUrl: "https://maps.google.com/?q=Ark,Bukhara", bestSeason: "Mart–May, Sentabr–Noyabr", duration: "1.5–2 soat", featured: true },
  { id: "chimgan", name: "Chimgan tog'lari", city: "Chimgan", region: "Toshkent viloyati", category: "tabiat", rating: 4.7, reviewCount: 1245, tags: ["Tog'", "Kanatka", "Tabiat"], shortDesc: "Toshkentga yaqin tog' kurort zonasi.", fullDesc: "Chimgan — mashhur tog' dam olish maskani.", transport: "Toshkentdan mashinada 1.5 soat", hours: "24/7", price: "Kanatka: 40 000 so'm", priceUSD: 3, googleMapsUrl: "https://maps.google.com/?q=Chimgan", bestSeason: "May–Oktyabr, Dekabr–Fevral (chang'i)", duration: "Butun kun", featured: true },
  { id: "guri-amir", name: "Guri Amir", city: "Samarqand", region: "Samarqand viloyati", category: "tarix", rating: 4.8, reviewCount: 1632, tags: ["Maqbara", "Temuriylar"], shortDesc: "Amir Temur va temuriylar maqbarasi.", fullDesc: "Guri Amir — Amir Temur dafn etilgan maqbara.", transport: "Registondan 10 daqiqa piyoda", hours: "08:00–19:00", price: "35 000 so'm", priceUSD: 3, googleMapsUrl: "https://maps.google.com/?q=Gur-e-Amir,Samarkand", bestSeason: "Aprel–Iyun, Sentabr–Oktyabr", duration: "1 soat", featured: false },
  { id: "chorsu", name: "Chorsu bozori", city: "Toshkent", region: "Toshkent shahri", category: "madaniyat", rating: 4.5, reviewCount: 2987, tags: ["Bozor", "Milliy taom", "Savdo"], shortDesc: "Toshkentning tarixiy Sharq bozori.", fullDesc: "Chorsu — mashhur gumbazli Sharq bozori.", transport: "Metro: Chorsu bekati", hours: "08:00–19:00", price: "Bepul kirish", priceUSD: 0, googleMapsUrl: "https://maps.google.com/?q=Chorsu+Bazaar,Tashkent", bestSeason: "Yil davomida", duration: "1–2 soat", featured: false },
  { id: "shahi-zinda", name: "Shohi Zinda", city: "Samarqand", region: "Samarqand viloyati", category: "din", rating: 4.9, reviewCount: 2010, tags: ["Ziyoratgoh", "Maqbara"], shortDesc: "Tirik shoh qabristonligi.", fullDesc: "Shohi Zinda — XIV–XV asr maqbaralari kompleksi.", transport: "Registondan taksi 10 daqiqa", hours: "08:00–19:00", price: "40 000 so'm", priceUSD: 3, googleMapsUrl: "https://maps.google.com/?q=Shah-i-Zinda,Samarkand", bestSeason: "Aprel–Iyun, Sentabr–Oktyabr", duration: "1–1.5 soat", featured: true },
  { id: "lyabi-xovuz", name: "Lyabi Hovuz", city: "Buxoro", region: "Buxoro viloyati", category: "madaniyat", rating: 4.6, reviewCount: 1543, tags: ["Havuz", "Choyxona", "Milliy muhit"], shortDesc: "Qadimiy markazdagi suv havuzi.", fullDesc: "Lyabi Hovuz — Buxoroning markazidagi XVII asr ansambli.", transport: "Ark qal'asidan 10 daqiqa", hours: "24/7", price: "Bepul", priceUSD: 0, googleMapsUrl: "https://maps.google.com/?q=Lyabi-Hauz,Bukhara", bestSeason: "Aprel–Oktyabr", duration: "1–3 soat", featured: false },
  { id: "poi-kalon", name: "Poi Kalon majmuasi", city: "Buxoro", region: "Buxoro viloyati", category: "din", rating: 4.9, reviewCount: 2874, tags: ["Minora", "Masjid", "Madrasa"], shortDesc: "Buxoroning ramzi — Kalon minorasi.", fullDesc: "Poi Kalon — Buxoroning eng mashhur me'moriy ansambli.", transport: "Lyabi Hovuzdan 10 daqiqa piyoda", hours: "08:00–19:00", price: "40 000 so'm", priceUSD: 3, googleMapsUrl: "https://maps.google.com/?q=Po-i-Kalyan,Bukhara", bestSeason: "Mart–May, Sentabr–Noyabr", duration: "1.5–2 soat", featured: true },
  { id: "bibixonim", name: "Bibixonim masjidi", city: "Samarqand", region: "Samarqand viloyati", category: "din", rating: 4.7, reviewCount: 1932, tags: ["Masjid", "Temuriylar"], shortDesc: "Amir Temur davrining eng ulkan masjidi.", fullDesc: "Bibixonim masjidi 1399–1404 yillarda qurilgan.", transport: "Registondan 15 daqiqa piyoda", hours: "08:00–19:00", price: "30 000 so'm", priceUSD: 2, googleMapsUrl: "https://maps.google.com/?q=Bibi-Khanym+Mosque,Samarkand", bestSeason: "Aprel–Iyun, Sentabr–Oktyabr", duration: "1–1.5 soat", featured: false },
  { id: "aydarkol", name: "Aydarko'l ko'li", city: "Nurota", region: "Navoiy viloyati", category: "tabiat", rating: 4.6, reviewCount: 876, tags: ["Ko'l", "Yurta", "Tuyalar"], shortDesc: "Qizilqum cho'lidagi moviy ko'l.", fullDesc: "Aydarko'l — Qizilqum cho'lining ulkan sun'iy ko'li.", transport: "Samarqanddan mashinada 3 soat", hours: "24/7", price: "Yurta lager: ~$25–40", priceUSD: 25, googleMapsUrl: "https://maps.google.com/?q=Aydar+Lake,Uzbekistan", bestSeason: "May–Sentabr", duration: "1–2 kun", featured: false },
  { id: "fayoz-tepa", name: "Fayoz-Tepa", city: "Termiz", region: "Surxondaryo viloyati", category: "arxeologiya", rating: 4.5, reviewCount: 412, tags: ["Buddizm", "Qadimiy", "Ibodatxona"], shortDesc: "I–III asrlarga oid budda ibodatxonasi xarobalari.", fullDesc: "Fayoz-Tepa — Termiz yaqinidagi qadimiy budda monastiri.", transport: "Termizdan taksi 20 daqiqa", hours: "09:00–18:00", price: "25 000 so'm", priceUSD: 2, googleMapsUrl: "https://maps.google.com/?q=Fayaz+Tepe,Termez", bestSeason: "Mart–May, Oktyabr–Noyabr", duration: "1–1.5 soat", featured: false },
];

async function main() {
  for (const loc of LOCATIONS) {
    await prisma.location.upsert({
      where: { id: loc.id },
      create: { ...loc, images: [] },
      update: { ...loc, images: [] },
    });
  }
  console.log(`Seeded ${LOCATIONS.length} locations.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
