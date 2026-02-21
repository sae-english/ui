/**
 * API base URL.
 * In dev (npm run dev) — localhost:8080, in prod — backend via ngrok.
 */
export const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:8080'
  : 'https://plethoric-unabortively-porsha.ngrok-free.dev'
