function normalizeOrigin(origin) {
  return origin.trim().replace(/\/$/, "")
}

export function getAllowedOrigins() {
  const configuredOrigins = [
    process.env.CLIENT_URL,
    ...(process.env.CLIENT_URLS || "").split(","),
  ]
    .filter(Boolean)
    .map(normalizeOrigin)

  return new Set(configuredOrigins.length > 0
    ? configuredOrigins
    : ["http://localhost:5173"])
}

export function createCorsOptions() {
  const allowedOrigins = getAllowedOrigins()

  return {
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(normalizeOrigin(origin))) {
        callback(null, true)
        return
      }
      callback(null, false)
    },
  }
}
