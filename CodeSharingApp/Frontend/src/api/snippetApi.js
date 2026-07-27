import { httpClient } from "./httpClient"

export const snippetApi = {
  async getById(id, signal) {
    const response = await httpClient.get(`/snippets/${encodeURIComponent(id)}`, { signal })
    return response.data.data
  },

  async create(input) {
    const response = await httpClient.post("/snippets", input)
    return response.data.data
  },
}
