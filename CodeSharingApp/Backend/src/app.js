import cors from "cors"
import express from "express"
import rateLimit from "express-rate-limit"
import { snippetRouter } from "./routes/snippetRoutes.js"
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js"

export function createApp() {
  const app = express()
  const allowedOrigin = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "")

  app.disable("x-powered-by")
  app.use(cors({ origin: allowedOrigin, methods: ["GET", "POST"] }))
  app.use(express.json({ limit: "120kb" }))
  app.get("/api/health", (_request, response) => {
    response.json({ success: true, service: "notecode-api" })
  })
  app.use("/api/snippets", rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }), snippetRouter)
  app.use(notFoundHandler)
  app.use(errorHandler)
  return app
}
