"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useClerk } from "@clerk/nextjs"
import { useT } from "@/lib/i18n/I18nProvider"
import { exitGuest } from "@/app/sign-in/actions"

// Right-side nav menu (hamburger) for the home dashboard. Collapses Leaderboard +
// the state-specific actions (guest: Sign in / Exit · member: Settings / Sign out)
// into one tidy dropdown instead of a row of mismatched buttons.
export default function NavMenu({ isGuest }: { isGuest: boolean }) {
  const t = useT()
  const { signOut } = useClerk()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown", onEsc)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("keydown", onEsc)
    }
  }, [open])

  const item =
    "flex items-center w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.06] transition-colors"

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
        aria-expanded={open}
        className="flex items-center justify-center w-9 h-9 rounded-lg text-zinc-300 border border-white/[0.08] hover:bg-white/[0.06] transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/[0.08] bg-[#111118] shadow-2xl overflow-hidden z-50 py-1">
          <Link href="/leaderboard" className={item} onClick={() => setOpen(false)}>
            {t("leaderboard.title")}
          </Link>
          <Link href="/help" className={item} onClick={() => setOpen(false)}>
            {t("home.docs")}
          </Link>
          <Link href="/feedback" className={item} onClick={() => setOpen(false)}>
            {t("home.feedback")}
          </Link>

          {isGuest ? (
            <>
              <Link href="/sign-in" className={item} onClick={() => setOpen(false)}>
                {t("home.signIn")}
              </Link>
              <form action={exitGuest}>
                <button type="submit" className={item}>
                  {t("home.exit")}
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/settings" className={item} onClick={() => setOpen(false)}>
                {t("settings.title")}
              </Link>
              <button type="button" className={item} onClick={() => signOut({ redirectUrl: "/" })}>
                {t("home.signOut")}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
