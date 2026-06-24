import { renderIcon } from "../render"

// 192×192 PWA icon (referenced by app/manifest.ts). Static — built once.
export const dynamic = "force-static"

export function GET() {
  return renderIcon(192)
}
