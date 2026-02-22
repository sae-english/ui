<template>
  <el-container class="series-content" direction="vertical">
    <el-header class="series-content__header" height="auto">
      <BackButton :label="t.seriesContent.backToSeries" @click="goBack" />
    </el-header>

    <el-main class="series-content__main">
      <div v-if="loading" class="content-loader-wrap">
        <ContentLoader :message="t.seriesContent.loadingEpisodes" />
      </div>

      <el-empty v-else-if="error" :description="error">
        <el-button type="primary" @click="loadEpisodes">{{ t.seriesCatalog.retry }}</el-button>
      </el-empty>

      <template v-else-if="episodes.length > 0">
        <section class="series-content__section">
          <h1 class="series-content__title">{{ seriesName }}</h1>
          <ul class="series-content__episode-list">
            <li
              v-for="ep in episodes"
              :key="ep.id"
              class="series-content__episode-item"
            >
              <router-link
                :to="{ name: 'episode', params: { id: String(ep.id) }, query: navQuery() }"
                class="series-content__episode-link"
              >
                <span class="series-content__episode-num">
                  {{ t.seriesContent.episodeLabel }} {{ ep.season != null ? `S${ep.season} ` : '' }}#{{ ep.episodeNumber }}
                </span>
                <span class="series-content__episode-title">{{ ep.episodeTitle }}</span>
              </router-link>
            </li>
          </ul>
        </section>
      </template>

      <el-empty v-else :description="t.seriesContent.noEpisodes" />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import BackButton from '@/components/ui/BackButton.vue'
import ContentLoader from '@/components/ui/ContentLoader.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useI18n } from '@/i18n'
import { getEpisodesByTitleId } from '@/features/series/api'
import type { EpisodeListDto } from '@/types/movie'

const route = useRoute()
const router = useRouter()
const { navQuery } = useLanguage()
const { t } = useI18n()

const seriesId = computed(() => {
  const id = route.params.seriesId
  return typeof id === 'string' ? parseInt(id, 10) : Number(id)
})

const seriesName = computed(() => {
  const state = (route as unknown as { state?: { series?: { name: string } } }).state
  return state?.series?.name ?? ''
})

const episodes = ref<EpisodeListDto[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function loadEpisodes() {
  const id = seriesId.value
  if (!id || isNaN(id)) return
  loading.value = true
  error.value = null
  try {
    episodes.value = await getEpisodesByTitleId(id)
  } catch (e) {
    console.error(e)
    error.value = t.value.seriesContent.errorLoadEpisodes
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push({ name: 'series-catalog', query: navQuery() })
}

onMounted(loadEpisodes)
watch(seriesId, loadEpisodes)
</script>

<style scoped>
.series-content__section {
  max-width: 720px;
  margin: 0 auto;
}

.series-content__title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 20px;
  color: var(--el-text-color-primary);
}

.series-content__episode-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.series-content__episode-item {
  margin-bottom: 8px;
}

.series-content__episode-link {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);
  text-decoration: none;
  color: inherit;
  transition: background 0.2s, border-color 0.2s;
}

.series-content__episode-link:hover {
  background: var(--el-fill-color);
  border-color: var(--el-border-color);
}

.series-content__episode-num {
  font-size: 0.9rem;
  color: var(--el-text-color-secondary);
  flex-shrink: 0;
}

.series-content__episode-title {
  font-weight: 500;
  color: var(--el-text-color-primary);
}
</style>
