// One-time (re-run on en.json changes) generator for the UI dictionaries.
// Reads lib/i18n/dictionaries/en.json, translates every leaf string into each
// target locale via the free engine in lib/translate.ts, and writes
// lib/i18n/dictionaries/<locale>.json. No API keys, no paid tokens.
//
//   npm run i18n:ui            # all target locales
//   npm run i18n:ui -- hi ar   # only these locales

import fs from "node:fs"
import path from "node:path"
import { TARGET_LOCALES, isLocale, type Locale } from "../lib/i18n/config"
import { translateText } from "../lib/translate"

const DICT_DIR = path.resolve(process.cwd(), "lib/i18n/dictionaries")

type Tree = { [k: string]: string | Tree }

function isStr(v: unknown): v is string {
  return typeof v === "string"
}

/** Translate every leaf string of `tree` into `locale`, preserving structure. */
async function translateTree(tree: Tree, locale: Locale): Promise<Tree> {
  const out: Tree = {}
  for (const [key, val] of Object.entries(tree)) {
    if (isStr(val)) {
      out[key] = await translateText(val, locale)
      process.stdout.write(".")
    } else {
      out[key] = await translateTree(val, locale)
    }
  }
  return out
}

async function main() {
  const en = JSON.parse(fs.readFileSync(path.join(DICT_DIR, "en.json"), "utf8")) as Tree

  const argLocales = process.argv.slice(2).filter(isLocale)
  const locales: Locale[] = argLocales.length ? argLocales : TARGET_LOCALES

  for (const locale of locales) {
    process.stdout.write(`\nTranslating → ${locale} `)
    const translated = await translateTree(en, locale)
    fs.writeFileSync(
      path.join(DICT_DIR, `${locale}.json`),
      JSON.stringify(translated, null, 2) + "\n",
    )
    process.stdout.write(` ✓ wrote ${locale}.json`)
  }
  process.stdout.write("\nDone.\n")
}

main().catch((err) => {
  console.error("\ntranslate-ui failed:", err)
  process.exit(1)
})
