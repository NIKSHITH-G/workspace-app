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

export default function ModoTitle({ titleGradient = "from-white via-white/90 to-indigo-400/70" }: { titleGradient?: string }) {
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
      <div className="relative" style={{ height: "1.15em", fontSize: "clamp(5rem, 14vw, 10rem)" }}>
        <AnimatePresence mode="wait">
          <motion.h1
            key={current.text}
            lang={current.lang}
            initial={{ y: "40%", opacity: 0, filter: "blur(10px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-40%", opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`font-black tracking-tight leading-none whitespace-nowrap bg-gradient-to-br ${titleGradient} bg-clip-text text-transparent`}
            style={{ margin: 0 }}
          >
            {current.text}
          </motion.h1>
        </AnimatePresence>
      </div>
    </div>
  )
}
