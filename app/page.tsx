import Link from "next/link"
import { db } from "@/lib/db"
import HomeKeyboard from "./HomeKeyboard"
import ModoTitle from "./ModoTitle"
import { connection } from "next/server"

const SUBJECTS = [
  {
    slug: "python",
    name: "Python for AI",
    desc: "Programming foundations for ML",
  },
  {
    slug: "database",
    name: "Database Systems",
    desc: "Relational & query fundamentals",
  },
  {
    slug: "architecture",
    name: "Computer Architecture & Networks",
    desc: "Systems from silicon to protocol",
  },
  {
    slug: "maths",
    name: "Mathematical Foundations",
    desc: "Linear algebra, probability, statistics",
  },
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
  const rows = await db.subject.findMany({
    select: { id: true, slug: true },
  })
  const idBySlug = Object.fromEntries(rows.map((s) => [s.slug, s.id]))

  const tiles = SUBJECTS.map((s) => ({
    ...s,
    href: idBySlug[s.slug] ? `/subject/${idBySlug[s.slug]}` : null,
  }))

  return (
    <div className="min-h-screen bg-[#080810] text-white flex flex-col items-center justify-center overflow-hidden px-6 py-12">
      <HomeKeyboard hrefs={tiles.map((t) => t.href)} />

      {/* glow */}
      <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/[0.08] rounded-full blur-[100px] pointer-events-none" />

      {/* hero */}
      <div className="relative z-10 text-center mb-10">
        <ModoTitle />
        <p className="text-zinc-600 text-[11px] tracking-[0.32em] uppercase mt-3 font-light">
          master anything
        </p>
      </div>

      {/* subject grid */}
      <div className="relative z-10 w-full max-w-lg grid grid-cols-2 gap-2.5">
        {tiles.map((tile, i) =>
          tile.href ? (
            <Link
              key={tile.slug}
              href={tile.href}
              className="group p-5 rounded-2xl bg-white/[0.05] border border-white/[0.09] hover:bg-white/[0.08] hover:border-white/[0.16] transition-all duration-200 active:scale-[0.98]"
            >
              <span className="text-[10px] text-zinc-600 font-mono">{i + 1}</span>
              <h2 className="text-sm font-semibold mt-3 mb-1 text-white">{tile.name}</h2>
              <p className="text-xs text-zinc-500 leading-relaxed">{tile.desc}</p>
            </Link>
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
