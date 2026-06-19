"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { saveSettings } from "./actions"
import { type Theme } from "@/lib/themes"
import { useT } from "@/lib/i18n/I18nProvider"
import { LOCALE_META, LOCALES } from "@/lib/i18n/config"

const AVATARS = [
  { id: "owl",    emoji: "🦉", tKey: "avatars.owl" },
  { id: "fox",    emoji: "🦊", tKey: "avatars.fox" },
  { id: "wolf",   emoji: "🐺", tKey: "avatars.wolf" },
  { id: "dragon", emoji: "🐉", tKey: "avatars.dragon" },
  { id: "cat",    emoji: "🐱", tKey: "avatars.cat" },
  { id: "robot",  emoji: "🤖", tKey: "avatars.robot" },
]

const STYLES = [
  { id: "scholar",  labelKey: "styles.scholarLabel",  descKey: "styles.scholarDesc",  hex: "#3B82F6" },
  { id: "warrior",  labelKey: "styles.warriorLabel",  descKey: "styles.warriorDesc",  hex: "#F97316" },
  { id: "shadow",   labelKey: "styles.shadowLabel",   descKey: "styles.shadowDesc",   hex: "#A855F7" },
  { id: "sage",     labelKey: "styles.sageLabel",     descKey: "styles.sageDesc",     hex: "#22C55E" },
  { id: "maverick", labelKey: "styles.maverickLabel", descKey: "styles.maverickDesc", hex: "#EAB308" },
]

type Props = {
  theme: Theme
  initialName: string
  initialAvatar: string
  initialStyle: string
  initialLanguage: string
}

export default function SettingsClient({ theme, initialName, initialAvatar, initialStyle, initialLanguage }: Props) {
  const t = useT()
  const [displayName, setDisplayName] = useState(initialName)
  const [avatar, setAvatar] = useState(initialAvatar)
  const [style, setStyle] = useState(initialStyle)
  const [language, setLanguage] = useState(initialLanguage)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const selectedStyle = STYLES.find(s => s.id === style)
  const accentHex = selectedStyle?.hex ?? theme.primaryHex

  const handleSave = () => {
    startTransition(async () => {
      const fd = new FormData()
      fd.append("avatar", avatar)
      fd.append("style", style)
      fd.append("language", language)
      fd.append("displayName", displayName.trim() || initialName)
      await saveSettings(fd)
      setSaved(true)
      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 800)
    })
  }

  return (
    <div className="min-h-screen bg-[#080810] text-white px-6 py-12 flex flex-col items-center">

      {/* back link */}
      <div className="w-full max-w-md mb-8">
        <button
          onClick={() => router.back()}
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1.5"
        >
          ← {t("common.back")}
        </button>
      </div>

      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: accentHex }}>
            {t("settings.title")}
          </h1>
          <p className="text-zinc-600 text-xs mt-1">{t("settings.subtitle")}</p>
        </div>

        {/* Username */}
        <section className="space-y-3">
          <label className="text-xs text-zinc-500 tracking-widest uppercase font-mono">{t("settings.username")}</label>
          <input
            type="text"
            maxLength={24}
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/60 transition-colors text-sm"
            placeholder={t("settings.usernamePlaceholder")}
          />
          <p className="text-[11px] text-zinc-600">{t("settings.usernameHint")}</p>
        </section>

        {/* Language */}
        <section className="space-y-3">
          <label className="text-xs text-zinc-500 tracking-widest uppercase font-mono">{t("settings.language")}</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {LOCALES.map(code => (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className="px-3 py-2.5 rounded-xl border text-sm transition-all duration-150 text-left"
                style={{
                  borderColor: language === code ? `${accentHex}88` : "rgba(255,255,255,0.06)",
                  background: language === code ? `${accentHex}18` : "rgba(255,255,255,0.03)",
                }}
              >
                {LOCALE_META[code].nativeLabel}
              </button>
            ))}
          </div>
        </section>

        {/* Avatar */}
        <section className="space-y-3">
          <label className="text-xs text-zinc-500 tracking-widest uppercase font-mono">{t("settings.avatar")}</label>
          <div className="grid grid-cols-6 gap-2">
            {AVATARS.map(a => (
              <button
                key={a.id}
                onClick={() => setAvatar(a.id)}
                className="aspect-square rounded-xl border text-2xl flex items-center justify-center transition-all duration-150"
                style={{
                  borderColor: avatar === a.id ? `${accentHex}88` : "rgba(255,255,255,0.06)",
                  background: avatar === a.id ? `${accentHex}18` : "rgba(255,255,255,0.03)",
                  boxShadow: avatar === a.id ? `0 0 12px ${accentHex}33` : "none",
                }}
              >
                {a.emoji}
              </button>
            ))}
          </div>
        </section>

        {/* Style */}
        <section className="space-y-3">
          <label className="text-xs text-zinc-500 tracking-widest uppercase font-mono">{t("settings.style")}</label>
          <div className="space-y-2">
            {STYLES.map(s => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className="w-full p-3.5 rounded-xl border text-left transition-all duration-150 flex items-center gap-3"
                style={{
                  borderColor: style === s.id ? `${s.hex}55` : "rgba(255,255,255,0.06)",
                  background: style === s.id ? `${s.hex}12` : "rgba(255,255,255,0.02)",
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: s.hex, boxShadow: style === s.id ? `0 0 8px ${s.hex}` : "none" }}
                />
                <div>
                  <p className="text-sm font-semibold text-white">{t(s.labelKey)}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{t(s.descKey)}</p>
                </div>
                {style === s.id && (
                  <span className="ml-auto text-[10px] font-mono tracking-widest" style={{ color: s.hex }}>
                    {t("common.active")}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={isPending || saved}
          className="w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200"
          style={{
            background: saved ? "#22c55e" : accentHex,
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {saved ? t("settings.saved") : isPending ? t("common.saving") : t("settings.save")}
        </button>
      </div>
    </div>
  )
}
