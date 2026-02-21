import { API_BASE_URL } from '@/constants/api'

/**
 * fetch with header for ngrok (skip "Visit Site" page on free plan).
 * Use everywhere instead of fetch for API requests.
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
