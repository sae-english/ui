<template>
  <el-container class="episode" direction="vertical">
    <el-header class="episode__header" height="auto">
      <BackButton :label="t.episode.back" @click="goBack" />
    </el-header>

    <el-main class="episode__main">
      <div v-if="loading" class="content-loader-wrap">
        <ContentLoader :message="t.episode.loadingEpisode" />
      </div>

      <el-empty v-else-if="error" :description="t.episode.notFound">
        <el-button type="primary" @click="goBack">{{ t.episode.toHome }}</el-button>
      </el-empty>

      <template v-else-if="transcript">
        <el-main class="episode__content">
          <EpisodeHero
            :episode-id="transcript.episodeId"
            :title="transcript.title"
          />
          <PhraseAddButton
            :content-key="episodeContentKey"
            content-type="EPISODE"
          >
            <EpisodeScript :blocks="transcript.blocks" />
          </PhraseAddButton>
        </el-main>
      </template>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import BackButton from '@/components/ui/BackButton.vue'
import { useI18n } from '@/i18n'
import {
  getEpisodeById,
  toEpisodeTranscript,
  type EpisodeTranscript,
} from '@/services/api'
import ContentLoader from '@/components/ui/ContentLoader.vue'
import EpisodeHero from '@/components/script/EpisodeHero.vue'
import EpisodeScript from '@/components/script/EpisodeScript.vue'
import PhraseAddButton from '@/components/script/PhraseAddButton.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const episodeId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? parseInt(id, 10) : Number(id)
})

const transcript = ref<EpisodeTranscript | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const episodeContentKey = ref<string | null>(null)

async function loadEpisode() {
  const id = episodeId.value
  if (!id || isNaN(id)) return
  loading.value = true
  error.value = null
  try {
    const dto = await getEpisodeById(id)
    episodeContentKey.value = dto.contentKey ?? null
    transcript.value = toEpisodeTranscript(dto)
  } catch (e) {
    console.error(e)
    error.value = t.value.episode.failedLoadEpisode
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}

onMounted(loadEpisode)
watch(episodeId, loadEpisode)
</script>
