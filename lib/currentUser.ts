import "server-only"
import { cache } from "react"
import { cookies } from "next/headers"
import { currentUser } from "@clerk/nextjs/server"
import { getTheme, type Theme } from "@/lib/themes"

export const THEME_COOKIE = "theme"

/**
 * Clerk's `currentUser()` makes a network request to Clerk's Backend API.
 * It's called from the layout, the page, AND <TopNav> on most routes — that's
 * 2–3 round-trips per render. `cache()` dedupes them to a single fetch shared
 * across the whole RSC tree for one request.
 */
export const getUser = cache(async () => {
  try {
    return await currentUser()
  } catch {
    return null
  }
})

/**
 * Resolved theme for the current request. Reads the `theme` cookie first (set on
 * settings/onboarding save) so the common path needs NO Clerk Backend API call —
 * which matters because this runs in the root layout AND <TopNav> on every page.
 * Falls back to `currentUser()` only when the cookie is absent (e.g. an existing
 * user who hasn't re-saved settings yet), so nothing regresses.
 */
export const getUserTheme = cache(async (): Promise<Theme> => {
  const styleCookie = (await cookies()).get(THEME_COOKIE)?.value
  if (styleCookie) return getTheme(styleCookie)

  const user = await getUser()
  const meta = (user?.publicMetadata ?? {}) as Record<string, string>
  return getTheme(meta.style)
})
