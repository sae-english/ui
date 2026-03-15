/** Book list item from backend */
export interface BookDto {
  id: number
  name: string
  contentKey: string
  author: string
  year: number
  description: string
}

/** Single content block (section = chapter, text = paragraph) */
export interface BookContentBlockDto {
  type?: string | null
  id?: string | null
  title?: string | null
  text?: string | null
}

/** Full book with content for the content view */
export interface BookFullDto {
  id: number
  name: string
  contentKey: string
  author: string
  year: number
  description: string
  note: string | null
  content: BookContentBlockDto[]
}
