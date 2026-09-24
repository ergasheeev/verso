/**
 * scripts/build-i18n.ts
 * D_translations/{til}/**\/*.ts → output/countries.i18n.ts
 * Ishlatish: npx ts-node scripts/build-i18n.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";

const langs = ["ru", "uz", "zh", "de", "fr"];
const result: Record<string, Record<string, any>> = {};

langs.forEach((lang) => {
  result[lang] = {};
  const files = glob.sync(`D_translations/${lang}/**/*.ts`);
  files.forEach((f) => {
    const mod = require(path.resolve(f));
    Object.values(mod).forEach((val: any) => {
      // key: country code (uz_ru → UZ)
      const modKey = Object.keys(require(path.resolve(f)))[0];
      const code = modKey.replace(`_${lang}`, "").toUpperCase();
      result[lang][code] = val;
    });
  });
});

const output = `// AUTO-GENERATED: scripts/build-i18n.ts
// O'zgartirmang — D_translations/ papkasidan generatsiya qilinadi.
// Oxirgi generatsiya: ${new Date().toISOString()}

export const countriesI18n = ${JSON.stringify(result, null, 2)} as const;
`;

fs.mkdirSync("output", { recursive: true });
fs.writeFileSync("output/countries.i18n.ts", output, "utf-8");
console.log(`✅ output/countries.i18n.ts — ${langs.length} til`);
