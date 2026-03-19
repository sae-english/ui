<template>
  <ContentPageFrame
    container-class="comedy-content"
    header-class="comedy-content__header"
    main-class="comedy-content__main"
  >
    <template #header>
      <BackButton :label="t.comedyContent.backToComedy" @click="goBack" />
    </template>

    <AsyncState
      :is-loading="query.isLoading.value"
      :has-data="!!special"
      :error-message="query.isError.value ? t.comedyContent.failedLoadScript : null"
      :retry-label="t.comedyCatalog.retry"
      :empty-description="t.comedyContent.contentNotFound"
      :loading-message="t.comedyContent.loadingScript"
      loading-wrapper-class="content-loader-wrap"
      @retry="query.refetch"
    >
      <div class="comedy-content__content">
        <div class="comedy-content__hero">
          <h1 class="comedy-content__title">{{ special!.name }}</h1>
          <p class="comedy-content__meta">{{ special!.performer }} · {{ special!.year }}</p>
          <p v-if="special!.description" class="comedy-content__desc">{{ special!.description }}</p>
        </div>
        <PhraseAddButton :content-key="special!.contentKey" content-type="COMEDY">
          <EpisodeScript :blocks="blocks" />
        </PhraseAddButton>
      </div>
    </AsyncState>
  </ContentPageFrame>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import BackButton from '@/components/ui/BackButton.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useI18n } from '@/i18n'
import { getComedySpecialById, comedyBlockToTranscriptBlock } from '@/features/comedy/api'
import type { ComedySpecialFullDto } from '@/features/comedy/types'
import type { TranscriptBlock } from '@/types/movie'
import EpisodeScript from '@/components/script/EpisodeScript.vue'
import PhraseAddButton from '@/components/script/PhraseAddButton.vue'
import AsyncState from '@/components/ui/AsyncState.vue'
import ContentPageFrame from '@/components/layout/ContentPageFrame.vue'

const route = useRoute()
const router = useRouter()
const { navQuery } = useLanguage()
const { t } = useI18n()

const id = computed(() => {
  const p = route.params.id
  return typeof p === 'string' ? parseInt(p, 10) : Number(p)
})

const query = useQuery({
  queryKey: computed(() => ['comedy-special', id.value] as const),
  enabled: computed(() => Number.isFinite(id.value) && id.value > 0),
  queryFn: () => getComedySpecialById(id.value),
})
const special = computed<ComedySpecialFullDto | null>(() => query.data.value ?? null)

const blocks = computed<TranscriptBlock[]>(() => {
  const s = special.value
  if (!s?.content?.length) return []
  return s.content.map(comedyBlockToTranscriptBlock)
})

function goBack() {
  router.push({
    name: 'comedy-catalog',
    query: navQuery(),
  })
}
</script>
