<template>
  <CatalogLayout :title="t.bookCatalog.title" :subtitle="t.bookCatalog.subtitle">
    <AsyncState
      :is-loading="loading"
      :has-data="books.length > 0"
      :error-message="error"
      :empty-description="t.bookCatalog.noBooks"
      :retry-label="t.bookCatalog.retry"
      :loading-message="t.bookCatalog.loading"
      :loading-icon="Loading"
      :loading-icon-size="32"
      loading-wrapper-class="catalog__loading content-loader-wrap"
      @retry="loadBooks"
    >
      <CatalogPosterGrid
        :items="books"
        :item-key="(b) => b.id"
        :section-title="t.bookCatalog.sectionBooks"
        :xs="12"
        :sm="8"
        :md="6"
        :lg="4"
        :gutter="24"
      >
        <template #item="{ item }">
          <BookCard :book="item" @click="openBook(item)" />
        </template>
      </CatalogPosterGrid>
    </AsyncState>
  </CatalogLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import { useI18n } from '@/i18n'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import AsyncState from '@/components/ui/AsyncState.vue'
import CatalogLayout from '@/components/layout/CatalogLayout.vue'
import CatalogPosterGrid from '@/components/layout/CatalogPosterGrid.vue'
import { getBooks } from '@/features/books/api'
import type { BookDto } from '@/features/books/types'
import { CATALOG_BOOKS_LIMIT } from '@/constants/defaults'
import BookCard from '@/features/books/components/BookCard.vue'

const router = useRouter()
const { navQuery } = useLanguage()
const { t } = useI18n()
const books = ref<BookDto[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function loadBooks() {
  loading.value = true
  error.value = null
  try {
    books.value = await getBooks(CATALOG_BOOKS_LIMIT)
  } catch (e) {
    console.error(e)
    error.value = t.value.bookCatalog.errorLoadBooks
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

function openBook(book: BookDto) {
  router.push({
    name: 'book-chapter',
    params: { id: String(book.id), sectionId: 'start' },
    query: navQuery(),
    state: { book: JSON.parse(JSON.stringify(book)) },
  })
}

onMounted(loadBooks)
</script>
