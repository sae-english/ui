import { API_BASE_URL } from '@/constants/api'

/**
 * fetch с заголовком для ngrok (пропуск страницы "Visit Site" на бесплатном плане).
 * Используй везде вместо fetch для запросов к API.
 */
export function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const headers = new Headers(init?.headers)
  if (API_BASE_URL) {
    headers.set('ngrok-skip-browser-warning', '1')
  }
  return fetch(input, { ...init, headers })
}
