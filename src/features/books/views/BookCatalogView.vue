<template>
  <CatalogLayout>
    <AsyncState
      :is-loading="query.isLoading.value"
      :has-data="books.length > 0"
      :error-message="query.isError.value ? t.bookCatalog.errorLoadBooks : null"
      :empty-description="t.bookCatalog.noBooks"
      :retry-label="t.bookCatalog.retry"
      :loading-message="t.bookCatalog.loading"
      :loading-icon="Loading"
      :loading-icon-size="32"
      loading-wrapper-class="catalog__loading content-loader-wrap"
      @retry="query.refetch"
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { useLanguage } from '@/composables/useLanguage'
import { useI18n } from '@/i18n'
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
const query = useQuery({
  queryKey: ['books-catalog', CATALOG_BOOKS_LIMIT],
  queryFn: () => getBooks(CATALOG_BOOKS_LIMIT),
})
const books = computed<BookDto[]>(() => query.data.value ?? [])

function openBook(book: BookDto) {
  router.push({
    name: 'book-chapter',
    params: { id: String(book.id), sectionId: 'start' },
    query: navQuery(),
    state: { book: JSON.parse(JSON.stringify(book)) },
  })
}

</script>
