import Link from "next/link"
import { getUserTheme } from "@/lib/currentUser"

type Crumb = { label: string; href?: string }

/** Shared top bar for inner pages — themed MODO wordmark links home, plus breadcrumbs. */
export default async function TopNav({ crumbs = [] }: { crumbs?: Crumb[] }) {
  const theme = await getUserTheme()

  return (
    <nav className="sticky top-0 z-30 flex items-center gap-2.5 px-5 py-3 border-b border-white/[0.05] bg-[#080810]/85 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2 group" title="Home">
        <span
          className="font-black tracking-tight text-base leading-none transition-transform duration-200 group-hover:scale-105"
          style={{
            background: theme.titleGradientCss,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          MODO
        </span>
      </Link>

      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-2.5 text-xs min-w-0">
          <span className="text-zinc-700">/</span>
          {c.href ? (
            <Link href={c.href} className="text-zinc-500 hover:text-zinc-300 transition-colors truncate">
              {c.label}
            </Link>
          ) : (
            <span className="text-zinc-300 truncate">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
