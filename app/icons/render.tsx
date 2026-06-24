import { ImageResponse } from "next/og"

// MODO app-icon art — a tilted flashcard (indigo→violet gradient) with a folded
// "dog-ear" corner and a bold "M", on a near-black tile. The card sits well
// inside the centre so it survives maskable (Android) + rounded (iOS) cropping.
export function renderIcon(size: number) {
  const cardW = Math.round(size * 0.58)
  const cardH = Math.round(size * 0.66)
  const fold = Math.round(size * 0.26)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #14141f 0%, #07070f 100%)",
        }}
      >
        {/* the flashcard */}
        <div
          style={{
            position: "relative",
            width: cardW,
            height: cardH,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: Math.round(size * 0.11),
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            boxShadow: `0 ${Math.round(size * 0.03)}px ${Math.round(size * 0.07)}px rgba(0,0,0,0.45)`,
            transform: "rotate(-7deg)",
            overflow: "hidden",
          }}
        >
          {/* folded dog-ear corner (top-right): a rotated square clipped by the
              card, with a darker shade reading as the underside of the fold */}
          <div
            style={{
              position: "absolute",
              top: -fold / 2,
              right: -fold / 2,
              width: fold,
              height: fold,
              transform: "rotate(45deg)",
              background: "rgba(8,8,20,0.32)",
            }}
          />
          {/* the M */}
          <div
            style={{
              fontSize: Math.round(size * 0.34),
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1,
            }}
          >
            M
          </div>
        </div>
      </div>
    ),
    { width: size, height: size },
  )
}
