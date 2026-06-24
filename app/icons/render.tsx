import { ImageResponse } from "next/og"
import { readFileSync } from "node:fs"
import { join } from "node:path"

// Bundled bold font so the lettermark renders with real weight (Satori ignores
// fontWeight unless the weight is actually supplied). Read at build time (icons
// are force-static), so there's no runtime/network dependency.
const poppins = readFileSync(join(process.cwd(), "app/fonts/Poppins-ExtraBold.ttf"))

// MODO app-icon — the wordmark stacked "MO / DO" as a 2×2 lettermark on a
// full-bleed indigo→violet gradient (fills the tile, so it survives maskable +
// rounded cropping). Reads as MODO and stays legible down to favicon size.
export function renderIcon(size: number) {
  const f = Math.round(size * 0.32)
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(140deg, #6366f1 0%, #a855f7 100%)",
          color: "#ffffff",
          fontFamily: "Poppins",
          fontWeight: 800,
          letterSpacing: -Math.round(size * 0.006),
        }}
      >
        <div style={{ display: "flex", fontSize: f, lineHeight: 1, textShadow: "0 2px 12px rgba(0,0,0,0.22)" }}>MO</div>
        <div style={{ display: "flex", fontSize: f, lineHeight: 1, textShadow: "0 2px 12px rgba(0,0,0,0.22)" }}>DO</div>
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [{ name: "Poppins", data: poppins, weight: 800, style: "normal" }],
    },
  )
}
