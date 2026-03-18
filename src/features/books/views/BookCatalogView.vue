<template>
  <div class="catalog">
    <PageSectionHeader
      :title="t.bookCatalog.title"
      :subtitle="t.bookCatalog.subtitle"
    />

    <el-main class="catalog__content">
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
        <section class="catalog__section">
          <h2 class="catalog__section-title">{{ t.bookCatalog.sectionBooks }}</h2>
          <el-row :gutter="24" class="catalog__poster-list">
            <el-col
              v-for="book in books"
              :key="book.id"
              :xs="12"
              :sm="8"
              :md="6"
              :lg="4"
              class="catalog__poster-item"
            >
              <BookCard :book="book" @click="openBook(book)" />
            </el-col>
          </el-row>
        </section>
      </AsyncState>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import { useI18n } from '@/i18n'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import AsyncState from '@/components/ui/AsyncState.vue'
import PageSectionHeader from '@/components/layout/PageSectionHeader.vue'
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
