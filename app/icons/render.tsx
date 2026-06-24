import { ImageResponse } from "next/og"

// Shared MODO app-icon art — a full-bleed indigo→violet gradient with a bold "M",
// centred so it survives maskable (adaptive) cropping on Android and the rounded
// mask iOS applies. Full bleed (no transparency) keeps it crisp on every launcher.
export function renderIcon(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
          color: "#ffffff",
          fontSize: Math.round(size * 0.56),
          fontWeight: 900,
        }}
      >
        M
      </div>
    ),
    { width: size, height: size },
  )
}
