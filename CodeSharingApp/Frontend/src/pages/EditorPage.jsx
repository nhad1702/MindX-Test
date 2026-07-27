import { AppHeader } from "../components/AppHeader"
import { CodeEditor } from "../components/CodeEditor"
import { HeroSection } from "../components/HeroSection"
import { ShareResult } from "../components/ShareResult"
import { StatusMessage } from "../components/StatusMessage"
import { useSnippet } from "../hooks/useSnippet"

export function EditorPage() {
  const { theme, loading } = useSnippet()

  if (loading) {
    return <main className="loading"><div className="loader" /><p>Đang mở snippet…</p></main>
  }

  return (
    <div className="app" data-theme={theme}>
      <AppHeader />
      <main className="workspace">
        <HeroSection />
        <CodeEditor />
        <ShareResult />
        <StatusMessage />
      </main>
    </div>
  )
}
