"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const LABELS = [
  { text: "MODO", lang: "en" },
  { text: "モード", lang: "ja" },
  { text: "모도", lang: "ko" },
  { text: "مودو", lang: "ar" },
  { text: "МОДО", lang: "ru" },
  { text: "मोडो", lang: "hi" },
  { text: "摩多", lang: "zh" },
  { text: "ΜΟΔΟ", lang: "el" },
  { text: "מודו", lang: "he" },
  { text: "โมโด", lang: "th" },
]

export default function ModoTitle() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % LABELS.length)
    }, 1800)
    return () => clearInterval(id)
  }, [])

  const current = LABELS[index]

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative h-[1.1em] overflow-hidden" style={{ fontSize: "clamp(5rem, 14vw, 10rem)" }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={current.text}
            lang={current.lang}
            initial={{ y: "60%", opacity: 0, filter: "blur(8px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-60%", opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center font-black tracking-tight leading-none text-white"
          >
            {current.text}
          </motion.span>
        </AnimatePresence>
      </div>
      <p className="text-zinc-500 text-sm tracking-[0.25em] uppercase mt-3 font-light">
        AI masters study
      </p>
    </div>
  )
}
