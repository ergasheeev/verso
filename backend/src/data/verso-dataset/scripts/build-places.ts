/**
 * scripts/build-places.ts
 * B_places/**\/*.ts → output/index.ts
 * Ishlatish: npx ts-node scripts/build-places.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";

const files = glob.sync("B_places/**/*.ts", { ignore: ["**/_*.ts"] });
const all: any[] = [];

files.forEach((f) => {
  const mod = require(path.resolve(f));
  const key = Object.keys(mod).find((k) => k.endsWith("_places"));
  if (key) all.push(...mod[key]);
});

// country bo'yicha saralash, keyin id
all.sort((a, b) => a.country.localeCompare(b.country) || a.id.localeCompare(b.id));

const output = `// AUTO-GENERATED: scripts/build-places.ts
// O'zgartirmang — B_places/ papkasidan generatsiya qilinadi.
// Oxirgi generatsiya: ${new Date().toISOString()}

export const locations = ${JSON.stringify(all, null, 2)} as const;

export type Location = typeof locations[number];
export type LocationType = Location["type"];
`;

fs.mkdirSync("output", { recursive: true });
fs.writeFileSync("output/index.ts", output, "utf-8");
console.log(`✅ output/index.ts — ${all.length} joy`);
