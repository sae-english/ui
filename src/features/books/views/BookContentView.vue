<template>
  <el-container class="book-content" direction="vertical">
    <el-header class="book-content__header" height="auto">
      <BackButton :label="t.bookContent.backToBooks" @click="goBack" />
    </el-header>

    <el-main class="book-content__main">
      <div v-if="query.isLoading.value" class="content-loader-wrap">
        <ContentLoader :message="t.bookContent.loadingContent" />
      </div>

      <el-empty v-else-if="query.isError.value" :description="errorMessage">
        <el-button type="primary" @click="goBack">{{ t.bookCatalog.retry }}</el-button>
      </el-empty>

      <template v-else-if="hasLoadedOnce">
        <div class="book-content__content">
          <div class="book-content__hero">
            <h1 class="book-content__title">{{ firstPage?.name }}</h1>
            <p class="book-content__meta">{{ firstPage?.author }} · {{ firstPage?.year }}</p>
            <p v-if="firstPage?.description" class="book-content__desc">{{ firstPage.description }}</p>
            <el-collapse v-if="sections.length" class="book-content__toc" accordion>
              <el-collapse-item :title="t.bookContent.tableOfContents" name="toc">
                <nav aria-label="Table of contents">
                  <ul class="book-content__toc-list">
                    <li v-for="s in sections" :key="s.id || s.title" class="book-content__toc-item">
                      <a
                        v-if="s.id"
                        :href="'#' + s.id"
                        class="book-content__toc-link"
                        @click.prevent="scrollToSection(s.id)"
                      >{{ s.title || s.id }}</a>
                      <span v-else class="book-content__toc-plain">{{ s.title }}</span>
                    </li>
                  </ul>
                </nav>
              </el-collapse-item>
            </el-collapse>
          </div>
          <PhraseAddButton :content-key="contentKey" content-type="BOOK">
            <EpisodeScript :blocks="blocks" :highlight-quotes="true" />
          </PhraseAddButton>
        </div>

        <InfiniteScrollLoadMore
          :has-next-page="query.hasNextPage.value"
          :is-fetching-next-page="query.isFetchingNextPage.value"
          class="book-content__load-more"
          @load-more="query.fetchNextPage()"
        />
      </template>

      <el-empty v-else :description="t.bookContent.contentNotFound" />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { ElCollapse, ElCollapseItem, ElMessage } from 'element-plus'
import BackButton from '@/components/ui/BackButton.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useI18n } from '@/i18n'
import { getBookContentPage, bookBlockToTranscriptBlock } from '@/features/books/api'
import type { BookContentPageDto } from '@/features/books/types'
import type { TranscriptBlock } from '@/types/movie'
import ContentLoader from '@/components/ui/ContentLoader.vue'
import InfiniteScrollLoadMore from '@/components/ui/InfiniteScrollLoadMore.vue'
import EpisodeScript from '@/components/script/EpisodeScript.vue'
import PhraseAddButton from '@/components/script/PhraseAddButton.vue'
import { DEFAULT_PAGE_SIZE } from '@/constants/defaults'

const route = useRoute()
const router = useRouter()
const { navQuery } = useLanguage()
const { t } = useI18n()

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

/** Sections (chapters) for TOC — from first page toc (all chapters), so all chapters are visible immediately */
const sections = computed<TranscriptBlock[]>(() => {
  const toc = firstPage.value?.toc ?? []
  return toc
    .map(
      (item) =>
        ({
          type: 'section',
          id: item.id,
          title: item.title,
        } as TranscriptBlock)
    )
    .filter((b) => (b as { id?: string }).id?.trim())
})

const errorMessage = computed(
  () =>
    (query.error.value as Error | null)?.message ??
    t.value.bookContent.failedLoadContent
)

function scrollToSection(sectionId: string) {
  const tryScroll = () => {
    const el = document.getElementById(sectionId)
    if (!el) return false
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    router.replace({ ...route, hash: '#' + sectionId }).catch(() => {})
    return true
  }

  // Если блок уже загружен — просто скроллим.
  if (tryScroll()) return

  // Если нужная секция ещё не подгружена, пытаемся подгрузить страницы, пока она не появится
  const loadUntilFound = async () => {
    // Защита от бесконечного цикла: максимум N шагов (по количеству оставшихся страниц)
    let safety = 100
    while (safety-- > 0) {
      if (!query.hasNextPage.value) break
      await query.fetchNextPage()
      await nextTick()
      if (tryScroll()) break
    }
  }

  void loadUntilFound()
}

/** After first page loads, scroll to hash if present */
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

function goBack() {
  router.push({
    name: 'book-catalog',
    query: navQuery(),
  })
}
</script>
