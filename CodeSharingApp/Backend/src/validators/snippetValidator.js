import { z } from "zod"

export const createSnippetSchema = z.object({
  code: z.string().min(1, "Code cannot be empty.").max(100_000, "Code is too large."),
  language: z.enum(["html", "css", "javascript", "typescript", "jsx", "python", "java", "rust", "c", "cpp"]),
  theme: z.enum(["light", "dark"]),
})

export const shareIdSchema = z.string().regex(/^[A-Za-z0-9_-]{10}$/, "Invalid snippet ID.")
