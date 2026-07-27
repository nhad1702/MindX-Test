import { useSnippet } from "../hooks/useSnippet"

export function StatusMessage() {
  const { notice } = useSnippet()
  return (
    <div className={`notice ${notice.type}`} role="status" aria-live="polite">
      {notice.text || "Code của bạn được lưu dưới dạng văn bản và không được thực thi."}
    </div>
  )
}
