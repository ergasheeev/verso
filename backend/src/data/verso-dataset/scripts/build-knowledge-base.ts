/**
 * scripts/build-knowledge-base.ts
 * B_places/ ma'lumotlaridan backend uchun knowledge-base.ts yasaydi.
 * Groq AI har so'rovga bu context ni oladi.
 * Ishlatish: npx ts-node scripts/build-knowledge-base.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";

const files = glob.sync("B_places/**/*.ts", { ignore: ["**/_*.ts"] });
const allPlaces: any[] = [];

files.forEach((f) => {
  const mod = require(path.resolve(f));
  const key = Object.keys(mod).find((k) => k.endsWith("_places"));
  if (key) allPlaces.push(...mod[key]);
});

// AI uchun ixcham format
const kb = allPlaces.map((p) => ({
  id: p.id,
  name: p.name,
  country: p.country,
  city: p.city,
  type: p.type,
  description: p.description,
  price: p.price,
  priceUSD: p.priceUSD,
  hours: p.hours,
  transport: p.transport,
}));

const output = `// AUTO-GENERATED: scripts/build-knowledge-base.ts
// O'zgartirmang — B_places/ papkasidan generatsiya qilinadi.
// Oxirgi generatsiya: ${new Date().toISOString()}
// Bu fayl Groq AI suhbat kontekstiga qo'shiladi.

export const knowledgeBase = ${JSON.stringify(kb, null, 2)};

export type KnowledgeEntry = typeof knowledgeBase[number];
`;

fs.mkdirSync("output", { recursive: true });
fs.writeFileSync("output/knowledge-base.ts", output, "utf-8");
console.log(`✅ output/knowledge-base.ts — ${kb.length} joy (AI knowledge base)`);
