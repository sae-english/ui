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

      <template v-else-if="chapterBlocks.length">
        <div class="book-content__content">
          <div class="book-content__hero">
            <h1 class="book-content__title">{{ bookMeta?.name }}</h1>
            <p class="book-content__meta">
              {{ bookMeta?.author }} · {{ bookMeta?.year }}
            </p>
            <p v-if="bookMeta?.description" class="book-content__desc">
              {{ bookMeta.description }}
            </p>

            <el-collapse v-if="sections.length" class="book-content__toc" accordion>
              <el-collapse-item :title="t.bookContent.tableOfContents" name="toc">
                <nav aria-label="Table of contents">
                  <ul class="book-content__toc-list">
                    <li
                      v-for="(s, i) in sections"
                      :key="s.id ?? s.title ?? i"
                      class="book-content__toc-item"
                    >
                      <RouterLink
                        v-if="s.id"
                        :to="{
                          name: 'book-chapter',
                          params: { id: bookId, sectionId: s.id },
                          query: route.query,
                        }"
                        class="book-content__toc-link"
                        :class="{ 'book-content__toc-link--active': s.id === sectionId }"
                      >
                        {{ s.title || s.id }}
                      </RouterLink>
                      <span v-else class="book-content__toc-plain">{{ s.title }}</span>
                    </li>
                  </ul>
                </nav>
              </el-collapse-item>
            </el-collapse>
          </div>

          <PhraseAddButton :content-key="bookMeta?.contentKey" content-type="BOOK">
            <EpisodeScript :blocks="blocks" :highlight-quotes="true" />
          </PhraseAddButton>

          <div
            v-if="currentSection"
            class="book-content__chapter-nav"
            :class="{
              'book-content__chapter-nav--only-prev': prevSection && !nextSection,
              'book-content__chapter-nav--only-next': nextSection && !prevSection,
              'book-content__chapter-nav--both': prevSection && nextSection,
            }"
          >
            <el-button
              v-if="prevSection"
              size="large"
              text
              @click="goToSection(prevSection.id!)"
            >
              ← {{ prevSection.title }}
            </el-button>

            <el-button
              v-if="nextSection"
              size="large"
              type="primary"
              @click="goToSection(nextSection.id!)"
            >
              {{ nextSection.title }} →
            </el-button>
          </div>
        </div>
      </template>

      <el-empty v-else :description="t.bookContent.contentNotFound" />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { ElCollapse, ElCollapseItem, ElMessage } from 'element-plus'
import BackButton from '@/components/ui/BackButton.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useI18n } from '@/i18n'
import { getBookContentPage, bookBlockToTranscriptBlock } from '@/features/books/api'
import type { BookContentBlockDto, BookContentPageDto } from '@/features/books/types'
import type { TranscriptBlock } from '@/types/movie'
import ContentLoader from '@/components/ui/ContentLoader.vue'
import EpisodeScript from '@/components/script/EpisodeScript.vue'
import PhraseAddButton from '@/components/script/PhraseAddButton.vue'
import { DEFAULT_PAGE_SIZE } from '@/constants/defaults'

const route = useRoute()
const router = useRouter()
const { navQuery } = useLanguage()
const { t } = useI18n()

const bookId = computed(() => {
  const p = route.params.id
  return typeof p === 'string' ? parseInt(p, 10) : Number(p)
})

const sectionId = computed(() => String(route.params.sectionId ?? ''))

type TocItem = { id?: string | null; title?: string | null }

type ChapterData = {
  meta: BookContentPageDto
  toc: TocItem[]
  blocks: BookContentBlockDto[]
}

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
    let toc: TocItem[] = []

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
        toc = (page.toc ?? []).map((item) => ({ id: item.id, title: item.title }))

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
const sections = computed<TocItem[]>(() => query.data.value?.toc ?? [])

const blocks = computed<TranscriptBlock[]>(() =>
  chapterBlocks.value.map((b) => bookBlockToTranscriptBlock(b)),
)

const currentSection = computed<TocItem | null | undefined>(() => {
  return sections.value.find((s) => s.id === sectionId.value) ?? null
})

const prevSection = computed<TocItem | null | undefined>(() => {
  const idx = sections.value.findIndex((s) => s.id === sectionId.value)
  if (idx > 0) return sections.value[idx - 1]
  return null
})

const nextSection = computed<TocItem | null | undefined>(() => {
  const idx = sections.value.findIndex((s) => s.id === sectionId.value)
  if (idx >= 0 && idx < sections.value.length - 1) return sections.value[idx + 1]
  return null
})

const errorMessage = computed(
  () =>
    (query.error.value as Error | null)?.message ??
    t.value.bookContent.failedLoadContent,
)

function goBack() {
  router.push({
    name: 'book-catalog',
    query: navQuery(),
  })
}

function goToSection(id: string) {
  router.push({
    name: 'book-chapter',
    params: { id: bookId.value, sectionId: id },
    query: route.query,
  })
}

query.isError.value &&
  ElMessage.error(errorMessage.value)

// При смене главы поднимаем скролл к началу страницы
watch(
  () => [sectionId.value, query.isSuccess.value, chapterBlocks.value.length] as const,
  async ([sec, ok, len]) => {
    if (!sec || !ok || !len) return
    await nextTick()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
)
</script>

<style scoped>
.book-content__chapter-nav {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

.book-content__chapter-nav--only-prev {
  justify-content: flex-start;
}

.book-content__chapter-nav--only-next {
  justify-content: flex-end;
}

.book-content__chapter-nav--both {
  justify-content: space-between;
}
</style>

