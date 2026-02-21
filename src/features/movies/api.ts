import { API_BASE_URL } from '@/constants/api'
import { DEFAULT_PAGE_SIZE } from '@/constants/defaults'
import { apiFetch } from '@/utils/apiFetch'
import type { MovieDto, MovieContentPageDto, ContentBlockDto } from '@/features/movies/types'
import type { TranscriptBlock } from '@/types/movie'

function baseUrl(): string {
  return API_BASE_URL.replace(/\/$/, '')
}

function moviesApiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl()}/api/movies${p}`
}

export async function getLimitedMovies(limit: number): Promise<MovieDto[]> {
  const res = await apiFetch(moviesApiUrl(`/titles?limit=${limit}`))
  if (!res.ok) throw new Error('Failed to load movies')
  return res.json()
}

/** First or next page of content. after = block_id from previous response nextCursor (empty for first). */
export async function getMovieContentPage(
  id: number,
  params?: { after?: string | null; limit?: number }
): Promise<MovieContentPageDto | null> {
  const after = params?.after?.trim() || undefined
  const limit = params?.limit ?? DEFAULT_PAGE_SIZE
  const search = new URLSearchParams()
  if (after) search.set('after', after)
  search.set('limit', String(limit))
  const res = await apiFetch(moviesApiUrl(`/movie-content/${id}/pages?${search.toString()}`))
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to load content page')
  return res.json()
}

/** Convert ContentBlockDto to TranscriptBlock for EpisodeScript */
export function contentBlockToTranscriptBlock(b: ContentBlockDto): TranscriptBlock {
  const type = b.type ?? 'action'
  const id = b.id ?? undefined
  switch (type) {
    case 'section':
      return { type: 'section', title: b.title ?? '', id }
    case 'scene':
      return { type: 'scene', description: b.description ?? '', id }
    case 'dialogue':
      return {
        type: 'dialogue',
        speaker: b.speaker ?? '',
        text: b.text ?? '',
        parenthetical: b.parenthetical ?? undefined,
        id,
      }
    case 'action':
      return { type: 'action', text: b.text ?? '', id }
    case 'transition':
      return { type: 'transition', text: b.text ?? '', id }
    default:
      return { type: 'action', text: b.text ?? String(b.title ?? b.description ?? ''), id }
  }
}
