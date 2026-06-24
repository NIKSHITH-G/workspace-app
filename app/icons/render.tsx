import { ImageResponse } from "next/og"

// MODO app-icon — a friendly mascot: an "M" forms the ears/crown above a winking,
// smiling face. Drawn as SVG strokes with round caps (hand-drawn marker feel) in
// the indigo→violet brand gradient, over a soft glow on the dark, app-themed tile.
export function renderIcon(size: number) {
  const art = Math.round(size * 0.64)
  const glow = Math.round(size * 0.78)

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
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: Math.round(size * 0.22),
            background: "linear-gradient(150deg, #16161f 0%, #0a0a12 100%)",
            border: `${Math.max(1, Math.round(size * 0.008))}px solid rgba(129,140,248,0.18)`,
          }}
        >
          {/* soft brand glow behind the mascot */}
          <div
            style={{
              position: "absolute",
              width: glow,
              height: glow,
              borderRadius: glow,
              display: "flex",
              background:
                "radial-gradient(circle at 50% 50%, rgba(139,124,255,0.30) 0%, rgba(139,124,255,0) 62%)",
            }}
          />
          <svg width={art} height={art} viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#818cf8" />
                <stop offset="1" stopColor="#c084fc" />
              </linearGradient>
            </defs>
            <g stroke="url(#g)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
              {/* M = ears / crown */}
              <path d="M31 53 L29 23 L50 44 L71 23 L69 53" />
              {/* right winking eye */}
              <path d="M55 64 Q60 69 65 64" strokeWidth="6" />
              {/* smile */}
              <path d="M36 74 Q50 88 64 74" />
            </g>
            {/* left open eye — solid dot reads better at small sizes */}
            <circle cx="39" cy="64" r="4.4" fill="url(#g)" />
          </svg>
        </div>
      </div>
    ),
    { width: size, height: size },
  )
}
