import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getUser } from "@/lib/currentUser"
import { db } from "@/lib/db"
import HomeKeyboard from "./HomeKeyboard"
import ModoTitle from "./ModoTitle"
import SubjectTile from "./SubjectTile"
import { connection } from "next/server"
import { getTheme, AVATAR_EMOJI } from "@/lib/themes"
import { computeXp, levelProgress } from "@/lib/xp"

const SUBJECTS = [
  { slug: "python",       name: "Python for AI",                    desc: "Programming foundations for ML" },
  { slug: "database",     name: "Database Systems",                 desc: "Relational & query fundamentals" },
  { slug: "architecture", name: "Computer Architecture & Networks", desc: "Systems from silicon to protocol" },
  { slug: "maths",        name: "Mathematical Foundations",         desc: "Linear algebra, probability, statistics" },
]

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 14" fill="none" className="inline-block opacity-50">
      <rect x="1" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3.5 6V4a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

export default async function Home() {
  await connection()

  const user = await getUser()
  const meta = (user?.publicMetadata ?? {}) as Record<string, string>

  // Brand-new accounts must pick a username + style before reaching the app
  if (user && !meta.onboardingComplete) redirect("/onboarding")

  const theme = getTheme(meta.style)
  const avatarId = meta.avatar ?? "owl"
  const displayName = meta.displayName ?? user?.firstName ?? "PLAYER"
  const emoji = AVATAR_EMOJI[avatarId] ?? "🧙"

  const [subjectRows, masteryRows, attempts] = await Promise.all([
    db.subject.findMany({ select: { id: true, slug: true } }),
    user
      ? db.masteryScore.findMany({ where: { studentId: user.id }, select: { score: true } })
      : Promise.resolve([]),
    user
      ? db.attempt.findMany({ where: { studentId: user.id }, select: { correct: true, quality: true, createdAt: true } })
      : Promise.resolve([]),
  ])

  const idBySlug = Object.fromEntries(subjectRows.map((s) => [s.slug, s.id]))
  const tiles = SUBJECTS.map((s) => ({
    ...s,
    href: idBySlug[s.slug] ? `/subject/${idBySlug[s.slug]}` : null,
  }))

  const masteredCount = masteryRows.filter((r) => r.score >= 0.7).length
  const xp = computeXp(attempts, masteredCount)
  const progress = levelProgress(xp.total)
  const level = progress.level
  const progressPct = progress.pct

  return (
    <div className="min-h-screen bg-[#080810] text-white flex flex-col overflow-hidden">
      <HomeKeyboard hrefs={tiles.map((t) => t.href)} />

      {/* ── nav bar ── */}
      <nav
        className="relative z-30 flex items-center justify-between gap-4 px-5 py-3 border-b border-white/[0.05]"
        style={{ minHeight: 60 }}
      >
        {/* left: character info */}
        {meta.onboardingComplete && user ? (
          <Link href="/settings" className="group flex items-center gap-3 min-w-0" style={{ textDecoration: "none" }}>
            {/* avatar */}
            <div
              className="flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                fontSize: 20,
                flexShrink: 0,
                background: `${theme.primaryHex}18`,
                border: `1px solid ${theme.primaryHex}33`,
              }}
            >
              {emoji}
            </div>
            {/* name + class + level */}
            <div className="flex flex-col" style={{ gap: 3 }}>
              <div className="flex items-center" style={{ gap: 7 }}>
                <span className="text-xs font-bold text-white tracking-wide leading-none truncate" style={{ maxWidth: 140 }}>{displayName}</span>
                <span
                  className="font-mono leading-none shrink-0"
                  style={{ fontSize: 9, padding: "2px 5px", borderRadius: 4, color: theme.primaryHex, border: `1px solid ${theme.primaryHex}44`, background: `${theme.primaryHex}11` }}
                >
                  LVL {level}
                </span>
                {xp.currentStreak > 0 && (
                  <span className="font-mono leading-none text-orange-400" style={{ fontSize: 9 }} title={`${xp.currentStreak}-day streak`}>
                    🔥 {xp.currentStreak}
                  </span>
                )}
              </div>
              <div className="flex items-center" style={{ gap: 7 }}>
                <span className="font-mono leading-none opacity-80" style={{ fontSize: 9, letterSpacing: "0.18em", color: theme.primaryHex }}>
                  {theme.class}
                </span>
                {/* XP bar — progress to next level */}
                <div
                  title={`${xp.total.toLocaleString()} XP · ${progress.toNext.toLocaleString()} to next level`}
                  style={{ width: 64, height: 3, borderRadius: 999, overflow: "hidden", background: "rgba(255,255,255,0.08)" }}
                >
                  <div
                    style={{ height: "100%", width: `${progressPct}%`, borderRadius: 999, background: `linear-gradient(90deg, ${theme.primaryHex}88, ${theme.primaryHex})` }}
                  />
                </div>
                <span className="font-mono leading-none text-zinc-600 hidden sm:inline" style={{ fontSize: 8.5 }}>
                  {xp.total.toLocaleString()} XP
                </span>
              </div>
            </div>
          </Link>
        ) : !user ? (
          <Link href="/sign-in" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            Sign in to save progress
          </Link>
        ) : (
          <Link
            href="/settings"
            className="group flex items-center gap-2.5"
            style={{ textDecoration: "none" }}
          >
            <div
              className="flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
              style={{ width: 38, height: 38, borderRadius: 10, fontSize: 20, flexShrink: 0, background: `${theme.primaryHex}18`, border: `1px solid ${theme.primaryHex}33` }}
            >
              {emoji}
            </div>
            <div className="flex flex-col" style={{ gap: 3 }}>
              <span className="text-xs font-bold text-white leading-none">Set up your profile</span>
              <span className="font-mono leading-none opacity-80" style={{ fontSize: 9, letterSpacing: "0.12em", color: theme.primaryHex }}>
                PICK USERNAME &amp; STYLE →
              </span>
            </div>
          </Link>
        )}

        {/* right: leaderboard + user */}
        <div className="flex items-center gap-3.5">
          <Link
            href="/leaderboard"
            className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 transition-colors"
            title="Leaderboard"
          >
            <TrophyIcon />
            <span className="text-[11px] font-mono tracking-wide hidden sm:inline">RANKS</span>
          </Link>
          {user ? (
            <UserButton />
          ) : (
            <Link href="/sign-in" className="text-xs text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 px-3 py-1.5 rounded-lg transition-all">
              Sign in
            </Link>
          )}
        </div>
      </nav>

      {/* ── hero + grid ── */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[110px] pointer-events-none"
          style={{ background: `rgba(${theme.glowRgb},0.09)` }}
        />

        {/* MODO title */}
        <div className="relative z-10 text-center mb-10">
          <ModoTitle gradientCss={theme.titleGradientCss} />
          <p className="text-zinc-600 text-[11px] tracking-[0.32em] uppercase mt-3 font-light">
            master anything
          </p>
        </div>

        {/* subject grid */}
        <div className="relative z-10 w-full max-w-lg grid grid-cols-2 gap-2.5">
          {tiles.map((tile, i) =>
            tile.href ? (
              <SubjectTile key={tile.slug} href={tile.href} index={i} name={tile.name} desc={tile.desc} primaryHex={theme.primaryHex} />
            ) : (
              <div key={tile.slug} className="p-5 rounded-2xl border border-dashed border-white/[0.07] cursor-default">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-700 font-mono">{i + 1}</span>
                  <span className="text-zinc-600 text-[10px] flex items-center gap-1"><LockIcon /> locked</span>
                </div>
                <h2 className="text-sm font-semibold mt-3 mb-1 text-zinc-600">{tile.name}</h2>
                <p className="text-xs text-zinc-700 leading-relaxed">{tile.desc}</p>
              </div>
            )
          )}
        </div>

        <p className="relative z-10 mt-7 text-[10px] text-zinc-700 tracking-[0.25em] uppercase">
          press 1–4 for quick access
        </p>
      </main>
    </div>
  )
}
