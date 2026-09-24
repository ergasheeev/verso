/**
 * scripts/build-countries.ts
 * A_countries/**\/*.ts → output/countries.ts
 * Ishlatish: npx ts-node scripts/build-countries.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";

const files = glob.sync("A_countries/**/*.ts", { ignore: ["**/_*.ts"] });
const all: any[] = [];

files.forEach((f) => {
  const mod = require(path.resolve(f));
  const key = Object.keys(mod).find((k) => !k.startsWith("_"));
  if (key) all.push(mod[key]);
});

// ISO kodi bo'yicha saralash
all.sort((a, b) => a.code.localeCompare(b.code));

const output = `// AUTO-GENERATED: scripts/build-countries.ts
// O'zgartirmang — A_countries/ papkasidan generatsiya qilinadi.
// Oxirgi generatsiya: ${new Date().toISOString()}

export const countries = ${JSON.stringify(all, null, 2)} as const;

export type Country = typeof countries[number];
export type CountryCode = Country["code"];
`;

fs.mkdirSync("output", { recursive: true });
fs.writeFileSync("output/countries.ts", output, "utf-8");
console.log(`✅ output/countries.ts — ${all.length} mamlakat`);
