<template>
  <div class="catalog">
    <PageSectionHeader
      :title="t.seriesCatalog.title"
      :subtitle="t.seriesCatalog.subtitle"
    />

    <el-main class="catalog__content">
      <AsyncState
        :is-loading="loading"
        :has-data="seriesList.length > 0"
        :error-message="error"
        :empty-description="t.seriesCatalog.noSeries"
        :retry-label="t.seriesCatalog.retry"
        :loading-message="t.seriesCatalog.loading"
        :loading-icon="Loading"
        :loading-icon-size="32"
        loading-wrapper-class="catalog__loading content-loader-wrap"
        @retry="loadSeries"
      >
        <CatalogPosterGrid
          :items="seriesList"
          :item-key="(s) => s.titleId"
          :section-title="t.seriesCatalog.sectionSeries"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="4"
          :gutter="24"
        >
          <template #item="{ item }">
            <SeriesPosterCard :series="item" @click="openSeries(item)" />
          </template>
        </CatalogPosterGrid>
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
import CatalogPosterGrid from '@/components/layout/CatalogPosterGrid.vue'
import { getLimitedSeries } from '@/features/series/api'
import type { SeriesDto } from '@/features/series/types'
import { CATALOG_SERIES_LIMIT } from '@/constants/defaults'
import SeriesPosterCard from '@/features/series/components/SeriesPosterCard.vue'

const router = useRouter()
const { navQuery } = useLanguage()
const { t } = useI18n()
const seriesList = ref<SeriesDto[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function loadSeries() {
  loading.value = true
  error.value = null
  try {
    seriesList.value = await getLimitedSeries(CATALOG_SERIES_LIMIT)
  } catch (e) {
    console.error(e)
    error.value = t.value.seriesCatalog.errorLoadSeries
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

function openSeries(series: SeriesDto) {
  router.push({
    name: 'series-content',
    params: { seriesId: String(series.titleId) },
    query: navQuery(),
    state: { series: JSON.parse(JSON.stringify(series)) },
  })
}

onMounted(loadSeries)
</script>
