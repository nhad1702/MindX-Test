import { useSnippet } from "../hooks/useSnippet"

export function AppHeader() {
  const { isDirty, startNewSnippet } = useSnippet()

  return (
    <header className="topbar">
      <button className="brand" type="button" onClick={startNewSnippet} aria-label="Tạo snippet mới">
        <span className="logo-mark" aria-hidden="true">&lt;/&gt;</span>
        <span>NoteCode</span>
      </button>
      <div className="topbar-actions">
        <span className={`save-state ${isDirty ? "unsaved" : ""}`}>
          <i aria-hidden="true" />{isDirty ? "Chưa lưu" : "Đã lưu"}
        </span>
        <button className="new-button" type="button" onClick={startNewSnippet}>Snippet mới</button>
      </div>
    </header>
  )
}
