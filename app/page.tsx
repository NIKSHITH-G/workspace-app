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
    <div className="min-h-screen bg-[#080810] text-white flex flex-col items-center justify-center overflow-hidden px-6">
      <HomeKeyboard hrefs={tiles.map((t) => t.href)} />

      {/* subtle radial glow behind title */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* title */}
      <div className="relative z-10 mb-14 text-center">
        <ModoTitle />
        <p className="text-zinc-600 text-xs tracking-[0.3em] uppercase mt-4 font-light">
          master anything
        </p>
      </div>

      {/* subject grid */}
      <div className="relative z-10 w-full max-w-xl grid grid-cols-2 gap-3">
        {tiles.map((tile, i) => {
          const inner = (
            <>
              <span className="text-[10px] text-zinc-600 font-mono mb-4 block">{i + 1}</span>
              <h2 className="text-sm font-medium mb-1 text-zinc-200">{tile.name}</h2>
              <p className="text-xs text-zinc-500 leading-relaxed">{tile.desc}</p>
              {!tile.href && (
                <span className="mt-3 inline-block text-[10px] text-zinc-700 font-mono">seed to unlock</span>
              )}
            </>
          )

          return tile.href ? (
            <Link
              key={tile.slug}
              href={tile.href}
              className="p-5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.14] transition-all duration-200"
            >
              {inner}
            </Link>
          ) : (
            <div
              key={tile.slug}
              className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.04] opacity-40 cursor-default"
            >
              {inner}
            </div>
          )
        })}
      </div>

      <p className="relative z-10 mt-8 text-[11px] text-zinc-700 tracking-widest uppercase">
        press 1–4 for quick access
      </p>
    </div>
  )
}
