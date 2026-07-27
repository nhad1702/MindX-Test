import { useEffect, useMemo, useRef, useState } from "react"
import "./App.css"

const DEFAULT_CODE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hello NoteCode</title>
  </head>
  <body>
    <h1>Build something worth sharing.</h1>
  </body>
</html>`

const LANGUAGES = [
  ["html", "HTML"], ["css", "CSS"], ["javascript", "JavaScript"],
  ["typescript", "TypeScript"], ["jsx", "JSX"], ["python", "Python"],
  ["java", "Java"], ["rust", "Rust"], ["c", "C"], ["cpp", "C++"],
]
const API_URL = import.meta.env.VITE_API_URL || "/api"
const INITIAL_ID = window.location.pathname.match(/^\/s\/([A-Za-z0-9_-]{10})\/?$/)?.[1]
  || new URLSearchParams(window.location.search).get("id")

async function requestSnippet(id, signal) {
  const response = await fetch(`${API_URL}/snippets/${encodeURIComponent(id)}`, { signal })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.message || "Không thể mở snippet này.")
  return payload.data
}

async function saveSnippet(input) {
  const response = await fetch(`${API_URL}/snippets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.message || "Không thể chia sẻ lúc này.")
  return payload.data
}

function App() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [language, setLanguage] = useState("html")
  const [theme, setTheme] = useState("dark")
  const [savedSnapshot, setSavedSnapshot] = useState(null)
  const [snippetId, setSnippetId] = useState("")
  const [loading, setLoading] = useState(Boolean(INITIAL_ID))
  const [sharing, setSharing] = useState(false)
  const [notice, setNotice] = useState({ type: "", text: "" })
  const textareaRef = useRef(null)

  const snapshot = useMemo(() => JSON.stringify({ code, language, theme }), [code, language, theme])
  const lines = useMemo(() => code.split("\n"), [code])
  const isDirty = snapshot !== savedSnapshot
  const codeSize = new Blob([code]).size
  const shareUrl = snippetId ? `${window.location.origin}/s/${snippetId}` : ""

  useEffect(() => {
    if (!INITIAL_ID) return undefined
    const controller = new AbortController()
    requestSnippet(INITIAL_ID, controller.signal)
      .then((snippet) => {
        setCode(snippet.code)
        setLanguage(snippet.language)
        setTheme(snippet.theme)
        setSnippetId(snippet.id)
        setSavedSnapshot(JSON.stringify({ code: snippet.code, language: snippet.language, theme: snippet.theme }))
      })
      .catch((error) => {
        if (error.name !== "AbortError") setNotice({ type: "error", text: error.message })
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  function handleKeyDown(event) {
    if (event.key !== "Tab") return
    event.preventDefault()
    const start = event.currentTarget.selectionStart
    const end = event.currentTarget.selectionEnd
    setCode(`${code.slice(0, start)}  ${code.slice(end)}`)
    requestAnimationFrame(() => {
      event.currentTarget.selectionStart = event.currentTarget.selectionEnd = start + 2
    })
  }

  async function handleShare() {
    if (!isDirty || sharing || !code.trim()) return
    setSharing(true)
    setNotice({ type: "", text: "" })
    try {
      const snippet = await saveSnippet({ code, language, theme })
      const createdShareUrl = `${window.location.origin}/s/${snippet.id}`
      window.history.replaceState({}, "", `/s/${snippet.id}`)
      setSnippetId(snippet.id)
      setSavedSnapshot(snapshot)
      try {
        await navigator.clipboard.writeText(createdShareUrl)
        setNotice({ type: "success", text: "Đã sao chép liên kết vào clipboard." })
      } catch {
        setNotice({ type: "success", text: createdShareUrl })
      }
    } catch (error) {
      setNotice({ type: "error", text: error.message })
    } finally {
      setSharing(false)
    }
  }

  async function copyShareLink() {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setNotice({ type: "success", text: "Đã sao chép liên kết vào clipboard." })
    } catch {
      setNotice({ type: "error", text: "Không thể tự động sao chép. Hãy chọn và sao chép URL bên dưới." })
    }
  }

  function startNewSnippet() {
    window.history.pushState({}, "", "/")
    setCode(DEFAULT_CODE)
    setLanguage("html")
    setTheme("dark")
    setSavedSnapshot(null)
    setSnippetId("")
    setNotice({ type: "", text: "" })
    requestAnimationFrame(() => textareaRef.current?.focus())
  }

  if (loading) return <main className="loading"><div className="loader" /><p>Đang mở snippet…</p></main>

  return (
    <div className="app" data-theme={theme}>
      <header className="topbar">
        <button className="brand" type="button" onClick={startNewSnippet} aria-label="Tạo snippet mới">
          <span className="logo-mark" aria-hidden="true">&lt;/&gt;</span><span>NoteCode</span>
        </button>
        <div className="topbar-actions">
          <span className={`save-state ${isDirty ? "unsaved" : ""}`}><i />{isDirty ? "Chưa lưu" : "Đã lưu"}</span>
          <button className="new-button" type="button" onClick={startNewSnippet}>Snippet mới</button>
        </div>
      </header>

      <main className="workspace">
        <section className="hero">
          <p className="eyebrow">CODE · SAVE · SHARE</p>
          <h1>Ý tưởng tốt xứng đáng<br />được chia sẻ.</h1>
          <p>Dán code, chọn ngôn ngữ và gửi một liên kết sạch — không cần đăng nhập.</p>
        </section>

        <section className="editor-shell" aria-label="Trình soạn thảo code">
          <div className="window-bar">
            <div className="window-dots" aria-hidden="true"><i /><i /><i /></div>
            <span className="file-name">snippet.{language}</span>
            <span className="snippet-label">{snippetId ? `ID ${snippetId}` : "Bản nháp mới"}</span>
          </div>
          <div className="editor">
            <div className="line-numbers" aria-hidden="true">
              {lines.map((_, index) => <span key={index}>{index + 1}</span>)}
            </div>
            <textarea
              ref={textareaRef}
              aria-label="Nội dung code"
              value={code}
              maxLength={100000}
              spellCheck="false"
              autoCapitalize="off"
              autoCorrect="off"
              onKeyDown={handleKeyDown}
              onChange={(event) => {
                setCode(event.target.value)
                setNotice({ type: "", text: "" })
              }}
            />
          </div>
          <footer className="editor-footer">
            <div className="selectors">
              <label><span>Ngôn ngữ</span>
                <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                  {LANGUAGES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label><span>Giao diện</span>
                <select value={theme} onChange={(event) => setTheme(event.target.value)}>
                  <option value="dark">Midnight</option><option value="light">Daylight</option>
                </select>
              </label>
            </div>
            <div className="share-area">
              <span className="code-meta">{lines.length} dòng · {(codeSize / 1024).toFixed(1)} KB</span>
              <button className="share-button" type="button" disabled={!isDirty || sharing || !code.trim()} onClick={handleShare}>
                <span aria-hidden="true">↗</span>
                {sharing ? "Đang tạo link…" : isDirty ? "Chia sẻ snippet" : "Đã chia sẻ"}
              </button>
            </div>
          </footer>
        </section>

        {shareUrl && (
          <section className="share-result" aria-labelledby="share-result-title">
            <div className="share-result-copy">
              <span className="share-result-icon" aria-hidden="true">↗</span>
              <div>
                <h2 id="share-result-title">{isDirty ? "Bản chia sẻ gần nhất" : "Snippet đã sẵn sàng"}</h2>
                <p>
                  {isDirty
                    ? "Bạn đang chỉnh sửa một bản mới. Liên kết này vẫn mở phiên bản đã lưu trước đó."
                    : "Bất kỳ ai có liên kết đều có thể mở và xem snippet này."}
                </p>
              </div>
            </div>
            <div className="share-link-row">
              <input
                aria-label="Liên kết chia sẻ snippet"
                value={shareUrl}
                readOnly
                onFocus={(event) => event.currentTarget.select()}
              />
              <button type="button" className="copy-button" onClick={copyShareLink}>Sao chép</button>
              <a className="open-button" href={shareUrl} target="_blank" rel="noreferrer">Mở liên kết</a>
            </div>
          </section>
        )}

        <div className={`notice ${notice.type}`} role="status" aria-live="polite">
          {notice.text || "Code của bạn được lưu dưới dạng văn bản và không được thực thi."}
        </div>
      </main>
    </div>
  )
}

export default App
