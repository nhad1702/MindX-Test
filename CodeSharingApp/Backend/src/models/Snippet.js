import mongoose from "mongoose"

const LANGUAGES = ["html", "css", "javascript", "typescript", "jsx", "python", "java", "rust", "c", "cpp"]

const snippetSchema = new mongoose.Schema({
  shareId: { type: String, required: true, unique: true, index: true },
  code: { type: String, required: true, maxlength: 100_000 },
  language: { type: String, required: true, enum: LANGUAGES },
  theme: { type: String, required: true, enum: ["light", "dark"] },
}, { timestamps: true, versionKey: false })

export const Snippet = mongoose.model("Snippet", snippetSchema)
