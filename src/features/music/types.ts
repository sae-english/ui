/** Music track list item from backend */
export interface MusicTrackDto {
  id: number
  name: string
  contentKey: string
  performer: string
  year: number
  description: string
}

/** Single content block (section or text/bridge/etc) */
export interface MusicContentBlockDto {
  type?: string | null
  id?: string | null
  title?: string | null
  text?: string | null
}

/** Full track with content for the content view */
export interface MusicTrackFullDto {
  id: number
  name: string
  contentKey: string
  performer: string
  year: number
  description: string
  note: string | null
  content: MusicContentBlockDto[]
}

