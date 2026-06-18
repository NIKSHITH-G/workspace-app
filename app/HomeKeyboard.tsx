"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomeKeyboard({ hrefs }: { hrefs: (string | null)[] }) {
  const router = useRouter()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const idx = parseInt(e.key, 10) - 1
      if (idx >= 0 && idx < hrefs.length && hrefs[idx]) {
        router.push(hrefs[idx]!)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [router, hrefs])

  return null
}
