/** The translatable prose the country hub renders. Every field is optional:
 *  a country the dataset does not cover falls back to the English text on
 *  `Country` itself, which is what the atlas has always shown. */
export interface CountryProse {
  summary?: string;
  tagline?: string;
  bestSeason?: string;
  visaNote?: string;
  topCities?: string[];
  cuisine?: string[];
}
