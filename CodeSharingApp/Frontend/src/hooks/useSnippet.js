import { useContext } from "react"
import { SnippetContext } from "../context/SnippetContext"

export function useSnippet() {
  const context = useContext(SnippetContext)
  if (!context) throw new Error("useSnippet must be used inside SnippetProvider.")
  return context
}
