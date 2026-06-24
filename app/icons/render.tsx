import { ImageResponse } from "next/og"
import { readFileSync } from "node:fs"
import { join } from "node:path"

// Sharp geometric font (Poppins ExtraBold), bundled so the lettermark renders
// with real weight. Read at build time (icons are force-static) — no runtime
// network dependency.
const poppins = readFileSync(join(process.cwd(), "app/fonts/Poppins-ExtraBold.ttf"))

// MODO app-icon — a DARK rounded "squircle" tile (matches the app's theme) with
// the wordmark laid out as a true 2×2 grid (M over D, O over O) in sharp letters
// filled with the indigo→violet brand gradient.
export function renderIcon(size: number) {
  const cell = Math.round(size * 0.28)
  const rowH = Math.round(size * 0.3)
  const f = Math.round(size * 0.34)

  const Letter = (ch: string) => (
    <div
      style={{
        display: "flex",
        width: cell,
        height: rowH,
        alignItems: "center",
        justifyContent: "center",
        fontSize: f,
        lineHeight: 1,
        backgroundImage: "linear-gradient(140deg, #818cf8 0%, #c084fc 100%)",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {ch}
    </div>
  )

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
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: Math.round(size * 0.22),
            background: "linear-gradient(150deg, #15151f 0%, #0a0a12 100%)",
            border: `${Math.max(1, Math.round(size * 0.008))}px solid rgba(129,140,248,0.18)`,
            fontFamily: "Poppins",
            fontWeight: 800,
          }}
        >
          <div style={{ display: "flex" }}>
            {Letter("M")}
            {Letter("O")}
          </div>
          <div style={{ display: "flex" }}>
            {Letter("D")}
            {Letter("O")}
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
