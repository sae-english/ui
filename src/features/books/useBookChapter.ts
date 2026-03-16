import { computed, nextTick, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { ElMessage } from 'element-plus'
import { getBookContentPage, bookBlockToTranscriptBlock } from '@/features/books/api'
import type { BookContentBlockDto, BookContentPageDto, BookTocItem } from '@/features/books/types'
import type { TranscriptBlock } from '@/types/movie'
import { DEFAULT_PAGE_SIZE } from '@/constants/defaults'
import { useI18n } from '@/i18n'
import { useBookBookmarkStore } from '@/features/books/bookmarkStore'

type ChapterData = {
  meta: BookContentPageDto
  toc: BookTocItem[]
  blocks: BookContentBlockDto[]
}

export function useBookChapter() {
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const bookmarkStore = useBookBookmarkStore()

  const bookId = computed(() => {
    const p = route.params.id
    return typeof p === 'string' ? parseInt(p, 10) : Number(p)
  })

  const sectionId = computed(() => String(route.params.sectionId ?? ''))

  const query = useQuery<ChapterData>({
    queryKey: computed(() => ['book-chapter', bookId.value, sectionId.value] as const),
    enabled: computed(() => !!bookId.value && !isNaN(bookId.value) && !!sectionId.value),
    queryFn: async () => {
      const id = bookId.value
      let targetSection = sectionId.value
      let after: string | null = null
      let found = false
      const chapterBlocks: BookContentBlockDto[] = []
      let meta: BookContentPageDto | null = null
      let toc: BookTocItem[] = []

      // Идём по страницам, пока не соберём все блоки нужной главы
      // или не кончатся данные.
      for (let safety = 0; safety < 500; safety++) {
        const page = await getBookContentPage(id, {
          after: after ?? undefined,
          limit: DEFAULT_PAGE_SIZE,
        })
        if (!page) throw new Error('Book or page not found')

        if (!meta) {
          meta = page
          toc = (page.toc ?? []).filter((item) => item.id?.trim())

          // Если sectionId === 'start' или пустой — начинаем с первой секции книги (пролог или глава 1)
          if (!targetSection || targetSection === 'start') {
            const firstId = toc[0]?.id
            if (firstId) {
              targetSection = firstId
              if (sectionId.value !== firstId) {
                router.replace({
                  name: 'book-chapter',
                  params: { id, sectionId: firstId },
                  query: route.query,
                })
              }
            }
          }
        }

        const content = page.content ?? []
        for (const b of content) {
          const type = (b.type ?? 'text').toLowerCase()
          const isSection = type === 'section'
          if (!found) {
            if (isSection && b.id === targetSection) {
              found = true
              chapterBlocks.push(b)
            }
          } else {
            if (isSection && b.id !== targetSection) {
              return { meta, toc, blocks: chapterBlocks }
            }
            chapterBlocks.push(b)
          }
        }

        if (!page.hasMore) {
          return { meta, toc, blocks: chapterBlocks }
        }
        after = page.nextCursor ?? null
      }

      throw new Error('Chapter not found')
    },
  })

  const bookMeta = computed(() => query.data.value?.meta)
  const chapterBlocks = computed(() => query.data.value?.blocks ?? [])
  const sections = computed<BookTocItem[]>(() => query.data.value?.toc ?? [])

  const blocks = computed<TranscriptBlock[]>(() =>
    chapterBlocks.value.map((b) => bookBlockToTranscriptBlock(b)),
  )

  const currentSection = computed<BookTocItem | null>(() => {
    return sections.value.find((s) => s.id === sectionId.value) ?? null
  })

  const prevSection = computed<BookTocItem | null>(() => {
    const idx = sections.value.findIndex((s) => s.id === sectionId.value)
    if (idx <= 0) return null
    const candidate = sections.value[idx - 1]
    return candidate ?? null
  })

  const nextSection = computed<BookTocItem | null>(() => {
    const idx = sections.value.findIndex((s) => s.id === sectionId.value)
    if (idx < 0 || idx >= sections.value.length - 1) return null
    const candidate = sections.value[idx + 1]
    return candidate ?? null
  })

  const errorMessage = computed(
    () =>
      (query.error.value as Error | null)?.message ??
      t.value.bookContent.failedLoadContent,
  )

  const bookmark = computed(() => {
    const id = bookId.value
    if (!id || isNaN(id)) return null
    return bookmarkStore.byBookId[id] ?? null
  })

  onMounted(() => {
    const id = bookId.value
    if (id && !isNaN(id)) {
      bookmarkStore.loadBookmark(id).catch((err) => {
        console.error('Failed to load book bookmark', err)
      })
    }
  })

  // При смене главы поднимаем скролл к началу страницы
  watch(
    () => [sectionId.value, query.isSuccess.value, chapterBlocks.value.length, route.hash] as const,
    async ([sec, ok, len, hash]) => {
      if (!sec || !ok || !len) return
      await nextTick()
      const idFromHash = hash?.replace(/^#/, '')
      if (idFromHash) {
        const el = document.getElementById(idFromHash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  )

  watch(
    () => query.isError.value,
    (isErr) => {
      if (isErr) ElMessage.error(errorMessage.value)
    },
  )

  const goToSection = (id: string) => {
    router.push({
      name: 'book-chapter',
      params: { id: bookId.value, sectionId: id },
      query: route.query,
      hash: undefined,
    })
  }

  return {
    bookId,
    sectionId,
    query,
    bookMeta,
    chapterBlocks,
    sections,
    blocks,
    currentSection,
    prevSection,
    nextSection,
    errorMessage,
    bookmark,
    goToSection,
  }
}

