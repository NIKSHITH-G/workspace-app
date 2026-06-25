"use client"

import { useEffect, useState } from "react"
import { subscribeToPush, unsubscribeFromPush } from "@/app/notifications/actions"

// Browsers want the VAPID public key as a Uint8Array.
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const raw = atob(base64)
  const out = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}

const VAPID = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

export default function NotificationToggle() {
  const [supported, setSupported] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [denied, setDenied] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !VAPID) return
    setSupported(true)
    if (Notification.permission === "denied") setDenied(true)
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setSubscribed(!!sub))
      .catch(() => {})
  }, [])

  async function enable() {
    setBusy(true)
    try {
      const perm = await Notification.requestPermission()
      if (perm !== "granted") {
        setDenied(perm === "denied")
        return
      }
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID!) as BufferSource,
      })
      const res = await subscribeToPush(JSON.parse(JSON.stringify(sub)))
      setSubscribed(res.ok)
    } catch {
      /* user dismissed or unsupported — leave as-is */
    } finally {
      setBusy(false)
    }
  }

  async function disable() {
    setBusy(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await unsubscribeFromPush(sub.endpoint)
        await sub.unsubscribe()
      }
      setSubscribed(false)
    } catch {
      /* ignore */
    } finally {
      setBusy(false)
    }
  }

  if (!supported) return null

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-100">Daily reminders</p>
        <p className="text-xs text-zinc-500 mt-0.5">
          {denied
            ? "Blocked in your browser settings — re-enable notifications for this site."
            : "Get a nudge when cards are due so you keep your streak."}
        </p>
      </div>
      <button
        onClick={subscribed ? disable : enable}
        disabled={busy || denied}
        className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-40 ${
          subscribed
            ? "border border-white/12 text-zinc-300 hover:border-white/30"
            : "text-white"
        }`}
        style={subscribed ? undefined : { background: "var(--theme-primary,#6366f1)" }}
      >
        {busy ? "…" : subscribed ? "Turn off" : "Turn on"}
      </button>
    </div>
  )
}
