import axios from "axios"
import { appConfig } from "../config/appConfig"

export const httpClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: appConfig.apiTimeoutMs,
  headers: {
    "Content-Type": "application/json",
  },
})

export function getApiErrorMessage(error, fallbackMessage) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message
      || (error.code === "ECONNABORTED" ? "Máy chủ phản hồi quá chậm." : null)
      || fallbackMessage
  }
  return error instanceof Error ? error.message : fallbackMessage
}
