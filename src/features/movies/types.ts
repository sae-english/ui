/** DTO фильма с бэка */
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

/** Один блок сценария с бэка. type: section | action | scene | dialogue | transition */
export interface ContentBlockDto {
  type: string
  id?: string | null
  title?: string | null
  text?: string | null
  description?: string | null
  speaker?: string | null
  parenthetical?: string | null
}

/** Кредиты сценария с бэка */
export interface CreditsDto {
  writtenBy?: string | null
  storyBy?: string | null
  directedBy?: string | null
  source?: string | null
  scriptDate?: string | null
}

export interface MovieContentDto {
  id: number
  movieId: number
  contentKey?: string | null
  content: ContentBlockDto[]
  credits: CreditsDto
  note: string | null
}
