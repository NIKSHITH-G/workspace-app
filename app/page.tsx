import Link from "next/link"
import { db } from "@/lib/db"
import BackgroundBoxes from "@/components/Boxes"
import HomeKeyboard from "./HomeKeyboard"
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
    <div className="h-screen relative text-white flex items-center justify-center overflow-hidden">
      <BackgroundBoxes />

      <HomeKeyboard hrefs={tiles.map((t) => t.href)} />

      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/2 left-1/2 w-[700px] h-[700px]
          bg-purple-500/10 rounded-full blur-3xl
          -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="relative z-20 w-full max-w-2xl px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold tracking-tight">MODO</h1>
          <p className="text-zinc-500 text-sm mt-2">AI masters study</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {tiles.map((tile, i) => {
            const inner = (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-zinc-600 font-mono">{i + 1}</span>
                  {!tile.href && (
                    <span className="text-[10px] text-zinc-700 font-mono">seed to unlock</span>
                  )}
                </div>
                <h2 className="text-base font-medium mb-1">{tile.name}</h2>
                <p className="text-xs text-zinc-400">{tile.desc}</p>
              </>
            )

            return tile.href ? (
              <Link
                key={tile.slug}
                href={tile.href}
                className="
                  group p-5 rounded-2xl
                  bg-white/5 border border-white/10
                  hover:bg-white/10 hover:border-white/20
                  backdrop-blur-xl transition-all duration-300
                  hover:scale-[1.02] active:scale-[0.98]
                "
              >
                {inner}
              </Link>
            ) : (
              <div
                key={tile.slug}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 opacity-50 cursor-default"
              >
                {inner}
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-zinc-600 mt-8">Press 1–4 for quick access</p>
      </div>
    </div>
  )
}
