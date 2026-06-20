"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import "katex/dist/katex.min.css"

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeHighlight]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-lg font-semibold text-white mt-6 mb-2">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-semibold text-white mt-5 mb-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold text-zinc-200 mt-4 mb-1">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-sm text-zinc-300 leading-relaxed mb-3">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-1 mb-3 text-sm text-zinc-300">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1 mb-3 text-sm text-zinc-300">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
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
          <blockquote className="border-l-2 border-zinc-700 pl-4 text-zinc-400 italic mb-3">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="border-zinc-800 my-4" />,
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
