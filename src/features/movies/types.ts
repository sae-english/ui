/** Movie DTO from backend */
export interface MovieDto {
  movieId: number
  workId: number
  type: string
  name: string
  language: string
  director: string
  year: number
  description: string
}

/** Single script block from backend. type: section | action | scene | dialogue | transition */
export interface ContentBlockDto {
  type: string
  id?: string | null
  title?: string | null
  text?: string | null
  description?: string | null
  speaker?: string | null
  parenthetical?: string | null
}

/** Script credits from backend */
export interface CreditsDto {
  writtenBy?: string | null
  storyBy?: string | null
  directedBy?: string | null
  source?: string | null
  scriptDate?: string | null
}

/** One page of content (pagination). Pass nextCursor as after for the next page. */
export interface MovieContentPageDto {
  movieId: number
  contentKey?: string | null
  credits: CreditsDto
  note: string | null
  content: ContentBlockDto[]
  nextCursor: string | null
  hasMore: boolean
}
