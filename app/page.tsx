import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import HomeKeyboard from "./HomeKeyboard"
import ModoTitle from "./ModoTitle"
import CharacterCard from "./CharacterCard"
import SubjectTile from "./SubjectTile"
import { connection } from "next/server"
import { getTheme } from "@/lib/themes"

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

export default async function Home() {
  await connection()

  // Load user profile + theme
  const user = await currentUser()
  const meta = (user?.publicMetadata ?? {}) as Record<string, string>
  const theme = getTheme(meta.style)
  const avatarId = meta.avatar ?? "owl"
  const displayName = meta.displayName ?? user?.firstName ?? "PLAYER"

  // Load subjects and compute overall mastery XP
  const [subjectRows, masteryRows] = await Promise.all([
    db.subject.findMany({ select: { id: true, slug: true } }),
    user
      ? db.masteryScore.findMany({
          where: { studentId: user.id },
          select: { score: true },
        })
      : Promise.resolve([]),
  ])

  const idBySlug = Object.fromEntries(subjectRows.map((s) => [s.slug, s.id]))
  const tiles = SUBJECTS.map((s) => ({
    ...s,
    href: idBySlug[s.slug] ? `/subject/${idBySlug[s.slug]}` : null,
  }))

  const avgXP =
    masteryRows.length > 0
      ? Math.round((masteryRows.reduce((s, r) => s + r.score, 0) / masteryRows.length) * 100)
      : 0
  const level = Math.max(1, Math.floor(avgXP / 10) + 1)

  return (
    <div className="min-h-screen bg-[#080810] text-white flex flex-col items-center justify-center overflow-hidden px-6 py-12">
      <HomeKeyboard hrefs={tiles.map((t) => t.href)} />

      {/* user button or sign-in prompt */}
      <div className="absolute top-5 right-5 z-30">
        {user ? (
          <UserButton />
        ) : (
          <Link
            href="/sign-in"
            className="text-xs text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 px-3 py-1.5 rounded-lg transition-all"
          >
            Sign in
          </Link>
        )}
      </div>

      {/* character card — top left */}
      {meta.onboardingComplete && (
        <div className="absolute top-5 left-5 z-30">
          <CharacterCard
            theme={theme}
            avatarId={avatarId}
            displayName={displayName}
            xp={avgXP}
            level={level}
          />
        </div>
      )}

      {/* theme glow behind title */}
      <div
        className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: `rgba(${theme.glowRgb},0.08)` }}
      />

      {/* hero */}
      <div className="relative z-10 text-center mb-10">
        <ModoTitle titleGradient={theme.titleGradient} />
        <p className="text-zinc-600 text-[11px] tracking-[0.32em] uppercase mt-3 font-light">
          master anything
        </p>
      </div>

      {/* subject grid */}
      <div className="relative z-10 w-full max-w-lg grid grid-cols-2 gap-2.5">
        {tiles.map((tile, i) =>
          tile.href ? (
            <SubjectTile
              key={tile.slug}
              href={tile.href}
              index={i}
              name={tile.name}
              desc={tile.desc}
              primaryHex={theme.primaryHex}
            />
          ) : (
            <div
              key={tile.slug}
              className="p-5 rounded-2xl border border-dashed border-white/[0.07] cursor-default"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-700 font-mono">{i + 1}</span>
                <span className="text-zinc-600 text-[10px] flex items-center gap-1">
                  <LockIcon /> locked
                </span>
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
    </div>
  )
}
