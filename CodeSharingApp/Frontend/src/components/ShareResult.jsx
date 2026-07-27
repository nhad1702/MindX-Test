import { useSnippet } from "../hooks/useSnippet"

export function ShareResult() {
  const { shareUrl, isDirty, copyShareLink } = useSnippet()
  if (!shareUrl) return null

  return (
    <section className="share-result" aria-labelledby="share-result-title">
      <div className="share-result-copy">
        <span className="share-result-icon" aria-hidden="true">↗</span>
        <div>
          <h2 id="share-result-title">{isDirty ? "Bản chia sẻ gần nhất" : "Snippet đã sẵn sàng"}</h2>
          <p>{isDirty
            ? "Bạn đang chỉnh sửa một bản mới. Liên kết này vẫn mở phiên bản đã lưu trước đó."
            : "Bất kỳ ai có liên kết đều có thể mở và xem snippet này."}</p>
        </div>
      </div>
      <div className="share-link-row">
        <input
          aria-label="Liên kết chia sẻ snippet"
          value={shareUrl}
          readOnly
          onFocus={(event) => event.currentTarget.select()}
        />
        <button type="button" className="copy-button" onClick={() => copyShareLink()}>Sao chép</button>
        <a className="open-button" href={shareUrl} target="_blank" rel="noreferrer">Mở liên kết</a>
      </div>
    </section>
  )
}
