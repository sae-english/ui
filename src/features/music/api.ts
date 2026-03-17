import { API_BASE_URL } from '@/constants/api'
import { apiFetch } from '@/utils/apiFetch'
import type { MusicTrackDto, MusicTrackFullDto, MusicContentBlockDto } from '@/features/music/types'
import type { TranscriptBlock } from '@/types/movie'

function baseUrl(): string {
  return API_BASE_URL.replace(/\/$/, '')
}

function musicApiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl()}/api/music${p}`
}

export async function getMusicTracks(limit: number): Promise<MusicTrackDto[]> {
  const res = await apiFetch(musicApiUrl(`/tracks?limit=${limit}`))
  if (!res.ok) throw new Error('Failed to load music tracks')
  const data = await res.json()
  if (!Array.isArray(data)) return []
  return data
}

export async function getMusicTrackById(id: number): Promise<MusicTrackFullDto | null> {
  const res = await apiFetch(musicApiUrl(`/tracks/${id}`))
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to load music track')
  return res.json()
}

/** Convert MusicContentBlockDto to TranscriptBlock for EpisodeScript (section + text) */
export function musicBlockToTranscriptBlock(b: MusicContentBlockDto): TranscriptBlock {
  const type = (b.type ?? 'text').toLowerCase()
  const id = b.id ?? undefined
  if (type === 'section') {
    return { type: 'section', title: b.title ?? '', id }
  }
  return { type: 'text', text: b.text ?? (b.title ?? ''), id }
}

