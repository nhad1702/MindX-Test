import "dotenv/config"
import { connectDatabase } from "./src/config/database.js"
import { createApp } from "./src/app.js"

const port = Number(process.env.PORT) || 3001

async function startServer() {
  await connectDatabase()

  const app = createApp()
  app.listen(port, () => {
    console.log(`NoteCode API listening on http://localhost:${port}`)
  })
}

startServer()