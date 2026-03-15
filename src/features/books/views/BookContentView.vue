<template>
  <el-container class="book-content" direction="vertical">
    <el-header class="book-content__header" height="auto">
      <BackButton :label="t.bookContent.backToBooks" @click="goBack" />
    </el-header>

    <el-main class="book-content__main">
      <div v-if="loading" class="content-loader-wrap">
        <ContentLoader :message="t.bookContent.loadingContent" />
      </div>

      <el-empty v-else-if="error" :description="error">
        <el-button type="primary" @click="goBack">{{ t.bookCatalog.retry }}</el-button>
      </el-empty>

      <template v-else-if="book">
        <div class="book-content__content">
          <div class="book-content__hero">
            <h1 class="book-content__title">{{ book.name }}</h1>
            <p class="book-content__meta">{{ book.author }} · {{ book.year }}</p>
            <p v-if="book.description" class="book-content__desc">{{ book.description }}</p>
            <nav v-if="sections.length" class="book-content__toc" aria-label="Table of contents">
              <h2 class="book-content__toc-title">{{ t.bookContent.tableOfContents }}</h2>
              <ul class="book-content__toc-list">
                <li v-for="(s, i) in sections" :key="s.id ?? s.title ?? i" class="book-content__toc-item">
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
          </div>
          <PhraseAddButton :content-key="book.contentKey" content-type="BOOK">
            <EpisodeScript :blocks="blocks" />
          </PhraseAddButton>
        </div>
      </template>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import BackButton from '@/components/ui/BackButton.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useI18n } from '@/i18n'
import { getBookById, bookBlockToTranscriptBlock } from '@/features/books/api'
import type { BookFullDto, BookContentBlockDto } from '@/features/books/types'
import type { TranscriptBlock } from '@/types/movie'
import ContentLoader from '@/components/ui/ContentLoader.vue'
import EpisodeScript from '@/components/script/EpisodeScript.vue'
import PhraseAddButton from '@/components/script/PhraseAddButton.vue'

const route = useRoute()
const router = useRouter()
const { navQuery } = useLanguage()
const { t } = useI18n()

const id = computed(() => {
  const p = route.params.id
  return typeof p === 'string' ? parseInt(p, 10) : Number(p)
})

const book = ref<BookFullDto | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const blocks = computed<TranscriptBlock[]>(() => {
  const b = book.value
  if (!b?.content?.length) return []
  return b.content.map(bookBlockToTranscriptBlock)
})

/** Sections (chapters) for table of contents — only blocks with type section and id */
const sections = computed<BookContentBlockDto[]>(() => {
  const b = book.value
  if (!b?.content?.length) return []
  return b.content.filter(
    (c) => (c.type ?? '').toLowerCase() === 'section' && (c.id ?? '').trim() !== ''
  ) as BookContentBlockDto[]
})

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    router.replace({ ...route, hash: '#' + sectionId }).catch(() => {})
  }
}

async function loadBook() {
  const bid = id.value
  if (!bid || isNaN(bid)) return
  loading.value = true
  error.value = null
  try {
    book.value = await getBookById(bid)
    if (!book.value) error.value = t.value.bookContent.contentNotFound
    else {
      await nextTick()
      const hash = route.hash.replace(/^#/, '')
      if (hash && document.getElementById(hash)) {
        document.getElementById(hash)!.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  } catch (e) {
    console.error(e)
    error.value = t.value.bookContent.failedLoadContent
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push({
    name: 'book-catalog',
    query: navQuery(),
  })
}

onMounted(loadBook)
watch(id, () => loadBook())
</script>
