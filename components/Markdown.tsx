"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import "katex/dist/katex.min.css"

// Paragraphs that begin with one of these emoji render as a coloured callout card.
const CALLOUTS: { emoji: string; cls: string }[] = [
  { emoji: "💡", cls: "border-indigo-500/40 bg-indigo-500/[0.08]" }, // insight / intuition
  { emoji: "⚠️", cls: "border-amber-500/40 bg-amber-500/[0.08]" },  // gotcha / warning
  { emoji: "✅", cls: "border-emerald-500/40 bg-emerald-500/[0.08]" }, // example / correct
  { emoji: "🔑", cls: "border-fuchsia-500/40 bg-fuchsia-500/[0.08]" }, // key idea
  { emoji: "🎯", cls: "border-sky-500/40 bg-sky-500/[0.08]" },        // goal / takeaway
  { emoji: "📌", cls: "border-rose-500/40 bg-rose-500/[0.08]" },      // note
]

/** Recursively pull the leading text out of react-markdown children. */
function leadingText(node: React.ReactNode): string {
  if (typeof node === "string") return node
  if (typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.length ? leadingText(node[0]) : ""
  if (React.isValidElement(node)) {
    return leadingText((node.props as { children?: React.ReactNode }).children)
  }
  return ""
}

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeHighlight]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-lg font-bold text-white mt-6 mb-3 pb-2 border-b border-white/10">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-semibold text-white mt-6 mb-2 flex items-center gap-2 before:content-[''] before:w-1 before:h-4 before:rounded-full before:bg-[var(--theme-primary,#6366f1)]">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold text-zinc-100 mt-4 mb-1">{children}</h3>
        ),
        p: ({ children }) => {
          const lead = leadingText(children).trimStart()
          const callout = CALLOUTS.find((c) => lead.startsWith(c.emoji))
          if (callout) {
            return (
              <div className={`rounded-xl border px-4 py-2.5 mb-3 text-sm leading-relaxed text-zinc-100 ${callout.cls}`}>
                {children}
              </div>
            )
          }
          return <p className="text-sm text-zinc-300 leading-relaxed mb-3">{children}</p>
        },
        ul: ({ children }) => (
          <ul className="space-y-1.5 mb-3 text-sm text-zinc-300 marker:text-[var(--theme-primary,#6366f1)] list-disc pl-5">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="space-y-1.5 mb-3 text-sm text-zinc-300 marker:text-[var(--theme-primary,#6366f1)] marker:font-semibold list-decimal pl-5">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),
        em: ({ children }) => <em className="text-zinc-200 not-italic font-medium">{children}</em>,
        // ── tables ──
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4 rounded-xl border border-white/10">
            <table className="w-full text-sm border-collapse">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-white/[0.04]">{children}</thead>,
        th: ({ children }) => (
          <th className="text-left font-semibold text-zinc-100 px-3 py-2 border-b border-white/10">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 border-b border-white/[0.06] text-zinc-300 align-top">{children}</td>
        ),
        code: ({ className, children, ...props }) => {
          const isBlock = className?.includes("language-")
          if (isBlock) {
            return (
              <code className={`${className} text-xs`} {...props}>
                {children}
              </code>
            )
          }
          return (
            <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-xs font-mono" {...props}>
              {children}
            </code>
          )
        },
        pre: ({ children }) => (
          <pre className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto mb-4 text-xs leading-relaxed">
            {children}
          </pre>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-[var(--theme-primary,#6366f1)] pl-4 text-zinc-400 italic mb-3">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="border-white/10 my-5" />,
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
