import { computed, nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { ElMessage } from 'element-plus'
import { getBookContentPage, bookBlockToTranscriptBlock } from '@/features/books/api'
import { useBookBookmarkStore } from '@/features/books/bookmarkStore'
import type { BookContentPageDto, BookTocItem } from '@/features/books/types'
import type { TranscriptBlock } from '@/types/movie'
import { DEFAULT_PAGE_SIZE } from '@/constants/defaults'
import { useI18n } from '@/i18n'

export function useBookContent() {
  const route = useRoute()
  const { t } = useI18n()
  const bookmarkStore = useBookBookmarkStore()

  const id = computed(() => {
    const p = route.params.id
    return typeof p === 'string' ? parseInt(p, 10) : Number(p)
  })

  const query = useInfiniteQuery({
    queryKey: computed(() => ['book-content', id.value] as const),
    queryFn: async ({ pageParam }) => {
      const bookId = id.value
      const page = await getBookContentPage(bookId, {
        after: pageParam ?? undefined,
        limit: DEFAULT_PAGE_SIZE,
      })
      if (!page) throw new Error('Book or page not found')
      return page
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: BookContentPageDto) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled: computed(() => {
      const bookId = id.value
      return !!bookId && !isNaN(bookId)
    }),
  })

  const blocks = computed<TranscriptBlock[]>(() => {
    const pages = query.data.value?.pages ?? []
    return pages.flatMap((p) => (p.content ?? []).map(bookBlockToTranscriptBlock))
  })

  const firstPage = computed(() => query.data.value?.pages?.[0])
  const contentKey = computed(() => firstPage.value?.contentKey ?? undefined)
  const hasLoadedOnce = computed(() => (query.data.value?.pages?.length ?? 0) > 0)

  const sections = computed<BookTocItem[]>(() => {
    const toc = firstPage.value?.toc ?? []
    return (toc ?? []).filter((item) => item.id?.trim())
  })

  const errorMessage = computed(
    () =>
      (query.error.value as Error | null)?.message ??
      t.value.bookContent.failedLoadContent
  )

  const bookmark = computed(() => {
    const bookId = id.value
    if (!bookId || isNaN(bookId)) return null
    return bookmarkStore.byBookId[bookId] ?? null
  })

  onMounted(() => {
    const bookId = id.value
    if (bookId && !isNaN(bookId)) {
      bookmarkStore.loadBookmark(bookId).catch((err) => {
        console.error('Failed to load book bookmark', err)
      })
    }
  })

  // После первой загрузки пытаемся проскроллить к hash, если он есть
  watch(
    () => [query.isSuccess.value, query.data.value?.pages?.length, route.hash] as const,
    ([success, pageCount, hash]) => {
      if (!success || !pageCount || !hash) return
      const idFromHash = hash.replace(/^#/, '')
      if (!idFromHash) return
      nextTick(() => {
        const el = document.getElementById(idFromHash)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  )

  watch(
    () => query.isError.value,
    (isErr) => {
      if (isErr) ElMessage.error(errorMessage.value)
    }
  )

  return {
    id,
    query,
    blocks,
    firstPage,
    contentKey,
    hasLoadedOnce,
    sections,
    errorMessage,
    bookmark,
  }
}

