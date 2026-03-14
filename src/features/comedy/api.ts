import { API_BASE_URL } from '@/constants/api'
import { apiFetch } from '@/utils/apiFetch'
import type { ComedySpecialDto, ComedySpecialFullDto, ComedyContentBlockDto } from '@/features/comedy/types'
import type { TranscriptBlock } from '@/types/movie'

function baseUrl(): string {
  return API_BASE_URL.replace(/\/$/, '')
}

function comedyApiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl()}/api/comedy${p}`
}

export async function getComedySpecials(limit: number): Promise<ComedySpecialDto[]> {
  const res = await apiFetch(comedyApiUrl(`/specials?limit=${limit}`))
  if (!res.ok) throw new Error('Failed to load comedy specials')
  const data = await res.json()
  if (!Array.isArray(data)) return []
  return data
}

export async function getComedySpecialById(id: number): Promise<ComedySpecialFullDto | null> {
  const res = await apiFetch(comedyApiUrl(`/specials/${id}`))
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to load comedy special')
  return res.json()
}

/** Convert ComedyContentBlockDto to TranscriptBlock for EpisodeScript (section + text) */
export function comedyBlockToTranscriptBlock(b: ComedyContentBlockDto): TranscriptBlock {
  const type = (b.type ?? 'text').toLowerCase()
  const id = b.id ?? undefined
  if (type === 'section') {
    return { type: 'section', title: b.title ?? '', id }
  }
  return { type: 'text', text: b.text ?? (b.title ?? ''), id }
}
