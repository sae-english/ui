import { API_BASE_URL } from '@/constants/api'
import { DEFAULT_TRANSLATE_TARGET } from '@/constants/defaults'
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
  if (!path) return `${baseUrl()}/api/dictionary`
  // If path starts with query string, don't insert extra slash
  if (path.startsWith('?')) return `${baseUrl()}/api/dictionary${path}`
  const p = path.startsWith('/') ? path : `/${path}`
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
export type DictionaryContentType = 'MOVIE' | 'SERIES' | 'EPISODE' | 'BOOK' | 'ALBUM' | 'COMEDY'

/** Dictionary entry DTO */
export interface DictionaryDto {
  id: number
  value: string
  translation: string
  comments: string[] | null
  contentKey: string | null
  contentType: DictionaryContentType | null
  blockId: string | null
  createdAt: string
  updatedAt: string
}

export interface DictionaryPageDto {
  entries: DictionaryDto[]
  nextId: number | null
  hasMore: boolean
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
  comments?: string[]
  contentKey?: string | null
  contentType?: DictionaryContentType | null
  blockId?: string | null
}

export async function getDictionaryEntries(language?: string): Promise<DictionaryDto[]> {
  const search = language ? `?language=${encodeURIComponent(language)}` : ''
  const res = await apiFetch(dictionaryApiUrl(search))
  if (!res.ok) throw new Error('Failed to load dictionary')
  return res.json()
}

export async function getDictionaryPage(params: {
  language: string
  after?: number | null
  limit?: number
}): Promise<DictionaryPageDto> {
  const search = new URLSearchParams()
  search.set('language', params.language)
  if (params.after != null) search.set('after', String(params.after))
  if (params.limit != null) search.set('limit', String(params.limit))
  const res = await apiFetch(dictionaryApiUrl(`/pages?${search.toString()}`))
  if (!res.ok) throw new Error('Failed to load dictionary page')
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
  }
  if (payload.comments && payload.comments.length) {
    body.comments = payload.comments.map((c) => c?.trim()).filter((c) => !!c)
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

/**
 * Translate text via backend (Yandex when translate.provider=yandex, else MyMemory).
 * POST /api/translate with { text, target }. Returns { translation }.
 */
export async function translate(
  text: string,
  target: string = DEFAULT_TRANSLATE_TARGET,
): Promise<TranslateResult> {
  const url = `${baseUrl()}/api/translate`
  const res = await apiFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text?.trim() ?? '', target }),
  })
  if (!res.ok) throw new Error('Failed to translate text')
  return res.json()
}

// --- Settings (backend: app_setting table) ---

export type TelegramSendingSetting = { enabled: boolean; intervalMinutes: number }

export async function getTelegramSendingEnabled(): Promise<TelegramSendingSetting> {
  const res = await apiFetch(`${baseUrl()}/api/settings/telegram-sending`)
  if (!res.ok) throw new Error('Failed to load settings')
  return res.json()
}

export async function setTelegramSendingEnabled(enabled: boolean): Promise<TelegramSendingSetting> {
  const res = await apiFetch(`${baseUrl()}/api/settings/telegram-sending`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled }),
  })
  if (!res.ok) throw new Error('Failed to save settings')
  return res.json()
}

export async function setTelegramSendingIntervalMinutes(minutes: number): Promise<TelegramSendingSetting> {
  const res = await apiFetch(`${baseUrl()}/api/settings/telegram-sending`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intervalMinutes: minutes }),
  })
  if (!res.ok) throw new Error('Failed to save settings')
  return res.json()
}
