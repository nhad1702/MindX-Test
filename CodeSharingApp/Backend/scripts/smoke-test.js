import "dotenv/config"
import mongoose from "mongoose"
import { connectDatabase } from "../src/config/database.js"
import { createApp } from "../src/app.js"
import { Snippet } from "../src/models/Snippet.js"

let server
let createdId

try {
  await connectDatabase()
  server = createApp().listen(0)
  await new Promise((resolve) => server.once("listening", resolve))

  const baseUrl = `http://127.0.0.1:${server.address().port}`
  const input = {
    code: 'console.log("NoteCode e2e")',
    language: "javascript",
    theme: "dark",
  }

  const createResponse = await fetch(`${baseUrl}/api/snippets`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  })
  const created = await createResponse.json()

  if (createResponse.status !== 201) {
    throw new Error(`Create failed (${createResponse.status}): ${JSON.stringify(created)}`)
  }
  createdId = created.data.id

  const readResponse = await fetch(`${baseUrl}/api/snippets/${created.data.id}`)
  const read = await readResponse.json()

  if (!readResponse.ok) {
    throw new Error(`Read failed (${readResponse.status}): ${JSON.stringify(read)}`)
  }

  const dataMatched = read.data.code === input.code
    && read.data.language === input.language
    && read.data.theme === input.theme

  if (!dataMatched) throw new Error("Stored snippet does not match the input.")

  console.log(JSON.stringify({
    database: "connected",
    createStatus: createResponse.status,
    readStatus: readResponse.status,
    shareId: created.data.id,
    dataMatched,
  }, null, 2))
} finally {
  if (server) await new Promise((resolve) => server.close(resolve))
  if (createdId && mongoose.connection.readyState === 1) {
    await Snippet.deleteOne({ shareId: createdId })
  }
  await mongoose.disconnect()
}
