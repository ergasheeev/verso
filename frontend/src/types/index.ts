export interface Location {
  id: string;
  name: string;
  city: string;
  region: string;
  category: "tarix" | "tabiat" | "madaniyat" | "din" | "arxeologiya";
  rating: number;
  reviewCount: number;
  /**
   * Optional, and left unset rather than filled with a stand-in: a photograph of
   * the wrong monument is a confident factual error, worse than none. Places
   * without a verified image render as a typographic plate instead.
   */
  img?: string;
  tags: string[];
  shortDesc: string;
  fullDesc: string;
  transport: string;
  hours: string;
  price: string;
  priceUSD: number;
  googleMapsUrl: string;
  bestSeason: string;
  duration: string;
  featured: boolean;
}

export interface Review {
  id: string;
  locationId: string;
  author: string;
  country: string;
  stars: number;
  text: string;
  time: string;
  trustScore: number;
  aiTags: string[];
  verified: boolean;
}

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  country: string;
  lang: string;
  plan: Location[];
  isPremium: boolean;
  // Set only for accounts created through the retired Google Sign-In flow. The
  // column remains on the User model, so the field is kept for type accuracy;
  // nothing reads it.
  googleId?: string | null;
  // False until the emailed 6-digit code has been confirmed. Existing
  // accounts predating this feature were backfilled to true.
  emailVerified?: boolean;
  // A resized JPEG data URL, or null/undefined for the initial-letter
  // fallback avatar. There is no object storage wired up, so the photo
  // itself lives in this field rather than a CDN URL.
  avatarUrl?: string | null;
}

export interface Guide {
  id: string;
  name: string;
  city: string;
  langs: string[];
  rating: number;
  pricePerDay: number;
  available: boolean;
  bio: string;
  verified: boolean;
  img: string;
}

export interface MenuItem {
  name: string;
  price: number;
  description: string;
}

export interface Restaurant {
  id: string;
  name: string;
  city: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  address: string;
  hours: string;
  img: string;
  menu: MenuItem[];
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  stars: number;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  address: string;
  img: string;
  available: boolean;
}
