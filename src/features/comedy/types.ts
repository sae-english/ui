/** Comedy special list item from backend */
export interface ComedySpecialDto {
  id: number
  name: string
  contentKey: string
  performer: string
  year: number
  description: string
}

/** Single content block (section or text) */
export interface ComedyContentBlockDto {
  type?: string | null
  id?: string | null
  title?: string | null
  text?: string | null
}

/** Full special with content for the content view */
export interface ComedySpecialFullDto {
  id: number
  name: string
  contentKey: string
  performer: string
  year: number
  description: string
  note: string | null
  content: ComedyContentBlockDto[]
}
