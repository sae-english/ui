<template>
  <el-container class="comedy-content" direction="vertical">
    <el-header class="comedy-content__header" height="auto">
      <BackButton :label="t.comedyContent.backToComedy" @click="goBack" />
    </el-header>

    <el-main class="comedy-content__main">
      <AsyncState
        :is-loading="loading"
        :has-data="!!special"
        :error-message="error"
        :retry-label="t.comedyCatalog.retry"
        :empty-description="t.comedyContent.contentNotFound"
        :loading-message="t.comedyContent.loadingScript"
        loading-wrapper-class="content-loader-wrap"
        @retry="goBack"
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
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import BackButton from '@/components/ui/BackButton.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useI18n } from '@/i18n'
import { getComedySpecialById, comedyBlockToTranscriptBlock } from '@/features/comedy/api'
import type { ComedySpecialFullDto } from '@/features/comedy/types'
import type { TranscriptBlock } from '@/types/movie'
import EpisodeScript from '@/components/script/EpisodeScript.vue'
import PhraseAddButton from '@/components/script/PhraseAddButton.vue'
import AsyncState from '@/components/ui/AsyncState.vue'

const route = useRoute()
const router = useRouter()
const { navQuery } = useLanguage()
const { t } = useI18n()

const id = computed(() => {
  const p = route.params.id
  return typeof p === 'string' ? parseInt(p, 10) : Number(p)
})

const special = ref<ComedySpecialFullDto | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const blocks = computed<TranscriptBlock[]>(() => {
  const s = special.value
  if (!s?.content?.length) return []
  return s.content.map(comedyBlockToTranscriptBlock)
})

async function loadSpecial() {
  const sid = id.value
  if (!sid || isNaN(sid)) return
  loading.value = true
  error.value = null
  try {
    special.value = await getComedySpecialById(sid)
    if (!special.value) error.value = t.value.comedyContent.contentNotFound
  } catch (e) {
    console.error(e)
    error.value = t.value.comedyContent.failedLoadScript
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push({
    name: 'comedy-catalog',
    query: navQuery(),
  })
}

onMounted(loadSpecial)
watch(id, () => loadSpecial())
</script>
