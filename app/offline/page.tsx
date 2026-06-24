import type { Metadata } from "next"

export const metadata: Metadata = { title: "Offline" }

// Branded fallback shown by the service worker when a navigation fails offline.
// Styles are INLINE on purpose: when truly offline the Tailwind CSS bundle may
// not be cached, so the page must look right with zero external dependencies.
export default function OfflinePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080810",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 16,
        padding: "0 24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ fontSize: 48 }} aria-hidden>
        📡
      </div>
      <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em", margin: 0 }}>
        You&apos;re offline
      </h1>
      <p style={{ fontSize: 14, color: "#a1a1aa", maxWidth: 280, lineHeight: 1.6, margin: 0 }}>
        MODO needs a connection to load new cards. Your progress is safe — reconnect and pick up right
        where you left off.
      </p>
      <a
        href="/"
        style={{
          marginTop: 8,
          fontSize: 14,
          padding: "8px 16px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.12)",
          color: "#d4d4d8",
          textDecoration: "none",
        }}
      >
        Try again
      </a>
    </div>
  )
}
