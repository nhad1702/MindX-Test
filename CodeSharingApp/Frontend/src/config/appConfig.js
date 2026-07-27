const PRODUCTION_API_URL = "https://mindx-test-1.onrender.com/api"

export const appConfig = Object.freeze({
  apiBaseUrl: (
    import.meta.env.VITE_API_URL
    || (import.meta.env.PROD ? PRODUCTION_API_URL : "/api")
  ).replace(/\/$/, ""),
  apiTimeoutMs: 20_000,
  maxCodeLength: 100_000,
})
