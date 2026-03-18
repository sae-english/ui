<template>
  <el-container class="music-content" direction="vertical">
    <el-header class="music-content__header" height="auto">
      <div class="music-content__header-inner">
        <BackButton :label="t.musicContent.backToMusic" @click="goBack" />
      </div>
    </el-header>

    <el-main class="music-content__main">
      <AsyncState
        :is-loading="query.isLoading.value"
        :has-data="!!track"
        :error-message="(query.isError.value || !track) ? errorMessage : null"
        :retry-label="t.musicCatalog.retry"
        :loading-message="t.musicContent.loadingTrack"
        loading-wrapper-class="content-loader-wrap"
        @retry="goBack"
      >
        <div class="music-content__content">
          <div class="music-content__hero">
            <h1 class="music-content__title">{{ track!.name }}</h1>
            <p class="music-content__meta">
              <span v-if="track!.performer">{{ track!.performer }}</span>
              <span v-if="track!.year">· {{ track!.year }}</span>
            </p>
            <p v-if="track!.description" class="music-content__desc">
              {{ track!.description }}
            </p>
          </div>

          <PhraseAddButton :content-key="track!.contentKey" content-type="ALBUM">
            <EpisodeScript :blocks="blocks" :highlight-quotes="true" />
          </PhraseAddButton>
        </div>
      </AsyncState>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { ElContainer, ElHeader, ElMain } from 'element-plus'
import BackButton from '@/components/ui/BackButton.vue'
import EpisodeScript from '@/components/script/EpisodeScript.vue'
import PhraseAddButton from '@/components/script/PhraseAddButton.vue'
import { getMusicTrackById, musicBlockToTranscriptBlock } from '@/features/music/api'
import type { TranscriptBlock } from '@/types/movie'
import { useI18n } from '@/i18n'
import AsyncState from '@/components/ui/AsyncState.vue'

const { t } = useI18n()
const route = useRoute()

const id = computed(() => {
  const p = route.params.id
  return typeof p === 'string' ? parseInt(p, 10) : Number(p)
})

const query = useQuery({
  queryKey: computed(() => ['music-track', id.value] as const),
  enabled: computed(() => !!id.value && !isNaN(id.value)),
  queryFn: async () => {
    const track = await getMusicTrackById(id.value)
    if (!track) throw new Error('Track not found')
    return track
  },
})

const track = computed(() => query.data.value ?? null)

const blocks = computed<TranscriptBlock[]>(() => {
  const content = track.value?.content ?? []
  return content.map(musicBlockToTranscriptBlock)
})

const errorMessage = computed(
  () =>
    (query.error.value as Error | null)?.message ??
    t.value.musicContent.failedLoadTrack,
)

function goBack() {
  window.history.length > 1
    ? window.history.back()
    : (location.href = `${location.origin}${location.pathname}#/music`)
}
</script>

<style scoped>
.music-content {
  min-height: 100vh;
  padding: 24px 20px;
  padding-bottom: 56px;
  background:
    radial-gradient(ellipse 120% 80% at 50% -20%, rgba(31, 41, 55, 0.6) 0, transparent 50%),
    radial-gradient(ellipse 100% 60% at 50% 120%, rgba(21, 26, 34, 0.5) 0, transparent 50%),
    var(--fe-bg-base);
  color: var(--fe-text-primary);
  font-family: var(--fe-font-body);
  font-size: 1rem;
  line-height: 1.7;
}

.music-content__header {
  padding: 0 !important;
  height: auto !important;
  margin-bottom: 24px;
}

.music-content__header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.music-content__main {
  padding: 0 !important;
}

.music-content__content {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 !important;
}

.music-content__hero {
  margin-bottom: 1.5rem;
}

.music-content__title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--fe-text-primary);
}

.music-content__meta {
  color: var(--el-text-color-secondary);
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  color: var(--el-text-color-secondary);
}

.music-content__desc {
  font-size: 0.9rem;
  color: var(--el-text-color-regular);
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 600px) {
  .music-content {
    padding: 16px 12px;
    padding-bottom: 52px;
  }

  .music-content__header {
    margin-bottom: 16px;
  }

  .music-content__content {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .music-content {
    padding: 14px 12px;
    padding-bottom: 52px;
  }

  .music-content__header {
    margin-bottom: 14px;
  }
}
</style>

