import { ImageResponse } from "next/og"
import { readFileSync } from "node:fs"
import { join } from "node:path"

// Baloo 2 — a rounded, friendly display face — bundled so the lettermark renders
// with real weight + smooth letterforms. Read at build time (icons are
// force-static), so there's no runtime/network dependency.
const baloo = readFileSync(join(process.cwd(), "app/fonts/Baloo2-Bold.ttf"))

// MODO app-icon — rounded "squircle" gradient tile with the wordmark laid out as
// a true 2×2 grid (fixed columns) so M sits over D and O sits over O.
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
            fontFamily: "Baloo",
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
      fonts: [{ name: "Baloo", data: baloo, weight: 800, style: "normal" }],
    },
  )
}
