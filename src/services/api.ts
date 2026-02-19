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

/** Получить список фильмов и сериалов */
export async function getTitles(): Promise<TitleDto[]> {
  const res = await apiFetch(apiUrl('/titles'))
  if (!res.ok) throw new Error('Не удалось загрузить каталог')
  return res.json()
}

/** Получить список эпизодов для title */
export async function getEpisodesByTitleId(titleId: number): Promise<EpisodeListDto[]> {
  const res = await apiFetch(apiUrl(`/titles/${titleId}/episodes`))
  if (!res.ok) throw new Error(`Не удалось загрузить эпизоды`)
  return res.json()
}

/** Получить эпизод с контентом по id */
export async function getEpisodeById(id: number): Promise<EpisodeDto> {
  const res = await apiFetch(apiUrl(`/episodes/${id}`))
  if (!res.ok) throw new Error('Эпизод не найден')
  return res.json()
}

/** Преобразует EpisodeDto в EpisodeTranscript для совместимости с EpisodeView */
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

/** Тип контента для привязки записи словаря */
export type DictionaryContentType = 'MOVIE' | 'SERIES' | 'EPISODE' | 'BOOK' | 'ALBUM'

/** Словарь */
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
  if (!res.ok) throw new Error('Не удалось загрузить словарь')
  return res.json()
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
  if (!res.ok) throw new Error('Не удалось сохранить')
  return res.json()
}

export async function deleteDictionaryEntry(id: number): Promise<void> {
  const res = await apiFetch(dictionaryApiUrl(`/${id}`), { method: 'DELETE' })
  if (!res.ok) throw new Error('Не удалось удалить')
}

export async function translate(text: string): Promise<TranslateResult> {
  const url = `${baseUrl()}/translate`
  const res = await apiFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text?.trim() ?? '' }),
  })
  if (!res.ok) throw new Error('Не удалось перевести текст')
  return res.json()
}
