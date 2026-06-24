import { renderIcon } from "./icons/render"

// iOS home-screen icon (180×180). Next auto-links it as apple-touch-icon.
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return renderIcon(180)
}
