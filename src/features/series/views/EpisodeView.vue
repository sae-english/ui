<template>
  <el-container class="episode" direction="vertical">
    <el-header class="episode__header" height="auto">
      <el-button class="episode__back" :icon="ArrowLeftBold" text @click="goBack">
        Назад
      </el-button>
    </el-header>

    <el-main class="episode__main">
      <el-space v-if="loading" direction="vertical" alignment="center" class="episode__loading">
        <el-icon class="is-loading" :size="40"><VideoCameraFilled /></el-icon>
        <el-text type="info">Загрузка эпизода...</el-text>
      </el-space>

      <el-empty v-else-if="error" description="Эпизод не найден">
        <el-button type="primary" @click="goBack">На главную</el-button>
      </el-empty>

      <template v-else-if="transcript">
        <el-main class="episode__content">
          <EpisodeHero
            :episode-id="transcript.episodeId"
            :title="transcript.title"
          />
          <EpisodeScript
            :blocks="transcript.blocks"
            @add-selection="handleBlockAddSelection"
          />
        </el-main>

        <PhraseDrawer
          v-model:visible="drawerVisible"
          :form="phraseForm"
          :loading="drawerSubmitting"
          :dictionary-context="drawerContext"
          @update:form="updatePhraseForm"
          @submit="handleDrawerSubmit"
        />
      </template>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeftBold, VideoCameraFilled } from '@element-plus/icons-vue'
import {
  getEpisodeById,
  toEpisodeTranscript,
  saveDictionaryEntry,
  type EpisodeTranscript,
} from '@/services/api'
import type { PhraseFormModel } from '@/types/phrase'
import EpisodeHero from '@/components/script/EpisodeHero.vue'
import EpisodeScript from '@/components/script/EpisodeScript.vue'
import PhraseDrawer, { type DictionaryContext } from '@/components/script/PhraseDrawer.vue'

const route = useRoute()
const router = useRouter()

const episodeId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? parseInt(id, 10) : Number(id)
})

const transcript = ref<EpisodeTranscript | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const drawerVisible = ref(false)
const episodeContentKey = ref<string | null>(null)
const drawerPendingBlockId = ref<string | undefined>(undefined)
const drawerContext = computed(() => ({
  contentKey: episodeContentKey.value ?? undefined,
  contentType: 'EPISODE' as const,
  blockId: drawerPendingBlockId.value ?? undefined,
}))
const phraseForm = ref<PhraseFormModel>({
  phrase: '',
  translation: '',
  comment: '',
})

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
    error.value = 'Не удалось загрузить эпизод'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

function handleBlockAddSelection(payload: { text: string; blockId?: string }) {
  phraseForm.value = { phrase: payload.text, translation: '', comment: '' }
  drawerPendingBlockId.value = payload.blockId
  drawerVisible.value = true
}

function goBack() {
  router.back()
}

function updatePhraseForm(payload: PhraseFormModel) {
  phraseForm.value = payload
}

const drawerSubmitting = ref(false)

async function handleDrawerSubmit(payload: {
  form: PhraseFormModel
  context?: DictionaryContext | null
}) {
  const { form, context } = payload
  if (!form.phrase?.trim() || !form.translation?.trim()) {
    ElMessage.warning('Заполни фразу и перевод')
    return
  }

  drawerSubmitting.value = true
  try {
    await saveDictionaryEntry({
      value: form.phrase,
      translation: form.translation,
      comment: form.comment || undefined,
      contentKey: context?.contentKey,
      contentType: context?.contentType as 'EPISODE' | undefined,
      blockId: context?.blockId,
    })
    ElMessage.success('Сохранено в словарь')
    drawerVisible.value = false
    phraseForm.value = { phrase: '', translation: '', comment: '' }
  } catch (e) {
    console.error(e)
    ElMessage.error('Не удалось сохранить. Проверь сервер.')
  } finally {
    drawerSubmitting.value = false
  }
}

onMounted(loadEpisode)
watch(episodeId, loadEpisode)
</script>

<style scoped>
.episode {
  min-height: 100vh;
  padding: 20px;
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

.episode__header {
  margin-bottom: 20px;
  padding: 0 !important;
  height: auto !important;
}

.episode__main {
  padding: 0 !important;
}

.episode__content {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 !important;
}

.episode__back {
  color: var(--fe-text-secondary) !important;
  font-size: 1.05rem;
}

.episode__back:hover {
  color: var(--fe-text-primary) !important;
}

.episode__loading {
  padding: 60px 20px;
}

@media (max-width: 600px) {
  .episode {
    padding: 16px;
  }
}
</style>
