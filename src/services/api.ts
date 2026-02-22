import { API_BASE_URL } from '@/constants/api'
import { apiFetch } from '@/utils/apiFetch'
import type {
  TitleDto,
  EpisodeListDto,
  EpisodeDto,
  EpisodeCredits,
  TranscriptBlock,
} from '@/types/movie'

function baseUrl(): string {
  return API_BASE_URL.replace(/\/$/, '')
}

function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl()}/api/movies${p}`
}

function dictionaryApiUrl(path: string): string {
  const p = path ? (path.startsWith('/') ? path : `/${path}`) : ''
  return `${baseUrl()}/api/dictionary${p}`
}

export type {
  TitleDto,
  EpisodeListDto,
  EpisodeDto,
  EpisodeCredits,
  TranscriptBlock,
}

export interface EpisodeTranscript {
  episodeId: string
  title: string
  credits: EpisodeCredits
  note?: string
  blocks: TranscriptBlock[]
}

/** Get list of episodes for a title */
export async function getEpisodesByTitleId(titleId: number): Promise<EpisodeListDto[]> {
  const res = await apiFetch(apiUrl(`/titles/${titleId}/episodes`))
  if (!res.ok) throw new Error('Failed to load episodes')
  return res.json()
}

/** Get episode with content by id */
export async function getEpisodeById(id: number): Promise<EpisodeDto> {
  const res = await apiFetch(apiUrl(`/episodes/${id}`))
  if (!res.ok) throw new Error('Episode not found')
  return res.json()
}

/** Convert EpisodeDto to EpisodeTranscript for EpisodeView */
export function toEpisodeTranscript(dto: EpisodeDto): EpisodeTranscript {
  const content = Array.isArray(dto.content) ? dto.content : []
  return {
    episodeId: String(dto.id),
    title: dto.episodeTitle,
    credits: dto.credits ?? {},
    note: dto.note ?? undefined,
    blocks: content as TranscriptBlock[],
  }
}

export type MessagePayload = {
  phrase: string
  translation: string
  comment?: string
}

export type SendMessageResult = { ok: boolean; message?: string }

export async function sendMessage(payload: MessagePayload): Promise<SendMessageResult> {
  const url = `${baseUrl()}/messages`
  const res = await apiFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phrase: payload.phrase?.trim() ?? '',
      translation: payload.translation?.trim() ?? '',
      comment: payload.comment?.trim() || undefined,
    }),
  })
  return res.json()
}

export type TranslateResult = { translation: string }

/** Content type for linking dictionary entry */
export type DictionaryContentType = 'MOVIE' | 'SERIES' | 'EPISODE' | 'BOOK' | 'ALBUM'

/** Dictionary entry DTO */
export interface DictionaryDto {
  id: number
  value: string
  translation: string
  comment: string | null
  contentKey: string | null
  contentType: DictionaryContentType | null
  blockId: string | null
  createdAt: string
  updatedAt: string
}

/** Content block from backend (same shape as in movie content pages). */
export interface ContentBlockDto {
  type?: string | null
  id?: string | null
  title?: string | null
  text?: string | null
  description?: string | null
  speaker?: string | null
  parenthetical?: string | null
}

/** Dictionary entry with expanded context: work title and content block. */
export interface ExpandedDictionaryDto {
  dictionary: DictionaryDto
  /** Movie/series title (work.name). */
  title: string | null
  /** Content block for block_id. */
  block: ContentBlockDto | null
}

export interface DictionaryRequestDto {
  value: string
  translation: string
  language?: string
  comment?: string
  contentKey?: string | null
  contentType?: DictionaryContentType | null
  blockId?: string | null
}

export async function getDictionaryEntries(): Promise<DictionaryDto[]> {
  const res = await apiFetch(dictionaryApiUrl(''))
  if (!res.ok) throw new Error('Failed to load dictionary')
  return res.json()
}

/** Search dictionary by value (case-insensitive contains). Returns expanded entries. GET /api/dictionary/search/expanded?q=... */
export async function searchDictionaryByValue(query: string): Promise<ExpandedDictionaryDto[]> {
  const q = query?.trim() ?? ''
  if (!q) return []
  const res = await apiFetch(dictionaryApiUrl(`/search/expanded?q=${encodeURIComponent(q)}`))
  if (!res.ok) throw new Error('Failed to search dictionary')
  const data = (await res.json()) as ExpandedDictionaryDto[]
  return Array.isArray(data) ? data : []
}

export async function saveDictionaryEntry(
  payload: DictionaryRequestDto,
): Promise<DictionaryDto> {
  const body: Record<string, unknown> = {
    value: payload.value?.trim() ?? '',
    translation: payload.translation?.trim() ?? '',
    language: payload.language ?? 'ENGLISH',
    comment: payload.comment?.trim() || null,
  }
  if (payload.contentKey != null) body.contentKey = payload.contentKey
  if (payload.contentType != null) body.contentType = payload.contentType
  if (payload.blockId != null) body.blockId = payload.blockId
  const res = await apiFetch(dictionaryApiUrl(''), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Failed to save')
  return res.json()
}

export async function deleteDictionaryEntry(id: number): Promise<void> {
  const res = await apiFetch(dictionaryApiUrl(`/${id}`), { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete')
}

export async function translate(text: string, target = 'ru'): Promise<TranslateResult> {
  const url = `${baseUrl()}/api/translate`
  const res = await apiFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text?.trim() ?? '', target }),
  })
  if (!res.ok) throw new Error('Failed to translate text')
  return res.json()
}
