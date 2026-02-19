import { API_BASE_URL } from '@/constants/api'
import { apiFetch } from '@/utils/apiFetch'
import type { MovieDto, MovieContentDto, ContentBlockDto } from '@/features/movies/types'
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
  if (!res.ok) throw new Error('Не удалось загрузить фильмы')
  return res.json()
}

export async function getMovieContentById(id: number): Promise<MovieContentDto | null> {
  const res = await apiFetch(moviesApiUrl(`/movie-content/${id}`))
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Не удалось загрузить контент фильма')
  return res.json()
}

/** Преобразует ContentBlockDto в TranscriptBlock для EpisodeScript */
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
