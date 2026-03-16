import { defineStore } from 'pinia'
import { getBookBookmarkLocation } from '@/features/books/api'

export interface BookBookmarkLocation {
  bookId: number
  blockId: string
  sectionId?: string | null
}

interface State {
  byBookId: Record<number, BookBookmarkLocation | undefined>
}

export const useBookBookmarkStore = defineStore('bookBookmark', {
  state: (): State => ({
    byBookId: {},
  }),
  actions: {
    async loadBookmark(bookId: number) {
      if (!bookId || Number.isNaN(bookId)) return
      if (this.byBookId[bookId]) return
      const loc = await getBookBookmarkLocation(bookId)
      if (!loc) return
      this.byBookId[bookId] = { bookId, ...loc }
    },
    setBookmark(bookId: number, blockId: string, sectionId?: string | null) {
      if (!bookId || Number.isNaN(bookId) || !blockId.trim()) return
      const existing = this.byBookId[bookId]
      this.byBookId[bookId] = {
        bookId,
        blockId: blockId.trim(),
        sectionId: sectionId ?? existing?.sectionId ?? null,
      }
    },
  },
})

