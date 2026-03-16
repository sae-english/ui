import { API_BASE_URL } from '@/constants/api'
import { DEFAULT_PAGE_SIZE } from '@/constants/defaults'
import { apiFetch } from '@/utils/apiFetch'
import type { BookDto, BookFullDto, BookContentBlockDto, BookContentPageDto } from '@/features/books/types'
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

/** First or next page of book content. after = block_id (nextCursor from previous response); omit for first page. */
export async function getBookContentPage(
  id: number,
  params?: { after?: string | null; limit?: number }
): Promise<BookContentPageDto | null> {
  const after = params?.after?.trim() || undefined
  const limit = params?.limit ?? DEFAULT_PAGE_SIZE
  const search = new URLSearchParams()
  if (after) search.set('after', after)
  search.set('limit', String(limit))
  const res = await apiFetch(booksApiUrl(`/${id}/pages?${search.toString()}`))
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to load book page')
  return res.json()
}

export async function getBookBookmark(id: number): Promise<string | null> {
  const res = await apiFetch(booksApiUrl(`/${id}/bookmark`))
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to load book bookmark')
  const data = await res.json()
  return typeof data?.blockId === 'string' ? data.blockId : null
}

export async function getBookBookmarkLocation(
  id: number,
): Promise<{ blockId: string; sectionId: string | null } | null> {
  const res = await apiFetch(booksApiUrl(`/${id}/bookmark/location`))
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to load book bookmark location')
  const data = await res.json()
  if (typeof data?.blockId !== 'string') return null
  return {
    blockId: data.blockId,
    sectionId: typeof data.sectionId === 'string' ? data.sectionId : null,
  }
}

export async function upsertBookBookmark(id: number, blockId: string): Promise<string | null> {
  const trimmed = blockId.trim()
  if (!trimmed) return null
  const res = await apiFetch(booksApiUrl(`/${id}/bookmark`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blockId: trimmed }),
  })
  if (!res.ok) throw new Error('Failed to save book bookmark')
  const data = await res.json()
  return typeof data?.blockId === 'string' ? data.blockId : null
}

/** Convert BookContentBlockDto to TranscriptBlock for EpisodeScript (section, dialogue, text) */
export function bookBlockToTranscriptBlock(b: BookContentBlockDto): TranscriptBlock {
  const type = (b.type ?? 'text').toLowerCase()
  const id = b.id ?? undefined
  if (type === 'section') {
    return { type: 'section', title: b.title ?? '', id }
  }
  if (type === 'dialogue') {
    return {
      type: 'dialogue',
      speaker: (b.title ?? '').trim() || '—',
      text: b.text ?? '',
      id,
    }
  }
  const spans =
    b.spans?.map((s) => ({
      text: s.text,
      style: s.style ?? null,
    })) ?? undefined

  return {
    type: 'text',
    text: b.text ?? (b.title ?? ''),
    id,
    spans,
    firstInSection: b.firstInSection ?? undefined,
  }
}
