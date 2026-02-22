import { API_BASE_URL } from '@/constants/api'
import { apiFetch } from '@/utils/apiFetch'
import type { SeriesDto } from '@/features/series/types'

function baseUrl(): string {
  return API_BASE_URL.replace(/\/$/, '')
}

function seriesApiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl()}/api/series${p}`
}

/**
 * List of series. Backend: GET /api/series/titles?limit=N
 */
export async function getLimitedSeries(limit: number): Promise<SeriesDto[]> {
  const res = await apiFetch(seriesApiUrl(`/titles?limit=${limit}`))
  if (!res.ok) throw new Error('Failed to load series')
  const data = await res.json()
  if (!Array.isArray(data)) return []
  return data.map((item: Record<string, unknown>) => ({
    titleId: Number(item.titleId ?? item.id ?? 0),
    name: String(item.name ?? ''),
    director: String(item.director ?? ''),
    year: Number(item.year ?? 0),
  }))
}

export { getEpisodesByTitleId } from '@/services/api'
export type { EpisodeListDto } from '@/types/movie'
