"use client"

import Link from "next/link"

type Props = {
  href: string
  index: number
  name: string
  desc: string
  primaryHex: string
}

export default function SubjectTile({ href, index, name, desc, primaryHex }: Props) {
  return (
    <Link
      href={href}
      className="group p-5 rounded-2xl bg-white/[0.04] border transition-all duration-200 active:scale-[0.98]"
      style={{ borderColor: `${primaryHex}22` }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = `${primaryHex}55`
        el.style.background = `${primaryHex}0a`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = `${primaryHex}22`
        el.style.background = "rgba(255,255,255,0.04)"
      }}
    >
      <span className="text-[10px] text-zinc-600 font-mono">{index + 1}</span>
      <h2 className="text-sm font-semibold mt-3 mb-1 text-white">{name}</h2>
      <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
    </Link>
  )
}
