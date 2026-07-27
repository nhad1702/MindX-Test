import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SnippetProvider } from './providers/SnippetProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SnippetProvider>
      <App />
    </SnippetProvider>
  </StrictMode>,
)
