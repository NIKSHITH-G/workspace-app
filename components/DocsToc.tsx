"use client"

import { useEffect, useState } from "react"

// Sticky table of contents that highlights the section currently in view.
export default function DocsToc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "")

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: "-15% 0px -75% 0px", threshold: 0 },
    )
    items.forEach((i) => {
      const el = document.getElementById(i.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [items])

  return (
    <ul className="space-y-0.5">
      {items.map((i) => {
        const on = active === i.id
        return (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              className={`block border-l-2 pl-3 py-1.5 text-sm transition-colors ${
                on ? "border-indigo-400 text-white" : "border-white/[0.06] text-zinc-500 hover:text-zinc-300 hover:border-white/20"
              }`}
            >
              {i.label}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
