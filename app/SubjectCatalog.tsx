"use client"

import { useMemo, useRef, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useT } from "@/lib/i18n/I18nProvider"
import SubjectIcon from "@/components/SubjectIcon"

export type CatalogSubject = {
  id: string
  slug: string
  href: string | null // set when published
  name: string // localized
  description: string // localized
  category: string | null
  comingSoon: boolean
  total: number
  mastered: number
}

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 14" fill="none" className="inline-block opacity-50">
      <rect x="1" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3.5 6V4a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export default function SubjectCatalog({
  subjects,
  primaryHex,
}: {
  subjects: CatalogSubject[]
  primaryHex: string
}) {
  const t = useT()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return subjects
    return subjects.filter((s) =>
      [s.name, s.description, s.category ?? ""].some((f) => f.toLowerCase().includes(q)),
    )
  }, [query, subjects])

  // "/" focuses search anywhere; Esc clears/blurs.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const el = document.activeElement
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
      if (e.key === "/" && !typing) {
        e.preventDefault()
        inputRef.current?.focus()
      } else if (e.key === "Escape" && typing) {
        setQuery("")
        inputRef.current?.blur()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  // Enter in the search box opens the first available match.
  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const first = filtered.find((s) => s.href)
      if (first?.href) router.push(first.href)
    }
  }

  return (
    <div className="w-full max-w-3xl">
      {/* Search */}
      <div className="relative mb-5">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onSearchKeyDown}
          placeholder={t("home.searchPlaceholder")}
          className="w-full bg-white/[0.04] border border-white/[0.07] rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
          style={{ caretColor: primaryHex }}
          onFocus={(e) => (e.currentTarget.style.borderColor = `${primaryHex}55`)}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-zinc-600 text-sm py-16">
          {t("home.noResults", { query: query.trim() })}
        </p>
      ) : (
        <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {filtered.map((s) =>
            s.comingSoon || !s.href ? (
              <div
                key={s.id}
                className="p-5 rounded-2xl border border-dashed border-white/[0.07] cursor-default opacity-60"
              >
                <div className="flex items-center justify-between">
                  <SubjectIcon slug={s.slug} size={22} className="text-zinc-500" />
                  <span className="text-zinc-600 text-[10px] flex items-center gap-1">
                    <LockIcon /> {t("home.comingSoon")}
                  </span>
                </div>
                <h2 className="text-sm font-semibold mt-3 mb-1 text-zinc-500">{s.name}</h2>
                <p className="text-xs text-zinc-700 leading-relaxed">{s.description}</p>
              </div>
            ) : (
              <Link
                key={s.id}
                href={s.href}
                className="group p-5 rounded-2xl bg-white/[0.04] border transition-all duration-200 active:scale-[0.98]"
                style={{ borderColor: `${primaryHex}22` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${primaryHex}55`
                  e.currentTarget.style.background = `${primaryHex}0a`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${primaryHex}22`
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)"
                }}
              >
                <div className="flex items-center justify-between">
                  <SubjectIcon slug={s.slug} size={22} style={{ color: primaryHex }} />
                  {s.category && (
                    <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-600">{s.category}</span>
                  )}
                </div>
                <h2 className="text-sm font-semibold mt-3 mb-1 text-white">{s.name}</h2>
                <p className="text-xs text-zinc-500 leading-relaxed">{s.description}</p>
                {s.total > 0 && (
                  <div className="mt-3 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(s.mastered / s.total) * 100}%`, background: primaryHex }}
                    />
                  </div>
                )}
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  )
}
