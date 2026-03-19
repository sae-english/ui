<template>
  <ContentPageFrame
    container-class="episode"
    header-class="episode__header"
    main-class="episode__main"
  >
    <template #header>
      <BackButton :label="t.episode.back" @click="goBack" />
    </template>

    <AsyncState
      :is-loading="query.isLoading.value"
      :has-data="!!transcript"
      :error-message="query.isError.value ? t.episode.notFound : null"
      :retry-label="t.episode.toHome"
      :empty-description="t.episode.notFound"
      :loading-message="t.episode.loadingEpisode"
      loading-wrapper-class="content-loader-wrap"
      @retry="goBack"
    >
      <el-main class="episode__content">
        <EpisodeHero :episode-id="transcript!.episodeId" :title="transcript!.title" />
        <PhraseAddButton :content-key="episodeContentKey" content-type="EPISODE">
          <EpisodeScript :blocks="transcript!.blocks" />
        </PhraseAddButton>
      </el-main>
    </AsyncState>
  </ContentPageFrame>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'
import BackButton from '@/components/ui/BackButton.vue'
import { useI18n } from '@/i18n'
import {
  getEpisodeById,
  toEpisodeTranscript,
  type EpisodeTranscript,
} from '@/services/api'
import AsyncState from '@/components/ui/AsyncState.vue'
import EpisodeHero from '@/components/script/EpisodeHero.vue'
import EpisodeScript from '@/components/script/EpisodeScript.vue'
import PhraseAddButton from '@/components/script/PhraseAddButton.vue'
import ContentPageFrame from '@/components/layout/ContentPageFrame.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const episodeId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? parseInt(id, 10) : Number(id)
})

const query = useQuery({
  queryKey: computed(() => ['episode', episodeId.value] as const),
  enabled: computed(() => Number.isFinite(episodeId.value) && episodeId.value > 0),
  queryFn: () => getEpisodeById(episodeId.value),
})

const transcript = computed<EpisodeTranscript | null>(() => {
  const dto = query.data.value
  return dto ? toEpisodeTranscript(dto) : null
})
const episodeContentKey = computed(() => query.data.value?.contentKey ?? null)

function goBack() {
  router.back()
}
</script>
