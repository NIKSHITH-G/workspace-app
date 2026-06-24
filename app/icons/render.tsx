import { ImageResponse } from "next/og"

// MODO app-icon — a friendly mascot: an "M" forms the ears/crown above a winking,
// smiling face. Drawn as SVG strokes with round caps so it keeps a hand-drawn
// marker feel, in the indigo→violet brand gradient on the dark (app-themed) tile.
export function renderIcon(size: number) {
  const art = Math.round(size * 0.66)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: Math.round(size * 0.22),
            background: "linear-gradient(150deg, #15151f 0%, #0a0a12 100%)",
            border: `${Math.max(1, Math.round(size * 0.008))}px solid rgba(129,140,248,0.18)`,
          }}
        >
          <svg width={art} height={art} viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#818cf8" />
                <stop offset="1" stopColor="#c084fc" />
              </linearGradient>
            </defs>
            <g stroke="url(#g)" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round">
              {/* M = ears / crown */}
              <path d="M29 60 L27 28 L50 50 L73 28 L71 60" />
              {/* left open eye */}
              <circle cx="40" cy="72" r="4.5" strokeWidth="5.5" />
              {/* right winking eye */}
              <path d="M56 71 Q61 76 66 71" strokeWidth="5.5" />
              {/* smile */}
              <path d="M37 80 Q50 92 63 80" />
            </g>
          </svg>
        </div>
      </div>
    ),
    { width: size, height: size },
  )
}
