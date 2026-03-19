<template>
  <CatalogLayout>
    <AsyncState
      :is-loading="query.isLoading.value"
      :has-data="seriesList.length > 0"
      :error-message="query.isError.value ? t.seriesCatalog.errorLoadSeries : null"
      :empty-description="t.seriesCatalog.noSeries"
      :retry-label="t.seriesCatalog.retry"
      :loading-message="t.seriesCatalog.loading"
      :loading-icon="Loading"
      :loading-icon-size="32"
      loading-wrapper-class="catalog__loading content-loader-wrap"
      @retry="query.refetch"
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
import CatalogPosterGrid from '@/components/layout/CatalogPosterGrid.vue'
import CatalogLayout from '@/components/layout/CatalogLayout.vue'
import { getLimitedSeries } from '@/features/series/api'
import type { SeriesDto } from '@/features/series/types'
import { CATALOG_SERIES_LIMIT } from '@/constants/defaults'
import SeriesPosterCard from '@/features/series/components/SeriesPosterCard.vue'

const router = useRouter()
const { navQuery } = useLanguage()
const { t } = useI18n()
const query = useQuery({
  queryKey: ['series-catalog', CATALOG_SERIES_LIMIT],
  queryFn: () => getLimitedSeries(CATALOG_SERIES_LIMIT),
})
const seriesList = computed<SeriesDto[]>(() => query.data.value ?? [])

function openSeries(series: SeriesDto) {
  router.push({
    name: 'series-content',
    params: { seriesId: String(series.titleId) },
    query: navQuery(),
    state: { series: JSON.parse(JSON.stringify(series)) },
  })
}

</script>
