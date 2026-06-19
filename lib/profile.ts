import { THEMES, type ThemeId } from "./themes"

// Allow-lists for user-chosen profile fields. These come straight from the
// client (FormData) and are written to Clerk publicMetadata + rendered on the
// public leaderboard, so anything off the list is coerced to a safe default.
export const AVATAR_IDS = ["owl", "fox", "wolf", "dragon", "cat", "robot"] as const
const STYLE_IDS = Object.keys(THEMES) as ThemeId[]

const DEFAULT_AVATAR: (typeof AVATAR_IDS)[number] = "owl"
const DEFAULT_STYLE: ThemeId = "scholar"
const MAX_DISPLAY_NAME = 40

export function sanitizeProfile(input: {
  avatar?: string | null
  style?: string | null
  displayName?: string | null
}) {
  const avatar = (AVATAR_IDS as readonly string[]).includes(input.avatar ?? "")
    ? (input.avatar as string)
    : DEFAULT_AVATAR
  const style = (STYLE_IDS as string[]).includes(input.style ?? "")
    ? (input.style as ThemeId)
    : DEFAULT_STYLE
  const displayName = (input.displayName ?? "")
    // strip control chars (incl. newlines) before clamping length
    .replace(/[\x00-\x1F\x7F]/g, "")
    .trim()
    .slice(0, MAX_DISPLAY_NAME)

  return { avatar, style, displayName }
}
