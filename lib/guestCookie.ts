// Shared constant with no runtime deps so it's safe to import from both the
// edge middleware (proxy.ts) and server modules (lib/access.ts).
export const GUEST_COOKIE = "guest"
