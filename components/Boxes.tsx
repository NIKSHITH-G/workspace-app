"use client"

import { motion } from "framer-motion"
import React, { useMemo } from "react"
import { cn } from "@/lib/utils"

export interface BoxesProps {
  className?: string
  rows?: number
  cols?: number
}

const colors = [
  "rgb(125 211 252)", // sky-300
  "rgb(249 168 212)", // pink-300
  "rgb(134 239 172)", // green-300
  "rgb(253 224 71)", // yellow-300
  "rgb(252 165 165)", // red-300
  "rgb(216 180 254)", // purple-300
  "rgb(147 197 253)", // blue-300
  "rgb(165 180 252)", // indigo-300
  "rgb(196 181 253)", // violet-300
]

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]

const BoxCell = React.memo(({ showPlus }: { showPlus: boolean }) => (
  <motion.div
    className="relative h-8 w-16 border-r border-t border-slate-700"
    whileHover={{
      backgroundColor: getRandomColor(),
      transition: { duration: 0 },
    }}
    transition={{ duration: 2 }}
  >
    {showPlus && (
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -left-[22px] -top-[14px] h-6 w-10 text-slate-700"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 6v12m6-6H6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </motion.div>
))

BoxCell.displayName = "BoxCell"

const BoxRow = React.memo(({ rowIndex, cols }: { rowIndex: number; cols: number }) => (
  <div className="relative h-8 w-16 border-l border-slate-700">
    {Array.from({ length: cols }).map((_, colIndex) => (
      <BoxCell key={colIndex} showPlus={rowIndex % 2 === 0 && colIndex % 2 === 0} />
    ))}
  </div>
))

BoxRow.displayName = "BoxRow"

export const Boxes = ({ className, rows = 150, cols = 100 }: BoxesProps) => {
  const rowElements = useMemo(
    () =>
      Array.from({ length: rows }).map((_, rowIndex) => (
        <BoxRow key={rowIndex} rowIndex={rowIndex} cols={cols} />
      )),
    [rows, cols],
  )

  return (
    <div
      className={cn("pointer-events-auto absolute inset-0 z-0 flex", className)}
      style={{
        transform: "translate(-50%, -50%) skewX(-48deg) skewY(14deg) scale(0.675)",
        transformOrigin: "center center",
        top: "50%",
        left: "50%",
        width: "300vw",
        height: "300vh",
      }}
    >
      {rowElements}
    </div>
  )
}

export default function BackgroundBoxesDemo() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-900">
      <Boxes />
      <div className="pointer-events-none absolute inset-0 z-20 bg-slate-900 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
    </div>
  )
}
