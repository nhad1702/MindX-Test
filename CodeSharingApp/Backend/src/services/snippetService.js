import { nanoid } from "nanoid"
import { Snippet } from "../models/Snippet.js"

export async function createSnippet(input) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await Snippet.create({ ...input, shareId: nanoid(10) })
    } catch (error) {
      if (error?.code !== 11000) throw error
    }
  }
  throw new Error("Could not generate a unique share ID.")
}

export function findSnippet(shareId) {
  return Snippet.findOne({ shareId }).lean()
}
