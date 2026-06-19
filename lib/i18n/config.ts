// Single source of truth for the locales MODO supports. These are the same
// languages the animated <ModoTitle> cycles through (app/ModoTitle.tsx).

export type Dir = "ltr" | "rtl"

export type LocaleMeta = {
  /** English name, for menus shown to admins/devs */
  label: string
  /** Endonym — the language's own name, shown in the user-facing switcher */
  nativeLabel: string
  dir: Dir
}

export const DEFAULT_LOCALE = "en"

// Order here drives the language switcher order.
export const LOCALE_META = {
  en: { label: "English", nativeLabel: "English", dir: "ltr" },
  ja: { label: "Japanese", nativeLabel: "日本語", dir: "ltr" },
  ko: { label: "Korean", nativeLabel: "한국어", dir: "ltr" },
  ar: { label: "Arabic", nativeLabel: "العربية", dir: "rtl" },
  ru: { label: "Russian", nativeLabel: "Русский", dir: "ltr" },
  hi: { label: "Hindi", nativeLabel: "हिन्दी", dir: "ltr" },
  zh: { label: "Chinese", nativeLabel: "中文", dir: "ltr" },
  el: { label: "Greek", nativeLabel: "Ελληνικά", dir: "ltr" },
  he: { label: "Hebrew", nativeLabel: "עברית", dir: "rtl" },
  th: { label: "Thai", nativeLabel: "ไทย", dir: "ltr" },
} as const satisfies Record<string, LocaleMeta>

export type Locale = keyof typeof LOCALE_META

export const LOCALES = Object.keys(LOCALE_META) as Locale[]

/** Non-English locales — the set the UI-dictionary generator must produce. */
export const TARGET_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE)

export const LOCALE_COOKIE = "NEXT_LOCALE"

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && value in LOCALE_META
}

export function dirFor(locale: Locale): Dir {
  return LOCALE_META[locale].dir
}
