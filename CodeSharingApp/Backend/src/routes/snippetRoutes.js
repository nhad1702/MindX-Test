import { Router } from "express"
import { getSnippet, postSnippet } from "../controllers/snippetController.js"

export const snippetRouter = Router()
snippetRouter.post("/", postSnippet)
snippetRouter.get("/:shareId", getSnippet)
