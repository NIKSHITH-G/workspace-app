import "server-only"
import { cache } from "react"
import { cookies, headers } from "next/headers"
import { getUser } from "@/lib/currentUser"
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./config"

/**
 * Resolve the active locale for this request, in priority order:
 *   1. `NEXT_LOCALE` cookie (set by the language switcher — immediate, no Clerk hit)
 *   2. the signed-in user's Clerk `publicMetadata.language`
 *   3. the browser `Accept-Language` header
 *   4. the default locale (`en`)
 *
 * Deduped per request via `cache()` (same pattern as `getUser`).
 */
export const getLocale = cache(async (): Promise<Locale> => {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value
  if (isLocale(cookieLocale)) return cookieLocale

  const user = await getUser()
  const metaLocale = (user?.publicMetadata as Record<string, unknown> | undefined)?.language
  if (isLocale(metaLocale)) return metaLocale

  const accept = (await headers()).get("accept-language")
  const fromHeader = pickFromAcceptLanguage(accept)
  if (fromHeader) return fromHeader

  return DEFAULT_LOCALE
})

/** First supported locale named in an Accept-Language header, else null. */
function pickFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null
  for (const part of header.split(",")) {
    const code = part.split(";")[0].trim().toLowerCase().split("-")[0]
    if (isLocale(code)) return code
  }
  return null
}
