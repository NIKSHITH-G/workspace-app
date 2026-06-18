import "server-only"
import { cache } from "react"
import { currentUser } from "@clerk/nextjs/server"
import { getTheme, type Theme } from "@/lib/themes"

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

/** Resolved theme for the current user (also deduped per request). */
export const getUserTheme = cache(async (): Promise<Theme> => {
  const user = await getUser()
  const meta = (user?.publicMetadata ?? {}) as Record<string, string>
  return getTheme(meta.style)
})
