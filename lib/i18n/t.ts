// Pure translation accessor — no "server-only", so the same code powers both
// server components (with a dict from getDictionary) and the client provider
// (with the dict passed down as a prop).

export type Vars = Record<string, string | number>
export type TFunc = (path: string, vars?: Vars) => string

/** Replace `{name}` tokens; unknown tokens are left intact. */
export function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  )
}

/** Resolve a dot-path ("settings.title") to a string, or undefined. */
function lookup(dict: unknown, path: string): string | undefined {
  let cur: unknown = dict
  for (const part of path.split(".")) {
    if (cur && typeof cur === "object" && part in (cur as object)) {
      cur = (cur as Record<string, unknown>)[part]
    } else {
      return undefined
    }
  }
  return typeof cur === "string" ? cur : undefined
}

/** Build a `t(path, vars?)` bound to a dictionary. Missing keys return the path. */
export function makeT(dict: unknown): TFunc {
  return (path, vars) => {
    const raw = lookup(dict, path)
    if (raw === undefined) return path
    return interpolate(raw, vars)
  }
}
