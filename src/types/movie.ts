/**
 * Types matching server DTOs
 */

export type TitleType = 'MOVIE' | 'SERIES'

export interface TitleDto {
  id: number
  type: TitleType
  name: string
  director: string
  year: number
  description: string
}

export interface EpisodeListDto {
  id: number
  season: number | null
  episodeNumber: number
  episodeTitle: string
}

export interface EpisodeCredits {
  writtenBy?: string
  transcribedBy?: string
  additionalTranscribingBy?: string
  withMinorAdjustmentsBy?: string
  storyBy?: string
  directedBy?: string
  source?: string
  scriptDate?: string
}

export type TranscriptBlock =
  | { type: 'section'; title: string; id?: string }
  | { type: 'scene'; description: string; id?: string }
  | {
      type: 'dialogue'
      speaker: string
      parenthetical?: string
      text: string
      isUncut?: boolean
      id?: string
    }
  | { type: 'action'; text: string; isUncut?: boolean; id?: string }
  | { type: 'transition'; text: string; id?: string }

export interface EpisodeDto {
  id: number
  titleId: number
  titleName: string
  type: TitleType
  season: number | null
  episodeNumber: number
  episodeTitle: string
  contentKey?: string | null
  content: TranscriptBlock[]
  credits: EpisodeCredits
  note?: string
}
