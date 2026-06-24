"use client"

import { useEffect } from "react"

// Registers the PWA service worker after load (so it never competes with the
// initial render). Failures are swallowed — the app works fine without it.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return
    const register = () => navigator.serviceWorker.register("/sw.js").catch(() => {})
    if (document.readyState === "complete") register()
    else {
      window.addEventListener("load", register)
      return () => window.removeEventListener("load", register)
    }
  }, [])

  return null
}
