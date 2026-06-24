import type { MetadataRoute } from "next"

// Web app manifest — lets MODO be installed to a phone/desktop home screen and
// run standalone (no browser chrome). Next auto-injects <link rel="manifest">.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MODO — Master anything",
    short_name: "MODO",
    description: "Spaced-repetition flashcards to master any subject — at your own pace.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#080810",
    theme_color: "#080810",
    categories: ["education", "productivity"],
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
