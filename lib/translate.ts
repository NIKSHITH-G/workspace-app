// Free, no-API-key machine translation. Primary: Google's unofficial
// translate_a/single endpoint (verified working for all 10 MODO locales,
// incl. ar/he). Fallback: MyMemory (also keyless). Used both by the one-time
// UI-dictionary generator and by on-demand content localization (Phase 2).
//
// No Gemini / paid tokens are involved.

// Segments protected from translation, in match order. Code is kept verbatim so
// it stays universal/English (e.g. Python is the same in every language), and
// `{placeholders}` aren't mangled. Fenced blocks first (they contain backticks),
// then inline code, then placeholders.
const FENCED_CODE_RE = /```[\s\S]*?```/g
const INLINE_CODE_RE = /`[^`\n]+`/g
const PLACEHOLDER_RE = /\{[^}]+\}/g
// Endpoint length is generous but not unlimited — chunk well below it.
const MAX_CHUNK = 4000

/** Replace code spans/blocks + `{tokens}` with `__i__` sentinels MT leaves intact. */
function protect(text: string): { masked: string; tokens: string[] } {
  const tokens: string[] = []
  const mask = (m: string) => `__${tokens.push(m) - 1}__`
  const masked = text
    .replace(FENCED_CODE_RE, mask)
    .replace(INLINE_CODE_RE, mask)
    .replace(PLACEHOLDER_RE, mask)
  return { masked, tokens }
}

function restore(text: string, tokens: string[]): string {
  return text.replace(/__(\d+)__/g, (m, i) => tokens[Number(i)] ?? m)
}

async function googleTranslate(text: string, target: string): Promise<string | null> {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=en&tl=" +
    encodeURIComponent(target) +
    "&q=" +
    encodeURIComponent(text)
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })
  if (!res.ok) return null
  const data = (await res.json()) as [Array<[string]>, ...unknown[]]
  if (!Array.isArray(data?.[0])) return null
  return data[0].map((seg) => seg[0]).join("")
}

async function myMemoryTranslate(text: string, target: string): Promise<string | null> {
  const url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(text) +
    "&langpair=en|" +
    encodeURIComponent(target)
  const res = await fetch(url)
  if (!res.ok) return null
  const data = (await res.json()) as { responseData?: { translatedText?: string } }
  return data.responseData?.translatedText ?? null
}

/** Split long text on paragraph/line boundaries so each chunk stays under the limit. */
function chunk(text: string): string[] {
  if (text.length <= MAX_CHUNK) return [text]
  const out: string[] = []
  let buf = ""
  for (const line of text.split(/(\n)/)) {
    if (buf.length + line.length > MAX_CHUNK && buf) {
      out.push(buf)
      buf = ""
    }
    buf += line
  }
  if (buf) out.push(buf)
  return out
}

/**
 * Translate English `text` into `target` locale. `en` (or empty) is a no-op.
 * Placeholders like `{count}` are preserved. Falls back to the original text
 * if every provider fails, so the UI never renders blank.
 */
export async function translateText(text: string, target: string): Promise<string> {
  if (target === "en" || !text.trim()) return text

  const { masked, tokens } = protect(text)

  const parts: string[] = []
  for (const part of chunk(masked)) {
    let translated: string | null = null
    try {
      translated = await googleTranslate(part, target)
    } catch {
      translated = null
    }
    if (translated == null) {
      try {
        translated = await myMemoryTranslate(part, target)
      } catch {
        translated = null
      }
    }
    parts.push(translated ?? part)
  }

  return restore(parts.join(""), tokens)
}
