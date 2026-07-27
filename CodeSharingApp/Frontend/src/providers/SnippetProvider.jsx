import { useEffect, useMemo, useState } from "react"
import { getApiErrorMessage } from "../api/httpClient"
import { snippetApi } from "../api/snippetApi"
import { DEFAULT_CODE } from "../constants/editor"
import { SnippetContext } from "../context/SnippetContext"
import { createShareUrl, getSnippetIdFromLocation, navigateToSnippet } from "../utils/snippetUrl"

function toSnapshot({ code, language, theme }) {
  return JSON.stringify({ code, language, theme })
}

const INITIAL_ID = getSnippetIdFromLocation()

export function SnippetProvider({ children }) {
  const [editor, setEditor] = useState({ code: DEFAULT_CODE, language: "html", theme: "dark" })
  const [savedSnapshot, setSavedSnapshot] = useState(null)
  const [snippetId, setSnippetId] = useState("")
  const [loading, setLoading] = useState(Boolean(INITIAL_ID))
  const [sharing, setSharing] = useState(false)
  const [notice, setNotice] = useState({ type: "", text: "" })

  const snapshot = useMemo(() => toSnapshot(editor), [editor])
  const isDirty = snapshot !== savedSnapshot
  const shareUrl = snippetId ? createShareUrl(snippetId) : ""

  useEffect(() => {
    if (!INITIAL_ID) return undefined
    const controller = new AbortController()

    snippetApi.getById(INITIAL_ID, controller.signal)
      .then((snippet) => {
        const loadedEditor = {
          code: snippet.code,
          language: snippet.language,
          theme: snippet.theme,
        }
        setEditor(loadedEditor)
        setSnippetId(snippet.id)
        setSavedSnapshot(toSnapshot(loadedEditor))
      })
      .catch((error) => {
        if (error.name !== "CanceledError") {
          setNotice({
            type: "error",
            text: getApiErrorMessage(error, "Không thể mở snippet này."),
          })
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  function updateEditor(field, value) {
    setEditor((current) => ({ ...current, [field]: value }))
    setNotice({ type: "", text: "" })
  }

  async function copyShareLink(url = shareUrl) {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setNotice({ type: "success", text: "Đã sao chép liên kết vào clipboard." })
    } catch {
      setNotice({ type: "error", text: "Không thể tự động sao chép. Hãy sao chép URL bên dưới." })
    }
  }

  async function shareSnippet() {
    if (!isDirty || sharing || !editor.code.trim()) return
    setSharing(true)
    setNotice({ type: "", text: "" })

    try {
      const snippet = await snippetApi.create(editor)
      const createdUrl = createShareUrl(snippet.id)
      navigateToSnippet(snippet.id, { replace: true })
      setSnippetId(snippet.id)
      setSavedSnapshot(snapshot)
      await copyShareLink(createdUrl)
    } catch (error) {
      setNotice({
        type: "error",
        text: getApiErrorMessage(error, "Không thể chia sẻ lúc này."),
      })
    } finally {
      setSharing(false)
    }
  }

  function startNewSnippet() {
    navigateToSnippet("")
    setEditor({ code: DEFAULT_CODE, language: "html", theme: "dark" })
    setSavedSnapshot(null)
    setSnippetId("")
    setNotice({ type: "", text: "" })
  }

  const value = {
    ...editor,
    snippetId,
    loading,
    sharing,
    notice,
    isDirty,
    shareUrl,
    updateEditor,
    shareSnippet,
    copyShareLink,
    startNewSnippet,
  }

  return <SnippetContext.Provider value={value}>{children}</SnippetContext.Provider>
}
