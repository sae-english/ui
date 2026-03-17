import { API_BASE_URL } from '@/constants/api'
import { useLanguage } from '@/composables/useLanguage'

/**
 * fetch with header for ngrok (skip "Visit Site" page on free plan).
 * Use everywhere instead of fetch for API requests.
 */
export function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers)
  if (API_BASE_URL) {
    headers.set('ngrok-skip-browser-warning', '1')
  }

  // Attach current study language as Accept-Language header so backend can filter content.
  try {
    const { language } = useLanguage()
    const lang = language.value
    if (lang === 'en') {
      headers.set('Accept-Language', 'en')
    } else if (lang === 'hy') {
      headers.set('Accept-Language', 'hy')
    }
  } catch {
    // In non-setup or non-Vue context, silently skip language header.
  }

  return fetch(input, { ...init, headers })
}
