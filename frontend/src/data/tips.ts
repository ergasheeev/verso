import {
  ShieldCheck, Wallet, Users, Bus, UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

/**
 * The Community section’s second tab: practical, country-specific advice —
 * the "what should I actually know before I go" layer the atlas’s own
 * country hubs don’t have room for (they carry the reference facts: visa,
 * currency, emergency numbers). A tip is editorial, not user-submitted —
 * written by the same voice as the country summaries in data/countries.ts,
 * attributed to "Verso" rather than a fabricated traveller, because it is
 * not a review of an experience, it is guidance.
 */

export type TipCategory = "safety" | "money" | "customs" | "transport" | "food";

/**
 * `labelKey`, not `label`. These strings are chips in the Community filter
 * and a badge on every tip card — user interface, not data — and holding the
 * English text here meant the whole category row stayed English in all six
 * languages while the country filter beside it translated correctly.
 */
export const TIP_CATEGORY_META: Record<TipCategory, { labelKey: string; Icon: LucideIcon }> = {
  safety:    { labelKey: "tip_safety",    Icon: ShieldCheck },
  money:     { labelKey: "tip_money",     Icon: Wallet },
  customs:   { labelKey: "tip_customs",   Icon: Users },
  transport: { labelKey: "tip_transport", Icon: Bus },
  food:      { labelKey: "tip_food",      Icon: UtensilsCrossed },
};

export interface Tip {
  id: string;
  /** ISO country code from data/countries.ts, or null for advice that holds
   *  everywhere (packing light, travel insurance, that kind of thing). */
  countryCode: string | null;
  category: TipCategory;
  title: string;
  body: string;
}

export const TIPS: Tip[] = [
  {
    id: "tip-uz-money",
    countryCode: "UZ",
    category: "money",
    title: "Carry cash — cards are a backup, not a plan",
    body: "Bazaars, taxis and most restaurants outside Tashkent run on cash. ATMs are common in cities but thin on the ground between them, and som notes come in large denominations — a $50 withdrawal is a genuinely thick stack. Change a reasonable amount on arrival rather than relying on finding a machine later.",
  },
  {
    id: "tip-uz-customs",
    countryCode: "UZ",
    category: "customs",
    title: "Remove your shoes before entering a home",
    body: "It’s the default in any private house and most guesthouses — look for a shoe rack by the door and follow it even if no one asks. At mosques and madrasas, shoulders and knees covered is expected of everyone, not just women.",
  },
  {
    id: "tip-uz-transport",
    countryCode: "UZ",
    category: "transport",
    title: "Book the Afrosiyob high-speed train ahead in summer",
    body: "Tashkent–Samarkand–Bukhara sells out on the Afrosiyob during peak season (April–May, September–October). It’s the fastest and most comfortable way between the Silk Road cities; a shared taxi is the fallback if you’re booking last-minute.",
  },
  {
    id: "tip-jp-customs",
    countryCode: "JP",
    category: "customs",
    title: "Don’t tip — it can cause genuine confusion",
    body: "Service is included and tipping isn’t part of the culture; leaving money on a table is sometimes chased after you by staff who think you forgot it. If you want to show appreciation, a verbal thank-you (\"gochisousama deshita\" after a meal) lands better than cash.",
  },
  {
    id: "tip-jp-transport",
    countryCode: "JP",
    category: "transport",
    title: "Get a Suica or Pasmo IC card on day one",
    body: "It taps onto nearly every train, bus and convenience store purchase in the country, removing the need to work out fare charts in a station you’ve never seen before. Reloadable at any station machine, and the remaining balance is refundable when you leave.",
  },
  {
    id: "tip-jp-food",
    countryCode: "JP",
    category: "food",
    title: "The best meal is often behind a vending machine",
    body: "Many small ramen and curry shops use a ticket machine at the entrance instead of a menu — pick your dish, pay, hand the ticket to the counter. It looks like a barrier but it’s usually the sign of a place that’s been doing one thing well for decades.",
  },
  {
    id: "tip-th-safety",
    countryCode: "TH",
    category: "safety",
    title: "Agree on a tuk-tuk or taxi price before you get in",
    body: "Meters exist and drivers are supposed to use them; some won’t unless asked. Naming your destination and agreeing a price first avoids the after-the-fact negotiation that ruins an otherwise pleasant ride.",
  },
  {
    id: "tip-th-customs",
    countryCode: "TH",
    category: "customs",
    title: "The head is sacred, the feet are not",
    body: "Avoid touching anyone’s head, including a child’s, and don’t point your feet at a person or a Buddha image — tucking them under you when seated is the safe default. Both are small, easy habits once you know to look for them.",
  },
  {
    id: "tip-it-food",
    countryCode: "IT",
    category: "food",
    title: "Cappuccino is a breakfast drink, not an after-dinner one",
    body: "Ordering one after a meal marks you as a tourist more than almost anything else — espresso or a digestivo is what follows dinner. No one will actually stop you, but a barista’s raised eyebrow is a small tax you can skip.",
  },
  {
    id: "tip-it-money",
    countryCode: "IT",
    category: "money",
    title: "A seated table costs more than the counter",
    body: "Many cafés and bars charge a noticeably higher price for the same espresso if you sit rather than stand at the bar — it’s printed on the price list (menu al banco vs al tavolo) if you look for it, not a scam, just how the pricing works.",
  },
  {
    id: "tip-fr-customs",
    countryCode: "FR",
    category: "customs",
    title: "Say bonjour before you ask for anything",
    body: "Opening any interaction — a shop, a café, asking for directions — with a greeting rather than straight into the request is the single biggest thing that changes how you’re received. Skipping it isn’t rude exactly, but it reads as brusque in a way that colours everything after.",
  },
  {
    id: "tip-ma-customs",
    countryCode: "MA",
    category: "customs",
    title: "The first price in a souk is a starting point",
    body: "Bargaining is expected in medina shops without marked prices, and it’s a normal, unhurried social exchange rather than a confrontation — a shopkeeper naming a high opening figure isn’t trying to cheat you, it’s just how the conversation starts.",
  },
  {
    id: "tip-eg-safety",
    countryCode: "EG",
    category: "safety",
    title: "Hire a licensed guide at the major sites",
    body: "Giza, Luxor and Abu Simbel all draw unofficial guides who’ll approach before you reach the ticket office. A guide booked through your hotel or a registered agency costs a little more and gets you accurate history instead of an invented one — and no pressure to buy anything at the end.",
  },
  {
    id: "tip-in-food",
    countryCode: "IN",
    category: "food",
    title: "Street food is often safer than a half-empty restaurant",
    body: "Look for a stall with a queue and high turnover — food that’s cooked to order and sold fast is generally a safer bet than something that’s been sitting. Bottled water, and ice only where you trust the source.",
  },
  {
    id: "tip-in-transport",
    countryCode: "IN",
    category: "transport",
    title: "Use a ride-hailing app rather than hailing on the street",
    body: "Uber and Ola operate in most cities and remove the fare negotiation entirely — the price is fixed before the car arrives. Street-hailed auto-rickshaws are fine too, but agree the fare first or insist on the meter.",
  },
  {
    id: "tip-is-safety",
    countryCode: "IS",
    category: "safety",
    title: "Check road.is before any drive outside Reykjavík",
    body: "Weather changes fast and closes roads with little warning, especially the interior F-roads and anything in winter. The official road conditions site is more current than any map app, and worth a look every morning of a road trip.",
  },
  {
    id: "tip-ge-food",
    countryCode: "GE",
    category: "food",
    title: "A toast is a whole speech, not a sentence",
    body: "At a Georgian supra (feast), the tamada (toastmaster) leads a long sequence of toasts — to guests, to parents, to those who’ve passed — and each one is meant to be a real, if brief, address. Sipping rather than draining your glass every time is entirely acceptable.",
  },
  {
    id: "tip-tr-transport",
    countryCode: "TR",
    category: "transport",
    title: "Get an Istanbulkart even for a short stay",
    body: "One card covers trams, the metro, buses and the ferries across the Bosphorus, at a fraction of a single paper ticket’s cost per ride. Sold from machines at any station and reloadable the same way.",
  },
  {
    id: "tip-mx-safety",
    countryCode: "MX",
    category: "safety",
    title: "Order a taxi through an app rather than flagging one",
    body: "In Mexico City and other large cities, an app-booked ride is trackable and priced up front, which is the more reliable option after dark. Registered taxi ranks (sitios) at hotels and airports are the safe street-hailed alternative.",
  },
  {
    id: "tip-kr-customs",
    countryCode: "KR",
    category: "customs",
    title: "Receive and give things with two hands",
    body: "Handing over money, a business card or a gift with both hands (or your free hand supporting your forearm) is a small gesture of respect that’s noticed when it’s there and, increasingly rarely among visitors, missed when it isn’t.",
  },
  {
    id: "tip-pe-safety",
    countryCode: "PE",
    category: "safety",
    title: "Spend a day in Cusco before you go higher",
    body: "Cusco itself sits at 3,400m, and altitude sickness doesn’t care how fit you are. Coca tea, a slow first day and plenty of water make the difference between enjoying the Sacred Valley and spending it with a headache.",
  },
  {
    id: "tip-general-1",
    countryCode: null,
    category: "money",
    title: "Tell your bank before you fly, not after a declined card",
    body: "A card that’s never been used abroad sometimes gets frozen on the first foreign transaction as a fraud precaution. A two-minute note in your banking app before departure avoids standing at a till working out what just happened.",
  },
  {
    id: "tip-general-2",
    countryCode: null,
    category: "safety",
    title: "Photograph your passport and keep a copy off your phone",
    body: "A photo in your camera roll, one emailed to yourself, and — if you’re the paper type — a physical photocopy packed separately from the original. Losing a passport is stressful; losing it with no record of the number is much worse.",
  },
  {
    id: "tip-general-3",
    countryCode: null,
    category: "customs",
    title: "Learn the local word for 'thank you' before anything else",
    body: "Not fluency, just that one word, said properly. It’s a small thing that reliably changes the tone of an interaction more than almost any other single piece of preparation, everywhere this atlas covers.",
  },
];
