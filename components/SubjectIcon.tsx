// Custom line-art subject icons (no emoji), keyed by subject slug. Monochrome,
// inherit color via `currentColor`. Unknown slugs fall back to a book glyph.

type Props = {
  slug: string
  size?: number
  className?: string
  style?: React.CSSProperties
}

const paths: Record<string, React.ReactNode> = {
  // Python for AI — a coiled snake
  python: (
    <>
      <path d="M16 4.5c-3 0-4 2-4 4s1.5 3 4 3 4 1.5 4 3.5-2 4.5-5.5 4.5c-4 0-7-2.5-7-6 0-2.5 1.5-3.5 1.5-3.5" />
      <path d="M9 19.5c1.6 0 2.5-1 2.5-2.2" />
      <circle cx="17.2" cy="6.2" r="0.7" fill="currentColor" />
      <path d="M19.5 5l1.5-.6M19.5 5l1.4.8" />
    </>
  ),
  // Database Systems — stacked cylinder
  database: (
    <>
      <ellipse cx="12" cy="6" rx="6.5" ry="2.5" />
      <path d="M5.5 6v12c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5V6" />
      <path d="M5.5 12c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5" />
    </>
  ),
  // Computer Architecture & Networks — a CPU chip with pins
  architecture: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <rect x="10.5" y="10.5" width="3" height="3" rx="0.5" />
      <path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3" />
    </>
  ),
  // Mathematical Foundations — axes + function curve
  maths: (
    <>
      <path d="M5 4v15h15" />
      <path d="M5 17C9 17 9 7 13 7s4 8 6 8" />
      <path d="M5 19l-1-2h2l-1 2M20 19l-2-1v2l2-1" fill="currentColor" stroke="none" />
    </>
  ),
}

function fallback() {
  return (
    <>
      <path d="M5 4.5h9a2 2 0 0 1 2 2V20H7a2 2 0 0 1-2-2V4.5Z" />
      <path d="M16 6.5h3V18a2 2 0 0 0-2 2" />
      <path d="M8 8.5h5M8 11.5h5" />
    </>
  )
}

export default function SubjectIcon({ slug, size = 24, className, style }: Props) {
  const icon = paths[slug] ?? fallback()
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden
    >
      {icon}
    </svg>
  )
}
