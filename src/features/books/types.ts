/** Book list item from backend */
export interface BookDto {
  id: number
  name: string
  contentKey: string
  author: string
  year: number
  description: string
}

/** Inline span for rich text (italic/bold). */
export interface BookContentSpanDto {
  text: string
  style?: 'italic' | 'bold' | 'italic-bold' | null
}

/** Single content block (section = chapter, text = paragraph) */
export interface BookContentBlockDto {
  type?: string | null
  id?: string | null
  title?: string | null
  text?: string | null
  level?: number | null
  firstInSection?: boolean | null
  spans?: BookContentSpanDto[] | null
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

/** One page of book content (cursor pagination). First page includes book metadata. */
export interface BookContentPageDto {
  bookId: number
  name: string
  contentKey: string
  author: string
  year: number
  description: string
  /** Lightweight table of contents for the whole book. Present only on the first page. */
  toc?: { id: string; title: string }[] | null
  content: BookContentBlockDto[]
  nextCursor: string | null
  hasMore: boolean
}

/** Single TOC item (chapter) derived from BookContentPageDto.toc */
export type BookTocItem = NonNullable<NonNullable<BookContentPageDto['toc']>>[number]
