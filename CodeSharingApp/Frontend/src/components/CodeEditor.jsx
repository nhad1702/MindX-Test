import { useMemo, useRef } from "react"
import { appConfig } from "../config/appConfig"
import { LANGUAGES, THEMES } from "../constants/editor"
import { useSnippet } from "../hooks/useSnippet"

export function CodeEditor() {
  const {
    code, language, theme, snippetId, sharing, isDirty,
    updateEditor, shareSnippet,
  } = useSnippet()
  const textareaRef = useRef(null)
  const lines = useMemo(() => code.split("\n"), [code])
  const codeSize = new Blob([code]).size

  function handleKeyDown(event) {
    if (event.key !== "Tab") return
    event.preventDefault()
    const start = event.currentTarget.selectionStart
    const end = event.currentTarget.selectionEnd
    updateEditor("code", `${code.slice(0, start)}  ${code.slice(end)}`)
    requestAnimationFrame(() => {
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
    })
  }

  return (
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
          maxLength={appConfig.maxCodeLength}
          spellCheck="false"
          autoCapitalize="off"
          autoCorrect="off"
          onKeyDown={handleKeyDown}
          onChange={(event) => updateEditor("code", event.target.value)}
        />
      </div>
      <footer className="editor-footer">
        <div className="selectors">
          <label><span>Ngôn ngữ</span>
            <select value={language} onChange={(event) => updateEditor("language", event.target.value)}>
              {LANGUAGES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          <label><span>Giao diện</span>
            <select value={theme} onChange={(event) => updateEditor("theme", event.target.value)}>
              {THEMES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
        </div>
        <div className="share-area">
          <span className="code-meta">{lines.length} dòng · {(codeSize / 1024).toFixed(1)} KB</span>
          <button
            className="share-button"
            type="button"
            disabled={!isDirty || sharing || !code.trim()}
            onClick={shareSnippet}
          >
            <span aria-hidden="true">↗</span>
            {sharing ? "Đang tạo link…" : isDirty ? "Chia sẻ snippet" : "Đã chia sẻ"}
          </button>
        </div>
      </footer>
    </section>
  )
}
