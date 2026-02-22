<template>
  <div class="catalog">
    <PageSectionHeader
      :title="t.seriesCatalog.title"
      :subtitle="t.seriesCatalog.subtitle"
    />

    <el-main class="catalog__content">
      <div v-if="loading" class="catalog__loading content-loader-wrap">
        <ContentLoader :message="t.seriesCatalog.loading" :icon="Loading" :icon-size="32" />
      </div>

      <el-empty v-else-if="error" :description="error">
        <el-button type="primary" @click="loadSeries">{{ t.seriesCatalog.retry }}</el-button>
      </el-empty>

      <template v-else>
        <section v-if="seriesList.length" class="catalog__section">
          <h2 class="catalog__section-title">{{ t.seriesCatalog.sectionSeries }}</h2>
          <el-row :gutter="24" class="catalog__poster-list">
            <el-col
              v-for="series in seriesList"
              :key="series.titleId"
              :xs="12"
              :sm="8"
              :md="6"
              :lg="4"
              class="catalog__poster-item"
            >
              <SeriesPosterCard :series="series" @click="openSeries(series)" />
            </el-col>
          </el-row>
        </section>

        <el-empty v-else :description="t.seriesCatalog.noSeries" />
      </template>
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
import ContentLoader from '@/components/ui/ContentLoader.vue'
import PageSectionHeader from '@/components/layout/PageSectionHeader.vue'
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
