// import.meta.env values are typed as unknown at runtime; we extract and coerce safely here.
const rawApiBase: unknown = import.meta.env['VITE_API_BASE_URL']
const rawRefreshMs: unknown = import.meta.env['VITE_REFRESH_INTERVAL_MS']

const apiBaseUrl: string =
  typeof rawApiBase === 'string' && rawApiBase.length > 0
    ? rawApiBase
    : 'http://localhost:5200'

const refreshIntervalMs: number =
  typeof rawRefreshMs === 'string' ? Number(rawRefreshMs) : 300_000

export const ENV = {
  apiBaseUrl,
  refreshIntervalMs,
} as const
