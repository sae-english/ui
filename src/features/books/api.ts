import { API_BASE_URL } from '@/constants/api'
import { apiFetch } from '@/utils/apiFetch'
import type { BookDto, BookFullDto, BookContentBlockDto } from '@/features/books/types'
import type { TranscriptBlock } from '@/types/movie'

function baseUrl(): string {
  return API_BASE_URL.replace(/\/$/, '')
}

function booksApiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl()}/api/books${p}`
}

export async function getBooks(limit: number): Promise<BookDto[]> {
  const res = await apiFetch(booksApiUrl(`?limit=${limit}`))
  if (!res.ok) throw new Error('Failed to load books')
  const data = await res.json()
  if (!Array.isArray(data)) return []
  return data
}

export async function getBookById(id: number): Promise<BookFullDto | null> {
  const res = await apiFetch(booksApiUrl(`/${id}`))
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to load book')
  return res.json()
}

/** Convert BookContentBlockDto to TranscriptBlock for EpisodeScript (section + text) */
export function bookBlockToTranscriptBlock(b: BookContentBlockDto): TranscriptBlock {
  const type = (b.type ?? 'text').toLowerCase()
  const id = b.id ?? undefined
  if (type === 'section') {
    return { type: 'section', title: b.title ?? '', id }
  }
  return { type: 'text', text: b.text ?? (b.title ?? ''), id }
}
