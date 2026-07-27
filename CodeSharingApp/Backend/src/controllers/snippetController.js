import { createSnippet, findSnippet } from "../services/snippetService.js"
import { createSnippetSchema, shareIdSchema } from "../validators/snippetValidator.js"

export async function postSnippet(request, response, next) {
  try {
    const input = createSnippetSchema.parse(request.body)
    const snippet = await createSnippet(input)
    response.status(201).json({
      success: true,
      data: { id: snippet.shareId, language: snippet.language, theme: snippet.theme, createdAt: snippet.createdAt },
    })
  } catch (error) {
    next(error)
  }
}

export async function getSnippet(request, response, next) {
  try {
    const shareId = shareIdSchema.parse(request.params.shareId)
    const snippet = await findSnippet(shareId)
    if (!snippet) {
      return response.status(404).json({ success: false, message: "Snippet not found." })
    }
    return response.json({
      success: true,
      data: { id: snippet.shareId, code: snippet.code, language: snippet.language, theme: snippet.theme, createdAt: snippet.createdAt },
    })
  } catch (error) {
    next(error)
  }
}
