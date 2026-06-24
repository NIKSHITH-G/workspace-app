import { ImageResponse } from "next/og"
import { readFileSync } from "node:fs"
import { join } from "node:path"

// Bundled bold font so the lettermark renders with real weight (Satori ignores
// fontWeight unless the weight is actually supplied). Read at build time (icons
// are force-static), so there's no runtime/network dependency.
const poppins = readFileSync(join(process.cwd(), "app/fonts/Poppins-ExtraBold.ttf"))

// MODO app-icon — a rounded "squircle" gradient tile with the wordmark stacked
// MO / DO, centred. Rounded corners (not a hard square) + a soft shadow read as
// a real app icon; the dark backdrop shows through the rounded corners.
export function renderIcon(size: number) {
  const f = Math.round(size * 0.3)
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#07070f",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: Math.round(size * 0.22),
            background: "linear-gradient(140deg, #6366f1 0%, #a855f7 100%)",
            color: "#ffffff",
            fontFamily: "Poppins",
            fontWeight: 800,
            textShadow: "0 1px 4px rgba(0,0,0,0.16)",
          }}
        >
          {/* small rightward nudge: the round "O" carries right-side bearing, so
              the glyph block otherwise sits a few % left of true centre */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `translateX(${Math.round(size * 0.03)}px)` }}>
            <div style={{ display: "flex", fontSize: f, lineHeight: 0.98 }}>MO</div>
            <div style={{ display: "flex", fontSize: f, lineHeight: 0.98 }}>DO</div>
          </div>
        </div>
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [{ name: "Poppins", data: poppins, weight: 800, style: "normal" }],
    },
  )
}
