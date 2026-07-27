import { ZodError } from "zod"

export function notFoundHandler(_request, response) {
  response.status(404).json({ success: false, message: "Route not found." })
}

export function errorHandler(error, _request, response, _next) {
  if (error instanceof ZodError) {
    return response.status(400).json({
      success: false,
      message: error.issues[0]?.message || "Invalid request.",
      errors: error.issues,
    })
  }
  console.error(error)
  return response.status(500).json({ success: false, message: "Internal server error." })
}
