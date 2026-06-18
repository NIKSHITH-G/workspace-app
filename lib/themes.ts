export type ThemeId = "scholar" | "warrior" | "shadow" | "sage" | "maverick"

export type Theme = {
  id: ThemeId
  name: string
  class: string
  avatar: string
  primaryHex: string
  glowRgb: string
  titleGradient: string  // kept for backward compat (unused now)
  titleGradientCss: string  // inline CSS gradient for MODO title
  cardBorder: string
  progressBar: string
  badgeBg: string
}

export const THEMES: Record<ThemeId, Theme> = {
  scholar: {
    id: "scholar", name: "The Scholar", class: "SCHOLAR", avatar: "",
    primaryHex: "#3B82F6", glowRgb: "59,130,246",
    titleGradient: "",
    titleGradientCss: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.9) 45%, rgba(96,165,250,0.75) 100%)",
    cardBorder: "border-blue-500/40", progressBar: "bg-blue-500",
    badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  warrior: {
    id: "warrior", name: "The Warrior", class: "WARRIOR", avatar: "",
    primaryHex: "#F97316", glowRgb: "249,115,22",
    titleGradient: "",
    titleGradientCss: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.9) 45%, rgba(249,115,22,0.75) 100%)",
    cardBorder: "border-orange-500/40", progressBar: "bg-orange-500",
    badgeBg: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  },
  shadow: {
    id: "shadow", name: "The Shadow", class: "SHADOW", avatar: "",
    primaryHex: "#A855F7", glowRgb: "168,85,247",
    titleGradient: "",
    titleGradientCss: "linear-gradient(135deg, #fff 0%, rgba(233,213,255,0.85) 45%, rgba(168,85,247,0.7) 100%)",
    cardBorder: "border-purple-500/40", progressBar: "bg-purple-500",
    badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  },
  sage: {
    id: "sage", name: "The Sage", class: "SAGE", avatar: "",
    primaryHex: "#22C55E", glowRgb: "34,197,94",
    titleGradient: "",
    titleGradientCss: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.9) 45%, rgba(34,197,94,0.75) 100%)",
    cardBorder: "border-emerald-500/40", progressBar: "bg-emerald-500",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  maverick: {
    id: "maverick", name: "The Maverick", class: "MAVERICK", avatar: "",
    primaryHex: "#EAB308", glowRgb: "234,179,8",
    titleGradient: "",
    titleGradientCss: "linear-gradient(135deg, #fff 0%, rgba(254,249,195,0.9) 45%, rgba(234,179,8,0.75) 100%)",
    cardBorder: "border-yellow-500/40", progressBar: "bg-yellow-500",
    badgeBg: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  },
}

export const AVATAR_EMOJI: Record<string, string> = {
  owl: "🦉",
  fox: "🦊",
  wolf: "🐺",
  dragon: "🐉",
  cat: "🐱",
  robot: "🤖",
}

export function getTheme(styleId?: string): Theme {
  return THEMES[(styleId as ThemeId) ?? "scholar"] ?? THEMES.scholar
}
