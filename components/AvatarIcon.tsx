// Custom line-art avatar icons (no emoji). Monochrome, inherit color via
// `currentColor`, sized via the `size` prop. Used wherever an avatar is shown.

type Props = {
  id: string
  size?: number
  className?: string
  style?: React.CSSProperties
}

const paths: Record<string, React.ReactNode> = {
  owl: (
    <>
      <path d="M6 4l2.5 3M18 4l-2.5 3" />
      <path d="M12 3.5c4 0 6.5 3 6.5 7.5 0 5-3 9-6.5 9s-6.5-4-6.5-9c0-4.5 2.5-7.5 6.5-7.5Z" />
      <circle cx="9.3" cy="10.5" r="2.1" />
      <circle cx="14.7" cy="10.5" r="2.1" />
      <circle cx="9.3" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="14.7" cy="10.5" r="0.5" fill="currentColor" />
      <path d="M12 13l-1 1.6h2L12 13Z" />
    </>
  ),
  fox: (
    <>
      <path d="M4 5l3.5 1.5M20 5l-3.5 1.5" />
      <path d="M4 5c1 4 2 5.5 4 7l4 4 4-4c2-1.5 3-3 4-7l-4 1.5c-1.4-.7-2.7-1-4-1s-2.6.3-4 1L4 5Z" />
      <path d="M10.5 11.5h3l-1.5 2-1.5-2Z" />
      <circle cx="9.5" cy="9.5" r="0.6" fill="currentColor" />
      <circle cx="14.5" cy="9.5" r="0.6" fill="currentColor" />
    </>
  ),
  wolf: (
    <>
      <path d="M4 4l3 4M20 4l-3 4" />
      <path d="M7 8C5.5 9.5 5 11 5 13c0 3.5 3 6.5 7 6.5s7-3 7-6.5c0-2-.5-3.5-2-5" />
      <path d="M7 8l5-1 5 1" />
      <path d="M10 14h4l-2 2.5L10 14Z" />
      <circle cx="9.5" cy="11" r="0.6" fill="currentColor" />
      <circle cx="14.5" cy="11" r="0.6" fill="currentColor" />
    </>
  ),
  dragon: (
    <>
      <path d="M5 14c0-4 3-7 7-7 2 0 3.5.8 4.5 2l3-2-1 3.5 1.5 1-2.5 1.5c-.3 3.3-2.7 5.5-5.5 5.5" />
      <path d="M5 14c-1 .5-2 .3-2.5-.5C3.5 13 4.3 13 5 13" />
      <circle cx="14" cy="11" r="0.7" fill="currentColor" />
      <path d="M9 19c-.5 1-1.5 1.5-3 1.5" />
    </>
  ),
  cat: (
    <>
      <path d="M6 4l1 4M18 4l-1 4" />
      <path d="M7 8C6 9.5 5.5 11 5.5 13c0 3.6 2.9 6.5 6.5 6.5s6.5-2.9 6.5-6.5c0-2-.5-3.5-1.5-5" />
      <path d="M6.5 6L7 8M17.5 6L17 8" />
      <circle cx="9.5" cy="12" r="0.6" fill="currentColor" />
      <circle cx="14.5" cy="12" r="0.6" fill="currentColor" />
      <path d="M12 14v1M12 15l-1 .7M12 15l1 .7" />
      <path d="M5 12.5l-2-.5M5 13.5l-2 .5M19 12.5l2-.5M19 13.5l2 .5" />
    </>
  ),
  robot: (
    <>
      <path d="M12 3v2" />
      <circle cx="12" cy="2.5" r="0.8" fill="currentColor" />
      <rect x="5" y="6" width="14" height="12" rx="2.5" />
      <rect x="8.5" y="10" width="2.5" height="2.5" rx="0.5" />
      <rect x="13" y="10" width="2.5" height="2.5" rx="0.5" />
      <path d="M9 15h6" />
      <path d="M3.5 10v4M20.5 10v4" />
    </>
  ),
}

export default function AvatarIcon({ id, size = 24, className, style }: Props) {
  const icon = paths[id] ?? paths.owl
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
